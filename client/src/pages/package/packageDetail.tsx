import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import axiosPrivateUser from "../../hook/axiosPrivateUser";
import axios from "axios";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { FaRegCalendarCheck, FaPeopleGroup } from "react-icons/fa6";
import { IoPricetagsOutline } from "react-icons/io5";
import { BiSolidDiscount } from "react-icons/bi";
import OpenStreetMapShoData from "../../components/OpenStreetMapShowData";
import { AuthContext } from "../../AuthContext/auth.provider";
import { GrSync } from "react-icons/gr";
import { FaChildReaching } from "react-icons/fa6";
import { MdOutlineBathroom } from "react-icons/md";
import { FaMale } from "react-icons/fa";
import { IoMdTime } from "react-icons/io";
import { MdOutlinePolicy } from "react-icons/md";
import { TbRuler3 } from "react-icons/tb";
import { LuBedSingle, LuBedDouble } from "react-icons/lu";
export interface Image {
  image_upload: string;
}
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
  pricePerRoom: number;
  roomType: RoomType;
  offer: Offer;
  bookingUser: User;
  rating: number;
  time_checkIn_homeStay: string;
  time_checkOut_homeStay: string;
  policy_cancel_homeStay: string;
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

const PackageDetail = () => {
  const [item, setItem] = useState<any>();
  const { id } = useParams(); // Destructure id from useParams
  const [currentIndex, setCurrentIndex] = useState(0);
  const roomTypes = item?.homestay.room_type || [];
  console.log(roomTypes);
  const [currentIndices, setCurrentIndices] = useState<number[]>(
    roomTypes.map(() => 0)
  );
  console.log(currentIndices);
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error("AuthContext must be used within an AuthProvider");
  }
  const { userInfo } = authContext;
  // console.log(id);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axiosPrivateUser.get(`/package/${id}`);
        setItem(res.data);
      } catch (error) {
        console.error("Error fetching package detail:", error);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]); // Add id to dependency array
  // ใช้ useEffect เพื่อตั้งค่า currentIndices เมื่อ roomTypes เปลี่ยนแปลง
  useEffect(() => {
    setCurrentIndices(roomTypes.map(() => 0));
  }, [roomTypes]);

  if (!item) {
    return <p>No item data available</p>;
  }
  console.log(item);

  const handleNextPackage = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === item.image.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handlePrevPackage = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? item.image.length - 1 : prevIndex - 1
    );
  };

  const image = item?.image.slice(1, 7).map((img: Image, index: number) => {
    return (
      <div key={index} className="w-full h-full">
        <div>
          <img
            className="w-[250px] md:w-60 h-[100px] md:h-[140px] object-cover rounded-md"
            src={img?.image_upload}
            alt=""
          />
        </div>
      </div>
    );
  });

  const activities = item?.activity_package.map(
    (activity: any, index: number) => {
      const activityDay = item?.activity_package[index].activity_days.map(
        (day, i: number) => {
          return (
            <div key={i}>
              <li>
                {item?.activity_package[index].activity_days[i].activity_name}
              </li>
            </div>
          );
        }
      );

      return (
        <div key={index} className="flex flex-col">
          <div className="flex gap-5">
            <div className=" flex flex-col items-center">
              <div className="bg-primaryUser rounded-full py-5 px-5 h-10 text-white"></div>
              {item?.activity_package.length > index + 1 ? (
                <div className="border h-full w-1 bg-primaryUser"></div>
              ) : (
                <div></div>
              )}
            </div>
            <div className=" w-full py-3">
              <div className="shadow-boxShadow p-4 rounded-b-lg rounded-r-lg flex flex-col">
                <span className="border-b pb-2 font-bold">
                  Day: {index + 1}
                </span>
                <span className="pt-2">{activityDay}</span>
              </div>
            </div>
          </div>
        </div>
      );
    }
  );

  const handlePrev = (index: number) => {
    setCurrentIndices((prevIndices) =>
      prevIndices.map((currentIndex, i) => {
        const imageRoomLength = roomTypes[i]?.image_room.length ?? 0;

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
        const imageRoomLength = roomTypes[i]?.image_room.length ?? 0;

        return i === index
          ? currentIndex === imageRoomLength - 1
            ? 0
            : currentIndex + 1
          : currentIndex;
      })
    );
  };

  const carousel = roomTypes.map((roomType: any, index: number) => {
    const offer = roomType.offer.map((offer: Offer, i: number) => {
      const price = offer.price_homeStay;
      const discount = offer.discount;
      const totalPrice =
        discount > 0 ? price * ((100 - discount) / 100) : price;
      const facilitiesRoom = offer?.facilitiesRoom.map(
        (facility: Facilities_Room, index: number) => {
          return (
            <div key={index} className="flex items-center gap-4">
              <div>✓</div>
              {facility.facilitiesName}
            </div>
          );
        }
      );

      return (
        <div key={i}>
          <div className="shadow-boxShadow flex rounded-lg px-5 py-10">
            <div className="w-2/6 border-r text-sm">{facilitiesRoom}</div>
            {roomType.offer[i].max_people.child > 0 &&
            roomType.offer[i].max_people.adult > 0 &&
            roomType.offer[i].max_people.adult < 2 ? (
              <div className="w-1/6 border-r">
                <div className="flex justify-center items-end">
                  <FaMale className="text-xl" />
                  <FaChildReaching className="text-md" />
                </div>
              </div>
            ) : roomType.offer[i].max_people.child > 0 &&
              roomType.offer[i].max_people.adult > 1 ? (
              <div className="w-1/6 border-r">
                <div className="flex justify-center items-end">
                  <FaMale className="text-xl" /> <FaMale className="text-xl" />{" "}
                  <FaChildReaching className="text-md" />
                </div>
              </div>
            ) : roomType.offer[i].max_people.child <= 0 &&
              roomType.offer[i].max_people.adult > 1 ? (
              <div className="w-1/6 border-r">
                <div className="flex justify-center items-end">
                  <FaMale className="text-xl" /> <FaMale className="text-xl" />
                </div>
              </div>
            ) : (
              <div className="w-1/6 flex justify-center border-r">
                <FaMale className="text-xl" />
              </div>
            )}

            <div className="w-2/6 flex flex-col justify-end border-r p-2">
              {offer.discount <= 0 ? (
                <p className="flex justify-end font-bold text-alert text-3xl">
                  {totalPrice} บาท
                </p>
              ) : (
                <div>
                  <div className=" text-white w-full md:w-[100px] rounded-xl flex justify-center item-center bg-alert text-sm">
                    SALE! ลด {offer.discount} %
                  </div>
                  <p className="flex justify-end text-sm ">
                    <del>{offer.price_homeStay}</del> บาท
                  </p>
                  <p className="flex justify-end font-bold text-alert text-3xl">
                    {totalPrice} บาท
                  </p>
                </div>
              )}

              <p className="flex justify-end text-xs">ราคาต่อคืน</p>
              <p className="flex justify-end text-xs">
                (ก่อนรวมภาษีและค่าธรรมเนียม)
              </p>
            </div>
            <div className="w-1/6 flex flex-col items-center pl-3">
              <button
                className=" bg-primaryUser shadow-boxShadow px-8 lg:px-6 lg:ml-4 h-10 rounded-3xl hover:scale-110
                transition-transform duration-300 text-white"
              >
                จอง
              </button>
            </div>
          </div>
        </div>
      );
    });

    return (
      <div
        key={index}
        className="my-5 relative  shadow-boxShadow p-5 rounded-lg"
      >
        <h2 className="text-xl font-bold mb-4">{roomType.name_type_room}</h2>
        <div className="flex flex-wrap md:flex-wrap lg:flex-nowrap xl:flex-nowrap gap-2 ">
          <div className="w-full md:full lg:w-1/3">
            <div
              id={`carousel-${index}`}
              className="relative w-full shadow-boxShadow rounded-xl"
              data-carousel="slide"
            >
              <div className="relative h-60 rounded-lg">
                {roomType.image_room.map(
                  (image: Image_room, imageIndex: number) => (
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
                        src={image.image}
                        className="absolute block w-full h-full object-cover rounded-xl"
                        alt={`Slide ${imageIndex + 1}`}
                      />
                    </div>
                  )
                )}
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
            <div className="my-5">
              <div className="flex items-center gap-2">
                <MdOutlineBathroom className="text-xl" />
                {roomTypes[index].bathroom_homeStay} ห้อง
              </div>
              <div className="flex items-center gap-2">
                {roomTypes[index].bedroom_homeStay < 2 ? (
                  <LuBedSingle className="text-xl" />
                ) : (
                  <LuBedDouble className="text-xl" />
                )}
                {roomTypes[index].bedroom_homeStay} เตียง
              </div>
              <div className="flex items-center gap-2">
                <TbRuler3 className="text-xl" />
                {roomTypes[index].sizeBedroom_homeStay}
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2 w-full md:full lg:w-2/3">
            {offer}
          </div>
        </div>
      </div>
    );
  });

  const handleScrollToElement =
    (id: string) =>
    (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
      event.preventDefault();
      const targetElement = document.getElementById(id);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: "smooth" });
      }
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

  const startDate = new Date(item.time_start_package);
  const endDate = new Date(item.time_end_package);
  const formatDate = (date: Date | null) => {
    if (!date) return "Select Date";

    return date.toLocaleDateString("th-TH", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };
  // console.log(userInfo?._id);
  const startStr = startDate;
  let bookingStart: string;

  if (startStr) {
    const dateStart = new Date(startStr);
    const offset = dateStart.getTimezoneOffset() * 60000; // Offset เป็น milliseconds
    const localDate = new Date(dateStart.getTime() - offset);
    bookingStart = localDate.toISOString().split("T")[0];
  } else {
    console.log("Start date is not defined");
    bookingStart = "default-start-date"; // หรือกำหนดค่าเริ่มต้นที่คุณต้องการ
  }
  // console.log(bookingStart);

  // การจัดการวันที่สิ้นสุด (end date)
  const endStr = endDate;
  let bookingEnd: string;

  if (endStr) {
    const dateEnd = new Date(endStr);
    bookingEnd = dateEnd.toISOString().split("T")[0];
  } else {
    console.log("End date is not defined");
    bookingEnd = "default-end-date"; // หรือกำหนดค่าเริ่มต้นที่คุณต้องการ
  }

  // console.log(bookingEnd);

  const packageName = item?.name_package;
  const booker = userInfo?._id;
  const paymentDetail = "promptpay";
  const packageId = id;
  const totalPrice = item.price_package;

  const makePayment = async () => {
    try {
      const response = await axiosPrivateUser.post("/create-checkout-session", {
        name: packageName,
        totalPrice: totalPrice,
        bookingStart: bookingStart,
        bookingEnd: bookingEnd,
        booker: booker,
        packageId: packageId,
        paymentDetail: paymentDetail,
      });

      if (response.data && response.data.sessionUrl) {
        window.location.href = response.data.sessionUrl;
      } else {
        throw new Error("No session URL returned");
      }
    } catch (error) {
      console.error("Error making payment:", error);
    }
  };

  // if (!item) {
  //   return <p>No item data available</p>;
  // }
  const discount: number = 20;
  return (
    <div>
      {item ? (
        <div>
          <div className="my-10 container-xl mx-6 md:mx-8 lg:mx-24 xl:mx-40">
            <div className="flex gap-4 justify-center items-center">
              <div className="flex gap-4 ">
                <img
                  className="w-[400px] md:w-[600px] h-[220px] md:h-[300px] object-cover rounded-lg"
                  src={item?.image[0].image_upload}
                  alt=""
                />
              </div>
              <div className="">
                <div className="grid grid-cols-3 gap-4">{image}</div>
              </div>
            </div>
            <div className="sticky z-10 top-0 bg-white flex shadow-boxShadow rounded-lg w-full my-5 p-5">
              <div className="flex items-center gap-4 w-full">
                <a
                  href="packageDetail"
                  className="text-decoration text-md "
                  onClick={handleScrollToElement("packageDetail")}
                >
                  รายละเอียด
                </a>
                <a
                  href="facilities"
                  className="text-decoration"
                  onClick={handleScrollToElement("facilities")}
                >
                  สิ่งอำนวยความสะดวก
                </a>
                <a
                  href="detailRoom"
                  className="text-decoration"
                  onClick={handleScrollToElement("detailRoom")}
                >
                  ห้องพัก
                </a>
                <a
                  href="review"
                  className="text-decoration"
                  onClick={handleScrollToElement("review")}
                >
                  รีวิว
                </a>
              </div>
            </div>

            {/* package Detail */}
            <div className="flex flex-row flex-wrap md:flex-wrap lg:flex-nowrap xl:flex-nowrap mb-10 gap-4">
              {/* Left Column */}
              <div className="flex flex-col w-full md:w-full lg:w-3/4 xl:w-3/4">
                <div className="rounded-lg shadow-boxShadow p-10 mb-5">
                  <div className="flex items-center">
                    <div className="flex items-center flex-wrap gap-4">
                      <div className="font-bold text-xl">
                        {item.name_package}
                      </div>
                      {/* ดาว */}
                      <div className="flex items-center font-bold mb-2 text-primaryUser">
                        {renderStars(item.review_rating_package)}
                        <div className="flex gap-2 mx-2">
                          <div>{item.review_rating_package}</div>
                          <div className="flex gap-1">
                            {/* <div>{review.length} </div> */}
                            <div>รีวิว</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="">
                    <div className="mt-2">{item.detail_package}</div>
                  </div>
                </div>
                <div className="shadow-boxShadow p-10 rounded-lg">
                  <span className="font-bold text-xl">รายละเอียดโปรแกรม</span>
                  <div className="flex flex-col my-5">{activities}</div>
                </div>
              </div>
              {/* Maps */}
              <div className="flex flex-col w-full md:w-full lg:w-1/4 xl:w-1/4">
                <div className="shadow-boxShadow rounded-lg">
                  <OpenStreetMapShoData
                    lat={item?.location[0].latitude_location}
                    lng={item?.location[0].longitude_location}
                  />
                </div>
              </div>
            </div>
            {/* package offer */}
            <h1 className="text-3xl my-5 font-bold ">แพ็กเกจสำหรับ - {item.name_package}</h1>
            <div className="shadow-boxShadow rounded-lg p-5">
              <span className="text-2xl font-bold">{item.name_package}</span>
              <div className=" flex gap-4 p-5">
                <div className="w-full md:full lg:w-1/2">
                  <div
                    id="controls-carousel"
                    className="relative w-full"
                    data-carousel="slide"
                  >
                    {/* Carousel wrapper */}
                    <div className="relative  overflow-hidden rounded-lg ">
                      <div
                        className="flex transition-transform duration-700 ease-in-out"
                        style={{
                          transform: `translateX(-${currentIndex * 100}%)`,
                        }}
                      >
                        {item.image.map((img: Image, index: number) => (
                          <div
                            key={index}
                            className="flex-shrink-0 w-full h-full"
                          >
                            <img
                              src={img.image_upload}
                              className=" block w-[800px] h-[300px] object-cover rounded-xl"
                              alt={`Carousel Item ${index + 1}`}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                    {/* Slider controls */}
                    <button
                      type="button"
                      className="absolute top-0 start-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
                      onClick={handlePrevPackage}
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
                      className="absolute top-0 end-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
                      onClick={handleNextPackage}
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
                <div className="w-1/2 grid grid-cols-2 p-5">
                  {/* กำหนดการเดินทาง */}
                  <div className="p-5">
                    <div className="flex gap-2">
                      <FaRegCalendarCheck className="text-2xl" />
                      กำหนดการเดินทาง
                    </div>
                    <div>
                      {formatDate(startDate)}- {formatDate(endDate)}
                    </div>
                  </div>
                  {/* ขนาดทัวร์ */}
                  <div className="p-5">
                    <span className="flex items-center gap-2">
                      <FaPeopleGroup className="text-2xl" /> ขนาดทัวร์
                      <div>{item.max_people} คน</div>
                    </span>
                  </div>
                  {/* policy_cancel_package */}
                  <div className="flex  p-5">
                    <div>
                      <span>
                        <GrSync className="text-2xl mr-2" />
                      </span>
                    </div>
                    <span>{item.policy_cancel_package}</span>
                  </div>
                  {/* ราคาเริ่มต้น */}
                  <div className="p-5">
                    <div className="flex justify-end gap-2">
                      <IoPricetagsOutline className="text-2xl" />
                      ราคาเริ่มต้น{" "}
                      {discount > 0 ? (
                        <span className="flex items-center px-2 border rounded-xl bg-red-600 text-white ml-2">
                          {" "}
                          <BiSolidDiscount />
                          {discount}%
                        </span>
                      ) : (
                        <div></div>
                      )}
                    </div>
                    <div className="flex justify-end">
                      {discount > 0 ? (
                        <span className="text-sm">
                          <del>6250 </del>บาท
                        </span>
                      ) : (
                        <div></div>
                      )}
                    </div>
                    <div className="flex justify-end items-end gap-2">
                      <span className="text-2xl font-bold text-red-500">
                        {item.price_package}
                      </span>{" "}
                      บาท/ท่าน
                    </div>
                  </div>
                  <div className="flex items-center p-5"></div>
                  <div className="flex items-end justify-end p-5">
                    <button
                      className="bg-primaryUser shadow-boxShadow px-8 lg:px-6 lg:ml-4 h-10 rounded-3xl hover:scale-110 
                        transition-transform duration-300 text-white"
                      onClick={makePayment}
                    >
                      จองทันที
                    </button>
                  </div>
                </div>
              </div>
            </div>
            {/* homeStay */}
            <h1 className="text-3xl mt-10 font-bold ">ที่พักสำหรับแพ็กเกจ - {item.name_package}</h1>
            <div>{carousel}</div>
          </div>
        </div>
      ) : (
        <div>no data</div>
      )}
    </div>
  );
};

export default PackageDetail;
