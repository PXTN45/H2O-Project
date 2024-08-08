import React from "react";
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import OpenStreetMap from "../../components/OpenStreetMap";
import { useParams } from "react-router-dom";
import { RxRulerSquare } from "react-icons/rx";
import {
  FaStar,
  FaStarHalfAlt,
  FaRegStar,
  FaCheck,
  FaMale,
} from "react-icons/fa";
import {
  MdOutlineBathroom,
  MdOutlineBedroomChild,
  MdOutlineBedroomParent,
} from "react-icons/md";
import axiosPrivateUser from "../../hook/axiosPrivateUser";
import { AuthContext } from "../../AuthContext/auth.provider";
import LoadingTravel from "../../assets/loadingAPI/loaddingTravel";
import { FaChildReaching } from "react-icons/fa6";
import { usePaymentContext } from "../../AuthContext/paymentContext";
import axios from "axios";
// import

// types.ts
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
interface Review {
  _id: string;
  reviewer: string;
  content: string;
  rating: number;
  package: string;
  homestay: string;
  createdAt: string;
}

const homeStayDetail = () => {
  const { id } = useParams<{ id: string }>();
  const authContext = useContext(AuthContext);
  const { setPaymentData } = usePaymentContext();
  const navigate = useNavigate();
  const [item, setItem] = useState<HomeStay | undefined>();
  const [review, setReview] = useState<Review[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [progress, setProgress] = useState(0);
  // const [reviewer, setReviewer] = useState<User>();
  const [isLoading, setLoadPage] = useState<boolean>(false);

  if (!authContext) {
    throw new Error("AuthContext must be used within an AuthProvider");
  }
  const { userInfo } = authContext;

  useEffect(() => {
    const fetchData = async () => {
      setLoadPage(true);
      try {
        const res = await axiosPrivateUser.get(`/homestay/${id}`);
        if (res.data) {
          setItem(res.data);
        }

        try {
          const reviewsResponse = await axios.get<Review[]>("/review.json");
          if (reviewsResponse.data) {
            const filteredReviews = reviewsResponse.data.filter(
              (review) => review.homestay === id
            );

            // ดึงข้อมูล reviewer ทั้งหมดในเวลาเดียวกัน
            const reviewersPromises = filteredReviews.map(async (review) => {
              try {
                const userData = await axios.get(
                  `http://localhost:3000/user/userData/${review.reviewer}`
                );
                return {
                  ...review,
                  reviewer: userData.data, // เพิ่มข้อมูลผู้รีวิวเข้าไปในรีวิวแต่ละรายการ
                };
              } catch (userError) {
                console.error(
                  `เกิดข้อผิดพลาดในการดึงรายละเอียด reviewer สำหรับ review ID: ${review._id}`,
                  userError
                );
                return review;
              }
            });

            // รอจนดึงข้อมูลผู้รีวิวเสร็จทั้งหมด
            const reviewsWithReviewerData = await Promise.all(
              reviewersPromises
            );

            setReview(reviewsWithReviewerData);
          }
        } catch (reviewError) {
          console.error("เกิดข้อผิดพลาดในการดึงข้อมูลรีวิว:", reviewError);
        }
      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการดึงรายละเอียด homestay:", error);
      } finally {
        setLoadPage(false);
      }
    };

    fetchData();
  }, [id]);

  if (isLoading == true) {
    <p>no Item</p>;
  }

  const images = item?.image.slice(1, 7).map((img: any, index: number) => {
    const specialClasses: { [key: number]: string } = {
      2: "rounded-tr-lg",
      5: "rounded-br-lg",
    };

    return (
      <div key={index} className="w-full h-full">
        <img
          className={`w-[250px] h-full object-cover rounded-md ${
            specialClasses[index] || ""
          }`}
          src={img.image_upload}
          alt=""
        />
      </div>
    );
  });

  // ตรวจสอบว่า item.facilities ถูกกำหนดก่อนการ map
  const facilities = item?.facilities.map((facility: any, index: number) => (
    <div key={index} className="flex items-center text-md gap-4">
      <FaCheck className="text-xs" />
      {facility.facilities_name}
    </div>
  ));

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

  const handleScrollToElement =
    (id: string) =>
    (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
      event.preventDefault();
      const targetElement = document.getElementById(id);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: "smooth" });
      }
    };

  const card = item?.room_type.map((data: RoomType, index: number) => {
    const handlePrev = () => {
      if (data.image_room.length) {
        setCurrentIndex((prevIndex) =>
          prevIndex === 0 ? data.image_room.length - 1 : prevIndex - 1
        );
      }
    };

    const handleNext = () => {
      if (data.image_room.length) {
        setCurrentIndex((prevIndex) =>
          prevIndex === data.image_room.length - 1 ? 0 : prevIndex + 1
        );
      }
    };

    const offer = data.offer.map((offer: Offer, i: number) => {
      const discount = (discount: number) => {
        const price = offer.price_homeStay;
        if (price > 0) {
          const totalDiscount = (100 - discount) / 100;
          const totalPrice = price * totalDiscount;
          return totalPrice;
        }
      };

      // console.log(data.offer[index].facilitiesRoom[i].facilitiesName);

      const facilitiesRoom = offer?.facilitiesRoom.map(
        (facility: Facilities_Room, index: number) => {
          // console.log(facility.facilitiesName);
          // console.log(facility.offer[index].facilitiesRoom[index].facilitiesName);

          return (
            <div key={index} className="flex items-center gap-4">
              <FaCheck />
              {facility.facilitiesName}
            </div>
          );
        }
      );

      // console.log(i + "ผญ." + data.offer[i].max_people.adult + "ด" + data.offer[i].max_people.child);
      // console.log(data.offer[i].max_people.child);

      const handleSelectAndProceed = (offer: Offer) => {
        if (item && userInfo && id) {
          // Set payment data
          const paymentData: PaymentData = {
            homeStayId: id,
            homeStayName: item.name_homeStay,
            totalPrice: offer.price_homeStay,
            roomType: item.room_type[i],
            offer: offer,
            bookingUser: userInfo,
            rating: averageRating,
          };

          localStorage.setItem("paymentData", JSON.stringify(paymentData));

          setPaymentData(paymentData);
          navigate("/bookingDetail");
        }
      };

      return (
        <div key={i}>
          <div className="shadow-boxShadow flex rounded-lg p-10 my-5">
            <div className="w-2/6 border-r text-sm">{facilitiesRoom}</div>
            {data.offer[i].max_people.child > 0 &&
            data.offer[i].max_people.adult > 0 &&
            data.offer[i].max_people.adult < 2 ? (
              <div className="w-1/6 border-r">
                <div className="flex justify-center items-end">
                  <FaMale className="text-xl" />
                  <FaChildReaching className="text-md" />
                </div>
              </div>
            ) : data.offer[i].max_people.child > 0 &&
              data.offer[i].max_people.adult > 1 ? (
              <div className="w-1/6 border-r">
                <div className="flex justify-center items-end">
                  <FaMale className="text-xl" /> <FaMale className="text-xl" />{" "}
                  <FaChildReaching className="text-md" />
                </div>
              </div>
            ) : data.offer[i].max_people.child <= 0 &&
              data.offer[i].max_people.adult > 1 ? (
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
                  {offer.price_homeStay} บาท
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
                    {discount(offer.discount) || 0} บาท
                  </p>
                </div>
              )}

              <p className="flex justify-end text-xs">ราคาต่อคืน</p>
              <p className="flex justify-end text-xs">
                (ก่อนรวมภาษีและค่าธรรมเนียม)
              </p>
            </div>
            <div className="w-1/6 flex pl-3">
              <button
                className=" bg-primaryUser shadow-boxShadow px-8 h-10 rounded-3xl hover:scale-110 
                transition-transform duration-300 text-white"
                onClick={() => handleSelectAndProceed(offer)}
              >
                จอง
              </button>
            </div>
          </div>
        </div>
      );
    });

    return (
      <div key={index} className="my-5">
        {data ? (
          <div className="rounded-lg shadow-boxShadow p-10">
            <div className="font-bold text-2xl">
              {item.room_type[index].name_type_room}
            </div>
            <div className="flex flex-wrap  gap-4 my-3">
              <div className="w-full md:w-[350px]">
                <p className="my-2">ห้องพัก</p>
                {/* carousel */}
                <div>
                  <div
                    id="default-carousel"
                    className="relative w-full"
                    data-carousel="slide"
                  >
                    <div className="relative h-60 overflow-hidden rounded-lg ">
                      {data?.image_room.map(
                        (src: Image_room, index: number) => (
                          <div
                            key={index}
                            className={`duration-700 ease-in-out ${
                              currentIndex === index ? "block" : "hidden"
                            }`}
                            data-carousel-item
                          >
                            <img
                              src={src.image}
                              className="absolute block w-full h-full object-cover rounded-xl"
                              alt={`Slide ${index + 1}`}
                            />
                          </div>
                        )
                      )}
                    </div>
                    <button
                      type="button"
                      className="absolute top-0 left-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
                      onClick={handlePrev}
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
                      onClick={handleNext}
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

                <div className="mt-4">
                  <ul className="flex flex-col gap-3">
                    <li className="flex items-center">
                      <RxRulerSquare className="mr-2 text-2xl" />{" "}
                      {item.room_type[index].sizeBedroom_homeStay}
                    </li>
                    <li className="flex items-center">
                      <MdOutlineBathroom className="mr-2 text-2xl" />{" "}
                      {item.room_type[index].bathroom_homeStay} ห้องน้ำ
                    </li>

                    {item.room_type[index].bedroom_homeStay > 1 ? (
                      <li className="flex items-center">
                        <MdOutlineBedroomParent className="mr-2 text-2xl" />{" "}
                        {item.room_type[index].bedroom_homeStay} เตียงคู่
                      </li>
                    ) : (
                      <li className="flex items-center">
                        <MdOutlineBedroomChild className="mr-2 text-2xl" />{" "}
                        {item.room_type[index].bedroom_homeStay} เตียงเดี่ยว
                      </li>
                    )}
                  </ul>
                </div>
              </div>

              <div className="w-full md:w-[750px]">
                <div className="flex flex-row mb-5">
                  <h1 className="w-2/5">สิทธิประโยชน์</h1>
                  <h1 className="w-1/5">ผู้เข้าพัก</h1>
                  <p className="w-2/5">ราคา ต่อห้อง ต่อคืน</p>
                </div>
                {offer}
              </div>
            </div>
          </div>
        ) : (
          <div>no data</div>
        )}
      </div>
    );
  });
  // ฟังก์ชันคำนวณค่าเฉลี่ยของ rating
  const calculateAverageRating = (reviews: Review[]): number => {
    if (reviews.length === 0) return 0;
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    return totalRating / reviews.length;
  };

  // ฟังก์ชันคำนวณความก้าวหน้า (progress)
  const radialProgress = (rating: number): number => {
    if (rating) {
      return (rating * 100) / 5;
    }
    return 0;
  };

  useEffect(() => {
    if (review.length > 0) {
      const averageRating = calculateAverageRating(review);
      const progress = radialProgress(averageRating);
      setAverageRating(averageRating);
      setProgress(progress);
      // console.log("Average Rating:", averageRating);
      // console.log("Progress:", progress);
    }
  }, [review]);

  const reviews = review?.map((reviewHomeStay: Review, reviewIndex: number) => {
    // console.log(reviewHomeStay);
    const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      return date.toLocaleDateString("th-TH", {
        day: "numeric",
        month: "numeric",
        year: "numeric",
      });
    };

    return (
      <div
        key={reviewIndex}
        className="flex flex-wrap gap-4 my-5 shadow-boxShadow rounded-xl p-5"
      >
        <div className="w-full p-5 flex flex-wrap justify-between">
          <div className="flex gap-2 items-center text-xl">
            <div className="avatar">
              <div className="w-12 rounded-full object-cover">
                <img src={reviewHomeStay?.reviewer.image} />
              </div>
            </div>
            <div>{reviewHomeStay?.reviewer.name}</div>
            <div className="bg-primaryUser rounded-2xl px-3 py-1 text-white">
              <div className="text-sm">{reviewHomeStay?.rating}/5</div>
            </div>
          </div>
          <div>
            <div>
              <div>{formatDate(reviewHomeStay?.createdAt)}</div>
            </div>
          </div>
        </div>
        <div className="w-full  rounded-lg">
          <div>{reviewHomeStay?.content}</div>
        </div>
      </div>
    );
  });
  return (
    <div>
      {item ? (
        <div>
          <div id="homeStayDetail" className="container-sm mx-10 md:mx-40">
            {/* รูปภาพ */}
            <div className="flex justify-center gap-4 mt-10 mb-5 ">
              <div>
                <img
                  className="w-[600px] h-full object-cover rounded-l-lg  rounded-r-md"
                  src={item.image[0].image_upload}
                  alt=""
                />
              </div>
              <div className="grid grid-cols-3 gap-4">{images}</div>
            </div>

            <div className="sticky z-10 top-0 bg-white flex shadow-boxShadow rounded-lg w-full mb-5 p-5">
              <div className="flex items-center gap-4 w-full">
                <a
                  href="homeStayDetail"
                  className="text-decoration text-md "
                  onClick={handleScrollToElement("homeStayDetail")}
                >
                  รายละเอียดที่พัก
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

            {/* homeStay Detail */}
            <div className="flex flex-row flex-wrap  mb-10 gap-4">
              {/* Left Column */}
              <div className="flex flex-col w-full md:w-4/5">
                <div className="rounded-lg shadow-boxShadow p-10 mb-5">
                  <div className="flex items-center">
                    <div className="flex items-center flex-wrap gap-4">
                      <div className="font-bold text-xl">
                        {item.name_homeStay}
                      </div>
                      {/* ดาว */}
                      <div className="flex items-center font-bold mb-2 text-primaryUser">
                        {renderStars(averageRating)}
                        <div className="flex gap-2 mx-2">
                          <div>{averageRating}</div>
                          <div className="flex gap-1">
                            <div>{review.length} </div>
                            <div>รีวิว</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="">
                    <div className="mt-2">{item.detail_homeStay}</div>
                  </div>
                </div>
                {/* Facilities */}
                <div
                  id="facilities"
                  className="rounded-lg shadow-boxShadow p-10 mb-5"
                >
                  <h1 className="font-bold text-xl mb-5">สิ่งอำนวยความสะดวก</h1>
                  <div className="grid grid-cols-3 gap-4">{facilities}</div>
                </div>
              </div>

              {/* Maps */}
              <div className="flex w-full md:w-[220px] h-60 shadow-boxShadow">
                <OpenStreetMap />
              </div>
            </div>

            {/* ส่วนการ์ดประเภทห้อง */}
            <div className="mb-5">
              <h1 id="detailRoom" className="font-bold text-3xl">
                ประเภทห้อง
              </h1>
              <h1 className="text-lg mb-5">
                ห้องพัก {item.room_type.length} ประเภท | มี{" "}
                {item.room_type.reduce(
                  (total, room) => total + room.offer.length,
                  0
                )}{" "}
                ข้อเสนอ
              </h1>
              {card}
            </div>

            {/* review */}
            <div>
              <div id="review" className="text-2xl font-bold mb-5">
                รีวิวจากผู้เข้าพักจริง - {item.name_homeStay}
              </div>
              <div id="review" className="shadow-boxShadow rounded-lg p-10">
                <div className="text-xl"> คะแนนรีวิวโดยรวม</div>
                <div>
                  <div className="flex flex-row flex-wrap gap-10 justify-around items-center p-10">
                    <div
                      className="radial-progress  text-primaryUser text-5xl font-bold "
                      style={{
                        "--value": `${progress}`,
                        "--size": "12rem",
                        "--thickness": "2rem",
                      }}
                      role="progressbar"
                    >
                      {averageRating}
                    </div>
                    <div className="flex flex-row items-center gap-10">
                      <div className="flex flex-col-reverse ">
                        <div>
                          <div>ต้องปรับปรุง</div>
                          <progress
                            className="progress progress-info w-[200px] md:w-[600px] h-5"
                            value={10}
                            max="100"
                          ></progress>
                        </div>
                        <div>
                          <div>ปานกลาง</div>
                          <progress
                            className="progress progress-info w-[200px] md:w-[600px] h-5"
                            value="20"
                            max="100"
                          ></progress>
                        </div>
                        <div>
                          <div>ดี</div>
                          <progress
                            className="progress progress-info w-[200px] md:w-[600px] h-5"
                            value="40"
                            max="100"
                          ></progress>
                        </div>
                        <div>
                          <div>ดีมาก</div>
                          <progress
                            className="progress progress-info w-[200px] md:w-[600px] h-5"
                            value="60"
                            max="100"
                          ></progress>
                        </div>
                        <div>
                          <div>ดีเยี่ยม</div>
                          <progress
                            className="progress progress-info w-[200px] md:w-[600px] h-5"
                            value="80"
                            max="100"
                          ></progress>
                        </div>
                      </div>
                      {/* <div className="flex flex-col gap-5  text-xl text-primaryUser">
                        <p className="flex gap-3 ">
                          <FaStar />
                          <FaStar />
                          <FaStar />
                          <FaStar />
                          <FaStar />
                        </p>
                        <p className="flex gap-3">
                          <FaStar />
                          <FaStar />
                          <FaStar />
                          <FaStar />
                          <FaRegStar />
                        </p>
                        <p className="flex gap-3">
                          <FaStar />
                          <FaStar />
                          <FaStar />
                          <FaRegStar />
                          <FaRegStar />
                        </p>
                        <p className="flex gap-3">
                          <FaStar />
                          <FaStar />
                          <FaRegStar />
                          <FaRegStar />
                          <FaRegStar />
                        </p>
                        <p className="flex gap-3">
                          <FaStar />
                          <FaRegStar />
                          <FaRegStar />
                          <FaRegStar />
                          <FaRegStar />
                        </p>
                      </div> */}
                    </div>
                  </div>
                </div>
                {/* Review */}
                {reviews}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <LoadingTravel />
      )}
    </div>
  );
};

export default homeStayDetail;
