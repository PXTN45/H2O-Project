import express, { Request, Response } from "express";
import QRCode from "qrcode";
import generatePayload from "promptpay-qr";
import _ from "lodash";
import Stripe from "stripe";
import BookingModel from "../model/booking.model";
import { getBookingNights, isDateValid } from "../utils";
import BadRequestError from "../error/badrequest";
import isBookingAvailable from "../utils/date/isBookingAvailable";

const YOUR_DOMAIN = "http://localhost:5173";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

const checkBooking = async (req: Request, res: Response) => {
  const { homestay, bookingStart, bookingEnd, booker, packageId } = req.body;
  console.log(req.body);
  
  const bookingStartDate = new Date(bookingStart);
  const bookingEndDate = new Date(bookingEnd);
  try {
    const data = {
      booker,
      homestay,
      package: packageId,
      bookingStart: bookingStartDate,
      bookingEnd: bookingEndDate,
    };
    const isAvailable = await BookingModel.findOne(data);
    if (!isAvailable) {
      return res.status(200).json({
        isAvailable,
        message: "ยังไม่เคยจอง",
      });
    } else {
      return res.status(200).json({
        isAvailable,
        message: "คุณต้องการทำการจองซ้ำอีกครั้งหรือไม่?",
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

const payment = async (req: Request, res: Response) => {
  const { totalPrice, name, email } = req.body;
  console.log(req.body);
  const price = parseInt((totalPrice * 100).toFixed(0));

  try {
    // สร้าง session ของ Stripe
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: "thb",
            product_data: {
              name: name,
            },
            unit_amount: price, // ราคาเป็นจำนวนเต็มในหน่วยย่อย (เช่น สตางค์)
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${YOUR_DOMAIN}/paymentSuccess`,
      cancel_url: `${YOUR_DOMAIN}/paymentFailure`,
      customer_email: email,
    });

    res.status(201).json({
      sessionUrl: session.url,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

const booking = async (req: Request, res: Response) => {
  const {
    bookingStart,
    bookingEnd,
    booker,
    homestayId = "",
    offer = [],
    packageId,
  } = req.body.bookingData;

  console.log(req.body);

  try {
    // ตรวจสอบความถูกต้องของวันที่
    if (!isDateValid(bookingStart, bookingEnd)) {
      return res.status(400).json({
        message: "Please provide valid dates starting from today!",
      });
    }

    const differenceInDays = getBookingNights(bookingStart, bookingEnd);
    if (differenceInDays < 1) {
      return res.status(400).json({
        message: "Return date must be after start date!",
      });
    }

    if (!isBookingAvailable) {
      return res.status(400).json({
        message: "The homestay is already booked!",
      });
    }

    // สร้างข้อมูลการจอง
    const booking = await BookingModel.create({
      booker,
      homestay: homestayId,
      detail_offer: offer,
      package: packageId || null, // กำหนดให้ packageId เป็น null หากไม่มีค่า
      bookingStart,
      bookingEnd,
      night: differenceInDays,
    });

    res.status(201).json({ booking });
  } catch (error) {
    console.error("Error creating checkout session or booking:", error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

export { payment, booking, checkBooking };
