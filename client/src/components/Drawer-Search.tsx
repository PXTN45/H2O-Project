import React, { useContext, useEffect, useState } from "react";
import OpenStreetMap from "./OpenStreetMap";
import { RxHamburgerMenu } from "react-icons/rx";
import { AuthContext } from "../AuthContext/auth.provider";

const getRandomPlaces = (places: string[], count: number) => {
  const shuffled = [...places].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

const truncateText = (text: string, maxLength: number) => {
  if (text.length > maxLength) {
    return text.slice(0, maxLength) + "...";
  }
  return text;
};

const Drawer: React.FC = () => {
  const [rangeValue, setRangeValue] = useState(0);
  const [searchText, setSearchText] = useState<string>("");

  
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error("AuthContext must be used within an AuthProvider");
  }

  const { userInfo, mapData } = authContext;

  const handleRangeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(event.target.value);
    setRangeValue(newValue);
    console.log(`Current value: ${newValue}`);
  };
  
  const [data, setData] = useState<string[]>([]);
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (mapData?.places) {
      setData(getRandomPlaces(mapData.places, 5));
    }
  }, [mapData]);

  const handleCheckboxChange = (item: string) => {
    setCheckedItems((prevCheckedItems) => {
      const newCheckedItems = new Set(prevCheckedItems);
      if (newCheckedItems.has(item)) {
        newCheckedItems.delete(item);
      } else {
        newCheckedItems.add(item);
      }
      return newCheckedItems;
    });
  }; 

  return (
    <div>
      <div className="md:w-1/4">
        <div className="drawer lg:drawer-open">
          <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
          <div className="drawer-content flex flex-col items-center justify-center">
            {/* Page content here */}
            <label
              htmlFor="my-drawer-2"
              className={
                userInfo?.role === "user"
                  ? "btn btn-circle btn-primary drawer-button lg:hidden bg-gradient-to-b from-primaryUser to-secondUser"
                  : userInfo?.role === "business"
                  ? "btn btn-circle btn-primary drawer-button lg:hidden bg-gradient-to-b from-primaryBusiness to-secondBusiness"
                  : userInfo?.role === "admin"
                  ? "btn btn-circle btn-primary drawer-button lg:hidden bg-gradient-to-b from-primaryAdmin to-secondAdmin"
                  : "btn btn-circle btn-primary drawer-button lg:hidden bg-gradient-to-b from-primaryUser to-primaryBusiness"
              }
            >
              <RxHamburgerMenu />
            </label>
          </div>
          <div className="drawer-side z-50">
            <label
              htmlFor="my-drawer-2"
              aria-label="close sidebar"
              className="drawer-overlay"
            />
            <ul className="menu p-4 w-[85%] min-h-full text-xl line-darkmode">
              <div className="w-full xl:w-72">
                <div className="w-full flex items-center justify-center my-5">
                  <input
                    type="text"
                    placeholder="ค้นหาสิ่งที่สนใจ"
                    className="input text-sm p-2 mb-2 rounded-full block w-full shadow"
                    onChange={(e) => setSearchText(e.target.value)}
                  />
                </div>
                <div className="w-full flex items-center justify-center my-5 h-52">
                  <OpenStreetMap />
                </div>
                <div className="w-full rounded-md shadow relative">
                  <div className="flex flex-col w-full h-full text-sm">
                    <span className="font-bold text-lg mt-5 mx-5">
                      ช่วงราคา (ห้อง / คืน)
                    </span>
                    <div className="w-[100%] flex flex-col items-center justify-center my-5">
                      <input
                        type="range"
                        id="rangePrice"
                        name="rangePrice"
                        min="0"
                        max="25000"
                        value={rangeValue}
                        onChange={handleRangeChange}
                        className="w-[80%] accent-primaryBusiness"
                      />
                      <div className="w-[80%] mt-2 flex items-center justify-between">
                        <span className="flex justify-start">เริ่มต้น: 0</span>
                        <span className="flex justify-end">สูงสุด: {rangeValue}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-full rounded-md overflow-hidden shadow relative my-5 h-full">
                  <div className="flex flex-col w-full h-full text-sm">
                    <span className="w- font-bold text-lg my-5 mx-5">
                      สถานที่เที่ยวใกล้ที่พัก
                    </span>
                    <ul className="list-disc w-full">
                      {data.length === 0 ? (
                        <div className="flex flex-col items-center justify-center mb-20 mt-12">
                          <label className=" flex justify-start font-semibold">
                            ไม่พบข้อมูล
                          </label>
                          <p className="flex justify-end font-medium">
                            ( โปรดใช้ Map ในการค้นหาสถานที่ )
                          </p>
                        </div>
                      ) : (
                        <div className="mx-5 mb-2">
                          {data.map((item) => (
                            <li key={item} className="mb-2">
                              <div className="flex items-center justify-start">
                                <input
                                  type="checkbox"
                                  id={item}
                                  value={item}
                                  checked={checkedItems.has(item)}
                                  onChange={() => handleCheckboxChange(item)}
                                  className="mr-2"
                                />
                                <label htmlFor={item}>{truncateText(item, 30)}</label>
                              </div>
                            </li>
                          ))}
                        </div>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Drawer;
