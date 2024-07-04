import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { RxExit } from "react-icons/rx";
import { IoRemoveOutline } from "react-icons/io5";
import { IoPeopleSharp } from "react-icons/io5";
import { LiaChildSolid } from "react-icons/lia";
import { MdFamilyRestroom } from "react-icons/md";

const Search: React.FC = () => {
  const [isPackage, setIsPackage] = useState<boolean>(false);
  const [showCalendar, setShowCalendar] = useState<boolean>(false);
  const [dateRange, setDateRange] = useState<Date[]>([new Date() , new Date()]);
  const [selectedDays, setSelectedDays] = useState<number>(0);
  const [showPeopleMenu, setShowPeopleMenu] = useState<boolean>(false);
  const [numPeople, setNumPeople] = useState<number>(0);
  const [numChildren, setNumChildren] = useState<number>(0);

  console.log(selectedDays);   

  const handleDateChange = (dates: Date[] | undefined | null) => { 
    if(dates !== null && dates !== undefined){
      const filteredDates = dates.filter((date): date is Date => date !== null);
      if (filteredDates.length === 2) {
        setDateRange(filteredDates);
        const diffTime = Math.abs(
          filteredDates[1].getTime() - filteredDates[0].getTime()
        );
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        setSelectedDays(diffDays);
        setShowCalendar(false);
      }
    }
  };
  

  const formatDate = (date: Date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = date.toLocaleString('th-TH', { month: 'long' });
    const buddhistYear = date.getFullYear() + 543;
    const shortYear = buddhistYear.toString().slice(-2);
  
    return `${day} ${month} ${shortYear}`;
  };

  const handleDecreasePeople = () => {
    if (numPeople > 0) {
      setNumPeople(numPeople - 1);
    }
  };
  
  const handleIncreasePeople = () => {
    setNumPeople(numPeople + 1);
  };

  const handleDecreaseChildren = () => {
    if (numChildren > 0) {
      setNumChildren(numChildren - 1);
    }
  };

  const handleIncreaseChildren = () => {
    setNumChildren(numChildren + 1);
  };

  const togglePeopleMenu = () => {
    setShowPeopleMenu(!showPeopleMenu);
    if (showCalendar) {
      setShowCalendar(false);
    }
  };

  const toggleCalendar = () => {
    setShowCalendar(!showCalendar);
    if (showPeopleMenu) {
      setShowPeopleMenu(false);
    }
  };

  const clickToPackage = () => {
    setIsPackage(true);
  };

  const clickToHome = () => {
    setIsPackage(false);
  };

  return (
    <div className="mx-auto">
      {isPackage === false && (
        <div className="relative bg-white bg-opacity-50 p-6 rounded-[20px] w-[full] h-full flex flex-col items-center justify-center shadow-lg">
        <div className="flex items-center justify-center w-full shadow-lg rounded-[10px]">
          <button
            className="bg-gradient-to-r from-primaryUser to-primaryBusiness text-white p-2 rounded-tl-[10px] rounded-bl-[10px] w-full"
            onClick={clickToHome}
          >
            ที่พัก
          </button>
          <button
            className="bg-white text-dark p-2 rounded-tr-[10px] rounded-br-[10px] w-full"
            onClick={clickToPackage}
          >
            แพ็คเกจ
          </button>
        </div>
        <div className="w-full h-1 my-5 bg-gradient-to-r from-primaryUser to-primaryBusiness shadow-lg rounded-full" />
        <div className="flex items-center justify-center w-full relative">
          <input
            type="text"
            placeholder="ค้นหาที่พักที่สนใจ"
            className="bg-white text-dark p-2 mb-2 rounded-tl-[10px] rounded-bl-[10px] block h-[3.5rem] w-full"
          />
          <button className="bg-gradient-to-r from-primaryUser to-primaryBusiness p-2 mb-2 block text-white rounded-tr-[10px] rounded-br-[10px] w-40 h-[3.5rem]">
            ค้นหา
          </button>
        </div>
        <div className="flex flex-col items-center justify-center mt-4 sm:flex-row sm:justify-between w-full">
          <div className="relative w-full sm:w-[20rem] mb-5">
            <button
              className="bg-white text-dark rounded-[10px] p-2 mb-2 sm:mb-0 sm:mr-2 w-full h-[5rem]"
              onClick={togglePeopleMenu}
            >
              <span className="flex items-center justify-center font-bold">
                <MdFamilyRestroom className="w-5 h-5 mr-3" />
                <span>ผู้ใหญ่</span>
                <span className="mx-2">{numPeople}</span>
                <span className="mr-3">/</span>
                <span>เด็ก</span>
                <span className="mx-2">{numChildren}</span>
              </span>
            </button>
            {showPeopleMenu && (
              <div className="flex items-start justify-center">
                <div className="absolute z-10 mt-2 bg-white shadow-lg p-4 w-full">
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
              </div>
            )}
          </div>
          <div className="w-5" />
          <div className="relative w-full sm:w-auto mb-5">
            <button
              className="bg-white text-dark rounded-[10px] p-2 sm:w-[30rem] flex items-center justify-center h-[5rem]"
              onClick={toggleCalendar}
            >
              {dateRange[0] && dateRange[1] ? (
                <span className="flex items-center font-bold relative">
                  <RxExit className="w-5 h-5 mr-3" />
                  {formatDate(dateRange[0])}
                  <IoRemoveOutline className="w-5 h-5 mx-3 rotate-90" />
                  {formatDate(dateRange[1])}
                  <RxExit className="w-5 h-5 ml-3 transform -scale-x-100" />
                </span>
              ) : (
                "เลือกวันที่"
              )}
            </button>
            {showCalendar && (
              <div className="flex items-start justify-center">
                <div className="absolute z-10 mt-2 bg-white shadow-lg p-4 w-full">
                  <div className="flex items-center justify-center">
                    <Calendar
                      onChange={(dates) => {
                        if (dates) {
                          handleDateChange(dates as Date[]);
                        }
                      }}
                      value={[dateRange[0] , dateRange[1]]}
                      selectRange={true}
                      minDate={new Date()}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      )}
      {isPackage === true && (
        <div className="relative bg-white bg-opacity-50 p-6 rounded-[20px] w-[full] h-full flex flex-col items-center justify-center shadow-lg">
          <div className="flex items-center justify-center w-full shadow-lg rounded-[10px]">
            <button
              className="bg-white text-dark p-2 rounded-tl-[10px] rounded-bl-[10px] w-full"
              onClick={clickToHome}
            >
              ที่พัก
            </button>
            <button
              className="bg-gradient-to-r from-primaryUser to-primaryBusiness text-white p-2 rounded-tr-[10px] rounded-br-[10px] w-full"
              onClick={clickToPackage}
            >
              แพ็คเกจ
            </button>
          </div>
          <div className="w-full h-1 my-5 bg-gradient-to-r from-primaryUser to-primaryBusiness shadow-lg rounded-full" />
          <div className="flex items-center justify-center w-full relative">
            <input
              type="text"
              placeholder="ค้นหาแพ็คเกจที่สนใจ"
              className="bg-white text-dark p-2 mb-2 rounded-tl-[10px] rounded-bl-[10px] block h-[3.5rem] w-full"
            />
            <button className="bg-gradient-to-r from-primaryUser to-primaryBusiness p-2 mb-2 block text-white rounded-tr-[10px] rounded-br-[10px] w-40 h-[3.5rem]">
              ค้นหา
            </button>
          </div>
          <div className="flex flex-col items-center justify-center mt-4 sm:flex-row sm:justify-between w-full">
            <div className="relative w-full sm:w-[20rem] mb-5">
              <button
                className="bg-white text-dark rounded-[10px] p-2 mb-2 sm:mb-0 sm:mr-2 w-full h-[5rem]"
                onClick={togglePeopleMenu}
              >
                <span className="flex items-center justify-center font-bold">
                  <MdFamilyRestroom className="w-5 h-5 mr-3" />
                  <span>ผู้ใหญ่</span>
                  <span className="mx-2">{numPeople}</span>
                  <span className="mr-3">/</span>
                  <span>เด็ก</span>
                  <span className="mx-2">{numChildren}</span>
                </span>
              </button>
              {showPeopleMenu && (
                <div className="flex items-start justify-center">
                  <div className="absolute z-10 mt-2 bg-white shadow-lg p-4 w-full">
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
                </div>
              )}
            </div>
            <div className="w-5" />
            <div className="relative w-full sm:w-auto mb-5">
              <button
                className="bg-white text-dark rounded-[10px] p-2 sm:w-[30rem] flex items-center justify-center h-[5rem]"
                onClick={toggleCalendar}
              >
                {dateRange[0] && dateRange[1] ? (
                  <span className="flex items-center font-bold relative">
                    <RxExit className="w-5 h-5 mr-3" />
                    {formatDate(dateRange[0])}
                    <IoRemoveOutline className="w-5 h-5 mx-3 rotate-90" />
                    {formatDate(dateRange[1])}
                    <RxExit className="w-5 h-5 ml-3 transform -scale-x-100" />
                  </span>
                ) : (
                  "เลือกวันที่"
                )}
              </button>
              {showCalendar && (
                <div className="flex items-start justify-center">
                  <div className="absolute z-10 mt-2 bg-white shadow-lg p-4 w-full">
                    <div className="flex items-center justify-center">
                      <Calendar
                        onChange={(dates) => {
                          if (dates) {
                            handleDateChange(dates as Date[]);
                          }
                        }}
                        value={[dateRange[0] , dateRange[1]]}
                        selectRange={true}
                        minDate={new Date()}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;
