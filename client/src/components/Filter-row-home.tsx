import React, { useEffect, useState, useContext } from "react";
import axiosPublic from "../hook/axiosPublic";
import Card from "./Card-Recomment-HomeStay";
import { AuthContext } from "../AuthContext/auth.provider";

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
  name_package?: string;
  name_homestay?: string;
  detail_package?: string;
  detail_homestay?: string;
  price_package?: number;
  price_homestay?: number;
  type_homestay?: string;
}

const Filterpackage: React.FC = () => {
  const [dataPackage, setDataPackage] = useState<Item[]>([]);
  const [filteredData, setFilteredData] = useState<Item[]>([]);
  const [isType, setIsType] = useState<string>("");

  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error("AuthContext must be used within an AuthProvider");
  }

  const { setLoadPage } = authContext;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosPublic.get("/homestay");
        const data = await response.data;
        if (data) {
          setDataPackage(data);
          setFilteredData(data);
          setLoadPage(true);
        } else {
          setLoadPage(false);
        }
      } catch (error) {
        console.log("Error fetching data:", error);
      }
    };
    fetchData();
  }, [setLoadPage]);

  const filterByType = (type: string) => {
    const filtered =
      type === ""
        ? dataPackage
        : dataPackage.filter((item) => item.type_homestay === type);
    setFilteredData(filtered);
    setIsType(type);
  };

  return (
    <div className="container mx-auto mt-12">
      <h1 className="text-2xl font-bold mb-4 my-[2rem] mx-[1.75rem]">
        Homestays Recommend
      </h1>
      <div id="butttonSelect-HomeStay" className="flex gap-4 mb-4 flex-wrap my-[2rem] mx-[1.75rem]">
        <button
          onClick={() => filterByType("")}
          className={
            isType === ""
              ? "btn border border-transparent bg-gradient-to-r from-primaryUser to-primaryBusiness transition-opacity group-hover:opacity-100 text-white"
              : "btn border border-primaryBusiness text-primaryUser hover:bg-gradient-to-r from-primaryUser to-primaryBusiness hover:text-white"
          }
        >
          ทั้งหมด
        </button>
        <button
          onClick={() => filterByType("บ้านเดี่ยว")}
          className={
            isType === "บ้านเดี่ยว"
              ? "btn border border-transparent bg-gradient-to-r from-primaryUser to-primaryBusiness transition-opacity group-hover:opacity-100 text-white"
              : "btn border border-primaryBusiness text-primaryUser hover:bg-gradient-to-r from-primaryUser to-primaryBusiness hover:text-white"
          }
        >
          ธรรมชาติ
        </button>
        <button
          onClick={() => filterByType("โฮมสเตย์")}
          className={
            isType === "โฮมสเตย์"
              ? "btn border border-transparent bg-gradient-to-r from-primaryUser to-primaryBusiness transition-opacity group-hover:opacity-100 text-white"
              : "btn border border-primaryBusiness text-primaryUser hover:bg-gradient-to-r from-primaryUser to-primaryBusiness hover:text-white"
          }
        >
          ทางน้ำ
        </button>
        <button
          onClick={() => filterByType("วิลล่า")}
          className={
            isType === "วิลล่า"
              ? "btn border border-transparent bg-gradient-to-r from-primaryUser to-primaryBusiness transition-opacity group-hover:opacity-100 text-white"
              : "btn border border-primaryBusiness text-primaryUser hover:bg-gradient-to-r from-primaryUser to-primaryBusiness hover:text-white"
          }
        >
          วิลล่า
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredData.slice(0, 4).map((item, index) => (
          <div key={index} className="w-full">
            <Card item={item} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Filterpackage;
