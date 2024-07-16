import { Request, Response } from "express";
import Booking from "../model/booking.model";
import BookingModel from "../model/booking.model";
const bookHomeStay = async (req: Request, res: Response): Promise<void> => {
  try {
    const { booker, homeStayDetail, paymentDetail } = req.body;

  
    // if (!booker || !homeStayDetail || paymentDetail) {
    //   res.status(400).json({ message: "Missing required fields" });
    //   return;
    // }

    const newBookHomeStay = new Booking({
      booker,
      homeStayDetail,
      paymentDetail
    });

    await newBookHomeStay.save();
    res.status(201).json(newBookHomeStay);
  } catch (error) {
    console.error("Error while booking home stay:", error);
    res.status(500).json({ message: "Server Error", error });
  }
};
const bookPackage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { booker, homeStayDetail, paymentDetail, packageDetail } = req.body;

    //  Check if required fields are missing
    // if (!booker || !homeStayDetail || !paymentDetail) {
    //   res.status(400).json({ message: "Missing required fields" });
    //   return;
    // }

    const newBookHomeStay = new Booking({
      booker,
      homeStayDetail,
      paymentDetail,
      packageDetail
    });

    await newBookHomeStay.save();
    res.status(201).json(newBookHomeStay);
  } catch (error) {
    console.error("Error while booking home stay:", error);
    res.status(500).json({ message: "Server Error", error });
  }
};

const confirmBooking = async (req: Request, res: Response): Promise<void> => {
  const bookingId = req.params.id;

  try {
    const booking = await BookingModel.findByIdAndUpdate(
      bookingId,
      { bookingStatus: "Confirmed" },
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
export { bookHomeStay, confirmBooking , bookPackage };
