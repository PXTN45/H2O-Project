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
import { useRef } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { CustomArrowProps } from "react-slick";

// types.ts
export interface Image_room {
  image: string;
}
export interface Offer {
  price_homeStay: number;
  quantity: number;
  discount: number;
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

// export interface Image {
//   image: any;
// }

// const images = [
//   "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRzwjRrPxNPtt9M_Lzn9REES05sB6iVSDLZEQ&s",
//   "https://png.pngtree.com/thumb_back/fh260/background/20210911/pngtree-xiaguang-daytime-rape-flower-mountain-no-photography-picture-with-picture-image_851488.jpg",
//   "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT66gud8TleGwraiwt11soeAxXtebT-7dbn7g&s",
//   "https://png.pngtree.com/thumb_back/fh260/background/20210903/pngtree-sunflower-summer-sunflower-flower-park-photography-picture-image_800070.jpg",
//   "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSqr6aqnAvfBy_qBntb6cEC6QdH2_4Nd6tMFQ&s",
// ];

const homeStayDetail = () => {
  const navigate = useNavigate();
  const [item, setItem] = useState<HomeStay | undefined>();
  const [isLoading, setLoadPage] = useState<boolean>(false);
  // const sliderRef = useRef<Slider | null>(null);
  const { id } = useParams<{ id: string }>();
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error("AuthContext must be used within an AuthProvider");
  }
  // const SampleNextArrow: React.FC<CustomArrowProps> = (props) => {
  //   const { className, style, onClick } = props;
  //   return (
  //     <button
  //       // className={`${className}  text-black rounded-full w-10 h-10`}
  //       style={{
  //         ...style,
  //         display: "block",
  //         background: "white",
  //         borderRadius: "50%",
  //         width: "40px",
  //         height: "40px",
  //         border: "none",
  //         color: "black",
  //       }}
  //       onClick={onClick}
  //     >
  //       <span style={{ color: "black", fontSize: "35px", lineHeight: "40px" }}>
  //         ›
  //       </span>
  //     </button>
  //   );
  // };

  // const SamplePrevArrow: React.FC<CustomArrowProps> = (props) => {
  //   const { className, style, onClick } = props;
  //   return (
  //     <div className="border">
  //       <button
  //         className="flex border"
  //         style={{
  //           ...style,
  //           // display: "block",
  //           background: "white",
  //           borderRadius: "50%",
  //           width: "40px",
  //           height: "40px",
  //           color: "black",
  //         }}
  //         onClick={onClick}
  //       >
  //         <span
  //           style={{ color: "black", fontSize: "35px", lineHeight: "40px" }}
  //         >
  //           ‹
  //         </span>
  //       </button>
  //     </div>
  //   );
  // };

