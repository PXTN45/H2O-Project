import { useEffect, useState } from "react";
import axiosPublic from "../../hook/axiosPublic";
import CardUser from "../../components/Card-Detail-User";
import CardBusiness from "../../components/Card-Detail-Business";

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

const BookingBusiness = () => {
  const [user, serUser] = useState<Booking[]>([]);
  const [businesses, setBusinesses] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isBusiness, setIsBusiness] = useState<boolean>(false);

  const clickToPackage = () => {
    setIsBusiness(true);
  };

  const clickToHome = () => {
    setIsBusiness(false);
  };

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        const response = await axiosPublic.get("/getBookingForAdmin");
        const confirmedBookingsBusiness = response.data.filter(
          (booking: Booking) => booking.bookingStatus === "Check-in"
        );
        const confirmedBookingsUser = response.data.filter(
          (booking: Booking) => booking.bookingStatus === "Cancelled"
        );
        serUser(confirmedBookingsUser);
        setBusinesses(confirmedBookingsBusiness);
      } catch (err) {
        setError("Failed to load businesses");
      } finally {
        setLoading(false);
      }
    };

    fetchBusinesses();
  }, [businesses]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="min-h-screen">
      <h1 className="text-2xl font-bold shadow-text my-5">
        รายชื่อผู้ที่ต้องได้รับเงิน
      </h1>
      <div className="flex items-center justify-center w-full shadow-lg rounded-[10px] ">
        <button
          id="button-homestaySearch-Select"
          className={
            !isBusiness
              ? "bg-gradient-to-r from-primaryAdmin to-secondAdmin text-white p-2 rounded-tl-[10px] rounded-bl-[10px] w-full"
              : "card-box p-2 rounded-tr-[10px] rounded-br-[10px] w-full"
          }
          onClick={clickToHome}
        >
          ผู้ใช้ ( {user.length} )
        </button>
        <button
          id="button-homestaySearch-noSelect"
          className={
            !isBusiness
              ? "card-box p-2 rounded-tr-[10px] rounded-br-[10px] w-full"
              : "bg-gradient-to-r from-primaryAdmin to-secondAdmin text-white p-2 rounded-tr-[10px] rounded-br-[10px] w-full"
          }
          onClick={clickToPackage}
        >
          ผู้ขาย ( {businesses.length} )
        </button>
      </div>
      <div className="grid grid-cols-1 gap-6 p-4 mb-10">
        {!isBusiness ? (
          user.length === 0 ? (
            <div className="min-h-screen flex items-center justify-center">
              ไม่มีข้อมูล
            </div>
          ) : (
            user.map((user) => (
              <div key={user?._id} className="w-full">
                <CardUser item={user} />
              </div>
            ))
          )
        ) : businesses.length === 0 ? (
          <div className="min-h-screen flex items-center justify-center">
            ไม่มีข้อมูล
          </div>
        ) : (
          businesses.map((business) => (
            <div key={business?._id} className="w-full">
              <CardBusiness item={business} />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default BookingBusiness;
