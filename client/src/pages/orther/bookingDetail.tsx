import React, { useState, useEffect } from "react";
import { usePaymentContext } from "../../AuthContext/paymentContext";
import DetailBooking from "../../components/detailBooking";
import { useNavigate } from "react-router-dom";

export interface Image_room {
  _id: string;
  image: string;
}
export interface Facilities_Room {
  facilitiesName: string;
}

export interface Offer {
  price_homeStay: number;
  max_people: {
    adult: number;
    child: number;
  };
  discount: number;
  facilitiesRoom: Facilities_Room[];
  roomCount: number;
  quantityRoom: number;
}
export interface RoomType {
  name_type_room: string;
  bathroom_homeStay: number;
  bedroom_homeStay: number;
  sizeBedroom_homeStay: string;
  offer: Offer[];
  image_room: Image_room[];
}
interface User {
  _id?: string;
  name?: string;
  lastName?: string;
  businessName?: string;
  email: string;
  password: string;
  phone: string | undefined;
  image: string;
  address: string;
  birthday: Date;
  role: string;
}
interface PaymentData {
  homeStayId: string;
  homeStayName: string;
  totalPrice: number;
  roomType: RoomType;
  offer: Offer;
  bookingUser: User;
  rating: number;
}
const BookingDetail: React.FC = () => {
  const { paymentData, setPaymentData } = usePaymentContext();
  const [totalFee, setTotalFee] = useState<number>(0);
  const [totalTax, setTotalTax] = useState<number>(0);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [feeAndTax, setFeeAndTax] = useState<number>(0);
  const navigate = useNavigate();

  if (!paymentData) {
    return <div>No booking details available.</div>;
  }

  useEffect(() => {
    if (paymentData.offer) {
      const price = paymentData.totalPrice * paymentData.offer.quantityRoom;
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
  }, [paymentData.totalPrice, paymentData.offer?.quantityRoom]);

  console.log(totalPrice);

  const handleToPayment = () => {
    if (paymentData) {
      const dataToPayment: PaymentData = {
        homeStayId: paymentData.homeStayId,
        homeStayName: paymentData.homeStayName,
        totalPrice: totalPrice,
        roomType: paymentData.roomType,
        offer: paymentData.offer,
        bookingUser: paymentData.bookingUser,
        rating: paymentData.rating,
      };

      localStorage.setItem("paymentData", JSON.stringify(dataToPayment));

      setPaymentData(dataToPayment);
      navigate("/detailPayment");
    }
  };

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
                  <div>
                    : {paymentData.bookingUser.name}{" "}
                    {paymentData.bookingUser.lastName}
                  </div>
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
                  <div>
                    {" "}
                    {paymentData.totalPrice.toLocaleString("th-TH", {
                      style: "decimal",
                      minimumFractionDigits: 2,
                    })}{" "}
                    บาท
                  </div>
                </div>
                <div className="flex justify-between">
                  <div>ภาษีและค่าธรรมเนียม</div>
                  <div>
                    {" "}
                    {feeAndTax.toLocaleString("th-TH", {
                      style: "decimal",
                      minimumFractionDigits: 2,
                    })}{" "}
                    บาท
                  </div>
                </div>
              </div>
              <div className="flex justify-between pt-5">
                <div className="font-bold text-xl">รวมทั้งสิ้น</div>
                <div className="font-bold text-xl text-alert">
                  {totalPrice.toLocaleString("th-TH", {
                    style: "decimal",
                    minimumFractionDigits: 2,
                  })}
                  บาท
                </div>
              </div>
              <div>
                <button
                  className="border w-full my-5 p-3 rounded-lg bg-primaryUser text-white font-bold text-xl hover:scale-105 
                transition-transform duration-300"
                  onClick={() => handleToPayment()}
                >
                  ชำระเงิน
                </button>
              </div>
            </div>
          </div>
        </div>
        <DetailBooking totalPrice={totalPrice} />
      </div>
    </div>
  );
};

export default BookingDetail;
