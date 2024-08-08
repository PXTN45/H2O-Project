import express, { Request, Response } from "express";
import {
  bookHomeStay,
  bookPackage,
  confirmBooking,
  getBooking,
  editPackageBooking,
  editHomeStayBooking,
  cancelBooking,
  deleteBooking,
  getBookingHomeStayByUser,
  getBookingPackageByUser
} from "../controller/booking.controller";
import { verifyToken } from "../middlewares/verifyToken";
import verifyUser from "../middlewares/verifyUser";
import verifyBusiness from "../middlewares/verifyBusiness";
import verifyAdmin from "../middlewares/verifyAdmin";
const router = express.Router();
router.get("/booking",getBooking , verifyUser,verifyToken)
router.get("/homestay-booking",getBookingHomeStayByUser , verifyUser,verifyToken)
router.get("/package-booking",getBookingPackageByUser , verifyUser,verifyToken)
router.post("/bookingHomeStay", bookHomeStay,verifyUser,verifyToken);
router.post("/bookingPackage", bookPackage,verifyUser,verifyToken);
router.put("/editPackageBooking",editPackageBooking,verifyUser,verifyToken)
router.put("/editHomeStayBooking",editHomeStayBooking,verifyUser,verifyToken)
router.put("/confirmBooking/:id", confirmBooking,verifyBusiness,verifyToken);
router.put("/cancelBooking",cancelBooking,verifyUser,verifyToken)
router.delete("/deleteBooking",deleteBooking,verifyToken,verifyAdmin)

export default router;
