import { Request, Response } from "express";
import reviewModel from "../model/review.model";
import BookingModel from "../model/booking.model";
import mongoose from "mongoose";

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
            .sort({ createdAt: -1 }) // เรียงตามวันที่สร้างจากใหม่ไปเก่า
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

// ฟังก์ชันสำหรับการสร้างรีวิว
const createReview = async (req: Request, res: Response): Promise<void> => {
    try {
        const { reviewer, content, rating, homestay, packageId } = req.body;

        // ตรวจสอบข้อมูลที่ได้รับ: ต้องมี reviewer, content, และ rating และต้องมี homestay หรือ package อย่างน้อยหนึ่งอย่าง
        if (!reviewer || !content || !rating || (!homestay && !packageId)) {
            res.status(400).json({ message: 'กรุณากรอกข้อมูลให้ครบถ้วน' });
            return;
        }

        // ตรวจสอบว่าคะแนนอยู่ในช่วงที่ถูกต้อง
        if (rating < 1 || rating > 5) {
            res.status(400).json({ message: 'คะแนนต้องอยู่ระหว่าง 1 ถึง 5' });
            return;
        }

        // ตรวจสอบการจองที่เกี่ยวข้องกับ homestay หรือ package
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

        // สร้างรีวิวใหม่โดยพิจารณาจากเงื่อนไขของ homestay และ package
        const newReview = new reviewModel({
            reviewer,
            content,
            rating,
            homestay: homestay || null, // ตั้งค่า homestay เป็น null ถ้าไม่ได้รับค่า
            package: packageId || null   // ตั้งค่า package เป็น null ถ้าไม่ได้รับค่า
        });

        // บันทึกรีวิวลงในฐานข้อมูล
        const savedReview = await newReview.save();
        res.status(201).json(savedReview);
    } catch (error: any) {
        console.error('ข้อผิดพลาดในการสร้างรีวิว:', error.message);
        res.status(500).json({ message: 'เกิดข้อผิดพลาดในระบบ' });
    }
};

// ฟังก์ชันสำหรับการอัพเดตรีวิว
const updateReview = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const data = req.body;

        // ตรวจสอบข้อมูลที่ได้รับ
        if (!data.reviewer || !data.content || !data.rating) {
            res.status(400).json({ message: 'กรุณากรอกข้อมูลให้ครบถ้วน' });
            return;
        }

        // ตรวจสอบว่าคะแนนอยู่ในช่วงที่ถูกต้อง
        if (data.rating < 1 || data.rating > 5) {
            res.status(400).json({ message: 'คะแนนต้องอยู่ระหว่าง 1 ถึง 5' });
            return;
        }

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

// ฟังก์ชันสำหรับการลบรีวิว
const deleteReview = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

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
        const totalRating = reviews.reduce((sum: number, review) => sum + review.rating, 0);
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
        // เปลี่ยน homestayId เป็น ObjectId โดยใช้ new
        const objectId = new mongoose.Types.ObjectId(homestayId);

        // ดึงรีวิวจากฐานข้อมูลตาม HomeStay ID
        const reviews = await reviewModel.find({ homestay: objectId }).populate("reviewer", "name");

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
        // เปลี่ยน packageId เป็น ObjectId โดยใช้ new
        const objectId = new mongoose.Types.ObjectId(packageId);

        // ดึงรีวิวจากฐานข้อมูลตาม Package ID
        const reviews = await reviewModel.find({ package: objectId }).populate("reviewer", "name");

        if (reviews.length === 0) {
            res.status(404).json({ message: "ไม่พบรีวิวสำหรับแพ็คเกจนี้" });
        } else {
            res.status(200).json(reviews);
        }
    } catch (error: any) {
        console.error('ข้อผิดพลาดในการดึงรีวิวตาม Package:', error.message);
        res.status(500).json({ message: "เกิดข้อผิดพลาดในระบบ" });
    }
};;

export {
    getAllReview,
    createReview,
    updateReview,
    deleteReview,
    getRating,
    getReviewByHomeStay,
    getReviewByPackageId
};
