import express, { Request, Response } from "express";
const router = express.Router();
import generateQR from "src/controller/generateQR.controller";

router.post("//generateQR", generateQR)

export default router;