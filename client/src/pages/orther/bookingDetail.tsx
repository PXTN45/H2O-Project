import React, { useState, useEffect } from "react";
import { usePaymentContext } from "../../AuthContext/paymentContext";
import DetailBooking from "../../components/detailBooking";



const BookingDetail: React.FC = () => {
  const { paymentData } = usePaymentContext();
  const [totalFee, setTotalFee] = useState<number>(0);
  const [totalTax, setTotalTax] = useState<number>(0);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [feeAndTax, setFeeAndTax] = useState<number>(0);

  useEffect(() => {
    if (paymentData && paymentData.offer) {
      const price = paymentData.offer.price_homeStay;
      const taxRate = 0.07;
      const feeRate = 0.1;

      const calculateTaxesAndFees = (price: number) => {
        const fee = price * feeRate;
        const tax = (price + fee) * taxRate;
        const feeAndTax = fee + tax;
        const total = price + feeAndTax;

        setTotalFee(fee);
        setTotalTax(tax);
        setFeeAndTax(feeAndTax);
        setTotalPrice(total);
      };

      calculateTaxesAndFees(price);
    }
  }, [paymentData]);

  if (!paymentData) {
    return <div>No booking details available.</div>;
  }

  return (
    <div className="container-sm mx-10 md:mx-40">
      <div className="flex gap-5 mt-5">
        <div className="w-2/3 flex flex-col gap-5">
          <div>
            <div className="shadow-boxShadow rounded-lg p-10">
              <div className="text-xl font-bold">ผู้เข้าพัก</div>
              <div className="flex gap-2 mt-5 text-md">
                <div>
                  <div>ชื่อเต็ม</div>
                  <div>อีเมล</div>
                </div>
                <div>
                  <div>: {paymentData.bookingUser.name}</div>
                  <div>: {paymentData.bookingUser.email}</div>
                </div>
              </div>
            </div>
          </div>
          <div>
            <div className="shadow-boxShadow rounded-lg p-10">
              <div className="text-xl font-bold">รายละเอียดราคา</div>
              <div className="gap-2 mt-5 text-md border-b pb-5">
                <div className="flex justify-between">
                  <div>ราคาห้องพัก</div>
                  <div>{paymentData.offer.price_homeStay} บาท</div>
                </div>
                <div className="flex justify-between">
                  <div>ภาษีและค่าธรรมเนียม</div>
                  <div>{feeAndTax.toFixed(2)} บาท</div>
                </div>
              </div>
              <div className="flex justify-between pt-5">
                <div className="font-bold text-xl">รวมทั้งสิ้น</div>
                <div className="font-bold text-xl text-alert">
                  {totalPrice.toFixed(2)} บาท
                </div>
              </div>
              <div>
                <button
                  className="border w-full my-5 p-3 rounded-lg bg-primaryUser text-white font-bold text-xl hover:scale-105 
                transition-transform duration-300"
                >
                  ชำระเงิน
                </button>
              </div>
            </div>
          </div>
        </div>
        <DetailBooking />
      </div>
    </div>
  );
};

export default BookingDetail;