  // const settings = {
  //   dots: false,
  //   infinite: true,
  //   speed: 500,
  //   slidesToShow: 1,
  //   slidesToScroll: 1,
  //   nextArrow: <SampleNextArrow />,
  //   prevArrow: <SamplePrevArrow />,
  // };
  // console.log(item);

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      setLoadPage(true);
      try {
        const res = await axiosPrivateUser.get(`/homestay/${id}`);
        setItem(res.data);
      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการดึงรายละเอียด homestay:", error);
      }
    };
    fetchData();
    setLoadPage(false);
  }, [id]);

  // console.log(item);
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

  const radialProgress = (rating: number) => {
    if (rating) {
      const progress = (rating * 100) / 5;
      return progress;
    }
  };

  // ตรวจสอบว่า item.facilities ถูกกำหนดก่อนการ map
  const facilities = item?.facilities.map((facility: any, index: number) => (
    <div key={index} className="flex items-center gap-4">
      <FaCheck />
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

  const handleButtonClick = () => {
    navigate("/bookingDetail", { state: { data } });
  };

  const card = item?.room_type.map((data: RoomType, index: number) => {
    console.log(data.image_room);

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

    const goToSlide = (index: number) => {
      if (data.image_room.length) {
        setCurrentIndex(index);
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

      return (
        <div key={i}>
          <div className="shadow-boxShadow flex rounded-lg p-10 my-5">
            <div className="w-2/6 border-r text-md">{facilities}</div>
            <div className="w-1/6 flex justify-center border-r">
              <FaMale className="text-xl" /> <FaMale className="text-xl" />{" "}
            </div>
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
                onClick={handleButtonClick}
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
              <div className="w-full md:w-[500px]">
                <p className="my-2">ห้องพัก</p>
                {/* carousel */}
                <div>
                  <div
                    id="default-carousel"
                    className="relative w-full"
                    data-carousel="slide"
                  >
                    <div className="relative h-56 overflow-hidden rounded-lg md:h-96">
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
                              className="absolute block w-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 h-[300px] object-cover rounded-xl"
                              alt={`Slide ${index + 1}`}
                            />
                          </div>
                        )
                      )}
                    </div>

                    <div className="absolute z-30 flex -translate-x-1/2 bottom-5 left-1/2 space-x-3 rtl:space-x-reverse">
                      {data?.image_room.map((_, index) => (
                        <button
                          key={index}
                          type="button"
                          className={`w-3 h-3 rounded-full ${
                            currentIndex === index ? "bg-white" : "bg-gray-500"
                          }`}
                          aria-current={currentIndex === index}
                          aria-label={`Slide ${index + 1}`}
                          onClick={() => goToSlide(index)}
                        ></button>
                      ))}
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
                {/* <div className="carousel w-full md:w-[500px] h-[300px] object-cover">
                  <div id="slide1" className="carousel-item relative w-full">
                    <img
                      src={item.room_type[index].image_room[index].image}
                      className="w-full rounded-lg object-cover"
                    />
                    <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
                      <a
                        href="#slide4"
                        className="text-white hover:bg-white hover:text-dark rounded-2xl px-2 "
                      >
                        ❮
                      </a>
                      <a
                        href="#slide2"
                        className="text-white hover:bg-white hover:text-dark rounded-2xl px-2 "
                      >
                        ❯
                      </a>
                    </div>
                  </div>
                  <div id="slide2" className="carousel-item relative w-full">
                    <img
                      src={item.room_type[index].image_room[index]?.image}
                      className="w-full rounded-lg object-cover"
                    />
                    <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
                      <a
                        href="#slide1"
                        className="text-white hover:bg-white hover:text-dark rounded-2xl px-2 "
                      >
                        ❮
                      </a>
                      <a
                        href="#slide3"
                        className="text-white hover:bg-white hover:text-dark rounded-2xl px-2 "
                      >
                        ❯
                      </a>
                    </div>
                  </div>
                  <div id="slide3" className="carousel-item relative w-full">
                    <img
                      src={item.room_type[index].image_room[index].image}
                      className="w-full rounded-lg object-cover"
                    />
                    <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
                      <a
                        href="#slide2"
                        className="text-white hover:bg-white hover:text-dark rounded-2xl px-2 "
                      >
                        ❮
                      </a>
                      <a
                        href="#slide4"
                        className="text-white hover:bg-white hover:text-dark rounded-2xl px-2 "
                      >
                        ❯
                      </a>
                    </div>
                  </div>
                  <div id="slide4" className="carousel-item relative w-full">
                    <img
                      src={item.room_type[index].image_room[index].image}
                      className="w-full rounded-lg object-cover"
                    />
                    <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
                      <a
                        href="#slide3"
                        className="text-white hover:bg-white hover:text-dark rounded-2xl px-2 "
                      >
                        ❮
                      </a>
                      <a
                        href="#slide1"
                        className="text-white hover:bg-white hover:text-dark rounded-2xl px-2 "
                      >
                        ❯
                      </a>
                    </div>
                  </div>
                </div> */}

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

              <div className="w-full md:w-[840px]">
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

  return (
    <div>
      {item ? (
        <div>
          <div id="homeStayDetail" className="container-sm mx-10">
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
            <div className="flex flex-row flex-wrap mx-auto mb-10 gap-4">
              {/* Left Column */}
              <div className="flex flex-col w-full md:w-3/4">
                <div className="rounded-lg shadow-boxShadow p-10 mb-5">
                  <div className="flex items-center">
                    <div className="flex items-center flex-wrap gap-4">
                      <div className="font-bold text-xl">
                        {item.name_homeStay}
                      </div>
                      {/* ดาว */}
                      <div className="flex items-center font-bold mb-2 text-primaryUser">
                        {renderStars(item.review_rating_homeStay || 0)}
                        <div className="flex gap-4">
                          <h1>{item.review_rating_homeStay}</h1>
                          <h1>1350 รีวิว</h1>
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
              <div className="flex w-full  md:w-[342px] h-[200px] shadow-boxShadow">
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
                        "--value": `${radialProgress(
                          item.review_rating_homeStay
                        )}`,
                        "--size": "12rem",
                        "--thickness": "2rem",
                      }}
                      role="progressbar"
                    >
                      {item.review_rating_homeStay}
                    </div>
                    <div className="flex flex-row items-center gap-10">
                      <div className="flex flex-col-reverse ">
                        <div>
                          <div>ต้องปรับปรุง</div>
                          <progress
                            className="progress progress-info w-[300px] md:w-[600px] h-5"
                            value={10}
                            max="100"
                          ></progress>
                        </div>
                        <div>
                          <div>ปานกลาง</div>
                          <progress
                            className="progress progress-info w-[300px] md:w-[600px] h-5"
                            value="20"
                            max="100"
                          ></progress>
                        </div>
                        <div>
                          <div>ดี</div>
                          <progress
                            className="progress progress-info w-[300px] md:w-[600px] h-5"
                            value="40"
                            max="100"
                          ></progress>
                        </div>
                        <div>
                          <div>ดีมาก</div>
                          <progress
                            className="progress progress-info w-[300px] md:w-[600px] h-5"
                            value="60"
                            max="100"
                          ></progress>
                        </div>
                        <div>
                          <div>ดีเยี่ยม</div>
                          <progress
                            className="progress progress-info w-[300px] md:w-[600px] h-5"
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
                <div className="flex flex-wrap gap-4 my-5 shadow-boxShadow rounded-xl p-5">
                  <div className="w-full md:w-1/4 p-5">
                    <div className="flex gap-5  items-center text-xl">
                      <div className="avatar">
                        <div className="ring-primary ring-offset-base-100 w-12 rounded-full ring ring-offset-2">
                          <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
                        </div>
                      </div>
                      <div>Nattaphong</div>
                    </div>
                  </div>
                  <div className="w-full md:w-[970px] shadow-boxShadow p-5 rounded-lg">
                    <div className="flex flex-wrap justify-between mb-5">
                      <div className="bg-primaryUser rounded-xl px-2 text-l text-white">
                        4.5/5
                      </div>
                      <div>02/สิงหาคม/2567</div>
                    </div>
                    <div>
                      เป็นโรงแรมและที่พักที่สะอาดมากๆถูกใจมากในการดูแลเรื่องของความสะอาด
                      แม่บ้านทำความสะอาดทุกอย่างในห้องได้ดีมากๆ
                      ถ้าเปรียบกับที่อื่นในราคาเท่ากันที่อื่นทำความสะอาดทุกวันเหมือนกัน
                      แต่ไม่เช็ดโต๊ะและถูกพื้นฯลฯ ฝักบัวอาบน้ำน้ำไหลมาก
                      เทวัญสะดวกทุกอย่างไม่ว่าจะเป็นแหล่งเที่ยวแหล่งของกิน
                      เราเลยพักต่ออีกสองคืน😊😊พนักงานทุกคนให้การบริการยิ้มแย้มแจ่มใสดีมากๆๆ
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 my-5 shadow-boxShadow rounded-xl p-5">
                  <div className="w-1/4 p-5">
                    <div className="flex gap-5 items-center text-xl">
                      <div className="avatar">
                        <div className="ring-primary ring-offset-base-100 w-12 rounded-full ring ring-offset-2">
                          <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
                        </div>
                      </div>
                      <div>Suttiporn</div>
                    </div>
                  </div>
                  <div className="w-3/4 shadow-boxShadow p-5 rounded-lg">
                    <div className="flex justify-between mb-5">
                      <div className="bg-primaryUser rounded-xl px-2 text-l text-white">
                        4/5
                      </div>
                      <div>02/สิงหาคม/2567</div>
                    </div>
                    <div>
                      บริการดีค่ะ ห้องพักสะอาด แต่เสียงดังค่ะ แม่บ้านทำความสะอาด
                      วันที่เข้าพัก มีเด็กฝรั่งเสียงดังร้องไห้ นานมากค่ะ
                      ตั้งแต่เช้าเลย หลายชั่วโมง
                      และได้ยินเสียงทีวีห้องติดกันชัดมาก
                      แต่ครั้งแรกค่ะที่เข้าพัก รอบหน้าก็ว่าจะไปอีกค่ะ
                      ชอบการบริการ ราคาถูก ใกล้ของกิน แนะนำค่ะ
                      ใครที่หาโรงแรมที่พัก😊👍
                    </div>
                  </div>
                </div>
                <div className="flex gap-4 my-5 shadow-boxShadow rounded-xl p-5">
                  <div className="w-1/4 p-5">
                    <div className="flex gap-5 items-center text-xl">
                      <div className="avatar">
                        <div className="ring-primary ring-offset-base-100 w-12 rounded-full ring ring-offset-2">
                          <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
                        </div>
                      </div>
                      <div>Athiphong</div>
                    </div>
                  </div>
                  <div className="w-3/4 shadow-boxShadow p-5 rounded-lg">
                    <div className="flex justify-between mb-5">
                      <div className="bg-primaryUser rounded-xl px-2 text-l text-white">
                        4.5/5
                      </div>
                      <div>02/สิงหาคม/2567</div>
                    </div>
                    <div>
                      ส่วนตัวอ่านรีวิวมาบ้างแล้วก่อนพัก แย่บ้าง ดีบ้างปนๆกันไป
                      แถวที่พักร้านอาหาร โลตัส เซเว่นฉ่ำมาก ไม่ต้องไปไหนไกล
                      ห้องก็คุ้มราคามากกก ราคานี้ไม่มีอุปกรณ์ยาสระผม
                      หมวกครอบผมไดร์เป่าผม ถือว่าคุ้มแล้วค่ะคืนละ 4-500
                      แถมมีสระว่ายน้ำให้เล่นด้วย 08:00-20:00 แอร์เย็นดี
                      ห้องกว้าง เตียงใหญ่ ห้องน้ำสวย มีตู้เย็น ตู้เสื้อผ้า ทีวี
                      ผ้าเช็ดตัว ห้องพักดีแบบมากๆๆ
                      ติดแค่เรื่องเสียงคอมแอร์ดัง+เสียงตู้เย็น
                      แต่ถ้าใครไม่ติดแนะนำเลยค่ะต้องมาลองพักซักครั้ง
                      ถ้ามีมีโอกาสก็จะไปพักอีกแน่นอนค่าา♥️♥️♥️
                    </div>
                  </div>
                </div>
                <div className="flex gap-4 my-5 shadow-boxShadow rounded-xl p-5">
                  <div className="w-1/4 p-5">
                    <div className="flex gap-5 items-center text-xl">
                      <div className="avatar">
                        <div className="ring-primary ring-offset-base-100 w-12 rounded-full ring ring-offset-2">
                          <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
                        </div>
                      </div>
                      <div>Supphalak</div>
                    </div>
                  </div>
                  <div className="w-3/4 shadow-boxShadow p-5 rounded-lg">
                    <div className="flex justify-between mb-5">
                      <div className="bg-primaryUser rounded-xl px-2 text-l text-white">
                        5/5
                      </div>
                      <div>02/สิงหาคม/2567</div>
                    </div>
                    <div>
                      แนะนำที่นี้คะ มากี่รอบก็ประทับใจ แต่รอบนี้ได้ชั้น 4
                      ติดหน้าลิฟต์ เราจองช่วงวันหยุดและด่วน
                      เข้าใจพนักงานคะเหลือห้องสุดท้าย ห้องใหญ่ สะอาดมากๆ
                      สามีชอบเพราะห้องไม่มีกลิ่นอับคะ แอร์เย็นไม่เสียงดัง
                      ผ้าเช็ดตัวสะอาด แต่วันเข้าพักมี 1
                      ผืนที่ขาดแต่แจ้งพนักงานเปลี่ยนมาเปลี่ยนให้
                      แม่บ้านมาเปลี่ยนให้ ไวมากคะ จะครั้งไหนๆก็จะไปพักอีกคะ
                    </div>
                  </div>
                </div>
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
