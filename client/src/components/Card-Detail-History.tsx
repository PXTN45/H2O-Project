import React from "react";
import Swal from "sweetalert2";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../Firebase/firebase.config";
import axiosPublic from "../hook/axiosPublic";
import LoaddingTravel from "../assets/loadingAPI/loaddingTravel";

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

  const [images, setImages] = React.useState<string>("");

  React.useEffect(() => {
    const fetchImage = async () => {
      try {
        const pathImage = `imagesPayment/${item?._id}`;
        const storageRef = ref(storage, pathImage);
        const imageURL = await getDownloadURL(storageRef);
        setImages(imageURL);
      } catch (error) {
        console.error("Error fetching image:", error);
      }
    };

    if (item?._id) {
      fetchImage();
    }
  }, [item]);

  console.log(images);


  return (
    <div className="card-box flex flex-col xl:flex-row max-w-full rounded overflow-hidden shadow-boxShadow relative my-6 h-full">
      <div
        id="image-Business"
        className="relative w-full xl:w-[25%] flex flex-col justify-center items-center"
      >
        {/* เส้นหมุน */}
        <div className="absolute w-[200px] h-[200px] rounded-full border-t-4 border-transparent border-t-green-300 animate-spin-slow"></div>
        <div className="absolute w-[170px] h-[170px] rounded-full border-t-4 border-transparent border-t-green-400 animate-spin-reverse"></div>
        <div className="absolute w-[140px] h-[140px] rounded-full border-t-4 border-transparent border-t-green-500 animate-spin-slow"></div>
        <div className="absolute w-[110px] h-[110px] rounded-full border-t-4 border-transparent border-t-green-600 animate-spin-reverse"></div>
        <div className="absolute w-[80px] h-[80px] rounded-full border-t-4 border-transparent border-t-gray-700 animate-spin-slow"></div>

        {/* รูปวงกลม */}
        <img
          id="imageCard-Home"
          src={
            images
          }
          alt="images to cards"
          className="w-[100px] h-[100px] rounded-full object-cover z-10 my-2"
        />
      </div>
      <div id="center-card-Package" className="w-full xl:w-[50%] mt-5">
        <div className="flex justify-between my-1 mx-5 text-xl">
          <div className="flex flex-row">
            <div className="mx-2">
              {item.homestay?.business_user?.[0]?.name ||
                item.package?.business_user?.name}
            </div>
            <div className="mx-2">
              {item.homestay?.business_user?.[0]?.lastName ||
                item.package?.business_user?.lastName}
            </div>
          </div>
          <div className="w-28 text-sm text-white rounded-full bg-primaryAdmin flex items-center justify-center">
            <div>พร้อมรับเงิน</div>
          </div>
        </div>
        <div className="mb-2 mx-7 text-sm">
          (
          {item.homestay?.business_user?.[0]?.businessName ||
            item.package?.business_user?.businessName}
          )
        </div>
        <div className="flex flex-col mb-5 mx-7 text-md">
          <div>
            รายการ: {item.detail_offer[0]?.name_type_room || "ไม่มีข้อมูล"}
          </div>
          <div>
            ประเภท: {item?.package ? "แพ็คเกจ" : "โฮมสเตย์"}
          </div>
          <div>จำนวน: {item.night || "ไม่มีข้อมูล"} คืน</div>
          <div>
            เช็คอิน:{" "}
            {item.bookingStart
              ? new Date(item.bookingStart).toLocaleDateString("th-TH", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })
              : "ไม่มีข้อมูล"}
          </div>
          <div>
            เช็คเอ้าท์:{" "}
            {item.bookingEnd
              ? new Date(item.bookingEnd).toLocaleDateString("th-TH", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })
              : "ไม่มีข้อมูล"}
          </div>
        </div>
        <div className="flex flex-col items-end justify-end mx-5 mb-5">
          <div className="text-sm">ยอดที่ต้องจ่าย</div>
          <div className="text-2xl">
            {item.detail_offer[0]?.totalPrice && item.night
              ? `${(
                  item.detail_offer[0].totalPrice *
                  (1 - 0.04 * Math.min(item.night, 2))
                )
                  .toFixed(2)
                  .toLocaleString()} บาท`
              : "ไม่มีข้อมูล"}
          </div>
        </div>
      </div>
      <button
        id="right-card"
        className="w-full xl:w-[25%] card-box hover:bg-whiteSmoke hover:text-blue-600"
      >
        <div className="flex items-center justify-center h-full text-[35px] shadow-text">
          ชำระเงิน
        </div>
      </button>
    </div>
  );
};

export default Card;
