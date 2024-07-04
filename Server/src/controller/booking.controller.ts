import { Request, Response } from "express";
import Booking from "../model/booking.model";
import BookingModel from "../model/booking.model";

const bookHomeStay = async (req: Request, res: Response): Promise<void> => {
  try {
    const { booker, room_type, bookingDate, bookingStatus, paymentDetail } =
      req.body;

    const newBookHomeStay = new Booking({
      booker,
      room_type,
      bookingDate,
      bookingStatus,
      paymentDetail,
    });

    await newBookHomeStay.save();
    res.status(201).json(newBookHomeStay);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

const confirmBooking = async (req: Request, res: Response): Promise<void> => {
  const bookingId = req.params.id;

  try {
    const booking = await BookingModel.findByIdAndUpdate(
      bookingId,
      { bookingStatus: true },
      { new: true }
    );

    if (!booking) {
      res.status(404).send({ message: "Booking not found" });
      return;
    }

    res.status(200).send(booking);
  } catch (error) {
    res.status(500).send(error);
  }
};
export { bookHomeStay, confirmBooking };
