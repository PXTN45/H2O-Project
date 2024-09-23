import { useEffect, useState } from "react";
import axiosPrivateBusiness from "../../hook/axiosPrivateBusiness";
import LoadingTravel from "../../assets/loadingAPI/loaddingTravel";
import { useContext } from "react";
import { AuthContext } from "../../AuthContext/auth.provider";
import BookingPackage from "../../components/BookingPackage";
import BusinessHomeStay from "../../components/BusinessHomeStay";

export interface Booker {
  _id: string;
  email: string;
  name: string;
  lastName: string;
}

export interface DetailOffer {
  name_type_room: string;
  adult: number;
  child: number;
  discount: number;
  totalPrice: number;
  image_room: {
    image: string;
  }[];
}
export interface Image_room {
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
export interface Image {
  _id: string;
  image: string;
}
interface Location {
  name_location: string;
  province_location: string;
  house_no: string;
  village?: string; // Optional property
  village_no: string;
  alley?: string; // Optional property
  street?: string; // Optional property
  district_location: string;
  subdistrict_location: string;
  zipcode_location: number;
  latitude_location: number;
  longitude_location: number;
  radius_location: number;
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

export interface Booking {
  booker: Booker;
  bookingStart: string;
  bookingEnd: string;
  bookingStatus: string;
  detail_offer: DetailOffer[];
  homestay: HomeStay;
  night: number;
}

const myBusiness = () => {
  const [myHomestayAndPackage, setMyHomestayAndPackage] = useState<Booking[]>(
    []
  );
  const [activeButton, setActiveButton] = useState<string>("homestay");
  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error("AuthContext must be used within an AuthProvider");
  }
  const { userInfo } = authContext;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosPrivateBusiness(
          `/business-homestay/${userInfo?._id}`
        );
        console.log(response.data);

        setMyHomestayAndPackage(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [userInfo?._id]);

  if (!myHomestayAndPackage) {
    return <div>no my booking</div>;
  }

  const handleButtonClick = (buttonName: string) => {
    setActiveButton(buttonName);
  };

  return (
    <div>
      {myHomestayAndPackage ? (
        <div className="container w-full px-6 my-5">
          <div>
            {activeButton === "homestay" ? (
              <span className="text-2xl">โฮมสเตย์ของ-{userInfo?.businessName}</span>
            ) : activeButton === "package" ? (
              <span className="text-2xl">แพ็คเกจของ-{userInfo?.businessName}</span>
            ) : (
              <div></div>
            )}
          </div>

          <div className="flex w-full gap-5 my-5">
            <div className="w-1/2">
              <button
                onClick={() => handleButtonClick("homestay")}
                className={`shadow-boxShadow rounded-md py-2 w-full
            ${
              activeButton === "homestay"
                ? "bg-primaryUser text-white"
                : "bg-primaryActive text-black"
            }`}
              >
                ที่พัก
              </button>
            </div>
            <div className="w-1/2">
              <button
                onClick={() => handleButtonClick("package")}
                className={`shadow-boxShadow rounded-md py-2 w-full
            ${
              activeButton === "package"
                ? "bg-primaryUser text-white"
                : "bg-primaryActive text-black"
            }`}
              >
                แพ็คเกจ
              </button>
            </div>
          </div>

          {activeButton == "homestay" ? (
            <div>
              <BusinessHomeStay />
            </div>
          ) : activeButton == "package" ? (
            <div>
              <BookingPackage />
            </div>
          ) : (
            <div>
              <span>ไม่พบประวัติการจอง</span>
            </div>
          )}
        </div>
      ) : (
        <div>
          <LoadingTravel />
        </div>
      )}
    </div>
  );
};

export default myBusiness;
