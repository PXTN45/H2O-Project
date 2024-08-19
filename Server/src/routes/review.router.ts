import express, { Request, Response } from "express";
import { createContent, 
        createReview, 
        deleteReview, 
        getAllReview, 
        getRating, 
        setRating, 
        updateReview,
        updateContent,
        getReviewByHomeStay,
        getReviewByPackage, } 
        from "../controller/review.controller";

const router = express.Router();

router.get("/review", getAllReview);

router.post("/createReview", createReview);

router.put("/updateReview/:id",updateReview);

router.delete("/deleteReview/:id", deleteReview);

router.post("/createContent", createContent);

router.put("/updateContent", updateContent);

router.get("/getRating", getRating);

router.put("/setRating", setRating);

router.get("/getReviewByHomeStay/:homeStayId",getReviewByHomeStay )

router.get("/getReviewByPackage/:packageId",getReviewByPackage)


export default router;