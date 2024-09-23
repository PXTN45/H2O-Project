import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import axiosPrivateUser from "../../hook/axiosPrivateUser";
import axios from "axios";
import OpenStreetMapShoData from "../../components/OpenStreetMapShowData";
import { AuthContext } from "../../AuthContext/auth.provider";
import { FaRegCalendarCheck, FaPeopleGroup } from "react-icons/fa6";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { IoPricetagsOutline } from "react-icons/io5";
import { BiSolidDiscount } from "react-icons/bi";
import { GrSync } from "react-icons/gr";
import PackageHomeStay from "../../components/PackageHomeStay";
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
interface Reviewer {
  image: string;
  name: string;
  email: string;
}
interface Review {
  _id: string;
  reviewer: Reviewer;
  content: string;
  rating: number;
  package: string;
  homestay: string;
  createdAt: string;
}

const PackageDetail = () => {
  const [item, setItem] = useState<any>();
  const { id } = useParams(); // Destructure id from useParams
  const [review, setReview] = useState<Review[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalPricePackage, setTotalPricePackage] = useState<number>(0);
  const [progress, setProgress] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error("AuthContext must be used within an AuthProvider");
  }
  const { userInfo } = authContext;

  useEffect(() => {
    if (!id) {
      console.error("ID is undefined or null");
      return; // หยุดการทำงานหาก id เป็น undefined หรือ null
    }

    const fetchData = async () => {
      try {
        const res = await axiosPrivateUser.get(`/package/${id}`);
        if (res.data) {
          setItem(res.data);
        } else {
          console.error("No data found for the package");
        }
      } catch (error) {
        console.error("Error fetching package detail:", error);
      }
    };

    fetchData();
  }, [id]); // Add id to dependency array

  useEffect(() => {
    const fetchReview = async () => {
      try {
        const reviewsResponse = await axios.get<Review[]>(
          "/reviewPackage.json"
        );
        if (reviewsResponse.data) {
          const filteredReviews = reviewsResponse.data.filter(
            (review) => review.package === id
          );

          setReview(filteredReviews);
        }
      } catch (reviewError) {
        console.error("เกิดข้อผิดพลาดในการดึงข้อมูลรีวิว:", reviewError);
      }
    };

    fetchReview();
  }, [id]);

  useEffect(() => {
    const priceDiscount = () => {
      if (item) { // ตรวจสอบว่ามี `item` ก่อน
        const price = item.price_package;
        const discount = item.discount;
        const totalPrice = discount > 0 ? price * ((100 - discount) / 100) : price;
        setTotalPricePackage(totalPrice);
      }
    };
    
    priceDiscount();
  }, [item]);

  // ฟังก์ชันคำนวณค่าเฉลี่ยของ rating
  const calculateAverageRating = (reviews: Review[]): number => {
    if (reviews.length === 0) return 0;
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / reviews.length;
    return parseFloat(averageRating.toFixed(1));
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

  const calculatePercentages = (review: Review[]) => {
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
  if (!item) {
    return <p>No item data available</p>;
  }

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
      const activityDay = activity.activity_days.map((day: any, i: number) => {
        return (
          <div key={i}>
            <li>{day.activity_name}</li>
          </div>
        );
      });

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
    bookingStart = "default-start-date"; 
  }

  const endStr = endDate;
  let bookingEnd: string;

  if (endStr) {
    const dateEnd = new Date(endStr);
    bookingEnd = dateEnd.toISOString().split("T")[0];
  } else {
    console.log("End date is not defined");
    bookingEnd = "default-end-date"; // หรือกำหนดค่าเริ่มต้นที่คุณต้องการ
  }

  const packageName = item?.name_package;
  const booker = userInfo?._id;
  const email = userInfo?.email;
  const packageId = id;
  const homestayId = " ";
  const offer: Offer[] = [];
  const totalPrice = totalPricePackage;

  const makePayment = async () => {
    try {
      const response = await axiosPrivateUser.post("/create-checkout-session", {
        name: packageName,
        totalPrice: totalPrice,
        email: email,
      });

      if (response.data) {
        const { sessionUrl } = response.data;

        // เก็บข้อมูลการจองใน localStorage
        const bookingDetails = {
          bookingStart,
          bookingEnd,
          booker,
          homestayId,
          offer,
          packageId,
        };
        localStorage.setItem("bookingDetails", JSON.stringify(bookingDetails));

        // เปลี่ยนไปยังหน้าการชำระเงิน
        window.location.href = sessionUrl;
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error("Error making payment:", error);
    }
  };
  const discount = item.discount;

  return (
    <div>
      {item && id ? (
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
              <div>
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
                  onClick={handleScrollToElement("program")}
                >
                  รายละเอียดโปรแกรม
                </a>
                <a
                  href="detailRoom"
                  className="text-decoration"
                  onClick={handleScrollToElement("package")}
                >
                  แพ็คเกจ
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
            <div className="flex flex-row flex-wrap md:flex-wrap  xl:flex-nowrap mb-10 gap-4">
              {/* Left Column */}
              <div className="flex flex-col w-full md:w-full lg:w-full xl:w-3/4">
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
                <div id="program" className="shadow-boxShadow p-10 rounded-lg">
                  <span className="font-bold text-xl">รายละเอียดโปรแกรม</span>
                  <div className="flex flex-col my-5">{activities}</div>
                </div>
              </div>
              {/* Maps */}
              <div className="flex flex-col w-full md:w-full lg:w-full xl:w-1/4">
                <div className="shadow-boxShadow rounded-lg">
                  <OpenStreetMapShoData
                    lat={item?.location[0].latitude_location}
                    lng={item?.location[0].longitude_location}
                  />
                </div>
              </div>
            </div>
            {/* package offer */}
            <h1 id="package" className="text-2xl my-5 font-bold ">
              แพ็คเกจสำหรับ - {item.name_package}
            </h1>
            <div className="shadow-boxShadow rounded-lg p-5">
              <span className="text-2xl font-bold">{item.name_package}</span>
              <div className=" flex flex-wrap xl:flex-nowrap gap-4 p-5">
                <div className="w-full xl:w-1/2">
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
                <div className="w-full xl:w-1/2 grid grid-cols-2 p-5">
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
                    <span className="flex items-center md:justify-end lg:justify-end gap-2">
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
                        <span className=" flex items-center px-2 h-8 rounded-xl bg-red-600 text-white ml-2">
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
                          <del>{item?.price_package} </del>บาท
                        </span>
                      ) : (
                        <div></div>
                      )}
                    </div>
                    <div className="flex justify-end items-end gap-2">
                      <span className="text-2xl font-bold text-red-500">
                        {totalPricePackage}
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
            {item?.homestay ? (
              <div>
                {/* homeStay */}
                <h1 className="text-2xl mt-10 font-bold ">
                  ที่พักสำหรับแพ็คเกจ - {item.name_package}
                </h1>
                <PackageHomeStay id={packageId || ""} />
              </div>
            ) : (
              <div></div>
            )}
            {/* review */}
            <div>
              <div id="review" className="text-2xl font-bold mb-5">
                รีวิวจากผู้เข้าพักจริง - {item.name_package}
              </div>
              <div id="review" className="shadow-boxShadow rounded-lg p-10">
                <div className="text-xl"> คะแนนรีวิวโดยรวม</div>
                <div>
                  <div className="flex  flex-wrap md:flex-wrap lg:flex-nowrap xl:flex-nowrap gap-10 justify-around items-center p-10">
                    <div
                      className="radial-progress text-primaryUser text-5xl font-bold"
                      style={
                        {
                          "--value": `${progress}`,
                          "--size": "12rem",
                          "--thickness": "2rem",
                        } as React.CSSProperties
                      }
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
                              className="progress progress-info w-[15rem] md:w-[500px] lg:w-[400px] xl:w-[500px] h-5"
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
        <div>no data</div>
      )}
    </div>
  );
};

export default PackageDetail;
