import React, { useState } from "react";

import { CiImageOn } from "react-icons/ci";
import { FaDeleteLeft } from "react-icons/fa6";
import { FaHome } from "react-icons/fa";
import { IoIosHome } from "react-icons/io";

const createHomeStay: React.FC = () => {
  const [checkInTime, setCheckInTime] = useState("15:00");
  const [checkOutTime, setCheckOutTime] = useState("12:00");
  const [cancellationPolicy, setCancellationPolicy] = useState("option1");
  const [selected, setSelected] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<number>(1); // Track the current step
  const [amenities, setAmenities] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [hasDiscount, setHasDiscount] = useState<boolean>(false);
  const [hasBank, setHasHasBank] = useState<boolean>(false);

  const handleAddAmenity = () => {
    if (inputValue.trim() !== "") {
      setAmenities([...amenities, inputValue]);
      setInputValue(""); // Clear the input after adding
    }
  };

  const handleNextClick = () => {
    setCurrentStep((prevStep) => Math.min(prevStep + 1, 6)); // Increment step, ensuring it does not exceed 6
  };

  const handlePreviousClick = () => {
    setCurrentStep((prevStep) => Math.max(prevStep - 1, 1)); // Decrement step, ensuring it does not go below 1
  };

  const handleButtonClick = (id: string) => {
    setSelected(id); // Set the selected button id
  };

  const handleDeleteAmenity = (index: number) => {
    setAmenities(amenities.filter((_, i) => i !== index));
  };

  const pageSwitch = () => {
    switch (currentStep) {
      case 1:
        return (
          <div>
            <div className="mb-6">
              <label className="block font-medium mb-2">
                ตั้งชื่อที่พักของท่าน
              </label>
              <input type="text" className="w-full border rounded-md p-2" />
            </div>

            <div className="mb-6 rounded-lg">
              <label className="block font-medium mb-2">
                เลือกประเภทที่พักของท่าน
              </label>
              <div className=" shadow-boxShadow rounded-md">
                <div className="w-full py-2 bg-primaryBusiness rounded-t-lg"></div>
                <div className="p-5">
                  <h3 className="text-lg font-semibold mb-3">ประเภทที่พัก</h3>
                  <div className="flex space-x-4">
                    <button
                      className={`border h-20 w-full rounded-md p-4 flex flex-col items-center ${
                        selected === "home"
                          ? "border-black bg-blue-500 text-white"
                          : "border-gray-300 bg-white text-gray-500"
                      }`}
                      onClick={() => handleButtonClick("home")}
                    >
                      <FaHome size={75} />
                      <span>บ้านพักตากอากาศ</span>
                    </button>
                    <button
                      className={`border h-20 w-full rounded-md p-4 flex flex-col items-center ${
                        selected === "homestay"
                          ? "border-black bg-blue-500 text-white"
                          : "border-gray-300 bg-white text-gray-500"
                      }`}
                      onClick={() => handleButtonClick("homestay")}
                    >
                      <IoIosHome size={75} />
                      <span>โฮมสเตย์</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <label className="block font-medium mb-2">
                กรอกคำอธิบายเกี่ยวกับที่พัก
              </label>
              <textarea className="w-full border rounded-md p-2 h-24" />
            </div>

            <div className="mb-6">
              <label className="block font-medium mb-2">
                เวลาเช็คอิน/เช็คเอาท์
              </label>
              <div className=" shadow-boxShadow rounded-md ">
                <div className="w-full py-2 bg-primaryBusiness rounded-t-lg"></div>
                <div className="p-5">
                  <div className="flex justify-between items-center mb-4">
                    <label>ผู้เข้าพักสามารถเช็คอินได้ตั้งแต่</label>
                    <label>ระหว่าง</label>
                    <input
                      type="time"
                      className="border rounded-md p-2"
                      value={checkInTime}
                      onChange={(e) => setCheckInTime(e.target.value)}
                    />
                    <span>ถึง</span>
                    <input type="time" className="border rounded-md p-2" />
                  </div>
                  <div className="flex justify-between items-center">
                    <label>ผู้เข้าพักสามารถเช็คเอาท์ได้ถึง</label>
                    <input
                      type="time"
                      className="border rounded-md p-2"
                      value={checkOutTime}
                      onChange={(e) => setCheckOutTime(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <label className="block font-medium mb-2">
                นโยบายการยกเลิกการจอง
              </label>
              <div className=" shadow-boxShadow rounded-md ">
                <div className="w-full py-2 bg-primaryBusiness rounded-t-lg"></div>
                <div className="p-5">
                  <div className="flex items-center mb-2">
                    <input
                      type="radio"
                      id="option1"
                      name="cancellationPolicy"
                      value="option1"
                      checked={cancellationPolicy === "option1"}
                      onChange={() => setCancellationPolicy("option1")}
                      className="mr-2"
                    />
                    <label htmlFor="option1">
                      คืนเงิน 100% หากทำการยกเลิกภายใน 7 วันก่อนการเข้าพัก
                    </label>
                  </div>
                  <div className="flex items-center mb-2">
                    <input
                      type="radio"
                      id="option2"
                      name="cancellationPolicy"
                      value="option2"
                      checked={cancellationPolicy === "option2"}
                      onChange={() => setCancellationPolicy("option2")}
                      className="mr-2"
                    />
                    <label htmlFor="option2">
                      คืนเงิน 50% หากทำการยกเลิกภายใน 3 วันก่อนการเข้าพัก
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="option3"
                      name="cancellationPolicy"
                      value="option3"
                      checked={cancellationPolicy === "option3"}
                      onChange={() => setCancellationPolicy("option3")}
                      className="mr-2"
                    />
                    <label htmlFor="option3">
                      คืนเงิน 50% หากทำการยกเลิกภายใน 7 วันหลังการเข้าพัก
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div>
            <div className=" shadow-boxShadow rounded-md ">
              <div className="w-full py-2 bg-primaryBusiness rounded-t-lg"></div>
              <div className="py-5">
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      จังหวัด
                    </label>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      อำเภอ
                    </label>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ตำบล
                    </label>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      รหัสไปรษณีย์ (ไม่บังคับ)
                    </label>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        ละติจูด
                      </label>
                      <input
                        type="text"
                        className="w-full p-2 border border-gray-300 rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        ลองจิจูด
                      </label>
                      <input
                        type="text"
                        className="w-full p-2 border border-gray-300 rounded-md"
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ที่ตั้งแผนที่
                    </label>
                    <div className="w-full h-64 bg-gray-200 rounded-md">
                      {/* Placeholder for Map Image */}
                      <img
                        src="path/to/map-image.png"
                        alt="Map"
                        className="w-full h-full object-cover rounded-md"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      มีปัญหากับแผนที่หรือพิกัดของสถานที่ของคุณหรือไม่?
                      หากไม่แน่ใจ ให้ลากแผนที่เพื่อกำหนดพิกัดของคุณ
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div>
            <h3 className="text-xl font-semibold ">อัปโหลดรูปภาพ</h3>
            <p>
              รูปภาพมีความสำคัญต่อผู้ใช้
              อัปโหลดภาพคุณภาพสูงได้มากเท่าที่คุณมีสามารถเพิ่มมากขึ้นในภายหลัง
            </p>
            <div className=" border-2 border-dashed border-smoke p-2 rounded-lg flex  flex-col items-center justify-center w-full h-[500px] m-3">
              <CiImageOn size={100} className=" text-smoke" />
              <div className="text-smoke flex flex-col items-center">
                <p>กรุณาอัปโหลดรูปภาพอย่างน้อย 7 รูป</p>
                <p>ลากและวางภาพของคุณที่นี่</p>
                <label
                  htmlFor="file-upload"
                  className="btn border-smoke bg-white  shadow-buttonShadow text-black m-3 "
                >
                  เลือกรูปถ่าย
                </label>
                <input id="file-upload" type="file" className="hidden" />
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div>
            <div className="w-full flex flex-col">
              {/* Room and Details Section */}
              <div className="shadow-boxShadow  rounded-lg p-4 mb-4 w-full">
                <h2 className="text-lg font-semibold mb-4">
                  ห้องพักและรายละเอียด
                </h2>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">
                    รองรับ
                  </label>
                  <div className="flex items-center">
                    <button className="btn btn-outline btn-sm">-</button>
                    <span className="mx-2">4</span>
                    <button className="btn btn-outline btn-sm">+</button>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">
                    ห้องน้ำ
                  </label>
                  <p className="text-sm mb-2">
                    นับเฉพาะห้องน้ำในที่พักของคุณ ไม่ใช่ห้องน้ำรวมในอาคารหรือ
                    คอมเพล็กซ์ของคุณ
                  </p>
                  <div className="flex items-center">
                    <button className="btn btn-outline btn-sm">-</button>
                    <span className="mx-2">1</span>
                    <button className="btn btn-outline btn-sm">+</button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    ห้องนอน
                  </label>
                  <div className="flex items-center mb-2">
                    <button className="btn btn-outline btn-sm">-</button>
                    <span className="mx-2">1</span>
                    <button className="btn btn-outline btn-sm">+</button>
                  </div>
                  <input
                    type="text"
                    className="input input-bordered w-full max-w-xs"
                    placeholder="เตียงควีนไซส์"
                  />
                </div>

                <a href="#" className="text-sm text-blue-500 mt-2 inline-block">
                  เพิ่มเตียงประเภทอื่น
                </a>
              </div>

              {/* Amenities Section */}
              <div className="border border-gray-300 rounded-lg p-4">
                <h2 className="text-lg font-semibold mb-4">
                  สิ่งอำนวยความสะดวก
                </h2>
                <p className="text-sm mb-2">เพิ่มอย่างน้อย 3 อย่าง</p>

                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="input input-bordered"
                    placeholder="กรอกสิ่งอำนวยความสะดวก"
                  />
                  <button className="btn text-smoke" onClick={handleAddAmenity}>
                    เพิ่ม
                  </button>
                </div>

                <ul className="grid grid-rows-4 grid-flow-col gap-4 ">
                  {amenities.map((amenity, index) => (
                    <li key={index} className="flex m-3">
                      <div className="">
                        <div className="text-lg flex items-center gap-3">
                          {amenity}
                          <button
                            onClick={() => handleDeleteAmenity(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <FaDeleteLeft size={20} className="flex  " />
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        );
      case 5:
        return (
          <div>
            <h3 className="text-xl font-semibold">ราคาต่อคืน</h3>
            <p>กรุณาระบุราคาต่อคนที่คุณต้องการสำหรับที่พักนี้</p>
            <div className="shadow-boxShadow rounded-md">
              <div className="w-full py-2 bg-primaryBusiness rounded-t-lg"></div>
              <div className="flex flex-col ml-20 p-10">
                <div className="mb-6">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    ราคาต่อคืน
                  </label>
                  <div className="flex">
                    <input
                      type="text"
                      className="shadow-boxShadow border-whiteSmoke rounded-l-lg"
                      defaultValue="0"
                    />
                    <span className="shadow-buttonShadow flex bg-primaryBusiness rounded-r-lg w-14 justify-center items-center">
                      บาท
                    </span>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      name="discountOption"
                      className="radio radio-primary"
                      checked={hasDiscount}
                      onChange={() => setHasDiscount(true)}
                    />
                    <span className="ml-2">ฉันมีส่วนลด</span>
                    <input
                      type="radio"
                      name="discountOption"
                      className="radio radio-primary ml-4"
                      checked={!hasDiscount}
                      onChange={() => setHasDiscount(false)}
                    />
                    <span className="ml-2">ฉันไม่มีส่วนลด</span>
                  </div>
                  <label className="block text-smoke   text-sm font-bold mb-2">
                    หากมีส่วนลดกรุณาเลือกพร้อมกรอกฟอร์มข้างล่างต่อ
                  </label>
                </div>

                {hasDiscount && (
                  <>
                    <div className="">
                      <label className="block text-gray-700 text-sm font-bold ">
                        อัตรารายสัปดาห์
                      </label>
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        ส่วนลดกรจองต่อไปนี้ใช้สำหรับ 7 คืนขึ้นไป
                      </label>
                      <div className="flex items-center">
                        <div className="flex">
                          <input
                            type="text"
                            placeholder="0"
                            className="shadow-boxShadow border-whiteSmoke rounded-l-lg"
                          />
                          <span className="shadow-buttonShadow flex bg-primaryBusiness rounded-r-lg w-14 justify-center items-center">
                            %
                          </span>
                        </div>
                        <div className="flex ml-5">
                          <input
                            type="text"
                            placeholder="0"
                            className="shadow-boxShadow border-whiteSmoke rounded-l-lg"
                          />
                          <span className="shadow-buttonShadow flex bg-primaryBusiness rounded-r-lg w-14 justify-center items-center">
                            บาท
                          </span>
                          <span className="ml-4 mt-1">ต่อคืนเป็นราคาขาย</span>
                        </div>
                      </div>
                    </div>

                    <div className="">
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        ส่วนลดกรจองต่อไปนี้ใช้สำหรับ 28 คืนขึ้นไป
                      </label>
                      <div className="flex items-center">
                        <div className="flex">
                          <input
                            type="text"
                            placeholder="0"
                            className="shadow-boxShadow border-whiteSmoke rounded-l-lg"
                          />
                          <span className="shadow-buttonShadow flex bg-primaryBusiness rounded-r-lg w-14 justify-center items-center">
                            %
                          </span>
                        </div>
                        <div className="flex ml-5">
                          <input
                            type="text"
                            placeholder="0"
                            className="shadow-boxShadow border-whiteSmoke rounded-l-lg"
                          />
                          <span className="shadow-buttonShadow flex bg-primaryBusiness rounded-r-lg w-14 justify-center items-center">
                            บาท
                          </span>
                          <span className="ml-4 mt-1">ต่อคืนเป็นราคาขาย</span>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        );
      case 6:
        return (
          <div>
            <h3 className="text-xl font-semibold">วิธีจ่ายเงิน</h3>
            <p>โปรดเลือกวิธีจ่ายเงินที่ต้องการ</p>
            <div className="shadow-boxShadow rounded-md">
              <div className="w-full py-2 bg-primaryBusiness rounded-t-lg"></div>
              <div className="flex flex-col ml-20 p-10">
                <div className="mb-6">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    เลือกบัญชีธนาคาร
                  </label>
                </div>
                <div className="mb-6">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      name="discountOption"
                      className="radio radio-primary"
                      checked={!hasBank}
                      onChange={() => setHasHasBank(false)}
                    />
                    <span className="ml-2">ผูกบัญชีธนาคารไว้</span>
                    <input
                      type="radio"
                      name="discountOption"
                      className="radio radio-primary ml-4"
                      checked={hasBank}
                      onChange={() => setHasHasBank(true)}
                    />
                    <span className="ml-2">ยังไม่ได้ผูกบัญชีธนาคาร</span>
                  </div>
                </div>

                {hasBank && (
                  <>
                    <div className="">
                      <div className="flex items-center">
                        <div className="flex w-full">
                          <select className="select select-bordered w-full bg-white">
                            <option disabled selected>
                              เลือกธนาคาร
                            </option>
                            <option>กสิกร</option>
                            <option>ออมสิน</option>
                            <option>กรุงไทย</option>
                            <option>ไทยพาณิชย์</option>
                            <option>กรุงเทพ</option>
                          </select>
                        </div>
                      </div>
                      <div className="mt-4 ">
                          <p>เลขที่บัญชี</p>  
                        <div className="flex mt-3 ">
                          <input
                            type="text"
                            placeholder="กรอกเลขหมายบัญชี"
                            className="shadow-boxShadow border-whiteSmoke rounded-l-lg w-full"
                          />
                        </div>
                      </div>
                       <div className="flex flex-row mt-4 w-full">
                        <div className="flex flex-col w-[50%]">
                          <div className="label">
                            <span className="label-text">ชื่อ</span>
                          </div>
                          <input
                            type="number"
                            placeholder="กรอกเลขหมายบัญชี"
                            className="shadow-boxShadow border-whiteSmoke rounded-lg  "
                          />
                        </div>
                        <div className="flex flex-col ml-4 w-[50%]">
                        <div className="label">
                            <span className="label-text">นามสกุล</span>
                          </div>
                          <input
                            type="number"
                            placeholder="กรอกเลขหมายบัญชี"
                            className="shadow-boxShadow border-whiteSmoke rounded-lg "
                          />
                        </div>
                       </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };
  return (
    <div className="container-lg flex flex-wrap md:flex-wrap lg:flex-wrap xl:flex-nowrap  p-4">
      {/* Left Sidebar */}
      <div className="flex lg:justify-center w-full md:w-full lg:w-full xl:w-1/5 xl:h-[500px]">
        <div className="  bg-white mx-6 flex  rounded-md shadow-md p-4">
          <ul className="steps steps-horizontal md:steps-horizontal lg:steps-horizontal xl:steps-vertical">
            <li className={`step ${currentStep >= 1 ? "step-primary" : ""}`}>
              ข้อมูลพื้นฐาน
            </li>
            <li className={`step ${currentStep >= 2 ? "step-primary" : ""}`}>
              สถานที่
            </li>
            <li className={`step ${currentStep >= 3 ? "step-primary" : ""}`}>
              รายละเอียดที่พัก
            </li>
            <li className={`step ${currentStep >= 4 ? "step-primary" : ""}`}>
              การตั้งค่าการจอง
            </li>
            <li className={`step ${currentStep >= 5 ? "step-primary" : ""}`}>
              ราคา
            </li>
            <li className={`step ${currentStep >= 6 ? "step-primary" : ""}`}>
              ข้อกำหนด
            </li>
          </ul>
        </div>
      </div>
      {/* Main Form Section */}
      <main className="w-full md:w-full lg:w-full xl:w-4/5 p-6 bg-white rounded-md shadow-md ">
        <h1 className="text-2xl font-semibold mb-4">
          สร้างที่พักของท่านที่เหมาะสม
        </h1>
        {pageSwitch()}

        <div className=" mt-4">
          {currentStep <= 1 ? (
            <div className="flex justify-end items-center">
              <button className="btn btn-primary" onClick={handleNextClick}>
                Next
              </button>
            </div>
          ) : currentStep >= 6 ? (
            <div className="flex justify-start items-center">
              <button className="btn btn-primary" onClick={handlePreviousClick}>
                Previous
              </button>
            </div>
          ) : (
            <div className="flex justify-between items-center">
              <button className="btn btn-primary" onClick={handlePreviousClick}>
                Previous
              </button>

              <button className="btn btn-primary" onClick={handleNextClick}>
                Next
              </button>
            </div>
          )}
        </div>
        {/* Updated from w-3/4 to w-2/3 */}
      </main>
    </div>
  );
};

export default createHomeStay;
