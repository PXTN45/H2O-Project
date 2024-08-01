import express, { Request, Response } from "express";
import { createReview, deleteReview, getAllReview, updateReview } from "../controller/review.controller";

const router = express.Router();

router.get("/review", getAllReview);

router.post("/createReview", createReview);

router.put("/updateReview/:id",updateReview);

router.delete("/deleteReview/:id", deleteReview);

export default router;