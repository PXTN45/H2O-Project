import { Request, Response } from "express";
import Booking from "../model/booking.model";
import BookingModel from "../model/booking.model";

const getBooking = async (req: Request, res: Response): Promise<void> => {
  const id = req.params.id;
  try {
    const data = await Booking.find();
    res.status(201).json(data);
  } catch (error: any) {
    res.status(404).json({ message: "Error cannot get this booking:", error });
  }
};
const bookHomeStay = async (req: Request, res: Response): Promise<void> => {
  try {
    const bookingHomeStay = req.body;
    const newBookHomeStay = new Booking(bookingHomeStay);
    await newBookHomeStay.save();
    res.status(201).json(newBookHomeStay);
  } catch (error) {
    console.error("Error while booking home stay:", error);
    res.status(500).json({ message: "Server Error", error });
  }
};
const bookPackage = async (req: Request, res: Response): Promise<void> => {
  try {
    const bookingPackage = req.body;
    const newBookPackage = new Booking(bookingPackage);

    await newBookPackage.save();
    res.status(201).json(newBookPackage);
  } catch (error) {
    console.error("Error while booking Package:", error);
    res.status(500).json({ message: "Server Error", error });
  }
};
const editPackageBooking = async (
  req: Request,
  res: Response
): Promise<void> => {
  const id = req.params.id;
  try {
    const data = await Booking.findByIdAndUpdate(id);
    if (!data) {
      res.status(404).json({ message: "Package Not Found" });
    }
    res.status(201).json(data);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
const editHomeStayBooking = async (
  req: Request,
  res: Response
): Promise<void> => {
  const id = req.params.id;
  try {
    const data = await Booking.findByIdAndUpdate(id);
    if (!data) {
      res.status(404).json({ message: "HomeStay Not Found" });
    }
    res.status(201).json(data);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

const cancelBooking = async (req: Request, res: Response): Promise<void> => {
  const id = req.params.id;
  try {
    const data = await Booking.findByIdAndDelete(id);
    if (!data) {
      res.status(404).json({ message: "HomeStay Not Found" });
    } else {
      res.status(200).json(data);
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
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
export {
  bookHomeStay,
  confirmBooking,
  bookPackage,
  getBooking,
  editPackageBooking,
  editHomeStayBooking,
  cancelBooking,
};
