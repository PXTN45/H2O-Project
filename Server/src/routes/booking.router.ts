import express, { Request, Response } from "express";
import {bookHomeStay,confirmBooking} from '../controller/booking.controller'
const router = express.Router();


router.post('/bookingHomeStay', bookHomeStay);

router.put('/confirmBooking/:id', confirmBooking);

export default router;