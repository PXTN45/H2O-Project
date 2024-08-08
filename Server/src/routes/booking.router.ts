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
router.get("/booking",getBooking , verifyAdmin,verifyToken)
router.get("/homestay-booking/:userId",getBookingHomeStayByUser , verifyUser,verifyToken)
router.get("/package-booking/:userId",getBookingPackageByUser , verifyUser,verifyToken)
router.post("/bookingHomeStay/:userId", bookHomeStay,verifyUser,verifyToken);
router.post("/bookingPackage", bookPackage,verifyUser,verifyToken);
router.put("/editPackageBooking/:userId",editPackageBooking,verifyUser,verifyToken)
router.put("/editHomeStayBooking/:userId",editHomeStayBooking,verifyUser,verifyToken)
router.put("/confirmBooking/:id", confirmBooking,verifyBusiness,verifyToken);
router.put("/cancelBooking/:id",cancelBooking,verifyUser,verifyToken)
router.delete("/deleteBooking/:id",deleteBooking,verifyToken,verifyAdmin)

export default router;
