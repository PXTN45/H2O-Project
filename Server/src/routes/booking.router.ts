import express, { Request, Response } from "express";
import {bookHomeStay} from '../controller/booking.controller'
const router = express.Router();


router.post('/bookingHomeStay', bookHomeStay);


export default router;