import React from "react";
import { useNavigate } from "react-router-dom";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

interface Image {
  image_upload: string;
}

interface Location {
  province_location: string;
}

interface MaxPeople {
  adult: number;
  child: number;
}

interface Offer {
  price_homeStay: number;
  max_people: MaxPeople;
  roomcount: number;
}

interface RoomType {
  name_type_room: string;
  bathroom_homeStay: number;
  bedroom_homeStay: number;
  sizeBedroom_homeStay: string;
  max_people: {
    adult: number;
    child: number;
  };
  roomcount: number;
  offer: Offer[];
}

interface Item {
  _id: string;
  image: Image[];
  room_type: RoomType[];
  location: Location[];
  name_homeStay?: string;
  detail_homeStay?: string;
  price_homestay?: number;
  review_rating_homeStay?: number;
  max_people?: number;
}

interface CardProps {
  item: Item;
  numPeople: number;
  numChildren: number;
}

const findLowestPrice = (offers: Offer[]) => {
  if (offers.length === 0) return 0;
  const lowestPrice = Math.min(...offers.map((offer) => offer.price_homeStay));
  return lowestPrice;
};

const Card: React.FC<CardProps> = ({ item, numPeople, numChildren }) => {
  const [currentIndex, setCurrentIndex] = React.useState(0);

  const handlePrev = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (item.image.length) {
      event.stopPropagation();
      setCurrentIndex((prevIndex) =>
        prevIndex === 0 ? item.image.length - 1 : prevIndex - 1
      );
    }
  };

  const handleNext = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (item.image.length) {
      event.stopPropagation();
      setCurrentIndex((prevIndex) =>
        prevIndex === item.image.length - 1 ? 0 : prevIndex + 1
      );
    }
  };

  const navigate = useNavigate();
  const handleCardClick = () => {
    navigate(`/homeStayDetail/${item._id}`);
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + "...";
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

  const calculateRequiredRooms = (
    offers: Offer[],
    numAdults: number,
    numChildren: number
  ) => {
    let totalRooms = 0;
    let remainingAdults = numAdults;
    let remainingChildren = numChildren;

    offers.sort((a, b) => b.roomcount - a.roomcount);

    for (const offer of offers) {
      let availableRooms = offer.roomcount;
      const maxAdults = offer.max_people.adult;
      const maxChildren = offer.max_people.child;

      while (
        (remainingAdults > 0 || remainingChildren > 0) &&
        availableRooms > 0
      ) {
        const adultsInThisRoom = Math.min(remainingAdults, maxAdults);
        const childrenInThisRoom = Math.min(remainingChildren, maxChildren);

        if (adultsInThisRoom > 0 || childrenInThisRoom > 0) {
          remainingAdults -= adultsInThisRoom;
          remainingChildren -= childrenInThisRoom;
          totalRooms++;
          availableRooms--;
        } else {
          break;
        }
      }

      if (remainingAdults <= 0 && remainingChildren <= 0) break;
    }

    return { totalRooms, remainingAdults, remainingChildren };
  };

  if (!Array.isArray(item.room_type) || item.room_type.length === 0) {
    return null;
  }

  const allOffers = item.room_type.flatMap((room) => room.offer);
  
  const { totalRooms, remainingAdults, remainingChildren } =
    calculateRequiredRooms(allOffers, numPeople, numChildren);
    
  const lowestPrice = findLowestPrice(allOffers);

  if (remainingAdults > 0 || remainingChildren > 0) {
    return null;
  }

  return (
    <div onClick={handleCardClick} className="flex flex-col xl:flex-row max-w-full rounded overflow-hidden shadow-boxShadow relative my-6 h-full hover:scale-105 transform transition duration-300">
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
            className="absolute top-0 right-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none hidden carousel-button"
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
      <div id="center-card-Homestay" className="w-full xl:w-[50%] bg-white">
        <div id="detailCard-Homestay" className="px-6 py-4">
          <div id="Name-Homestay" className="font-bold text-xl mb-2">
            {truncateText(item.name_homeStay || "", 30)}
          </div>
          <div className="mt-3">
            <p id="Detail-Homestay" className="text-base">
              {truncateText(item.detail_homeStay || "", 150)}
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
              {renderStars(item.review_rating_homeStay || 0)}
            </div>
          </div>
        </div>
      </div>
      <div id="right-card" className="w-full xl:w-[25%] bg-whiteSmoke">
        <div className="flex flex-col ">
          <div className="bg-white w-[75%] rounded-br-[10px] border-white shadow-rb">
            <span className="mx-1">
              <div className="w-full mx-5">ใช้ห้องทั้งหมด: {totalRooms}</div>
            </span>
          </div>
          <div id="Price-Homestay" className="mt-16 px-6 py-4">
            <div className="flex flex-col items-end">
              <span className="mx-1 font-bold text-[10px]">
                ราคาเริ่มต้น (คืนละ)
              </span>
              <span className="mx-1 font-bold text-2xl">THB {lowestPrice}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
