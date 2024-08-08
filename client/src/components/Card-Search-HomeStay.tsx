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
  const lowestPrice = Math.min(...offers.map(offer => offer.price_homeStay));
  return lowestPrice;
};

const Card: React.FC<CardProps> = ({ item, numPeople, numChildren }) => {
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

  const calculateRequiredRooms = (offers: Offer[], numAdults: number, numChildren: number) => {
    let totalRooms = 0;
    let remainingAdults = numAdults
    let remainingChildren = numChildren

    // จัดเรียง offer ตามจำนวนห้องที่มากไปน้อย
    offers.sort((a, b) => b.roomcount - a.roomcount);

    for (const offer of offers) {
      let availableRooms = offer.roomcount; // จำนวนห้อง
      const maxAdults = offer.max_people.adult;
      const maxChildren = offer.max_people.child;

      while ((remainingAdults > 0 || remainingChildren > 0) && availableRooms > 0) {
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
    return null; // ไม่แสดงการ์ดถ้า item.room_type ไม่มีข้อมูล
  }

  // ดึง offer ทั้งหมดจาก room_type
  const allOffers = item.room_type.flatMap(room => room.offer);

  // คำนวณจำนวนห้องที่ต้องการตาม offers สำหรับผู้ใหญ่และเด็ก
  const { totalRooms, remainingAdults, remainingChildren } = calculateRequiredRooms(allOffers, numPeople, numChildren);
  
  const lowestPrice = findLowestPrice(allOffers);
  
  if (remainingAdults > 0 || remainingChildren > 0) {
    return null; // ไม่แสดงการ์ดถ้าห้องไม่เพียงพอ
  }

  return (
    <div
      className="flex max-w-full rounded overflow-hidden shadow-boxShadow relative mx-6 my-6 h-full hover:scale-105 transform transition duration-300"
      onClick={handleCardClick}
    >
      <div id="image-Homestay" className="w-[25%]">
        <img
          id="imageCard-Homestay"
          src={item.image[0].image_upload}
          alt="images to cards"
          className="w-full h-[15rem] object-cover"
        />
      </div>
      <div id="center-card-Homestay" className="w-[50%]">
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
      <div id="right-card" className="w-[25%] bg-whiteSmoke">
        <div className="flex items-center justify-start">
          <div className="bg-white w-[75%] rounded-br-[10px] border-white shadow-rb">
            <span className="mx-1">
              <div className="w-full mx-5">
                ใช้ห้องทั้งหมด: {totalRooms}
              </div>
            </span>
          </div>
          <div
            id="Price-Homestay"
            className="absolute right-0 bottom-5 font-bold px-6 py-4"
          >
            <div className="flex flex-col items-end">
              <span className="mx-1 font-bold text-[10px]">ราคาเริ่มต้น (คืนละ)</span>
              <span className="mx-1 font-bold text-2xl">THB {lowestPrice}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
