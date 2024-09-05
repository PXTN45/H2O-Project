import express, { Request, Response } from "express";
const router = express.Router();
import {payment, booking} from "../controller/payment.controller";

// router.post("/generateQR", generateQR)
router.post("/create-checkout-session", payment)
router.post("/create-booking", booking)

export default router;