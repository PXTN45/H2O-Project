import express, { Request, Response } from "express";
import {bookHomeStay,bookPackage,confirmBooking} from '../controller/booking.controller'
const router = express.Router();


router.post('/bookingHomeStay', bookHomeStay);
router.post('/bookingPackage', bookPackage);

router.put('/confirmBooking/:id', confirmBooking);

export default router;