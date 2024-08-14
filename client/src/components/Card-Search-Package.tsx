import React from "react";
import { useNavigate } from "react-router-dom";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

interface Image {
  image_upload: string;
}

interface Location {
  province_location: string;
}

interface Item {
  _id: string;
  image: Image[];
  location: Location[];
  name_package?: string;
  detail_package?: string;
  type_package?: string;
  price_package?: number;
  review_rating_package?: number;
  max_people?: number;
}

interface CardProps {
  item: Item;
  numPeople: number;
  numChildren: number;
}

const Card: React.FC<CardProps> = ({ item , numPeople , numChildren }) => {
  const [currentIndex, setCurrentIndex] = React.useState(0);

  const handlePrev = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    if (item.image.length) {
      event.stopPropagation();
      setCurrentIndex((prevIndex) =>
        prevIndex === 0 ? item.image.length - 1 : prevIndex - 1
      );
    }
  };

  const handleNext = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    if (item.image.length) {
      event.stopPropagation();
      setCurrentIndex((prevIndex) =>
        prevIndex === item.image.length - 1 ? 0 : prevIndex + 1
      );
    }
  };

  const navigate = useNavigate();
  const seeDetail = (id: string) => {
    navigate(`/packageDetail/${id}`);
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + "...";
  };

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (rating >= i) {
        stars.push(<FaStar key={i} className="text-yellow-500" />);
      } else if (rating >= i - 0.5) {
        stars.push(<FaStarHalfAlt key={i} className="text-yellow-500" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-yellow-500" />);
      }
    }
    return stars;
  };

  const calculateRequiredTicket = (
    items: Item[],
    numAdults: number
  ) => {
    let remainingAdults = numAdults;
  
    for (const item of items) {
      let availableTicket = item.max_people ?? 0;
      while (remainingAdults > 0 && availableTicket > 0) {
        const adultsInThisTicket = Math.min(remainingAdults, availableTicket);
        remainingAdults -= adultsInThisTicket;
        availableTicket -= adultsInThisTicket;      
      }
  
      if (remainingAdults <= 0) break;
    }
  
    return { remainingAdults };
  };
  
  

  if (item.max_people === 0) {
    return null;
  }
  
  const { remainingAdults } = calculateRequiredTicket([item], numPeople);


  
  if (remainingAdults > 0) {
    return null;
  }
  

  return (
    <div
      onClick={() => seeDetail(item._id)}
      className="card-box flex flex-col xl:flex-row max-w-full rounded overflow-hidden shadow-boxShadow relative my-6 h-full hover:scale-105 transform transition duration-300"
    >
      <div id="image-Homestay" className="w-full xl:w-[25%]">
        <div
          id="default-carousel"
          className="relative w-full carousel-container"
          data-carousel="slide"
        >
          <div className="relative h-60 overflow-hidden">
            {item?.image.map((src: Image, index: number) => (
              <div
                key={index}
                className={`duration-700 ease-in-out ${
                  currentIndex === index ? "block" : "hidden"
                }`}
                data-carousel-item
              >
                <img
                  src={src.image_upload}
                  className="absolute block w-full h-full object-cover"
                  alt={`Slide ${index + 1}`}
                />
              </div>
            ))}
          </div>
          <button
            type="button"
            className="absolute top-0 left-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none hidden carousel-button"
            onClick={handlePrev}
            data-carousel-prev
          >
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
              <svg
                className="w-4 h-4 rtl:rotate-180"
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
            className="absolute top-0 right-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none hidden carousel-button"
            onClick={handleNext}
            data-carousel-next
          >
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
              <svg
                className="w-4 h-4 rtl:rotate-180"
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
      <div id="center-card-Homestay" className="w-full xl:w-[50%]">
        <div id="detailCard-Homestay" className="px-6 py-4">
          <div id="Name-Homestay" className="font-bold text-xl mb-2">
            {truncateText(item.name_package || "", 30)}
          </div>
          <div className="mt-3">
            <p id="Detail-Homestay" className="text-base">
              {truncateText(item.detail_package || "", 150)}
            </p>
          </div>
          <div className="mt-3">
            <p id="Location-Homestay" className="text-base">
              {item.location[0].province_location || ""}
            </p>
          </div>
          <div
            id="Stars-Homestay"
            className="mt-3 font-bold py-4 text-primaryUser"
          >
            <div className="flex">
              {renderStars(item.review_rating_package || 0)}
            </div>
          </div>
        </div>
      </div>
      <div id="right-card" className="w-full xl:w-[25%] semi-bg">
        <div className="flex flex-col ">
          <div className="card-semiBox w-[75%] rounded-br-[10px]">
            <span className="mx-1">
              <div className="w-full mx-5">ใช้ทั้งหมด: {numPeople} ที่นั่ง</div>
            </span>
          </div>
          <div id="Price-Homestay" className="mt-16 px-6 py-4">
            <div className="flex flex-col items-end">
              <span className="mx-1 font-bold text-[10px]">
                ราคาเริ่มต้น (ที่นั่ง)
              </span>
              <span className="mx-1 font-bold text-2xl">THB {item.price_package}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
