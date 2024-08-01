import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { RxExit } from "react-icons/rx";
import { IoRemoveOutline } from "react-icons/io5";
import { IoPeopleSharp } from "react-icons/io5";
import { LiaChildSolid } from "react-icons/lia";
import { MdFamilyRestroom } from "react-icons/md";
import { MdFilterList } from "react-icons/md";
import { useLocation } from "react-router-dom";
import axiosPublic from "../../hook/axiosPublic";
import CardHomeStay from "../../components/Card-Search-HomeStay";
import CardPackage from "../../components/Card-Search-Package";

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
  name_homeStay?: string;
  price_package?: number;
  price_homestay?: number;
  type_homestay?: string;
}

const SearchResult: React.FC = () => {
  const location = useLocation();
  const dataSearch = location.state?.dataSearch;

  const [isPackage, setIsPackage] = useState<boolean>(false);
  const [showCalendar, setShowCalendar] = useState<boolean>(false);
  const [dateRange, setDateRange] = useState<Date[]>([
    new Date(dataSearch?.dateRange.startDate_Time ?? null),
    new Date(dataSearch?.dateRange.endDate_Time ?? null),
  ]);
  const [selectedDays, setSelectedDays] = useState<number>(0);
  const [showPeopleMenu, setShowPeopleMenu] = useState<boolean>(false);
  const [numPeople, setNumPeople] = useState<number>(
    dataSearch?.numPeople ?? 0
  );
  const [numChildren, setNumChildren] = useState<number>(
    dataSearch?.numChildren ?? 0
  );
  const [showFilterMenu, setShowFilterMenu] = useState<boolean>(false);
  const [dataHomeStays, setDataHomeStays] = useState<Item[]>([]);
  const [dataPackage, setDataPackage] = useState<Item[]>([]);

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  useEffect(() => {
    const dayAfterTomorrow = new Date(today);
    dayAfterTomorrow.setDate(today.getDate() + 2);

    setDateRange([tomorrow, dayAfterTomorrow]);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseHomestay = await axiosPublic.get("/homestay");
        const responsePackage = await axiosPublic.get("/package");

        const dataHomestay = await responseHomestay.data;
        const dataPackage = await responsePackage.data;
        const searchMessage = await dataSearch;

        const filteredResultsHomestay = dataHomestay.filter(
          (item: Item) =>
            item.name_homeStay
              ?.toLowerCase()
              .includes(searchMessage.searchText.toLowerCase()) ?? false
        );

        const filteredResultsPackage = dataPackage.filter(
          (item: Item) =>
            item.name_package
              ?.toLowerCase()
              .includes(searchMessage.searchText.toLowerCase()) ?? false
        );

        setDataHomeStays(filteredResultsHomestay);
        setDataPackage(filteredResultsPackage);
      } catch (error) {
        console.log("Error fetching data:", error);
      }
    };

    fetchData();
  }, [dataSearch, dataHomeStays, dataPackage]);

  const handleDateChange = (dates: Date[] | undefined | null) => {
    if (dates !== null && dates !== undefined) {
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
    const day = date.getDate().toString().padStart(2, "0");
    const month = date.toLocaleString("th-TH", { month: "long" });
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
    if (showFilterMenu) {
      setShowFilterMenu(false);
    }
  };

  const toggleCalendar = () => {
    setShowCalendar(!showCalendar);
    if (showPeopleMenu) {
      setShowPeopleMenu(false);
    }
    if (showFilterMenu) {
      setShowFilterMenu(false);
    }
  };

  const toggleFilterMenu = () => {
    setShowFilterMenu(!showFilterMenu);
    if (showCalendar) {
      setShowCalendar(false);
    }
    if (showPeopleMenu) {
      setShowPeopleMenu(false);
    }
  };

  const handleFilterClick = (filter: string) => {
    console.log(filter);
    setShowFilterMenu(false);
  };

  const clickToPackage = () => {
    setIsPackage(true);
  };

  const clickToHome = () => {
    setIsPackage(false);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      <div id="main-search" className="w-full my-5">
        <div className="flex items-center justify-center w-full shadow-lg rounded-[10px]">
          <button
            id="button-homestaySearch-Select"
            className={
              !isPackage
                ? "bg-gradient-to-r from-primaryUser to-primaryBusiness text-white p-2 rounded-tl-[10px] rounded-bl-[10px] w-full"
                : "bg-white text-dark p-2 rounded-tr-[10px] rounded-br-[10px] w-full"
            }
            onClick={clickToHome}
          >
            ที่พัก
          </button>
          <button
            id="button-homestaySearch-noSelect"
            className={
              !isPackage
                ? "bg-white text-dark p-2 rounded-tr-[10px] rounded-br-[10px] w-full"
                : "bg-gradient-to-r from-primaryUser to-primaryBusiness text-white p-2 rounded-tr-[10px] rounded-br-[10px] w-full"
            }
            onClick={clickToPackage}
          >
            แพ็คเกจ
          </button>
        </div>
        <div id="header">
          <div className="flex flex-col items-center justify-center mt-4 sm:flex-row sm:justify-between w-full">
            <div className="relative w-full mb-5">
              <button
                id="people-buttonPackage"
                className="bg-white text-dark rounded-[10px] p-2 mb-2 sm:mb-0 w-full h-[5rem] sm:w-[16rem] shadow-md"
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
                  <div className="absolute z-10 mt-2 bg-white text-darkmode-oneColor shadow-lg p-4 w-full rounded-[1.25rem] rounded-tl-[0rem]">
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
            <div className="mx-14" />
            <div className="relative w-full mb-5 flex flex-col items-center justify-center">
              <button
                id="date-buttonHomstay"
                className="bg-white text-dark rounded-[10px] p-2 mb-2 sm:mb-0 w-full h-[5rem] sm:w-[23rem] shadow-md"
                onClick={toggleCalendar}
              >
                {dateRange[0] && dateRange[1] ? (
                  <span className="flex items-center justify-center font-bold relative">
                    <RxExit className="w-5 h-5 mr-3" />
                    {formatDate(dateRange[0])}
                    <IoRemoveOutline className="w-5 h-5 mx-3 rotate-90" />
                    {formatDate(dateRange[1])}
                    <RxExit className="w-5 h-5 ml-3 transform -scale-x-100" />
                  </span>
                ) : (
                  <span className="font-bold flex items-center justify-center">
                    <RxExit className="w-5 h-5 mr-3" />
                    วันที่เช็คอิน - เช็คเอาท์
                  </span>
                )}
              </button>
              {showCalendar && (
                <div className="flex items-start justify-center">
                  <div className="absolute z-10 mt-2 bg-white text-darkmode-oneColor shadow-lg p-4 w-full rounded-[1.25rem]">
                    <div className="flex items-center justify-center">
                      <Calendar
                        onChange={(dates) => {
                          if (dates) {
                            handleDateChange(dates as Date[]);
                          }
                        }}
                        value={[dateRange[0], dateRange[1]]}
                        selectRange={true}
                        minDate={tomorrow}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="mx-14" />
            <div className="relative w-full mb-5">
              <button
                id="filter-buttonPackage"
                className="bg-white text-dark rounded-[10px] p-2 mb-2 sm:mb-0 w-full h-[5rem] sm:w-[16rem] shadow-md"
                onClick={toggleFilterMenu}
              >
                <span className="flex items-center justify-center font-bold">
                  <MdFilterList className="w-5 h-5 mr-3" />
                  <span>Filter</span>
                </span>
              </button>
              {showFilterMenu && (
                <div className="flex items-start justify-center">
                  <div className="absolute z-10 mt-2 bg-white text-darkmode-oneColor shadow-lg p-4 w-full rounded-[1.25rem] rounded-tr-[0rem]">
                    <div className="flex flex-col items-start">
                      <button
                        className="w-full text-left p-2 hover:bg-gray-100 rounded"
                        onClick={() =>
                          handleFilterClick("เรียงตามราคาสูงไปน้อย")
                        }
                      >
                        เรียงตามราคาสูงไปน้อย
                      </button>
                      <button
                        className="w-full text-left p-2 hover:bg-gray-100 rounded"
                        onClick={() =>
                          handleFilterClick("เรียงตามราคาน้อยไปสูง")
                        }
                      >
                        เรียงตามราคาน้อยไปสูง
                      </button>
                      <button
                        className="w-full text-left p-2 hover:bg-gray-100 rounded"
                        onClick={() =>
                          handleFilterClick("เรียงตามดาวสูงไปน้อย")
                        }
                      >
                        เรียงตามดาวสูงไปน้อย
                      </button>
                      <button
                        className="w-full text-left p-2 hover:bg-gray-100 rounded"
                        onClick={() =>
                          handleFilterClick("เรียงตามดาวน้อยไปสูง")
                        }
                      >
                        เรียงตามดาวน้อยไปสูง
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center w-full h-full">
          {isPackage ? (
            <div className="w-full">
              {dataPackage.length > 0 ? (
                <>
                  {dataPackage.map((item, index) => (
                    <div key={index} className="w-full">
                      <CardPackage item={item} />
                    </div>
                  ))}
                </>
              ) : (
                <div className="flex justify-center">
                  <span>ไม่มีข้อมูล</span>
                </div>
              )}
            </div>
          ) : (
            <div className="w-full">
              {dataHomeStays.length > 0 ? (
                <>
                  {dataHomeStays.map((item, index) => (
                    <div key={index} className="w-full">
                      <CardHomeStay item={item} />
                    </div>
                  ))}
                </>
              ) : (
                <div className="flex justify-center">
                  <span>ไม่มีข้อมูล</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchResult;
