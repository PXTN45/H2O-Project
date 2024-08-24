import React from "react";
import { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
import { IoMdTime } from "react-icons/io";
import { MdOutlinePolicy } from "react-icons/md";
import Navbar from "../../components/Navbar-data";
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
  time_checkIn_homeStay: string;
  time_checkOut_homeStay: string;
  policy_cancel_homeStay: string;
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
  const navigate = useNavigate();
  const [item, setItem] = useState<HomeStay | undefined>();
  const [review, setReview] = useState<Review[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isLoading, setLoadPage] = useState<boolean>(false);
  const authContext = useContext(AuthContext);
  const { setPaymentData } = usePaymentContext();

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

  // if (!item) {
  //   return <div>No booking details available.</div>;
  // }

  const images = item?.image.slice(1, 7).map((img: any, index: number) => {
    const specialClasses: { [key: number]: string } = {
      2: "rounded-tr-lg",
      5: "rounded-br-lg",
    };

    return (
      <div key={index} className="w-full h-full">
        <img
          className={`w-[250px] h-[200px] object-cover rounded-md ${
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

  const roomTypes = item?.room_type || [];
  const [currentIndices, setCurrentIndices] = useState<number[]>(
    roomTypes.map(() => 0)
  );

  // ใช้ useEffect เพื่อตั้งค่า currentIndices เมื่อ roomTypes เปลี่ยนแปลง
  useEffect(() => {
    setCurrentIndices(roomTypes.map(() => 0));
  }, [roomTypes]);

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

  const cardOffer = item?.room_type.map((data: RoomType, index: number) => {
    const offer = data.offer.map((offer: Offer, i: number) => {
      const price = offer.price_homeStay;
      const discount = offer.discount;
      const totalPrice = price > 0 ? price * ((100 - discount) / 100) : price;
      const facilitiesRoom = offer?.facilitiesRoom.map(
        (facility: Facilities_Room, index: number) => {
          return (
            <div key={index} className="flex items-center gap-4">
              <FaCheck />
              {facility.facilitiesName}
            </div>
          );
        }
      );

      const handleSelectAndProceed = () => {
        if (item && userInfo && id) {
          // Set payment data
          const roomTypeIndex =
            Array.isArray(item.room_type) && item.room_type.length > 0
              ? i < item.room_type.length
                ? i
                : 0
              : 0;
          const paymentData: PaymentData = {
            homeStayId: id,
            homeStayName: item.name_homeStay,
            totalPrice: totalPrice,
            roomType: item.room_type[roomTypeIndex],
            offer: item.room_type[roomTypeIndex].offer[i],
            bookingUser: userInfo,
            rating: averageRating,
            time_checkIn_homeStay: item.time_checkIn_homeStay,
            time_checkOut_homeStay: item.time_checkOut_homeStay,
            policy_cancel_homeStay: item.policy_cancel_homeStay,
          };

          localStorage.setItem("paymentData", JSON.stringify(paymentData));

          setPaymentData(paymentData);
          navigate("/bookingDetail");
        }
      };

      const fetchHomeStayData = async () => {
        try {
          const response = await axiosPrivateUser.get(`/homeStay/${id}`);
          setItem(response.data);
        } catch (error) {
          console.error("Error fetching HomeStay data:", error);
        }
      };

      const handleDecreaseQuantity = async (i: number) => {
        try {
          // ค้นหาข้อมูล HomeStay
          const homeStay = await axiosPrivateUser.get(`/homeStay/${id}`);
          const roomType = homeStay.data.room_type.find((rt) => rt.offer[i]);

          if (!roomType) {
            console.log("Room type not found");
            return;
          }

          const offer = roomType.offer[i];
          const newQuantityRoom = offer.quantityRoom - 1;

          if (newQuantityRoom < 1) {
            console.log("Cannot decrease quantity further");
            return;
          }

          // อัปเดตข้อมูล HomeStay ด้วยจำนวนห้องที่ลดลง
          await axiosPrivateUser.put(`/homeStay/${id}`, {
            ...homeStay.data,
            room_type: homeStay.data.room_type.map((rt) =>
              rt.offer[i]
                ? {
                    ...rt,
                    offer: rt.offer.map((o, index: number) =>
                      index === i ? { ...o, quantityRoom: newQuantityRoom } : o
                    ),
                  }
                : rt
            ),
          });

          // อัปเดตข้อมูลตะกร้าสินค้า
          const cardOffer = {
            homeStayId: id,
            homeStayName: homeStay.data.name_homeStay,
            totalPrice: totalPrice,
            roomType: roomType,
            offer: roomType.offer[i],
            bookingUser: userInfo,
            rating: averageRating,
          };

          await axiosPrivateUser.put(`/homestay/${id}`, cardOffer);

          // เรียกใช้ฟังก์ชัน refetch เพื่อดึงข้อมูลล่าสุด
          fetchHomeStayData();
        } catch (error) {
          console.error("Error updating quantity:", error);
        }
      };

      const handleIncreaseQuantity = async (i: number) => {
        try {
          const homeStay = await axiosPrivateUser.get(`/homeStay/${id}`);
          const roomType = homeStay.data.room_type.find((rt) => rt.offer[i]);

          if (!roomType) {
            console.log("Room type not found");
            return;
          }

          const offer = roomType.offer[i];
          const newQuantityRoom = offer.quantityRoom + 1;

          // อัปเดตข้อมูล HomeStay ด้วยจำนวนห้องที่ลดลง
          await axiosPrivateUser.put(`/homeStay/${id}`, {
            ...homeStay.data,
            room_type: homeStay.data.room_type.map((rt) =>
              rt.offer[i]
                ? {
                    ...rt,
                    offer: rt.offer.map((o, index: number) =>
                      index === i ? { ...o, quantityRoom: newQuantityRoom } : o
                    ),
                  }
                : rt
            ),
          });

          const cardOffer = {
            homeStayId: id,
            homeStayName: homeStay.data.name_homeStay,
            totalPrice: totalPrice,
            roomType: roomType,
            offer: roomType.offer[i],
            bookingUser: userInfo,
            rating: averageRating,
          };

          await axiosPrivateUser.put(`/homestay/${id}`, cardOffer);

          // เรียกใช้ฟังก์ชัน refetch เพื่อดึงข้อมูลล่าสุด
          fetchHomeStayData();
        } catch (error) {
          console.log(error);
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
              <div className="flex my-2 gap-3">
                <button
                  className="text-2xl"
                  onClick={() => handleDecreaseQuantity(i)}
                >
                  {" "}
                  -{" "}
                </button>
                <input
                  type="number"
                  placeholder="1"
                  className="input input-bordered w-[50px] h-[30px] max-w-xs"
                  value={offer.quantityRoom}
                />
                <button
                  className="text-2xl"
                  onClick={() => handleIncreaseQuantity(i)}
                >
                  {" "}
                  +{" "}
                </button>
              </div>
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

    return <div>{offer}</div>;

    // return (
    //   <div key={index} className="my-5">
    //     {data ? (
    //       <div className="rounded-lg shadow-boxShadow p-10">
    //         <div className="font-bold text-2xl">
    //           {item.room_type[index].name_type_room}
    //         </div>
    //         <div className="flex flex-wrap gap-4 my-3">
    //           <div className="w-full md:w-[350px]">
    //             <p className="my-2">ห้องพัก</p>
    //             {/* carousel */}
    //             <div>
    //               <div
    //                 id={`carousel-${index}`} // unique ID for each carousel
    //                 className="relative w-full"
    //                 data-carousel="slide"
    //               >
    //                 <div className="relative h-60 overflow-hidden rounded-lg">
    //                   {data?.image_room.map(
    //                     (src: Image_room, imageIndex: number) => (
    //                       <div
    //                         key={imageIndex}
    //                         className={`duration-700 ease-in-out ${
    //                           currentIndex === imageIndex ? "block" : "hidden"
    //                         }`}
    //                         data-carousel-item
    //                       >
    //                         <img
    //                           src={src.image}
    //                           className="absolute block w-full h-full object-cover rounded-xl"
    //                           alt={`Slide ${imageIndex + 1}`}
    //                         />
    //                       </div>
    //                     )
    //                   )}
    //                 </div>
    //                 <button
    //                   type="button"
    //                   className="absolute top-0 left-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
    //                   onClick={handlePrev}
    //                   data-carousel-prev
    //                 >
    //                   <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
    //                     <svg
    //                       className="w-4 h-4 text-white dark:text-gray-800 rtl:rotate-180"
    //                       aria-hidden="true"
    //                       xmlns="http://www.w3.org/2000/svg"
    //                       fill="none"
    //                       viewBox="0 0 6 10"
    //                     >
    //                       <path
    //                         stroke="currentColor"
    //                         strokeLinecap="round"
    //                         strokeLinejoin="round"
    //                         strokeWidth="2"
    //                         d="M5 1 1 5l4 4"
    //                       />
    //                     </svg>
    //                     <span className="sr-only">Previous</span>
    //                   </span>
    //                 </button>
    //                 <button
    //                   type="button"
    //                   className="absolute top-0 right-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
    //                   onClick={handleNext}
    //                   data-carousel-next
    //                 >
    //                   <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
    //                     <svg
    //                       className="w-4 h-4 text-white dark:text-gray-800 rtl:rotate-180"
    //                       aria-hidden="true"
    //                       xmlns="http://www.w3.org/2000/svg"
    //                       fill="none"
    //                       viewBox="0 0 6 10"
    //                     >
    //                       <path
    //                         stroke="currentColor"
    //                         strokeLinecap="round"
    //                         strokeLinejoin="round"
    //                         strokeWidth="2"
    //                         d="m1 9 4-4-4-4"
    //                       />
    //                     </svg>
    //                     <span className="sr-only">Next</span>
    //                   </span>
    //                 </button>
    //               </div>
    //             </div>

    //             <div className="mt-4">
    //               <ul className="flex flex-col gap-3">
    //                 <li className="flex items-center">
    //                   <RxRulerSquare className="mr-2 text-2xl" />{" "}
    //                   {item.room_type[index].sizeBedroom_homeStay}
    //                 </li>
    //                 <li className="flex items-center">
    //                   <MdOutlineBathroom className="mr-2 text-2xl" />{" "}
    //                   {item.room_type[index].bathroom_homeStay} ห้องน้ำ
    //                 </li>

    //                 {item.room_type[index].bedroom_homeStay > 1 ? (
    //                   <li className="flex items-center">
    //                     <MdOutlineBedroomParent className="mr-2 text-2xl" />{" "}
    //                     {item.room_type[index].bedroom_homeStay} เตียงคู่
    //                   </li>
    //                 ) : (
    //                   <li className="flex items-center">
    //                     <MdOutlineBedroomChild className="mr-2 text-2xl" />{" "}
    //                     {item.room_type[index].bedroom_homeStay} เตียงเดี่ยว
    //                   </li>
    //                 )}
    //               </ul>
    //             </div>
    //           </div>

    //           <div className="w-full md:w-[750px]">
    //             <div className="flex flex-row mb-5">
    //               <h1 className="w-2/5">สิทธิประโยชน์</h1>
    //               <h1 className="w-1/5">ผู้เข้าพัก</h1>
    //               <p className="w-2/5">ราคา ต่อห้อง ต่อคืน</p>
    //             </div>
    //             {offer}
    //           </div>
    //         </div>
    //       </div>
    //     ) : (
    //       <div>no data</div>
    //     )}
    //   </div>
    // );
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
                <img src={reviewHomeStay?.reviewer?.image} />
              </div>
            </div>
            <div>{reviewHomeStay?.reviewer?.name}</div>
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

  const calculatePercentages = (review) => {
    const totalReviews = review.length;
    const ratingCounts = [0, 0, 0, 0, 0]; // Index 0 = 1 ดาว, Index 1 = 2 ดาว, etc.

    // นับจำนวนรีวิวสำหรับแต่ละดาว
    review.forEach((review) => {
      if (review.rating >= 1 && review.rating <= 5) {
        ratingCounts[review.rating - 1]++;
      }
    });

    // คำนวณเปอร์เซ็นต์
    const percentages = ratingCounts.map(
      (count) => (count / totalReviews) * 100
    );

    return percentages;
  };

  const percentages = calculatePercentages(review);

  // Debugging: ตรวจสอบค่า currentIndices และ roomTypes
  console.log("Current Indices:", currentIndices);
  console.log("Room Types:", roomTypes);

  const test = roomTypes.map((roomType, index) => (
    <div key={index} className="mb-8 relative">
      <h2 className="text-xl font-bold mb-4">{roomType.name_type_room}</h2>
      <div
        id={`carousel-${index}`}
        className="relative w-full"
        data-carousel="slide"
      >
        <div className="relative h-60 rounded-lg">
          {roomType.image_room.map((image, imageIndex) => (
            <div
              key={imageIndex}
              className={`duration-700 ease-in-out ${
                currentIndices[index] === imageIndex ? "block" : "hidden"
              }`}
              data-carousel-item
            >
              <img
                src={image.image}
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
  ));

  return (
    <div>
      {item ? (
        <div>
          <div id="homeStayDetail" className="container-sm mx-10 md:mx-40">
            <div className="mt-5">
              <Navbar />
            </div>
            {/* รูปภาพ */}
            <div className="flex justify-center gap-4 mt-10 mb-5 ">
              <div>
                <img
                  className="w-[600px] h-[420px] object-cover rounded-l-lg  rounded-r-md"
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
            <div id="detailTypeRoom" className="mb-5">
              <h1 id="detailRoom" className="font-bold text-3xl">
                ประเภทห้อง
              </h1>
              <h1 className="text-lg mb-5">
                ห้องพัก {item?.room_type.length} ประเภท | มี{" "}
                {item.room_type.reduce(
                  (total, room) => total + room.offer.length,
                  0
                )}{" "}
                ข้อเสนอ
              </h1>
              {/* <div>
                {roomTypes.map((roomType, index) => (
                  <div key={index} className="mb-8 relative">
                    <h2 className="text-xl font-bold mb-4">
                      {roomType.name_type_room}
                    </h2>
                    <div
                      id={`carousel-${index}`}
                      className="relative w-full"
                      data-carousel="slide"
                    >
                      <div className="relative h-60 overflow-hidden rounded-lg">
                        {roomType.image_room.map((image, imageIndex) => (
                          <div
                            key={`${index}-${imageIndex}`}
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
                ))}
              </div> */}
              <div>
              <div>{test}</div>

              </div>

            </div>
            {/* policy */}
            <div id="policy" className=" my-10">
              <div className="text-2xl font-bold my-5">
                นโยบายที่พักและข้อมูลทั่วไปของ - {item.name_homeStay}
              </div>
              <div className="w-full rounded-lg shadow-boxShadow p-5">
                <div>
                  <div className="flex items-center gap-2 text-lg font-bold">
                    <IoMdTime /> เช็คอิน/เช็คเอ้า
                  </div>
                  <div className="ml-10">
                    <div>เช็คอินตั้งแต่ : {item.time_checkIn_homeStay} น.</div>
                    <div>เช็คเอ้าก่อน : {item.time_checkOut_homeStay} น.</div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-lg font-bold mt-5">
                    <MdOutlinePolicy />
                    นโยบาย
                  </div>
                  <div className="ml-10">{item.policy_cancel_homeStay}</div>
                </div>
              </div>
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
                      <div className="flex flex-col-reverse">
                        {percentages.map((percentage, index) => (
                          <div key={index}>
                            <div>{`${index + 1} ดาว`}</div>
                            <progress
                              className="progress progress-info w-[200px] md:w-[600px] h-5"
                              value={percentage}
                              max="100"
                            ></progress>
                          </div>
                        ))}
                      </div>
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
