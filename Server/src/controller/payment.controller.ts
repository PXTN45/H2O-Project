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

const payment = async (req: Request, res: Response) => {
  const {
    totalPrice,
    name,
    bookingStart,
    bookingEnd,
    booker,
    homestayId,
    packageId,
    paymentDetail,
    email,
  } = req.body;

  console.log(req.body);

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
            unit_amount: totalPrice * 100, // ราคาเป็นจำนวนเต็มในหน่วยย่อย (เช่น สตางค์)
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${YOUR_DOMAIN}/paymentSuccess`,
      cancel_url: `${YOUR_DOMAIN}/paymentFailure`,
      customer_email: email,
    });

    if (session) {
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
          message: "The homeStay is already booked!",
        });
      }

      // สร้างข้อมูลการจอง
      const booking = await BookingModel.create({
        booker,
        homestay: homestayId,
        package: packageId,
        bookingStart,
        bookingEnd,
        night: differenceInDays,
        paymentDetail,
      });

      // ส่ง URL กลับไปยัง frontend
      res.status(201).json({
        sessionUrl: session.url,
        booking,
        totalPrice,
        email,
        name
      });
    }
    // ตรวจสอบวันที่ก่อนสร้าง session
  } catch (error) {
    console.error("Error creating checkout session or booking:", error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

export default payment;
