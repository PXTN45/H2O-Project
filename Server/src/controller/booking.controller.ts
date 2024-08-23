import { Request, Response } from "express";
import Booking from "../model/booking.model";
import User from "../model/user.model";
import { getBookingNights, isDateValid } from "../utils";
import BadRequestError from "../error/badrequest";
import isBookingAvailable from "../utils/date/isBookingAvailable";
import {differenceInDays} from "date-fns"

const getAllBooking = async (req: Request, res: Response): Promise<void> => {
  const id = req.params.id;
  try {
    const data = (await Booking.find().populate([{path:"booker", select:"email name lastName"}]));
    res.status(201).json(data);
  } catch (error: any) {
    res.status(404).json({ message: "Error cannot get this booking:", error });
  }
};
const getBookingHomeStayByUser = async (req: Request, res: Response): Promise<void> =>{
  const userId = req.params.id
  
  try {
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({message: "User Not Found!"})
      return
    }
    const bookings = await Booking.find({user:userId}).populate('homestay')
    res.status(200).json(bookings)
  } catch (error) {
    
  }
}
const getBookingPackageByUser = async (req: Request, res: Response): Promise<void> =>{
  const userId = req.params.id
  try {
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({message: "User Not Found!"})
      return
    }
    const bookings = await Booking.find({user:userId}).populate('package')
    res.status(200).json(bookings)
  } catch (error) {
    
  }
}
const bookHomeStay = async (req: Request, res: Response): Promise<void> => {
  const { homestay, bookingStart, bookingEnd, paymentDetail } = req.body;
  const userId = req.params.userId;
// console.log(userId);

  try {
    // Validate dates
    if (!isDateValid(bookingStart, bookingEnd)) {
      throw new BadRequestError("Please provide valid dates starting from today!");
    }

    // Calculate the number of nights
    const differenceInDays = getBookingNights(bookingStart, bookingEnd);
    if (differenceInDays < 1) {
      throw new BadRequestError("Return date must be after the start date!");
    }

    // Check if the homestay is available (assuming you have an isBookingAvailable function)
    const isAvailable = await isBookingAvailable(homestay, bookingStart, bookingEnd);
    if (!isAvailable) {
      throw new BadRequestError("The homestay is already booked!");
    }

    // Create the booking
    const booking = await Booking.create({
      booker: userId,  // userId is directly assigned since booker is a single ObjectId
      homestay,
      bookingStart,
      bookingEnd,
      night: differenceInDays,
      bookingStatus: "Pending",  // This will use the default, but explicitly setting it
      paymentDetail,
    });

    // Respond with the created booking
    res.status(201).json({ booking });
  } catch (error) {
    console.error("Error while booking homestay:", error);
    res.status(500).json({ message: "Server Error", error });
  }
};
const bookPackage = async (req: Request, res: Response): Promise<void> => {
  try {
    const bookingPackage = req.body;
    const newBookingPackage = new Booking(bookingPackage);

    await newBookingPackage.save();
    res.status(201).json(newBookingPackage);
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
const deleteBooking = async (req: Request , res: Response) : Promise<void> => {
  const bookingId = req.params.id
  try {
    const data = await Booking.findById(bookingId)
    if (!data) {
      res.status(404).json({ message: "Booking Not Found" });
    }
    await Booking.findByIdAndDelete(bookingId);
    res.status(201).json({message: 'Booking deleted !'});
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

const cancelBooking = async (req: Request, res: Response): Promise<void> => {
  const bookingId = req.params.id;
  try {
      
    const booking = await Booking.findById(bookingId);
  
    if (!booking) {
      res.status(404).send({ message: "Booking not found" });
      return;
    }

    // Check if the booking can be canceled (within 3 days)
    const today = new Date();
    const daysUntilBooking = differenceInDays(new Date(booking.bookingStart), today);

    if (daysUntilBooking < 0) {
      res.status(400).send({ message: "Booking start date has already passed. Cannot cancel!" });
      return;
    } else if (daysUntilBooking > 3) {
      res.status(400).send({ message: "Booking cannot be canceled after three days before the start date." });
      return;
    }

    // Proceed to cancel the booking
    booking.bookingStatus = "Cancelled";
    await booking.save();

    res.status(200).send(booking);
  } catch (error) {
    res.status(500).send(error);
  }
};

const confirmBooking = async (req: Request, res: Response): Promise<void> => {
  const bookingId = req.params.id;

  try {
    const booking = await Booking.findByIdAndUpdate(
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
  getAllBooking,
  editPackageBooking,
  editHomeStayBooking,
  cancelBooking,
  deleteBooking,
  getBookingHomeStayByUser,
  getBookingPackageByUser
};
