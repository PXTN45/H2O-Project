import { Request, Response } from "express";
import reviewModel from "../model/review.model";
import BookingModel from "../model/booking.model";
import { Review } from "../model/review.model";

// ฟังก์ชันสำหรับการเรียกดูรีวิวทั้งหมด
const getAllReview = async (req: Request, res: Response): Promise<void> => {
    try {
        const { page = 1, limit = 10 } = req.query;

        // ตรวจสอบให้แน่ใจว่า page และ limit เป็นตัวเลข
        const pageNumber = parseInt(page as string, 10);
        const limitNumber = parseInt(limit as string, 10);

        if (isNaN(pageNumber) || isNaN(limitNumber)) {
            res.status(400).json({ message: "Invalid page or limit parameter" });
            return;
        }

        // ดึงข้อมูลรีวิวทั้งหมด พร้อมดึงข้อมูลผู้รีวิวมาแสดงด้วย และจัดเรียงตามวันที่สร้าง (ใหม่ไปเก่า)
        const reviews = await reviewModel.find()
            .populate("reviewer", "name") // ดึงเฉพาะฟิลด์ 'name' ของ User
            .sort({ createdAt: -1 })
            .skip((pageNumber - 1) * limitNumber)
            .limit(limitNumber);

        if (!reviews || reviews.length === 0) {
            res.status(404).json({ message: "ไม่พบรีวิว" });
            return;
        }

        res.status(200).json(reviews); // ส่งข้อมูลรีวิวกลับในรูปแบบ JSON
    } catch (error: any) {
        console.error("Error fetching reviews:", error.message);
        res.status(500).json({ message: "เกิดข้อผิดพลาดในระบบ" });
    }
};

// ฟังก์ชันสำหรับการสร้างรีวิวใหม่ ลูกค้าต้องทำการจองก่อนถึงจะสามารถสร้างรีวิวได้
const createReview = async (req: Request, res: Response): Promise<void> => {
    try {
        const { reviewer, content, rating, homestay, package: packageId } = req.body;

        // ตรวจสอบข้อมูลที่ได้รับ
        if (!reviewer || !content || !rating || (!homestay && !packageId)) {
            res.status(400).json({ message: 'กรุณากรอกข้อมูลให้ครบถ้วน' });
            return;
        }

        // ตรวจสอบว่าคะแนนอยู่ในช่วงที่ถูกต้อง
        if (rating < 1 || rating > 5) {
            res.status(400).json({ message: 'คะแนนรีวิวต้องอยู่ระหว่าง 1 ถึง 5' });
            return;
        }

        // ตรวจสอบสถานะการจองของลูกค้าสำหรับ homestay หรือ package
        const booking = await BookingModel.findOne({ 
            booker: reviewer, 
            $or: [
                { homestay },
                { package: packageId }
            ]
        });

        if (!booking) {
            res.status(404).json({ message: 'ไม่พบการจองที่เกี่ยวข้อง' });
            return;
        }

        if (booking.bookingStatus !== 'Confirmed') {
            res.status(403).json({ message: 'ลูกค้าที่มีสถานะ Confirmed เท่านั้นที่สามารถเขียนรีวิวได้' });
            return;
        }

        // สร้างรีวิวใหม่
        const newReview = new reviewModel({
            reviewer,
            content,
            rating,
            homestay,
            package: packageId,
        });

        // บันทึกรีวิวลงในฐานข้อมูล
        const savedReview = await newReview.save();
        res.status(201).json(savedReview);
    } catch (error: any) {
        console.error('ข้อผิดพลาดในการสร้างรีวิว:', error.message);
        res.status(500).json({ message: 'เกิดข้อผิดพลาดในระบบ' });
    }
};

