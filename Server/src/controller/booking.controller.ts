import { Request, Response } from 'express';
import Booking from '../model/booking.model';

export const bookHomeStay = async (req: Request, res: Response): Promise<void> => {
  try {
    const { booker, room_type, bookingDate, bookingStatus, paymentDetail } = req.body;

    const newBookHomeStay = new Booking({
      booker,
      room_type,
      bookingDate,
      bookingStatus,
      paymentDetail
    });

    await newBookHomeStay.save();
    res.status(201).json(newBookHomeStay);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

