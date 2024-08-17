import React, { useState } from "react";
import { MdFamilyRestroom } from "react-icons/md";
import { IoPeopleSharp, IoRemoveOutline } from "react-icons/io5";
import { LiaChildSolid } from "react-icons/lia";
import { RxExit } from "react-icons/rx";
import Calendar from "react-calendar";

const Navbar = () => {
    const [showPeopleMenu, setShowPeopleMenu] = useState(false);
    const [showCalendar, setShowCalendar] = useState(false);
    const [numPeople, setNumPeople] = useState(1);
    const [numChildren, setNumChildren] = useState(0);
    const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
  
    const togglePeopleMenu = () => {
      setShowPeopleMenu(!showPeopleMenu);
      setShowCalendar(false); // ปิด Calendar ถ้า People Menu เปิด
    };
  
    const toggleCalendar = () => {
      setShowCalendar(!showCalendar);
      setShowPeopleMenu(false); // ปิด People Menu ถ้า Calendar เปิด
    };
  
    const handleDecreasePeople = () => setNumPeople(numPeople > 1 ? numPeople - 1 : 1);
    const handleIncreasePeople = () => setNumPeople(numPeople + 1);
    const handleDecreaseChildren = () => setNumChildren(numChildren > 0 ? numChildren - 1 : 0);
    const handleIncreaseChildren = () => setNumChildren(numChildren + 1);
    const handleDateChange = (dates: Date[]) => setDateRange(dates as [Date | null, Date | null]);
  
    return (
      <nav className="bg-white-frosted sticky top-0 left-0 w-full z-40 shadow-boxShadow rounded-lg">
        <div className="flex flex-col items-center justify-between xl:flex-row w-full">
          {/* People Button */}
          <div className="relative w-full flex justify-start">
            <button
              id="people-buttonPackage"
              className="text-xs sm:text-sm p-1 sm:p-2 mb-2 sm:mb-0 w-full h-[4rem] sm:h-[4rem]"
              onClick={togglePeopleMenu}
            >
              <span className="flex items-center justify-center font-bold">
                <MdFamilyRestroom className="w-4 h-4 mr-2 sm:mr-3" />
                <span>ผู้ใหญ่</span>
                <span className="mx-1 sm:mx-2">{numPeople}</span>
                <span className="mr-2 sm:mr-3">/</span>
                <span>เด็ก</span>
                <span className="mx-1 sm:mx-2">{numChildren}</span>
              </span>
            </button>
            {showPeopleMenu && (
              <div className="absolute left-0 z-10 mt-[4.5rem] semi-bg shadow-2xl p-4 w-full rounded-[1.25rem] rounded-tl-[0rem]">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <IoPeopleSharp className="w-5 h-5 mr-5" />
                    <span className="w-5 h-5">ผู้ใหญ่</span>
                  </div>
                  <div>
                    <button
                      className="text-primaryBusiness rounded-full p-2 mr-2"
                      onClick={handleDecreasePeople}
                    >
                      -
                    </button>
                    <span className="text-lg">{numPeople}</span>
                    <button
                      className="text-primaryUser rounded-full p-2 ml-2"
                      onClick={handleIncreasePeople}
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <LiaChildSolid className="w-5 h-5 mr-5" />
                    <span className="w-5 h-5">เด็ก</span>
                  </div>
                  <div>
                    <button
                      className="text-primaryBusiness rounded-full p-2 mr-2"
                      onClick={handleDecreaseChildren}
                    >
                      -
                    </button>
                    <span className="text-lg">{numChildren}</span>
                    <button
                      className="text-primaryUser rounded-full p-2 ml-2"
                      onClick={handleIncreaseChildren}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
          {/* Date Button */}
          <div className="relative w-full flex justify-center">
            <button
              id="date-buttonHomstay"
              className="text-xs sm:text-sm p-1 sm:p-2 mb-2 sm:mb-0 w-full h-[4rem] sm:h-[4rem]"
              onClick={toggleCalendar}
            >
              {dateRange[0] && dateRange[1] ? (
                <span className="flex items-center justify-center font-bold relative">
                  <RxExit className="w-4 h-4 mr-2 sm:mr-3" />
                  {formatDate(dateRange[0])}
                  <IoRemoveOutline className="w-4 h-4 mx-1 sm:mx-3 rotate-90" />
                  {formatDate(dateRange[1])}
                  <RxExit className="w-4 h-4 ml-2 sm:ml-3 transform -scale-x-100" />
                </span>
              ) : (
                <span className="font-bold flex items-center justify-center">
                  <RxExit className="w-4 h-4 mr-2 sm:mr-3" />
                  วันที่เช็คอิน - เช็คเอาท์
                </span>
              )}
            </button>
            {showCalendar && (
              <div className="absolute z-10 mt-[4.5rem] left-0 right-0 semi-bg text-dark shadow-lg p-4 w-full rounded-[1.25rem] rounded-tr-[0rem]">
                <div className="flex items-center justify-center">
                  <Calendar
                    onChange={(dates) => {
                      if (dates) {
                        handleDateChange(dates as Date[]);
                      }
                    }}
                    value={[dateRange[0], dateRange[1]]}
                    selectRange={true}
                    minDate={new Date()}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>
    );
  };
  

export default Navbar;
