import { Request, Response } from "express";
import reviewModel from "../model/review.model";

const getAllReview = async (req: Request, res: Response): Promise<void> => {
    try {
        const review = await reviewModel.find();
        res.status(200).json(review);
    } catch (error:any) {
        res.status(500).json({ message: error.message});
    }
};

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
   

export {
    getAllReview,
    createReview,
    updateReview,
    deleteReview,
}