import { useEffect, useState } from "react";
import axiosPublic from "../../hook/axiosPublic";
import CardHistory from "../../components/Card-Detail-History";

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


const BookingHistory = () => {
  const [user, setUser] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        const response = await axiosPublic.get("/getBookingForAdmin");
        const confirmedBookingsUser = response.data.filter(
          (booking: Booking) => booking.bookingStatus === "Money-transferred"
        );
        setUser(confirmedBookingsUser);
      } catch (err) {
        setError("Failed to load businesses");
      } finally {
        setLoading(false);
      }
    };

    fetchBusinesses();
  }, []);

  const filteredUsers = user.filter((booking) =>
    booking._id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="min-h-screen">
      <div className="p-4 mb-4 flex justify-between">
        <h1 className="text-2xl font-bold shadow-text">
          รายชื่อผู้ที่ได้รับเงินแล้ว
        </h1>
        <input
          type="text"
          placeholder="ค้นหาโดย ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input input-bordered w-full max-w-xs shadow-primaryAdmin shadow-boxShadow"
        />
      </div>
      <div className="grid grid-cols-1 gap-6 p-4 mb-10">
        {filteredUsers.length === 0 ? (
          <div className="min-h-screen flex items-center justify-center">
            ไม่มีข้อมูล
          </div>
        ) : (
          filteredUsers.map((user) => (
            <div key={user?._id} className="w-full">
              <CardHistory item={user} />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default BookingHistory;
