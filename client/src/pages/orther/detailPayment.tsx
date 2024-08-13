// DetailPayment.tsx
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axiosPublic from "../../hook/axiosPublic";
import DetailBooking from "../../components/detailBooking";
import { usePaymentContext } from "../../AuthContext/paymentContext";

const DetailPayment: React.FC = () => {
  const location = useLocation();
  const { amount } = location.state || { amount: 0 };
  const [qrCodeUrl, setQrCodeUrl] = useState<string | undefined>(undefined);
  const { paymentData } = usePaymentContext();
  if (!paymentData) {
    return <div>No booking details available.</div>;
  }

  useEffect(() => {
    const generateQR = async () => {
      try {
        const response = await axiosPublic.post("/payment/generateQR", {
          amount,
        });
        setQrCodeUrl(response.data.Result);
      } catch (err) {
        console.error("Error generating QR code:", err);
      }
    };
    generateQR();
  }, []);

  return (
    <div className="container-sm  mx-auto px-60">
      <div className="flex flex-col items-center">
        <div className="flex justify-center mt-10 mb-10">
          <ul className="steps steps-vertical lg:steps-horizontal">
            <li data-content="✓" className="step step-primary">
              ข้อมูลการจอง
            </li>
            <li className="step step">ข้อมูลการชำระเงิน</li>
            <li className="step">รอการยืนยัน</li>
          </ul>
        </div>
      <DetailBooking />


        <div className="shadow-lg m-5 rounded-lg w-full">
          <div className="p-2 bg-primaryUser rounded-t-lg"></div>
          <div className="flex items-center m-5">
            <img
              className="w-20 rounded-md"
              src="https://download-th.com/wp-content/uploads/2023/02/ThaiQR.jpg"
              alt=""
            />
            <h1 className="font-bold text-lg ml-4">ชำระเงินด้วย QR Code</h1>
          </div>
          <div className="flex flex-row">
            <div className="flex justify-center w-1/2">
              {qrCodeUrl && (
                <img
                  id="imgqr"
                  src={qrCodeUrl}
                  alt="QR Code"
                  style={{ width: "300px", objectFit: "contain" }}
                />
              )}
            </div>
            <div className="flex flex-col w-1/2 gap-4 mt-10">
              <p>1. เปิดแอปพลิเคชันของธนาคารบนอุปกรณ์มือถือที่ต้องการใช้งาน</p>
              <p>
                2. สแกน QR Code หรือบันทึกรูป QR Code
                และเปิดรูปในแอปพลิเคชั่นธนาคารของท่าน
              </p>
              <p>3. ตรวจสอบรายละเอียดและยืนยันการชำระเงิน</p>
              <p>4. เราจะส่งใบยืนยันการจองไปยังอีเมลที่ท่านใช้ในการจอง</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailPayment;
