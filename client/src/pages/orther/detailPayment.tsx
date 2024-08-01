// DetailPayment.tsx
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import axiosPublic from "../../hook/axiosPublic";

const DetailPayment: React.FC = () => {
  const location = useLocation();
  const { amount } = location.state || { amount: 0 };
  const [qrCodeUrl, setQrCodeUrl] = useState<string | undefined>(undefined);

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
  }, [amount]);

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

        <div className="flex flex-row w-full">
          <div className="w-2/3 shadow-lg rounded-lg mr-5">
            <div className="p-2 bg-primaryUser rounded-t-lg"></div>
            <h1 className="font-bold text-lg m-5">
              <b>ข้อมูลการจอง</b>
            </h1>

            <div className="pl-10 pb-10">
              <div className="mt-3 font-bold text-lg">
                <h6>เทวัญ จอมเทียน พัทยา (Tevan Jomtien Hotel Pattaya)</h6>
              </div>
              <div className="flex mt-3">
                <div className="flex flex-col gap-5 mr-5">
                  <h1>ชื่อผู้เข้าพัก : </h1>
                  <h1>ห้อง : </h1>
                  <h1>เช็คอิน : </h1>
                  <h1>เช็คเอ้า : </h1>
                </div>
                <div className="flex flex-col gap-5 ">
                  <h1>Nattaphong Sriphaophan</h1>
                  <h1>ซูพีเรีย เตียงใหญ่ (Superior Double Room)</h1>
                  <h1>วันพุธที่ 24 กรกฎาคม 2567</h1>
                  <h1>วันพฤหัสบดีที่ 25 กรกฎาคม 2567</h1>
                </div>
              </div>
            </div>
          </div>

          <div className="w-1/3 shadow-lg rounded-lg">
            <div className="p-2 bg-primaryUser rounded-t-lg"></div>
            <div className="m-5">
              <h1 className="font-bold text-lg m-5">รายละเอียดการชำระเงิน</h1>
            </div>
            <div className="m-5 pl-5">
              <h1>ยอด {amount} บาท</h1>
              <h1>กำหนดชำระ</h1>
            </div>
          </div>
        </div>

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
