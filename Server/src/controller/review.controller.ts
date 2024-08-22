import { Request, Response } from "express";
import reviewModel from "../model/review.model";
import bookingModel from "../model/booking.model";

// get all review สำหรับการเรียกดูรีวิวทั้งหมด
const getAllReview = async (req: Request, res: Response): Promise<void> => {
    try {
        //const review = await reviewModel.find()
        const review = await reviewModel.find().populate({path :"reviewer" , strictPopulate:false});
        res.status(200).json(review);
    } catch (error:any) {
        res.status(500).json({ message: error.message});
    }
};

// สำหรับการสร้างรีวิวใหม่ ลูกค้าต้องทำการจองก่อนถึงจะสามารถสร้างรีวิวได้
const createReview = async (req: Request, res: Response): Promise<void> => {
    // ดึง homestayId และ userId จาก body ของ request
    const { homestayId, userId } = req.body;

    try {
        // ตรวจสอบว่าลูกค้ามีการจองโฮมสเตย์นี้และการจองนั้นถูกยืนยันแล้วหรือไม่
        const existingBooking = await bookingModel.findOne({
            homestay: homestayId, 
            user: userId, 
            bookingStatus: "Confirmed" // ตรวจสอบว่าการจองได้รับการยืนยันแล้ว
        });

        // ถ้าไม่มีการจองหรือการจองยังไม่ได้รับการยืนยัน
        if (!existingBooking) {
            // ส่งสถานะ 403 (Forbidden) พร้อมข้อความแจ้งเตือน
            res.status(403).json({ message: "คุณต้องทำการจองและได้รับการยืนยันก่อนถึงจะสามารถรีวิวได้" });
            return; // หยุดการทำงานถ้าเงื่อนไขไม่ผ่าน
        }

        // ถ้ามีการจองและการจองได้รับการยืนยันแล้ว
        // ดึงข้อมูลการรีวิวจาก body ของ request เพื่อเตรียมสร้างรีวิวใหม่
        const createReview = req.body;
        const newReview = new reviewModel(createReview); // สร้างอินสแตนซ์ของ reviewModel ด้วยข้อมูลที่ได้รับ

        // บันทึกรีวิวใหม่ลงในฐานข้อมูล
        const savedReview = await newReview.save();

        // ส่งสถานะ 201 (Created) พร้อมข้อมูลรีวิวที่ถูกบันทึก
        res.status(201).json(savedReview);
    } catch (error: any) {
        // จัดการข้อผิดพลาดและบันทึกลงใน console
        console.error("เกิดข้อผิดพลาดในการสร้างรีวิว:", error);

        // ส่งสถานะ 500 (Internal Server Error) พร้อมข้อความข้อผิดพลาด
        res.status(500).json({ message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์", error: error.message });
    }
};

// สำหรับการอัพเดตรีวิวตาม id
const updateReview = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id;
    const data = req.body;
    try {
        const updateReview = await reviewModel.findByIdAndUpdate(id, data, {
            new: true,
        });
        if (!updateReview) {
            res.status(404).json({ message: "Review Not Found"});
        } else {
            res.status(200).json({ message: "Review Updated", updateReview});
        }
    } catch (error: any) {
        res.status(500).json({ messaeg: error.message});
    }
};

// สำหรับการลบรีวิวตาม id
const deleteReview = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id;
    try {
        const data = await reviewModel.findByIdAndDelete(id);
        if(!data) {
            res.status(404).json({ messaeg: "Review Not Found"});
        } else {
            res.status(200).json(data);
        }
    } catch (error: any) {
        res.status(500).json({ messaeg: error.message});
    }
};

// สำหรับการสร้างเนื้อหาใหม่
const createContent = async (req: Request, res: Response): Promise<void> => {

    const createContent = req.body;
    const newContent = new reviewModel (createContent)
    console.log(createContent);

    try {
        const savedContent = await newContent.save();
        res.status(201).json(savedContent);
    } catch (error: any) {
        res.status(500).json({ message: error.message});
    }
};

// สำหรับการอัพเดตเนื้อหาตาม id
const updateContent = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id;
    const data = req.body;
    try {
        const updateContent = await reviewModel.findByIdAndUpdate(id, data, {
            new: true,
        });
        if (!updateContent) {
            res.status(404).json({ message: "Content Not Found"});
        } else {
            res.status(200).json({ message: "Content Updated", updateContent}); 
        }
    } catch (error: any) {
        res.status(500).json ({ message: error.message});
    }
};
   // สำหรับการดึงค่ารวมของคะแนนรีวิว
const getRating = async (req: Request, res: Response): Promise<void> => {
    try {
        const reviews = await reviewModel.find();
        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
        res.status(200).json({ totalRating });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
 // สำหรับการตั้งค่าคะแนนของรีวิวทั้งหมด
const setRating = async (req: Request, res: Response): Promise<void> => {
    const { rating } = req.body;

    if (typeof rating !== 'number' || rating < 1 || rating > 5) {
        res.status(400).json({ message: "Invalid rating value. Rating must be an integer between 1 and 5." });
        return;
    }

    try {
        const result = await reviewModel.updateMany({}, { rating });
        res.status(200).json({ message: `Rating updated for ${result.modifiedCount} reviews.` });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// สำหรับการดึงรีวิวตาม HomeStay ID
const getReviewByHomeStay = async (req: Request, res: Response): Promise<void> => {
    // รับ homeStayId จากพารามิเตอร์
    const homeStayId = req.params.homeStayId;

    try {
        // ค้นหาข้อมูลรีวิวโดยใช้ findById ซึ่งจะไม่ทำงานตามที่คาดหวัง
        const review = await reviewModel.findById(homeStayId); // ข้อผิดพลาดที่นี่
        // ตรวจสอบว่ามีรีวิวหรือไม่
        if (!review) {
            res.status(404).json({ message: "No reviews found for this HomeStay" }); // ไม่มีรีวิว
        } else {
            res.status(200).json(review); // ส่งรีวิวที่พบกลับ
        }
    } catch (error: any) {
        res.status(500).json({ message: error.message }); // ส่งข้อความแสดงข้อผิดพลาด
    }
};

// สำหรับการดึงรีวิวตาม Package ID

const getReviewByPackageId = async (req: Request, res: Response): Promise<void> => {
    const packageId = req.params.packageId; // ดึง packageId จากพารามิเตอร์ของคำขอ

    try {
        const review = await reviewModel.findById(packageId); // ค้นหารีวิวโดยใช้ packageId ในกรณีที่ packageId ตรงกับ _id ของรีวิว

        if (!review) { // ตรวจสอบว่ามีรีวิวที่ตรงกับ packageId หรือไม่
            res.status(404).json({ message: "ไม่พบรีวิวสำหรับแพ็คเกจนี้" }); // ส่งข้อความถ้าไม่พบรีวิว
        } else {
            res.status(200).json(review); // ส่งรีวิวที่พบไปยังผู้ใช้
        }
    } catch (error: any) {
        res.status(500).json({ message: error.message }); // ส่งข้อความผิดพลาดถ้ามีข้อผิดพลาดในการค้นหา
    }
}

export default getReviewByPackageId;





export {
    getAllReview,
    createReview,
    updateReview,
    deleteReview,
    createContent,
    updateContent,
    getRating,
    setRating,
    getReviewByHomeStay,
    getReviewByPackageId,
}