import React, { useContext, useEffect, useState } from "react";
import OpenStreetMap from "./OpenStreetMap";
import { RxHamburgerMenu } from "react-icons/rx";
import { AuthContext } from "../AuthContext/auth.provider";

const getRandomPlaces = (places: string[], count: number) => {
  const shuffled = [...places].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

const Drawer: React.FC = () => {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error("AuthContext must be used within an AuthProvider");
  }

  const { userInfo, mapData } = authContext;

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
          <div className="drawer-side z-10">
            <label
              htmlFor="my-drawer-2"
              aria-label="close sidebar"
              className="drawer-overlay"
            />
            <ul className="menu p-4 min-h-full text-xl line-darkmode">
              <div className=" my-3 mx-5">
                <input
                  type="text"
                  placeholder="ค้นหาสิ่งที่สนใจ"
                  className="input text-sm p-2 mb-2 rounded-full block w-full shadow"
                />
              </div>
              <div className="mx-5 my-5 h-60 z-20">
                <OpenStreetMap />
              </div>
              <div className="max-w-full rounded-md overflow-hidden shadow relative mx-5 my-5 h-full">
                <div className="flex flex-col w-full h-full text-sm">
                  <span className="font-bold text-lg my-5 mx-5">
                    ช่วงราคา (ห้อง / คืน)
                  </span>
                  <div className="flex items-center justify-center mx-5 my-2">
                    <div className="flex flex-col mx-3">
                      <label className="font-semibold">ราคาเริ่มต้น</label>
                      <input type="number" className="input w-32 h-8 my-3" />
                    </div>
                    <div className="flex flex-col mx-3">
                      <label className="font-semibold">ราคาสูงสุด</label>
                      <input type="number" className="input w-32 h-8 my-3" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="max-w-full rounded-md overflow-hidden shadow relative mx-5 my-5 h-full">
                <div className="flex flex-col w-full h-full text-sm">
                  <span className="font-bold text-lg my-5 mx-5">
                    สถานที่เที่ยวใกล้ที่พัก
                  </span>
                  <ul className="list-disc">
                    {data.length === 0 ? (
                      <div className="flex flex-col items-center justify-center mb-20 mt-12">
                        <label className="font-semibold">
                          ไม่พบข้อมูลบริเวณใกล้เคียง
                        </label>
                        <p className="font-medium">
                          ( โปรดใช้ Map ในการค้นหาสถานที่ใกล้เคียง )
                        </p>
                      </div>
                    ) : (
                      <div className="ml-5 mb-2">
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
                              <label htmlFor={item}>{item}</label>
                            </div>
                          </li>
                        ))}
                      </div>
                    )}
                  </ul>
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
