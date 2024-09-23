import { Request, Response } from "express";
import reviewModel from "../model/review.model";
import BookingModel from "../model/booking.model";
import mongoose from "mongoose";
import AdminModel from "../model/admin.model ";
import BusinessModel from "../model/business.model";

// ฟังก์ชันสำหรับการเรียกดูรีวิวทั้งหมด
const getAllReview = async (req: Request, res: Response): Promise<void> => {
    try {
        // ดึงค่าของ page และ limit จาก query parameters และกำหนดค่าเริ่มต้น
        const page = parseInt(req.query.page as string, 10) || 1;
        const limit = parseInt(req.query.limit as string, 10) || 10;

        // ตรวจสอบว่า page และ limit เป็นตัวเลขที่ถูกต้อง
        if (page < 1 || limit < 1) {
            res.status(400).json({ message: "Page and limit must be greater than 0" });
            return;
        }

        // ดึงข้อมูลรีวิวทั้งหมด พร้อมดึงข้อมูลผู้รีวิวมาแสดงด้วย และจัดเรียงตามวันที่สร้าง (ใหม่ไปเก่า)
        const reviews = await reviewModel.find()
            .populate("reviewer", "name") // ดึงเฉพาะฟิลด์ 'name' ของ User
            .sort({ createdAt: -1 }) // เรียงตามวันที่สร้างจากใหม่ไปเก่า
            .skip((page - 1) * limit) // ใช้ page และ limit สำหรับการแบ่งหน้า
            .limit(limit); // จำกัดจำนวนรีวิวที่ดึงออกมา

        // ตรวจสอบว่ามีรีวิวที่ดึงมาได้หรือไม่
        if (reviews.length === 0) {
            res.status(404).json({ message: "No reviews found" });
            return;
        }

        // ส่งข้อมูลรีวิวกลับในรูปแบบ JSON
        res.status(200).json(reviews);

    } catch (error: any) {
        // บันทึกข้อผิดพลาดและส่งกลับข้อผิดพลาดในระบบ
        console.error("Error fetching reviews:", error.message);
        res.status(500).json({ message: "An error occurred while fetching reviews" });
    }
};

// ฟังก์ชันสำหรับการสร้างรีวิว
const createReview = async (req: Request, res: Response): Promise<void> => {
    try {
        const { reviewer, content, rating, homestayId, packageId }: { reviewer: string, content: string, rating: number, homestayId?: string, packageId?: string } = req.body;

        // ตรวจสอบข้อมูลที่ได้รับ
        if (!reviewer || !content || rating == null || (!homestayId && !packageId)) {
            res.status(400).json({ message: 'กรุณากรอกข้อมูลให้ครบถ้วน และต้องระบุ homestayId หรือ packageId อย่างน้อยหนึ่งอย่าง' });
            return;
        }

        // ตรวจสอบคะแนน
        if (rating < 1 || rating > 5) {
            res.status(400).json({ message: 'คะแนนต้องอยู่ระหว่าง 1 ถึง 5' });
            return;
        }
        
        // ตรวจสอบว่า homestayId หรือ packageId เป็น ObjectId ที่ถูกต้องหรือไม่
        const isValidHomestayId = homestayId && mongoose.Types.ObjectId.isValid(homestayId);
        const isValidPackageId = packageId && mongoose.Types.ObjectId.isValid(packageId);

        if (!isValidHomestayId && !isValidPackageId) {
            res.status(400).json({ message: 'homestayId หรือ packageId ไม่ถูกต้อง' });
            return;
        }

        // ตรวจสอบว่าลูกค้าคนเดิมได้รีวิวโฮมสเตย์หรือแพ็กเกจนี้ไปแล้วหรือไม่
        const existingReview = await reviewModel.findOne({
            reviewer: new mongoose.Types.ObjectId(reviewer),
            $or: [
                { homestay: homestayId ? new mongoose.Types.ObjectId(homestayId) : null },
                { package: packageId ? new mongoose.Types.ObjectId(packageId) : null }
            ]
        });

        if (existingReview) {
            res.status(400).json({ message: 'ลูกค้าคนเดิมไม่สามารถรีวิวซ้ำได้' });
            return;
        }

        // ตรวจสอบการจองที่เกี่ยวข้อง
        const booking = await BookingModel.findOne({
            booker: new mongoose.Types.ObjectId(reviewer),
            $or: [
                { homestay: homestayId ? new mongoose.Types.ObjectId(homestayId) : null },
                { package: packageId ? new mongoose.Types.ObjectId(packageId) : null }
            ],
            bookingStatus: 'Confirmed'
        });

        if (!booking) {
            res.status(404).json({ message: 'ไม่พบการจองที่เกี่ยวข้อง' });
            return;
        }

        // สร้างรีวิวใหม่ โดยไม่ใส่ค่าที่เป็น null
        const newReviewData = {
            reviewer: new mongoose.Types.ObjectId(reviewer),
            content,
            rating,
            ...(homestayId && { homestay: new mongoose.Types.ObjectId(homestayId) }), // ใส่ homestay ถ้ามี
            ...(packageId && { package: new mongoose.Types.ObjectId(packageId) }), // ใส่ package ถ้ามี
        };

        const newReview = new reviewModel(newReviewData);

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
        // ดึงข้อมูลรีวิวทั้งหมดจาก MongoDB และรวมข้อมูลรีวิวเวอร์ (ชื่อ) ผ่านการใช้ .populate()
        const reviews = await reviewModel.find().populate("reviewer", "name");

        // ฟังก์ชันเพื่อหาค่าเฉลี่ยของคะแนนรีวิว และปัดเศษคะแนนให้เป็นทศนิยม 0.5
        const getRoundedAverage = (reviews: any[]) => {
            // คำนวณผลรวมของคะแนนทั้งหมด
            const total = reviews.reduce((sum, review) => sum + review.rating, 0);
            // หาค่าเฉลี่ยของคะแนน
            const avg = reviews.length ? total / reviews.length : 0;
            // ปัดเศษคะแนนให้เป็นทศนิยม 0.5 (เช่น 4.25 จะปัดเป็น 4.5)
            return Math.round(avg * 10) / 10;
        };

        // ดึง ID ของที่พักจาก URL parameter
        const { homestayId } = req.params;

        // ตรวจสอบว่า ID ของที่พักได้รับการส่งมาในคำขอหรือไม่
        if (!homestayId) {
            res.status(400).json({ message: "Homestay ID is required" });
            return;
        }

        // กรองเฉพาะรีวิวที่มี ID ของที่พักที่ต้องการ
        const filteredReviews = reviews.filter(review => review.homestay && review.homestay.toString() === homestayId);

        // ตรวจสอบว่าไม่มีรีวิวสำหรับที่พักที่ระบุ
        if (filteredReviews.length === 0) {
            res.status(404).json({ message: "No reviews found for this homestay" });
            return;
        }
        console.log('Filtered Reviews:', filteredReviews);

        // คำนวณคะแนนรวมและค่าเฉลี่ยของรีวิวที่เกี่ยวข้องกับที่พักเฉพาะ
        const homestayRating = {
            homestayId: homestayId, // เพิ่ม ID ของที่พักที่นี่
            totalRating: filteredReviews.reduce((sum, r) => sum + r.rating, 0),
            averageRating: getRoundedAverage(filteredReviews)
        };

        // ส่งค่าผลลัพธ์ (homestay rating) กลับไปที่ client ด้วยสถานะ 200
        res.status(200).json({ homestayRating });
    } catch (error: any) {
        // ในกรณีเกิดข้อผิดพลาด แสดงข้อความข้อผิดพลาด และส่งสถานะ 500 กลับไปที่ client
        console.error('Error calculating rating:', error.message);
        res.status(500).json({ message: "System error occurred" });
    }
};

