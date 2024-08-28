import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axiosPrivateUser from "../../hook/axiosPrivateUser";
import axios from "axios";
import { FaStar, FaStarHalfAlt, FaRegStar, FaArrowDown } from "react-icons/fa";
import { ImArrowDown } from "react-icons/im";
import { BiTime } from "react-icons/bi";
import { FaRegCalendarCheck, FaPeopleGroup } from "react-icons/fa6";
import { IoPricetagsOutline } from "react-icons/io5";
import { BiSolidDiscount } from "react-icons/bi";
import { FaPersonWalkingLuggage } from "react-icons/fa6";
import { GrSync } from "react-icons/gr";
export interface Image {
  image_upload: string;
}

const PackageDetail = () => {
  const [item, setItem] = useState<any>();
  const { id } = useParams(); // Destructure id from useParams
  const [currentIndex, setCurrentIndex] = useState(0);
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

  if (!item) {
    return <p>No item data available</p>;
  }
  console.log(item);

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === item.image.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handlePrev = () => {
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

  if (!item) {
    return <p>No item data available</p>;
  }
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
            </div>
            {/* package offer */}
            <div className="shadow-boxShadow rounded-lg p-5">
              <span className="text-2xl font-bold">
                {item.name_package}
              </span>
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
                    onClick={handlePrev}
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
                    onClick={handleNext}
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
                  <div>{formatDate(startDate)}- {formatDate(endDate)}</div>
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
                    <span><GrSync className="text-2xl mr-2"/></span>
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
                  >
                    จองทันที
                  </button>
                </div>
              </div>
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
