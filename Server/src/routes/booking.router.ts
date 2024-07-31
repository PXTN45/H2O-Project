import express, { Request, Response } from "express";
import {
  bookHomeStay,
  bookPackage,
  confirmBooking,
  getBooking,
  editPackageBooking,
  editHomeStayBooking,
  cancelBooking,
} from "../controller/booking.controller";
const router = express.Router();
router.get("/booking",getBooking)
router.post("/bookingHomeStay", bookHomeStay);
router.post("/bookingPackage", bookPackage);
router.put("/editPackageBooking",editPackageBooking)
router.put("/editHomeStayBooking",editHomeStayBooking)
router.put("/confirmBooking/:id", confirmBooking);
router.delete("/cancelBooking",cancelBooking)

export default router;
