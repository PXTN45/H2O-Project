import { Request, Response } from "express";
import reviewModel from "../model/review.model";
import BookingModel from "../model/booking.model";

// ฟังก์ชันสำหรับการเรียกดูรีวิวทั้งหมด
const getAllReview = async (req: Request, res: Response): Promise<void> => {
    try {
        // ดึงข้อมูลรีวิวทั้งหมด พร้อมดึงข้อมูลรีวิวเวอร์มาแสดงด้วย และจัดเรียงตามวันที่สร้าง (ใหม่ไปเก่า)
        const reviews = await reviewModel.find().populate("reviewer").sort({ createdAt: -1 });
        res.status(200).json(reviews);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// ฟังก์ชันสำหรับการสร้างรีวิวใหม่ ลูกค้าต้องทำการจองก่อนถึงจะสามารถสร้างรีวิวได้
const createReview = async (req: Request, res: Response): Promise<void> => {
    try {
        const { reviewer, content, rating, homestay, package: packageId } = req.body;

        // ตรวจสอบข้อมูลที่ได้รับ
        if (!reviewer || !content || !rating || (!homestay && !packageId)) {
            res.status(400).json({ message: 'กรุณากรอกข้อมูลให้ครบถ้วน' });
            return; // ออกจากฟังก์ชันถ้าเกิดข้อผิดพลาด
        }

        // ตรวจสอบว่าคะแนนอยู่ในช่วงที่ถูกต้อง
        if (rating < 1 || rating > 5) {
            res.status(400).json({ message: 'คะแนนรีวิวต้องอยู่ระหว่าง 1 ถึง 5' });
            return;
        }

        // ตรวจสอบสถานะการจองของลูกค้าสำหรับ homestay หรือ package
        const booking = await BookingModel.findOne({ reviewer, $or: [{ homestay }, { package: packageId }] });

        if (!booking) {
            // หากไม่พบการจองที่เกี่ยวข้อง
            res.status(404).json({ message: 'ไม่พบการจองที่เกี่ยวข้อง' });
            return; // ออกจากฟังก์ชันถ้าไม่พบการจอง
        }

        if (booking.bookingStatus !== 'Confirmed') {
            // หากสถานะการจองไม่ใช่ Confirmed
            res.status(403).json({ message: 'ลูกค้าที่มีสถานะ Confirmed เท่านั้นที่สามารถเขียนรีวิวได้' });
            return; // ออกจากฟังก์ชันถ้าสถานะการจองไม่ใช่ Confirmed
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
        res.status(201).json(savedReview); // ส่งผลลัพธ์กลับไป
    } catch (error: any) {
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
        });
        if (!updatedReview) {
            res.status(404).json({ message: "ไม่พบรีวิว" });
        } else {
            res.status(200).json(updatedReview);
        }
    } catch (error: any) {
        res.status(500).json({ message: error.message });
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
        res.status(500).json({ message: error.message });
    }
};

// ฟังก์ชันสำหรับการดึงค่ารวมของคะแนนรีวิวทั้งหมดและคะแนนเฉลี่ย
const getRating = async (req: Request, res: Response): Promise<void> => {
    try {
        const reviews = await reviewModel.find();
        // คำนวณค่ารวมของคะแนนรีวิว
        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
        const averageRating = reviews.length ? totalRating / reviews.length : 0;
        res.status(200).json({ totalRating, averageRating });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// ฟังก์ชันสำหรับการดึงรีวิวตาม HomeStay ID
const getReviewByHomeStay = async (req: Request, res: Response): Promise<void> => {
    const homestayId = req.params.homestayId;
    try {
        const reviews = await reviewModel.find({ homestay: homestayId }).populate("reviewer");
        if (reviews.length === 0) {
            res.status(404).json({ message: "ไม่พบรีวิวสำหรับ Homestay นี้" });
        } else {
            res.status(200).json(reviews);
        }
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// ฟังก์ชันสำหรับการดึงรีวิวตาม Package ID
const getReviewByPackageId = async (req: Request, res: Response): Promise<void> => {
    const packageId = req.params.packageId;
    try {
        const reviews = await reviewModel.find({ package: packageId }).populate("reviewer");
        if (reviews.length === 0) {
            res.status(404).json({ message: "ไม่พบรีวิวสำหรับแพ็คเกจนี้" });
        } else {
            res.status(200).json(reviews);
        }
    } catch (error: any) {
        res.status(500).json({ message: error.message });
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
