import { Request, Response } from "express";
import reviewModel from "../model/review.model";

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

// สำหรับการสร้างรีวิวใหม่
const createReview = async (req: Request, res: Response): Promise<void> => {

        const createReview = req.body;
        const newReview = new reviewModel(createReview)
        console.log(createReview);
    
        try{
         const savedMessage = await newReview.save();
         res.status(201).json(savedMessage);
        } catch (error: any) {
            res.status(500).json({ message: error.message});
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
const getReviewByPackage = async (req: Request, res: Response): Promise<void> => {
    const packageId = req.params.packageId;
    try {
        const reviews = await reviewModel.find({ packageId });
        if (reviews.length === 0) {
            res.status(404).json({ message: "No reviews found for this Package" });
        } else {
            res.status(200).json(reviews);
        }
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}


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
    getReviewByPackage,
}