// ฟังก์ชันสำหรับการอัพเดตรีวิวตาม id
const updateReview = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id;
    const data = req.body;
    try {
        // ตรวจสอบว่าคะแนนที่อัพเดตอยู่ในช่วงที่ถูกต้องหรือไม่
        if (data.rating && (data.rating < 1 || data.rating > 5)) {
            res.status(400).json({ message: 'คะแนนรีวิวต้องอยู่ระหว่าง 1 ถึง 5' });
            return;
        }

        // อัพเดตข้อมูลรีวิวที่ตรงกับ id ที่ได้รับ
        const updatedReview = await reviewModel.findByIdAndUpdate(id, data, {
            new: true, // ส่งค่าที่อัพเดตกลับไป
            runValidators: true, // เปิดใช้ validators เพื่อเช็คความถูกต้องของข้อมูลที่อัพเดต
        }).populate("reviewer", "name"); // ดึงเฉพาะฟิลด์ 'name' ของ User
        
        if (!updatedReview) {
            res.status(404).json({ message: "ไม่พบรีวิว" });
        } else {
            res.status(200).json(updatedReview);
        }
    } catch (error: any) {
        console.error('ข้อผิดพลาดในการอัพเดตรีวิว:', error.message);
        res.status(500).json({ message: "เกิดข้อผิดพลาดในระบบ" });
    }
};

// ฟังก์ชันสำหรับการลบรีวิวตาม id
const deleteReview = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id;
    try {
        // ลบรีวิวที่ตรงกับ id ที่ได้รับ
        const deletedReview = await reviewModel.findByIdAndDelete(id);
        if (!deletedReview) {
            res.status(404).json({ message: "ไม่พบรีวิว" });
        } else {
            res.status(200).json({ message: "ลบรีวิวเรียบร้อยแล้ว", deletedReview });
        }
    } catch (error: any) {
        console.error('ข้อผิดพลาดในการลบรีวิว:', error.message);
        res.status(500).json({ message: "เกิดข้อผิดพลาดในระบบ" });
    }
};

// ฟังก์ชันสำหรับการดึงค่ารวมของคะแนนรีวิวทั้งหมดและคะแนนเฉลี่ย
const getRating = async (req: Request, res: Response): Promise<void> => {
    try {
        const reviews = await reviewModel.find().populate("reviewer", "name");
        // คำนวณค่ารวมของคะแนนรีวิว
        const totalRating = reviews.reduce((sum: number, review: Review) => sum + review.rating, 0);
        const averageRating = reviews.length ? totalRating / reviews.length : 0;
        res.status(200).json({ totalRating, averageRating });
    } catch (error: any) {
        console.error('ข้อผิดพลาดในการคำนวณคะแนน:', error.message);
        res.status(500).json({ message: "เกิดข้อผิดพลาดในระบบ" });
    }
};

// ฟังก์ชันสำหรับการดึงรีวิวตาม HomeStay ID
const getReviewByHomeStay = async (req: Request, res: Response): Promise<void> => {
    const homestayId = req.params.homestayId;
    try {
        const reviews = await reviewModel.find({ homestay: homestayId }).populate("reviewer", "name");
        if (reviews.length === 0) {
            res.status(404).json({ message: "ไม่พบรีวิวสำหรับ Homestay นี้" });
        } else {
            res.status(200).json(reviews);
        }
    } catch (error: any) {
        console.error('ข้อผิดพลาดในการดึงรีวิวตาม Homestay:', error.message);
        res.status(500).json({ message: "เกิดข้อผิดพลาดในระบบ" });
    }
};

// ฟังก์ชันสำหรับการดึงรีวิวตาม Package ID
const getReviewByPackageId = async (req: Request, res: Response): Promise<void> => {
    const packageId = req.params.packageId;
    try {
        const reviews = await reviewModel.find({ package: packageId }).populate("reviewer", "name");
        if (reviews.length === 0) {
            res.status(404).json({ message: "ไม่พบรีวิวสำหรับแพ็คเกจนี้" });
        } else {
            res.status(200).json(reviews);
        }
    } catch (error: any) {
        console.error('ข้อผิดพลาดในการดึงรีวิวตาม Package:', error.message);
        res.status(500).json({ message: "เกิดข้อผิดพลาดในระบบ" });
    }
};

export {
    getAllReview,
    createReview,
    updateReview,
    deleteReview, 
    getRating,
    getReviewByHomeStay,
    getReviewByPackageId,
};
