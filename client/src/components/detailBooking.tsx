import React from "react";
import { usePaymentContext } from "../AuthContext/paymentContext";
import { FaRegStar, FaStar, FaStarHalfAlt } from "react-icons/fa";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import {
  MdOutlineBathroom,
  MdOutlineBedroomChild,
  MdOutlineBedroomParent,
} from "react-icons/md";

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

export interface Facility {
  _id: string;
  facilities_name: string;
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

export interface Image {
  _id: string;
  image: string;
}
export interface HomeStay {
  name_homeStay: string;
  room_type: RoomType[];
  max_people: number;
  detail_homeStay: string;
  time_checkIn_homeStay: string;
  time_checkOut_homeStay: string;
  policy_cancel_homeStay: string;
  location: Location[];
  image: Image[];
  business_user: string[]; // Assuming you use ObjectId as string
  review_rating_homeStay: number;
  facilities: Facility[];
  status_sell_homeStay: boolean;
  discount: number;
  createdAt: Date;
  updatedAt: Date;
}

const DetailBooking: React.FC<{ totalPrice: number }> = ({ totalPrice }) => {
  const { paymentData, dataNav } = usePaymentContext();

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (rating >= i) {
        stars.push(<FaStar key={i} />);
      } else if (rating >= i - 0.5) {
        stars.push(<FaStarHalfAlt key={i} />);
      } else {
        stars.push(<FaRegStar key={i} />);
      }
    }
    return stars;
  };

  const createImageCarousel = (paymentData: PaymentData) => {
    return (
      <Carousel
        showThumbs={false}
        autoPlay={true}
        infiniteLoop={true}
        showStatus={false}
        stopOnHover={true}
        dynamicHeight={true}
      >
        {paymentData.roomType?.image_room.map(
          (image: Image_room, index: number) => (
            <div key={image._id}>
              <img
                className="rounded-xl h-[250px] object-cover"
                src={image.image}
                alt={`Image ${index}`}
              />
            </div>
          )
        )}
      </Carousel>
    );
  };

  if (!paymentData) {
    return <div>No booking details available.</div>;
  }
  // // console.log(dataNav?.dateRange.startDate);
  // const calculateNights = (startDateTime?: Date | null, endDateTime?: Date | null): number => {
  //   if (!startDateTime || !endDateTime) {
  //     console.error("Start date or end date is missing or invalid");
  //     return 0;
  //   }
  
  //   // ตรวจสอบว่าค่าเป็น Date หรือไม่ ถ้าไม่ใช่ให้แปลง
  //   const start = typeof startDateTime === 'string' ? new Date(startDateTime) : startDateTime;
  //   const end = typeof endDateTime === 'string' ? new Date(endDateTime) : endDateTime;
  
  //   if (isNaN(start.getTime()) || isNaN(end.getTime())) {
  //     console.error("Invalid start or end date");
  //     return 0;
  //   }
  
  //   const differenceInTime = end.getTime() - start.getTime();
  //   const differenceInDays =( differenceInTime / (1000 * 3600 * 24)-1);
  
  //   return Math.ceil(differenceInDays);
  // };
  
  // // การใช้งานฟังก์ชัน
  // const startDate_Time = dataNav?.dateRange.startDate_Time;
  // const endDate_Time = dataNav?.dateRange.endDate_Time;    
  
  // const numberOfNights = calculateNights(startDate_Time, endDate_Time);
  // console.log(`จำนวนคืน: ${numberOfNights}`); 
  
  
  

  return (
    <div className="">
      <div className="shadow-boxShadow p-5 rounded-xl border-b">
        <div className="flex justify-between">
          <div className="text-md font-bold mb-2">
            {paymentData.homeStayName}
          </div>
          <div className="flex items-center text-primaryUser">
            {renderStars(paymentData.rating)}
          </div>
        </div>
        <div className="text-sm">{paymentData.roomType.name_type_room}</div>
        <div className="my-5">{createImageCarousel(paymentData)}</div>
        <div className="flex justify-between items-center my-4 font-light">
          <div className="shadow-boxShadow w-2/5 p-3 rounded-xl flex flex-col items-center text-sm">
            <div>เช็คอิน</div>
            <div>{dataNav?.dateRange.startDate}</div>
            <div>ตั้งแต่ : 14.00 </div>
          </div>
          <div className="w-1/5 flex justify-center border-b">
            <div className="text-sm"> {dataNav?.dateRange.numberOfNights} คืน</div>
          </div>
          <div className="shadow-boxShadow w-2/5 p-3 rounded-xl flex flex-col items-center text-sm">
            <div>เช็คเอ้า</div>
            <div>{dataNav?.dateRange.endDate}</div>
            <div>ก่อน : 12.0</div>
          </div>
        </div>
        <div>
          (x{dataNav?.numRoom}){" "}
          {paymentData.roomType.name_type_room}
        </div>
        <div className="flex gap-2 items-center">
          <MdOutlineBathroom className="text-xl" />
          {paymentData.roomType.bathroom_homeStay} ห้อง
        </div>
        {paymentData.roomType.bedroom_homeStay > 1 ? (
          <div className="border-b pb-5 flex gap-2 items-center">
            <MdOutlineBedroomParent className="text-xl" />
            {paymentData.roomType.bedroom_homeStay} เตียง
          </div>
        ) : (
          <div className="border-b pb-5 flex gap-2 items-center">
            <MdOutlineBedroomChild className="text-xl" />
            {paymentData.roomType.bedroom_homeStay} เตียง
          </div>
        )}

        <div className="pt-5">
          <div className="flex justify-between">
            <div>ราคาห้องพักรวม</div>
            <div className="text-xs">
              <del>
                {(
                  paymentData.offer.price_homeStay *
                  paymentData.offer.quantityRoom
                ).toLocaleString("th-TH", {
                  style: "decimal",
                  minimumFractionDigits: 2,
                })}{" "}
                บาท
              </del>
            </div>
          </div>
          <div className="flex justify-between">
            <div className="text-sm">{dataNav?.numRoom} ห้อง / {dataNav?.dateRange.numberOfNights} คืน</div>
            <div className="text-alert font-bold text-lg">
              {totalPrice.toLocaleString("th-TH", {
                style: "decimal",
                minimumFractionDigits: 2,
              })}{" "}
              บาท
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailBooking;
