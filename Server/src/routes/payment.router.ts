import express, { Request, Response } from "express";
const router = express.Router();
import payment from "../controller/payment.controller";

// router.post("/generateQR", generateQR)
router.post("/create-checkout-session", payment)

export default router;