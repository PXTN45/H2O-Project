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
  const [dataHomeStays, setDataHomeStays] = useState<Item[]>([]);
  const [filteredData, setFilteredData] = useState<Item[]>([]);
  const [isType, setIsType] = useState<string>("");
  const [randomProvinces, setRandomProvinces] = useState<string[]>([]);

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
          setDataHomeStays(data);
          setFilteredData(data);
          setRandomProvinces(getRandomProvinces(data, 3));
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

  const getRandomProvinces = (data: Item[], count: number): string[] => {
    const provinces = Array.from( // จะเปลี่ยน Set กลับมาเป็น Array ที่มีชื่อจังหวัดที่ไม่ซ้ำกัน
      new Set(data.map((item) => item.location[0].province_location)) // จะทำการลบข้อมูลที่ซ้ำกันออกจากรายการ
    );
    const shuffledProvinces = provinces.sort(() => 0.5 - Math.random());
    return shuffledProvinces.slice(0, count);
  };

  const filterByProvince = (province: string) => {
    const filtered =
      province === ""
        ? dataHomeStays
        : dataHomeStays.filter(
            (item) => item.location[0].province_location === province
          );
    setFilteredData(filtered);
    setIsType(province);
  };

  return (
    <div className="container mx-auto mt-12">
      <h1 className="text-2xl font-bold mb-4 my-[2rem] mx-[1.75rem]">
        Homestays Recommend
      </h1>
      <div
        id="butttonSelect-HomeStay"
        className="flex gap-4 mb-4 flex-wrap my-[2rem] mx-[1.75rem]"
      >
        <button
          id="ทั้งหมด"
          onClick={() => filterByProvince("")}
          className={
            isType === ""
              ? "btn border border-transparent bg-gradient-to-r from-primaryUser to-primaryBusiness transition-opacity group-hover:opacity-100 text-white"
              : "btn border border-primaryBusiness text-primaryUser hover:bg-gradient-to-r from-primaryUser to-primaryBusiness hover:text-white"
          }
        >
          ทั้งหมด
        </button>
        {randomProvinces.map((province) => (
          <button
            id={province}
            key={province}
            onClick={() => filterByProvince(province)}
            className={
              isType === province
                ? "btn border border-transparent bg-gradient-to-r from-primaryUser to-primaryBusiness transition-opacity group-hover:opacity-100 text-white"
                : "btn border border-primaryBusiness text-primaryUser hover:bg-gradient-to-r from-primaryUser to-primaryBusiness hover:text-white"
            }
          >
            {province}
          </button>
        ))}
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
