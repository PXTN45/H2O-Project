import { useEffect, useState } from "react";
import { useContext } from "react";
import { AuthContext } from "../AuthContext/auth.provider";
import axiosPrivateBusiness from "../hook/axiosPrivateBusiness";
import Loader from "../assets/loadingAPI/loaddingTravel";
import { FaLocationDot, FaStar } from "react-icons/fa6";
import { GoProjectSymlink } from "react-icons/go";
import { IoTrashBinOutline } from "react-icons/io5";
import { MdAddHomeWork } from "react-icons/md";
import { FaRegEdit, FaRegStar, FaStarHalfAlt } from "react-icons/fa";
import { Link } from "react-router-dom";

export interface Image_room {
  _id: string;
  image: string;
}
export interface Facilities_Room {
  facilitiesName: string;
}

export interface Offer {
  _id: string;
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

export interface Image {
  _id: string;
  image_upload: string;
}

export interface HomeStay {
  _id: string;
  name_homeStay: string;
  room_type: RoomType[];
  max_people: number;
  detail_homeStay: string;
  time_checkIn_homeStay: string;
  time_checkOut_homeStay: string;
  policy_cancel_homeStay: string;
  location: Location[];
  image: Image[];
  business_user: string[];
  review_rating_homeStay: number;
  facilities: Facility[];
  status_sell_homeStay: boolean;
  discount: number;
  createdAt: Date;
  updatedAt: Date;
}

const BusinessHomeStay = () => {
  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error("AuthContext must be used within an AuthProvider");
  }
  const { userInfo } = authContext;
  const [myHomestay, setMyHomestay] = useState<HomeStay[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosPrivateBusiness.get(
          `/business-homestay/${userInfo?._id}`
        );
        if (response.data) {
          setMyHomestay(response.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  const [currentIndices, setCurrentIndices] = useState<number[]>(
    myHomestay.map(() => 0)
  );

  // ใช้ useEffect เพื่อตั้งค่า currentIndices เมื่อ myHomestay เปลี่ยนแปลง
  useEffect(() => {
    setCurrentIndices(myHomestay.map(() => 0));
  }, [myHomestay]);

  const handlePrev = (index: number) => {
    setCurrentIndices((prevIndices) =>
      prevIndices.map((currentIndex, i) => {
        const imageRoomLength = myHomestay[i]?.image.length ?? 0;

        return i === index
          ? currentIndex === 0
            ? imageRoomLength - 1
            : currentIndex - 1
          : currentIndex;
      })
    );
  };

  const handleNext = (index: number) => {
    setCurrentIndices((prevIndices) =>
      prevIndices.map((currentIndex, i) => {
        const imageRoomLength = myHomestay[i]?.image.length ?? 0;

        return i === index
          ? currentIndex === imageRoomLength - 1
            ? 0
            : currentIndex + 1
          : currentIndex;
      })
    );
  };

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
  const formatThaiDate = (date: Date): string => {
    const formatDate = new Date(date);
    return formatDate.toLocaleDateString("th-TH", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  console.log(myHomestay[0]?._id);

  return (
    <div>
      {myHomestay?.length > 0 ? (
        myHomestay?.map((homestay: any, index) => (
          <div key={index} className="px-0 xl:px-10">
            <div className="w-full my-5 shadow-boxShadow rounded-xl flex gap-2 flex-wrap xl:flex-nowrap">
              <div className="w-full lg:h-full xl:w-1/3 rounded-l-lg ">
                <div
                  id={`carousel-${index}`}
                  className="relative w-full shadow-boxShadow rounded-xl"
                  data-carousel="slide"
                >
                  <div className="relative h-60 rounded-lg">
                    {homestay.image.map((image: any, imageIndex: number) => (
                      <div
                        key={imageIndex}
                        className={`duration-700 ease-in-out ${
                          currentIndices[index] === imageIndex
                            ? "block"
                            : "hidden"
                        }`}
                        data-carousel-item
                      >
                        <img
                          src={image.image_upload}
                          className="absolute block w-full h-full object-cover rounded-xl"
                          alt={`Slide ${imageIndex + 1}`}
                        />
                      </div>
                    ))}
                    <button
                      type="button"
                      className="absolute top-0 left-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
                      onClick={() => handlePrev(index)}
                      data-carousel-prev
                    >
                      <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
                        <svg
                          className="w-4 h-4 text-white dark:text-gray-800 rtl:rotate-180"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 6 10"
                        >
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 1 1 5l4 4"
                          />
                        </svg>
                        <span className="sr-only">Previous</span>
                      </span>
                    </button>
                    <button
                      type="button"
                      className="absolute top-0 right-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
                      onClick={() => handleNext(index)}
                      data-carousel-next
                    >
                      <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
                        <svg
                          className="w-4 h-4 text-white dark:text-gray-800 rtl:rotate-180"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 6 10"
                        >
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="m1 9 4-4-4-4"
                          />
                        </svg>
                        <span className="sr-only">Next</span>
                      </span>
                    </button>
                  </div>
                </div>
              </div>
              <div className="pl-10 pt-5 md:pr-5 xl:p-2 flex flex-col xl:flex-row w-full xl:w-2/3">
                <div className=" xl:w-4/6 pr-2 flex flex-col gap-5">
                  <div className="flex justify-between ">
                    <div className="flex flex-col w-full gap-2">
                      <span className="text-md font-bold flex items-start justify-between w-full gap-3">
                        {homestay?.name_homeStay}
                        <div className="flex items-center text-yellow-300">
                          {renderStars(homestay?.review_rating_homeStay)}
                          {homestay?.review_rating_homeStay}
                        </div>
                      </span>
                      <div className="flex flex-col">
                        <span>ประเภทที่พัก</span>
                        {homestay?.room_type.map((roomType: any) => (
                          <span>- {roomType.name_type_room}</span>
                        ))}
                      </div>
                      <div
                        id="location"
                        className=" flex md:items-center  gap-2"
                      >
                        <FaLocationDot className="text-red-600" />
                        <div className="flex flex-wrap text-sm gap-1">
                          <div>{homestay.location[0].house_no}</div>
                          <div>ม.{homestay.location[0].village_no}</div>
                          <div>
                            ต.
                            {homestay.location[0].subdistrict_location}
                          </div>
                          <div>
                            อ.
                            {homestay.location[0].district_location}
                          </div>
                          <div>
                            จ.
                            {homestay.location[0].province_location}
                          </div>
                          <div>{homestay.location[0].zipcode_location}</div>
                        </div>
                      </div>
                      <div>
                        <span className="text-sm">
                          {homestay?.policy_cancel_homeStay}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="xl:w-2/6 flex flex-col w-full xl:border-l p-1">
                  <div className="flex flex-col justify-between h-full w-full gap-2">
                    <div className="w-full flex flex-col items-end justify-end">
                      {homestay?.status_sell_homeStay === "Ready" ? (
                        <div className="text-sm bg-green-400 px-2 rounded-xl text-white">
                          พร้อมให้จอง
                        </div>
                      ) : (
                        homestay?.status_sell_homeStay === "NotReady" && (
                          <div className="text-sm bg-red-400 px-2 rounded-xl text-white">
                            ยังไม่พร้อมให้จอง
                          </div>
                        )
                      )}
                      <div>
                        <button className="p-2">
                          <FaRegEdit className="text-xl hover:text-yellow-400" />
                        </button>
                        <button className="p-2">
                          <Link to={`/homeStayDetail/${homestay?._id}`}>
                            <GoProjectSymlink className="text-xl  hover:text-blue-500" />
                          </Link>
                        </button>
                        <button className="p-2">
                          <IoTrashBinOutline className="text-xl  hover:text-red-600" />
                        </button>
                      </div>
                    </div>
                    <div className="w-full text-xs flex justify-end opacity-50">
                      {homestay?.updatedAt ? (
                        <span>
                          อัปเดตเมื่อ {formatThaiDate(homestay?.updatedAt)}
                        </span>
                      ) : homestay?.createdAt ? (
                        <span>
                          สร้างเมื่อ {formatThaiDate(homestay?.createdAt)}
                        </span>
                      ) : (
                        <div></div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="flex flex-col justify-center items-center h-full p-20 w-full">
          <span className="text-2xl flex items-center gap-5">
            ยังไม่มีที่พักของคุณในขณะนี้
          </span>
          <button className="flex items-center gap-3 text-lg bg-green-500 p-2 rounded-lg text-white my-2">
            <MdAddHomeWork className="text-3xl" />
            สร้างที่พักใหม่เลยตอนนี้
          </button>
        </div>
      )}
    </div>
  );
};

export default BusinessHomeStay;
