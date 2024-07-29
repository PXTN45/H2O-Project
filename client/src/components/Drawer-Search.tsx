import React, { useContext , useEffect } from "react";
import OpenStreetMap from "./OpenStreetMap";
import { RxHamburgerMenu } from "react-icons/rx";
import { AuthContext } from "../AuthContext/auth.provider";


const Drawer: React.FC = () => {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error("AuthContext must be used within an AuthProvider");
  }

  const { userInfo , mapData } = authContext;

  useEffect(() => {
    console.log(mapData);
  },[mapData])

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
              <div className=" my-5 mx-5">
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
                  <span className="font-bold text-lg my-5 mx-5">ช่วงราคา (ห้อง / คืน)</span>
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
                  <span className="font-bold text-lg my-5 mx-5">สถานที่เที่ยวใกล้ที่พัก</span>

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
