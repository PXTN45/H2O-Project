import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const Search: React.FC = () => {
  const [isPackage, setIsPackage] = useState<boolean>(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [dateRange, setDateRange] = useState([new Date(), new Date()]);
  const [selectedDays, setSelectedDays] = useState(0);
  const [showPeopleMenu, setShowPeopleMenu] = useState(false);
  const [numPeople, setNumPeople] = useState(1);

  const handleDateChange = (dates) => {
    setDateRange(dates);
    if (dates[0] && dates[1]) {
      const diffTime = Math.abs(dates[1] - dates[0]);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setSelectedDays(diffDays);
      setShowCalendar(false); // ซ่อนปฏิทินเมื่อเลือกวันที่แล้ว

      // Log the selected dates
      console.log(
        `Start Date: ${dates[0].getDate()}-${
          dates[0].getMonth() + 1
        }-${dates[0].getFullYear()}`
      );
      console.log(
        `End Date: ${dates[1].getDate()}-${
          dates[1].getMonth() + 1
        }-${dates[1].getFullYear()}`
      );
    }
  };

  const handleIncreasePeople = () => {
    setNumPeople(numPeople + 1);
  };

  const handleDecreasePeople = () => {
    if (numPeople > 1) {
      setNumPeople(numPeople - 1);
    }
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
        <div className="relative bg-white bg-opacity-50 p-6 rounded-[20px] w-[50vw] h-[35vh] flex flex-col items-center justify-center shadow-lg">
          <div className="flex items-center justify-between mt-4">
            <div className="relative">
              <button
                className="bg-gradient-to-r from-primaryUser to-primaryBusiness text-white p-2 mr-2 rounded-[15px]"
                onClick={clickToHome}
              >
                ที่พัก
              </button>
            </div>
            <div className="relative">
              <button
                className="bg-white text-black p-2 rounded-[15px]"
                onClick={clickToPackage}
              >
                แพ็คเกจ
              </button>
            </div>
          </div>
          <hr className="w-full my-5 border-t-2 border-white shadow-lg" />
          <div className="flex items-center justify-center">
            <input
              type="text"
              placeholder="Search..."
              className="bg-white text-black p-2 mb-2 rounded-tl-[10px] rounded-bl-[10px] block w-[25vw] relative"
            />
            <button className="bg-gradient-to-r from-primaryUser to-primaryBusiness text-black p-2 mb-2 block text-white rounded-tr-[10px] rounded-br-[10px]">
              ค้นหา
            </button>
          </div>
          <div className="flex items-center justify-between mt-4">
            <button className="bg-white text-black rounded-[10px] p-2 mr-2">
              Select People
            </button>
            <button className="bg-white text-black rounded-[10px] p-2">
              Select Calendar
            </button>
          </div>
        </div>
      )}
      {isPackage === true && (
        <div className="relative bg-white bg-opacity-50 p-6 rounded-[20px] w-[50vw] h-[35vh] flex flex-col items-center justify-center shadow-lg">
          <div className="flex items-center justify-between mt-4">
            <div className="relative">
              <button
                className="bg-white text-black p-2 mr-2 rounded-[15px]"
                onClick={clickToHome}
              >
                ที่พัก
              </button>
            </div>
            <div className="relative">
              <button
                className="bg-gradient-to-r from-primaryUser to-primaryBusiness text-white p-2 rounded-[15px]"
                onClick={clickToPackage}
              >
                แพ็คเกจ
              </button>
            </div>
          </div>
          <hr className="w-full my-5 border-t-2 border-white shadow-lg" />
          <div className="flex items-center justify-center">
            <input
              type="text"
              placeholder="Search..."
              className="bg-white text-black p-2 mb-2 rounded-tl-[10px] rounded-bl-[10px] block w-[25vw] relative"
            />
            <button className="bg-gradient-to-r from-primaryUser to-primaryBusiness text-black p-2 mb-2 block text-white rounded-tr-[10px] rounded-br-[10px]">
              ค้นหา
            </button>
          </div>
          <div className="flex flex-col items-center justify-center mt-4 sm:flex-row sm:justify-between">
            <div className="relative w-full sm:w-auto">
              <button
                className="bg-white text-dark rounded-[10px] p-2 mb-2 sm:mb-0 sm:mr-2 w-full sm:w-auto"
                onClick={togglePeopleMenu}
              >
                {`Select ${numPeople} ${numPeople === 1 ? "Person" : "People"}`}
              </button>
              {showPeopleMenu && (
                <div className="absolute z-10 mt-2 left-0 right-0 sm:right-auto sm:left-auto sm:mt-0 sm:ml-2 bg-white shadow-lg rounded-lg p-4 flex flex-col items-center">
                  <div className="flex items-center">
                    <button
                      className="bg-primaryBusiness rounded-full p-2 mr-4"
                      onClick={handleDecreasePeople}
                    >
                      -
                    </button>
                    <span className="text-lg">{numPeople}</span>
                    <button
                      className="bg-primaryUser rounded-full p-2 ml-4"
                      onClick={handleIncreasePeople}
                    >
                      +
                    </button>
                  </div>
                </div>
              )}
            </div>
            <div className="relative w-full sm:w-auto">
              <button
                className="bg-white text-dark rounded-[10px] p-2 w-full sm:w-auto"
                onClick={toggleCalendar}
              >
                {selectedDays > 0
                  ? `Selected ${selectedDays} days`
                  : "Select Calendar"}
              </button>
              {showCalendar && (
                <div className="flex items-start justify-center mt-2">
                  <div className="absolute z-10">
                    <Calendar
                      onChange={handleDateChange}
                      value={dateRange}
                      selectRange={true}
                    />
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
