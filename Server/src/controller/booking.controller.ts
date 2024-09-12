import { Request, Response } from "express";
import Booking from "../model/booking.model";
import User from "../model/user.model";
import { getBookingNights, isDateValid } from "../utils";
import BadRequestError from "../error/badrequest";
import isBookingAvailable from "../utils/date/isBookingAvailable";

const getAllBooking = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = await Booking.find().populate([
      { path: "booker", select: "email name lastName" },
    ]);
    res.status(201).json(data);
  } catch (error: any) {
    res.status(404).json({ message: "Error cannot get this booking:", error });
  }
};

const getBookingByPending = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = req.params.id; // รับ userId จาก params
  try {
    const bookingData = await Booking.find({
      booker: userId,
      bookingStatus: "Pending",
    }).populate([
      { path: "booker", select: "email name lastName" },
      { path: "homestay" },
      { path: "package" },
    ]);

    // ตรวจสอบว่าพบข้อมูลหรือไม่
    if (bookingData.length === 0) {
      res.status(404).json({
        message: "No bookings found for this user with pending status.",
      });
    } else {
      res.status(200).json(bookingData);
    }
  } catch (error: any) {
    res.status(500).json({ message: "Error cannot get bookings", error });
  }
};

const getBookingByConfirm = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = req.params.id; // รับ userId จาก params
  try {
    const bookingData = await Booking.find({booker: userId,bookingStatus: "Confirmed",}).populate([
      { path: "booker", select: "email name lastName" },
      { path: "homestay" },
      { path: "package" },
    ]);

    // ตรวจสอบว่าพบข้อมูลหรือไม่
    if (bookingData.length === 0) {
      res.status(404).json({
        message: "No bookings found for this user with pending status.",
      });
    } else {
      res.status(200).json(bookingData);
    }
  } catch (error: any) {
    res.status(500).json({ message: "Error cannot get bookings", error });
  }
};

const getBookingHomeStayByUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = req.params.id;

  try {
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: "User Not Found!" });
      return;
    }
    const bookings = await Booking.find({ user: userId }).populate("homestay");
    res.status(200).json(bookings);
  } catch (error) {}
};

const getBookingPackageByUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = req.params.id;
  try {
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: "User Not Found!" });
      return;
    }
    const bookings = await Booking.find({ user: userId }).populate("package");
    res.status(200).json(bookings);
  } catch (error) {}
};

const bookHomeStay = async (req: Request, res: Response): Promise<void> => {
  const { homestay, bookingStart, bookingEnd, paymentDetail } = req.body;
  const userId = req.params.userId;
  // console.log(userId);

  try {
    // Validate dates
    if (!isDateValid(bookingStart, bookingEnd)) {
      throw new BadRequestError(
        "Please provide valid dates starting from today!"
      );
    }

    // Calculate the number of nights
    const differenceInDays = getBookingNights(bookingStart, bookingEnd);
    if (differenceInDays < 1) {
      throw new BadRequestError("Return date must be after the start date!");
    }

    // Check if the homestay is available (assuming you have an isBookingAvailable function)
    const isAvailable = await isBookingAvailable(
      homestay,
      bookingStart,
      bookingEnd
    );
    if (!isAvailable) {
      throw new BadRequestError("The homestay is already booked!");
    }

    // Create the booking
    const booking = await Booking.create({
      booker: userId, // userId is directly assigned since booker is a single ObjectId
      homestay,
      bookingStart,
      bookingEnd,
      night: differenceInDays,
      bookingStatus: "Pending", // This will use the default, but explicitly setting it
      paymentDetail,
    });

    // Respond with the created booking
    res.status(201).json({ booking });
  } catch (error) {
    console.error("Error while booking homestay:", error);
    res.status(500).json({ message: "Server Error", error });
  }
};

const bookPackage = async (req: Request, res: Response) => {
  // เข้าถึง bookingData จาก req.body
  const { bookingData } = req.body;

  console.log("Received booking package data:", bookingData);

  try {
    // ตรวจสอบการมีอยู่ของฟิลด์ใน bookingData
    const { bookingStart, bookingEnd, booker, homestayId, offer, packageId } =
      bookingData;

    if (!bookingStart || !bookingEnd || !booker) {
      return res.status(400).json({ message: "Please provide all required fields: bookingStart!" });
    }

    const night = getBookingNights(bookingStart, bookingEnd);
    if (night <= 0) {
      return res.status(400).json({ message: "Booking duration must be at least 1 night." });
    }

    const newBookingPackage = new Booking({
      booker,
      homestay: homestayId.trim() || undefined,  // ใช้ trim() เพื่อลบช่องว่างที่ไม่ต้องการ
      detail_offer: offer || [],
      package: packageId || undefined,
      bookingStart,
      bookingEnd,
      night,
      bookingStatus: "Pending",
    });

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

const deleteBooking = async (req: Request, res: Response): Promise<void> => {
  const bookingId = req.params.id;
  try {
    const data = await Booking.findById(bookingId);
    if (!data) {
      res.status(404).json({ message: "Booking Not Found" });
    }
    await Booking.findByIdAndDelete(bookingId);
    res.status(201).json({ message: "Booking deleted !" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

const cancelBooking = async (req: Request, res: Response): Promise<void> => {
  const bookingId = req.params.id;
  try {
    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      { bookingStatus: "Cancelled" },
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
  getBookingPackageByUser,
  getBookingByPending,
  getBookingByConfirm,
};
