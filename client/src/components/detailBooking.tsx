import React from "react";
import { usePaymentContext } from "../AuthContext/paymentContext";
import { FaRegStar, FaStar, FaStarHalfAlt } from "react-icons/fa";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

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
}
export interface RoomType {
  name_type_room: string;
  bathroom_homeStay: number;
  bedroom_homeStay: number;
  sizeBedroom_homeStay: string;
  offer: Offer[];
  image_room: Image_room[];
}

export interface Location {
  name_location: string;
  province_location: string;
  house_no: string;
  village?: string;
  village_no: string;
  alley?: string;
  street?: string;
  district_location: string;
  subdistrict_location: string;
  zipcode_location: number;
  latitude_location: string;
  longitude_location: string;
  radius_location: number;
}

export interface Image {
  image_upload: string;
}

export interface Facility {
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

const detailBooking = () => {
  const { paymentData } = usePaymentContext();
  if (!paymentData) {
    return <div>No booking details available.</div>;
  }
  //   console.log(paymentData);

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
        {paymentData.roomType.image_room.map((image: Image_room, index: number) => (
          <div key={image._id}>
            <img className="rounded-xl" src={image.image} alt={`Image ${index}`} />
          </div>
        ))}
      </Carousel>
    );
  };

  return (
    <div className="w-1/3 rounded-xl ">
      <div className="shadow-boxShadow p-5">
        <div className="flex justify-between">
          <div className="text-md font-bold mb-2">
            {paymentData.homeStayName}
          </div>
          <div className="flex items-center text-primaryUser">
            {/* <div className="mx-2">{paymentData?.rating}</div>  */}
            {renderStars(paymentData?.rating)}
          </div>
        </div>
        <div className="text-sm">{paymentData.roomType.name_type_room}</div>
        <div className="text-sm my-5">{createImageCarousel(paymentData)}</div>
      </div>
    </div>
  );
};

export default detailBooking;
