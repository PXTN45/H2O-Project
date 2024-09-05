import express, { Request, Response } from "express";
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

const paymentAndWebhook = async (req: Request, res: Response) => {
  const { totalPrice, name, email, bookingStart, bookingEnd, booker, homestayId, packageId } = req.body;

  try {
    // 1. สร้าง session ของ Stripe
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
      // ส่งข้อมูลการจองผ่าน metadata เพื่อใช้งานใน Webhook
      metadata: {
        bookingStart,
        bookingEnd,
        booker,
        homestayId,
        packageId,
      },
    });

    // ส่ง session URL กลับไปที่ frontend เพื่อทำการชำระเงิน
    res.status(201).json({
      sessionUrl: session.url,
    });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

// 2. สร้าง Webhook เพื่อรับ event จาก Stripe
const stripeWebhook = express.raw({ type: "application/json" });

const handleStripeWebhook = async (req: Request, res: Response) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    // ตรวจสอบ signature ของ webhook
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the checkout session completed event
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    // เรียกฟังก์ชันเพื่อสร้าง booking หลังจากชำระเงินสำเร็จ
    await createBooking(session);
  }

  res.json({ received: true });
};

// 3. ฟังก์ชันสำหรับสร้าง Booking หลังจากชำระเงินสำเร็จ
const createBooking = async (session) => {
  const { bookingStart, bookingEnd, booker, homestayId, packageId } = session.metadata;
  const paymentDetail = session.payment_intent;

  try {
    // ตรวจสอบวันจอง
    if (!isDateValid(bookingStart, bookingEnd)) {
      console.error("Invalid booking dates");
      return;
    }

    const differenceInDays = getBookingNights(bookingStart, bookingEnd);

    // ตรวจสอบสถานะการจอง
    if (!isBookingAvailable(homestayId, bookingStart, bookingEnd)) {
      console.error("The homeStay is already booked!");
      return;
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

    console.log("Booking created successfully:", booking);
  } catch (error) {
    console.error("Error creating booking:", error);
  }
};

export { booking, payment };
