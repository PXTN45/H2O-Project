import express, { Request, Response } from 'express';
import QRCode from 'qrcode';
import generatePayload from 'promptpay-qr';
import _ from 'lodash';
import Stripe from "stripe";
import BookingModel from '../model/booking.model';

// interface QRRequestBody {
//     amount: number;
// }

// const generateQR = (req: Request<{}, {}, QRRequestBody>, res: Response) => {
//     const amount: number = parseFloat(String(_.get(req, ["body", "amount"])));
//     const mobileNumber: string = '0928983405';
//     const payload: string = generatePayload(mobileNumber, { amount });
//     const option = {
//         color: {
//             dark: '#000',
//             light: '#fff'
//         }
//     };

//     QRCode.toDataURL(payload, (err: any, url) => {
//         if (err) {
//             console.error('การสร้าง QR Code ล้มเหลว:', err);
//             return res.status(400).json({
//                 RespCode: 400,
//                 RespMessage: 'การสร้าง QR code ล้มเหลว: ' + err.message
//             });
//         } else {
//             return res.status(200).json({
//                 RespCode: 200,
//                 RespMessage: 'สร้าง QR code สำเร็จ',
//                 Result: url
//             });
//         }
//     });
// };

const YOUR_DOMAIN = "http://localhost:3000/";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2024-06-20",
  })

const payment = async (req: Request, res: Response) => {
    const { products } = req.body;
    try {
      // กำหนดค่า tax และ fee
      // const taxRate = 0.07; // ตัวอย่าง ค่าภาษี 7%
      // const fee = 0.1; // ตัวอย่าง ค่าธรรมเนียมเป็นบาท
  
      // // คำนวณค่า tax และ fee
      // const taxAmount = Math.round(products.totalPrice * taxRate);
      // const totalAmount = products.totalPrice + taxAmount + fee;
      const session = await stripe.checkout.sessions.create({
        line_items: [
          {
            price_data: {
              currency: "thb",
              product_data: {
                name: products.homeStayName,
              },
              unit_amount: products.totalPrice  * 100, // ราคาเป็นจำนวนเต็มในหน่วยย่อย (เช่น สตางค์)
            },
            quantity: products.offer.quantityRoom,
          },
        ],
        mode: "payment",
        success_url: `http://localhost:5173/`,
        cancel_url: `${YOUR_DOMAIN}?canceled=true`,
      });
  
      // ส่ง URL กลับไปยัง frontend
      res.json({ sessionUrl: session.url });
    } catch (error) {
      console.error("Error creating checkout session:", error);
      res.status(500).send("Internal Server Error");
    }
}

export default payment;
