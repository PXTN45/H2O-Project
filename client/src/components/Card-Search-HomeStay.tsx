import React from "react";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

interface Image {
  image_upload: string;
}

interface Room {
  price_homeStay: number;
}

interface Location {
  province_location: string;
}

interface Item {
  _id: string;
  image: Image[];
  room_type: Room[];
  location: Location[];
  name_homeStay?: string;
  detail_homeStay?: string;
  price_homestay?: number;
  review_rating_homeStay?: number;
}

interface CardProps {
  item: Item;
}

const seeDetail = (id: string) => {
  console.log(id);
};

const Card: React.FC<CardProps> = ({ item }) => {
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
  
  return (
    <div
      className="flex max-w-full rounded overflow-hidden shadow-boxShadow relative mx-6 my-6 h-full hover:scale-105 transform transition duration-300"
      onClick={() => seeDetail(item._id)}
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
          <div id="Stars-Homestay" className="mt-3 font-bold py-4 text-primaryUser">
          <div className="flex">
            {renderStars(item.review_rating_homeStay || 0)}
          </div>
        </div>
        </div>
      </div>
      <div id="right-card" className="w-[25%] bg-whiteSmoke">
        <div className="flex items-center justify-center mt-5">
          <div id="Price-Homestay" className="absolute right-0 font-bold px-6 py-4">
            <span className="mx-1">฿</span>
            {item.room_type[0].price_homeStay}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
