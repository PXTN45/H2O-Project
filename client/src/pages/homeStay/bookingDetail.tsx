import React, { useState, useEffect } from "react";
import { usePaymentContext } from "../../AuthContext/paymentContext";
import DetailBooking from "../../components/detailBooking";
import { IoMdTime } from "react-icons/io";
import { MdOutlinePolicy } from "react-icons/md";
import axiosPrivateUser from "../../hook/axiosPrivateUser";


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
  time_checkIn_homeStay: string;
  time_checkOut_homeStay: string;
  policy_cancel_homeStay: string;
}
const BookingDetail: React.FC = () => {
  const { paymentData } = usePaymentContext();
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [feeAndTax, setFeeAndTax] = useState<number>(0);


  console.log(paymentData);

  useEffect(() => {
    if (paymentData) {
      const price = paymentData.totalPrice * paymentData.offer.quantityRoom;
      const taxRate = 0.07;
      const feeRate = 0.1;

      const fee = price * feeRate;
      const tax = (price + fee) * taxRate;
      const feeAndTax = fee + tax;
      const total = price + feeAndTax;
      setFeeAndTax(feeAndTax);
      setTotalPrice(total);
    }
  }, [paymentData?.totalPrice]);

  const makePayment = async () => {
    try {
      const response = await axiosPrivateUser.post('/create-checkout-session', {
        products: paymentData,
      });
  
      if (response.data && response.data.sessionUrl) {
        window.location.href = response.data.sessionUrl;
      } else {
        throw new Error('No session URL returned');
      }
    } catch (error) {
      console.error('Error making payment:', error);
    }
  };
  
  
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
            {/* policy */}
            <div id="policy">
              <div className="w-full rounded-lg shadow-boxShadow p-5">
                <div className="text-xl font-bold mb-5">
                  นโยบายที่พักและข้อมูลทั่วไปของ - {paymentData.homeStayName}
                </div>
                <div>
                  <div className="flex items-center gap-2 text-md font-bold">
                    <IoMdTime /> เช็คอิน/เช็คเอ้า
                  </div>
                  <div className="ml-10">
                    <div>
                      เช็คอินตั้งแต่ : {paymentData.time_checkIn_homeStay} น.
                    </div>
                    <div>
                      เช็คเอ้าก่อน : {paymentData.time_checkOut_homeStay} น.
                    </div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-md font-bold mt-5">
                    <MdOutlinePolicy />
                    นโยบาย
                  </div>
                  <div className="ml-10">
                    {paymentData.policy_cancel_homeStay}
                  </div>
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
                    {(
                      paymentData.totalPrice * paymentData.offer.quantityRoom
                    ).toLocaleString("th-TH", {
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
                  onClick={makePayment}
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
