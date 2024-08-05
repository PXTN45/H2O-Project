import React, { useEffect, useState, useContext } from "react";
import axiosPublic from "../hook/axiosPublic";
import { AuthContext } from "../AuthContext/auth.provider";
import Card from "./Card-Recomment-Package";

interface Image {
  image_upload: string;
}

interface Item {
  _id: string;
  image: Image[];
  name_package?: string;
  detail_package?: string;
  price_package?: number;
  type_package?: string;
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
        const response = await axiosPublic.get("/package");
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
        : dataPackage.filter((item) => item.type_package === type);
    setFilteredData(filtered);
    setIsType(type);
  };

  return (
    <div className="container mx-auto my-20">
      <h1 className="text-2xl font-bold mb-4 my-[2rem] mx-[1.75rem]">
        Packages Recommend
      </h1>
      <div id="butttonSelect-Package" className="flex gap-4 mb-4 flex-wrap my-[2rem] mx-[1.75rem]">
        <button
          id="ทั้งหมด[2]"
          onClick={() => filterByType("")}
          className={
            isType === ""
              ? "btn border border-transparent bg-gradient-to-r from-primaryUser to-primaryBusiness transition-opacity group-hover:opacity-100 text-white"
              : "btn border bg-white border-primaryBusiness text-primaryUser hover:bg-gradient-to-r from-primaryUser to-primaryBusiness hover:text-white"
          }
        >
          ทั้งหมด
        </button>
        <button
          id="การท่องเที่ยวธรรมชาติ"
          onClick={() => filterByType("การท่องเที่ยวธรรมชาติ")}
          className={
            isType === "การท่องเที่ยวธรรมชาติ"
              ? "btn border border-transparent bg-gradient-to-r from-primaryUser to-primaryBusiness transition-opacity group-hover:opacity-100 text-white"
              : "btn border bg-white border-primaryBusiness text-primaryUser hover:bg-gradient-to-r from-primaryUser to-primaryBusiness hover:text-white"
          }
        >
          ธรรมชาติ
        </button>
        <button
          id="การท่องเที่ยวทางน้ำ"
          onClick={() => filterByType("การท่องเที่ยวทางน้ำ")}
          className={
            isType === "การท่องเที่ยวทางน้ำ"
              ? "btn border border-transparent bg-gradient-to-r from-primaryUser to-primaryBusiness transition-opacity group-hover:opacity-100 text-white"
              : "btn border bg-white border-primaryBusiness text-primaryUser hover:bg-gradient-to-r from-primaryUser to-primaryBusiness hover:text-white"
          }
        >
          ทางน้ำ
        </button>
        <button
          id="การท่องเที่ยวเชิงวัฒนธรรม"
          onClick={() => filterByType("การท่องเที่ยวเชิงวัฒนธรรม")}
          className={
            isType === "การท่องเที่ยวเชิงวัฒนธรรม"
              ? "btn border border-transparent bg-gradient-to-r from-primaryUser to-primaryBusiness transition-opacity group-hover:opacity-100 text-white"
              : "btn border bg-white border-primaryBusiness text-primaryUser hover:bg-gradient-to-r from-primaryUser to-primaryBusiness hover:text-white"
          }
        >
          เชิงวัฒนธรรม
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
