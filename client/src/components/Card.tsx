import React from "react";

interface Image {
  image_upload: string;
}

interface Room {
  price_homeStay: number;
}

interface Item {
  _id: string;
  image: Image[];
  room_type: Room[];
  name_package?: string;
  name_homeStay?: string;
  detail_package?: string;
  detail_homeStay?: string;
  price_package?: number;
  price_homestay?: number;
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

  return (
    <div
      className="max-w-full rounded overflow-hidden shadow relative mx-6 my-6 h-full hover:scale-105 transform transition duration-300"
      onClick={() => seeDetail(item._id)}
    >
      <img
        id="imageCard-Home"
        src={item.image[0].image_upload}
        alt="images to cards"
        className="w-full h-[15rem] object-cover"
      />
      <div id="detailCard-Home" className="px-6 py-4">
        <div className="font-bold text-xl mb-2">
          {truncateText(item.name_package || item.name_homeStay || "", 20)}
        </div>
        <p className="text-base">
          {truncateText(item.detail_package || item.detail_homeStay || "", 20)}
        </p>
      </div>
      <div id="priceCard-Home" className="text-lg font-semibold absolute bottom-5 right-0 mx-5">
        <span className="mx-2">฿</span>
        {item.price_package || item.room_type[0].price_homeStay}
      </div>
    </div>
  );
};

export default Card;
