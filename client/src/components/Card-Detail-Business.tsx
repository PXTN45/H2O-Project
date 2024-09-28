import React from "react";

// ที่อยู่ของ business user
interface Address {
  houseNumber: string;
  village: string;
  street: string;
  district: string;
  subdistrict: string;
  city: string;
  country: string;
  postalCode: string;
  _id: string;
}

// ข้อมูลของ business user
interface BusinessUser {
  _id: string;
  email: string;
  businessName: string;
  name: string;
  lastName: string;
  birthday: string | null;
  image: string;
  idcard: string;
  BankingName: string;
  BankingUsername: string;
  BankingUserlastname: string;
  BankingCode: string;
  isVerified: boolean;
  role: string;
  address: Address[];
  __v: number;
}

// ข้อมูลของ homestay
interface Homestay {
  _id: string;
  business_user: BusinessUser[];
}

// ข้อมูลของ Package
interface Package {
  _id: string;
  business_user: BusinessUser;
}

// รูปภาพของห้องพัก
interface ImageRoom {
  image: string;
  _id: string;
}

// ข้อเสนอสำหรับห้องพัก
interface DetailOffer {
  name_type_room: string;
  adult: number;
  child: number;
  room: number;
  discount: number;
  totalPrice: number;
  image_room: ImageRoom[];
  _id: string;
}

// ข้อมูลการจอง
interface Booking {
  _id: string;
  booker: string;
  homestay: Homestay;
  package: Package;
  detail_offer: DetailOffer[];
  bookingStart: string;
  bookingEnd: string;
  night: number;
  bookingStatus: string;
  __v: number;
}

const Card: React.FC<{ item: Booking }> = ({ item }) => {
  console.log(item);

  return (
    <div className="card-box flex flex-col xl:flex-row max-w-full rounded overflow-hidden shadow-boxShadow relative my-6 h-full">
      <div
        id="image-Business"
        className="relative w-full xl:w-[25%] flex flex-col justify-center items-center my-10"
      >
        {/* เส้นหมุน */}
        <div className="absolute w-[200px] h-[200px] rounded-full border-t-4 border-transparent border-t-blue-300 animate-spin-slow"></div>
        <div className="absolute w-[170px] h-[170px] rounded-full border-t-4 border-transparent border-t-blue-400 animate-spin-reverse"></div>
        <div className="absolute w-[140px] h-[140px] rounded-full border-t-4 border-transparent border-t-blue-500 animate-spin-slow"></div>
        <div className="absolute w-[110px] h-[110px] rounded-full border-t-4 border-transparent border-t-blue-600 animate-spin-reverse"></div>
        <div className="absolute w-[80px] h-[80px] rounded-full border-t-4 border-transparent border-t-gray-700 animate-spin-slow"></div>

        {/* รูปวงกลม */}
        <img
          id="imageCard-Home"
          src={
            item.homestay?.business_user?.[0]?.image ||
            item.package?.business_user?.image ||
            "https://www.thebetter.co.th/upload/news/thumb/2803.png?t=1727486225"
          }
          alt="images to cards"
          className="w-[100px] h-[100px] rounded-full object-cover z-10 my-2"
        />
      </div>
      <div id="center-card-Package" className="w-full xl:w-[50%]">
        a
      </div>
      <div id="right-card" className="w-full xl:w-[25%] semi-bg">
        c
      </div>
    </div>
  );
};

export default Card;