// ฟังก์ชันสำหรับการดึงรีวิวตาม HomeStay ID
const getReviewByHomeStay = async (req: Request, res: Response): Promise<void> => {
    const homeStayId = req.params.homeStayId;
    console.log(homeStayId);
    
    try {
        // เปลี่ยน homestayId เป็น ObjectId โดยใช้ new
        const objectId = new mongoose.Types.ObjectId(homeStayId);

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

// ฟังก์ชันสำหรับตอบกลับรีวิว
// ฟังก์ชันสำหรับตอบกลับรีวิว
const respondToReview = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params; // รหัสรีวิวที่ต้องการเพิ่มการตอบกลับ
    const { responder, content } = req.body; // ข้อมูลการตอบกลับ

    // ตรวจสอบว่า id และ responder เป็น ObjectId ที่ถูกต้องหรือไม่
    if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(responder)) {
        return res.status(400).json({ message: 'ID หรือ Responder ID ไม่ถูกต้อง' });
    }

    // ตรวจสอบว่ามีการส่งข้อมูลครบถ้วนหรือไม่
    if (!responder || !content) {
        return res.status(400).json({ message: 'กรุณาระบุข้อมูลที่ครบถ้วน' });
    }

    try {
        // ตรวจสอบว่าผู้ตอบกลับเป็นเจ้าของธุรกิจหรือไม่
        const business = await BusinessModel.findById(responder);
        if (!business) {
            return res.status(404).json({ message: 'ไม่พบบัญชีธุรกิจที่ระบุ' });
        }

        // ตรวจสอบ role ของผู้ตอบกลับ
        if (business.role !== 'business') {
            return res.status(403).json({ message: 'เฉพาะเจ้าของธุรกิจเท่านั้นที่สามารถตอบกลับรีวิวได้' });
        }

        // ตรวจสอบว่ามีรีวิวที่ตรงกับ id หรือไม่
        const review = await reviewModel.findById(id);
        if (!review) {
            return res.status(404).json({ message: 'ไม่พบรีวิวที่ระบุ' });
        }

        // เพิ่มการตอบกลับในรีวิว
        const currentDate = new Date();
        review.responses.push({ responder, content, createdAt: currentDate });
        
        // อัปเดต createdAt และ updatedAt ของรีวิว
        review.createdAt = currentDate; 
        review.updatedAt = currentDate; 
        
        await review.save();

        // Populate the review data (ดึงข้อมูลที่เกี่ยวข้องกับ reviewer และ responder)
        const updatedReview = await reviewModel.findById(id)
            .populate('reviewer', 'name')
            .populate('responses.responder', 'name')
            .lean() // ใช้ lean เพื่อแปลงเป็น plain JavaScript object
            .exec();

        // ตรวจสอบว่า updatedReview ไม่เป็น null
        if (!updatedReview) {
            return res.status(404).json({ message: 'ไม่พบรีวิวที่อัปเดต' });
        }

        // ลบฟิลด์ที่มีค่า null ออกจาก response
        const cleanedReview = Object.fromEntries(
            Object.entries(updatedReview).filter(([_, value]) => value !== null)
        );

        return res.status(200).json(cleanedReview);
    } catch (error: any) {
        console.error('ข้อผิดพลาดในการตอบกลับรีวิว:', error);
        return res.status(500).json({ message: 'เกิดข้อผิดพลาดในระบบ', error: error.message });
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
    respondToReview
};
