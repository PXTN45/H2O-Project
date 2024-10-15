import { useContext, useEffect, useState } from "react";
import { HomeStay } from "../../../type";
import axiosPrivateBusiness from "../../../hook/axiosPrivateBusiness";
import { AuthContext } from "../../../AuthContext/auth.provider";
import { IoHomeOutline } from "react-icons/io5";
import { GoShieldCheck } from "react-icons/go";
import { FaLocationDot, FaStar } from "react-icons/fa6";
import { FaRegStar, FaStarHalfAlt } from "react-icons/fa";
import { usePackageData } from "../../../AuthContext/packageData";

const DetailPackages = () => {
  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error("AuthContext must be used within an AuthProvider");
  }
  const { userInfo } = authContext;
  const { setHomestayID } = usePackageData();
  const [homestay, setHomestay] = useState<string>("");
  const [indexHomesaty, setIndex] = useState<number>(0);
  const [myHomestay, setMyHomestay] = useState<HomeStay[]>([]);

  const fetchData = async () => {
    try {
      const response = await axiosPrivateBusiness.get(
        `/business-homestay/${userInfo?._id}`
      );
      if (response.data) {
        setMyHomestay(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchData();
  }, [homestay]);

  const handleCancellationChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setHomestay(event.target.value);
  };

  const [currentIndices, setCurrentIndices] = useState<number[]>([]);

  useEffect(() => {
    if (myHomestay.length > 0 && currentIndices.length === 0) {
      setCurrentIndices(myHomestay.map(() => 0));
    }
  }, [myHomestay, currentIndices]);

  const handlePrev = (index: number) => {
    setCurrentIndices((prevIndices) =>
      prevIndices.map((currentIndex, i) => {
        const imageRoomLength = myHomestay[i]?.image.length ?? 0;

        return i === index
          ? currentIndex === 0
            ? imageRoomLength - 1
            : currentIndex - 1
          : currentIndex;
      })
    );
  };

  const handleNext = (index: number) => {
    setCurrentIndices((prevIndices) =>
      prevIndices.map((currentIndex, i) => {
        const imageRoomLength = myHomestay[i]?.image.length ?? 0;

        return i === index
          ? currentIndex === imageRoomLength - 1
            ? 0
            : currentIndex + 1
          : currentIndex;
      })
    );
  };

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (rating >= i) {
        stars.push(<FaStar key={i} />);
      } else if (rating >= i - 0.5) {
        stars.push(<FaStarHalfAlt key={i} />);
      } else {
        stars.push(<FaRegStar key={i} />);
      }
    }
    return stars;
  };
  const formatThaiDate = (date: Date): string => {
    const formatDate = new Date(date);
    return formatDate.toLocaleDateString("th-TH", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const OpenModal = () => {
    const modal = document.getElementById("my_homestay") as HTMLDialogElement;
    if (modal) {
      modal.showModal();
    }
  };

  const selectHomeStay = (index: number) => {
    setHomestay(myHomestay[index]?.business_user[0]);
    setIndex(index);
    setHomestayID(myHomestay[index]?.business_user[0])
    const modal = document.getElementById("my_homestay") as HTMLDialogElement;
    if (modal) {
      modal.close();
    }
  };
  return (
    <div className="w-full  flex justify-center">
      <div className="w-full mb-20">
        <dialog id="my_homestay" className="modal">
          <div className="modal-box w-11/12 max-w-5xl">
            <form method="dialog">
              {myHomestay.length < 0 && (
                <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                  ✕
                </button>
              )}
            </form>
            <h3 className="font-bold text-lg">เลือกที่พักของคุณจากระบบ</h3>
            <div>
              {myHomestay?.map((homestay: any, index) => (
                <div
                  key={index}
                  className="px-0 xl:px-10 hover:scale-101"
                  onClick={() => selectHomeStay(index)}
                >
                  <div className="w-full my-5 shadow-boxShadow rounded-xl flex gap-2 flex-wrap xl:flex-nowrap">
                    <div className="w-full lg:h-full xl:w-1/3 rounded-l-lg ">
                      <div
                        id={`carousel-${index}`}
                        className="relative w-full shadow-boxShadow rounded-xl"
                        data-carousel="slide"
                      >
                        <div className="relative h-60 rounded-lg">
                          {homestay.image.map(
                            (image: any, imageIndex: number) => (
                              <div
                                key={imageIndex}
                                className={`duration-700 ease-in-out ${
                                  currentIndices[index] === imageIndex
                                    ? "block"
                                    : "hidden"
                                }`}
                                data-carousel-item
                              >
                                <img
                                  src={image.image_upload}
                                  className="absolute block w-full h-full object-cover rounded-xl"
                                  alt={`Slide ${imageIndex + 1}`}
                                />
                              </div>
                            )
                          )}
                          <button
                            type="button"
                            className="absolute top-0 left-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
                            onClick={() => handlePrev(index)}
                            data-carousel-prev
                          >
                            <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
                              <svg
                                className="w-4 h-4 text-white dark:text-gray-800 rtl:rotate-180"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 6 10"
                              >
                                <path
                                  stroke="currentColor"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M5 1 1 5l4 4"
                                />
                              </svg>
                              <span className="sr-only">Previous</span>
                            </span>
                          </button>
                          <button
                            type="button"
                            className="absolute top-0 right-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
                            onClick={() => handleNext(index)}
                            data-carousel-next
                          >
                            <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
                              <svg
                                className="w-4 h-4 text-white dark:text-gray-800 rtl:rotate-180"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 6 10"
                              >
                                <path
                                  stroke="currentColor"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="m1 9 4-4-4-4"
                                />
                              </svg>
                              <span className="sr-only">Next</span>
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="pl-10 pt-5 md:pr-5 xl:p-2 flex flex-col xl:flex-row w-full xl:w-2/3">
                      <div className=" xl:w-4/6 pr-2 flex flex-col gap-5">
                        <div className="flex justify-between ">
                          <div className="flex flex-col w-full gap-2">
                            <span className="text-md font-bold flex items-start justify-between w-full gap-3">
                              {homestay?.name_homeStay}
                              <div className="flex items-center text-yellow-300">
                                {renderStars(homestay?.review_rating_homeStay)}
                                {homestay?.review_rating_homeStay}
                              </div>
                            </span>
                            <div className="flex flex-col">
                              <span className="flex items-center gap-2">
                                <IoHomeOutline />
                                ประเภทที่พัก
                              </span>
                              <div className="flex flex-col pl-6">
                                {homestay?.room_type.map(
                                  (roomType: any, i: number) => (
                                    <span key={i}>
                                      - {roomType.name_type_room}
                                    </span>
                                  )
                                )}
                              </div>
                            </div>
                            <div
                              id="location"
                              className=" flex md:items-center  gap-2"
                            >
                              <FaLocationDot className="text-red-600" />
                              <div className="flex flex-wrap text-sm gap-1">
                                <div>{homestay.location[0].house_no}</div>
                                <div>ม.{homestay.location[0].village_no}</div>
                                <div>
                                  ต.
                                  {homestay.location[0].subdistrict_location}
                                </div>
                                <div>
                                  อ.
                                  {homestay.location[0].district_location}
                                </div>
                                <div>
                                  จ.
                                  {homestay.location[0].province_location}
                                </div>
                                <div>
                                  {homestay.location[0].zipcode_location}
                                </div>
                              </div>
                            </div>
                            <div id="policy">
                              <span className="text-sm flex gap-2">
                                <div className="pt-2">
                                  <GoShieldCheck className="text-lg" />
                                </div>
                                {homestay?.policy_cancel_homeStay}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="xl:w-2/6 flex flex-col w-full xl:border-l p-1">
                        <div className="flex flex-col justify-between h-full w-full gap-2">
                          <div className="w-full text-xs flex justify-end opacity-50">
                            {homestay?.updatedAt ? (
                              <span>
                                อัปเดตเมื่อ{" "}
                                {formatThaiDate(homestay?.updatedAt)}
                              </span>
                            ) : homestay?.createdAt ? (
                              <span>
                                สร้างเมื่อ {formatThaiDate(homestay?.createdAt)}
                              </span>
                            ) : (
                              <div></div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </dialog>
        <div>
          <span className="text-lg">คุณมีที่พักหรือไม่</span>
        </div>
        <div className="mt-5 shadow-boxShadow h-full rounded-lg">
          <div className=" p-3 w-full bg-primaryBusiness rounded-t-lg"></div>
          <div className="p-5">
            <div>
              <input
                type="radio"
                name="selectHomestay"
                value=""
                className="radio radio-primary my-2"
                onChange={handleCancellationChange}
                defaultChecked
              />
              <span> ฉันไม่มีที่พักให้ลูกค้า</span>
            </div>
            <div>
              <input
                type="radio"
                name="selectHomestay"
                className="radio radio-primary"
                onClick={OpenModal}
              />
              <span> ฉันมีที่พักให้ลูกค้า</span>
            </div>
          </div>
          {homestay !== "" && (
            <div>
              <div className="px-0 xl:px-10 hover:scale-101">
                <div className="w-full my-5 shadow-boxShadow rounded-xl flex gap-2 flex-wrap xl:flex-nowrap">
                  <div className="w-full lg:h-full xl:w-1/3 rounded-l-lg ">
                    <div
                      id={`carousel`}
                      className="relative w-full shadow-boxShadow rounded-xl"
                      data-carousel="slide"
                    >
                      <div className="relative h-60 rounded-lg">
                        {myHomestay[indexHomesaty].image.map(
                          (image: any, imageIndex: number) => (
                            <div
                              key={imageIndex}
                              className={`duration-700 ease-in-out ${
                                currentIndices[indexHomesaty] === imageIndex
                                  ? "block"
                                  : "hidden"
                              }`}
                              data-carousel-item
                            >
                              <img
                                src={image.image_upload}
                                className="absolute block w-full h-full object-cover rounded-xl"
                                alt={`Slide ${imageIndex + 1}`}
                              />
                            </div>
                          )
                        )}
                        <button
                          type="button"
                          className="absolute top-0 left-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
                          onClick={() => handlePrev(indexHomesaty)}
                          data-carousel-prev
                        >
                          <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
                            <svg
                              className="w-4 h-4 text-white dark:text-gray-800 rtl:rotate-180"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 6 10"
                            >
                              <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M5 1 1 5l4 4"
                              />
                            </svg>
                            <span className="sr-only">Previous</span>
                          </span>
                        </button>
                        <button
                          type="button"
                          className="absolute top-0 right-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
                          onClick={() => handleNext(indexHomesaty)}
                          data-carousel-next
                        >
                          <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
                            <svg
                              className="w-4 h-4 text-white dark:text-gray-800 rtl:rotate-180"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 6 10"
                            >
                              <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="m1 9 4-4-4-4"
                              />
                            </svg>
                            <span className="sr-only">Next</span>
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="pl-10 pt-5 md:pr-5 xl:p-2 flex flex-col xl:flex-row w-full xl:w-2/3">
                    <div className=" xl:w-4/6 pr-2 flex flex-col gap-5">
                      <div className="flex justify-between ">
                        <div className="flex flex-col w-full gap-2">
                          <span className="text-md font-bold flex items-start justify-between w-full gap-3">
                            {myHomestay[indexHomesaty]?.name_homeStay}
                            <div className="flex items-center text-yellow-300">
                              {renderStars(myHomestay[indexHomesaty]?.review_rating_homeStay)}
                              {myHomestay[indexHomesaty]?.review_rating_homeStay}
                            </div>
                          </span>
                          <div className="flex flex-col">
                            <span className="flex items-center gap-2">
                              <IoHomeOutline />
                              ประเภทที่พัก
                            </span>
                            <div className="flex flex-col pl-6">
                              {myHomestay[indexHomesaty]?.room_type.map(
                                (roomType: any, i: number) => (
                                  <span key={i}>
                                    - {roomType.name_type_room}
                                  </span>
                                )
                              )}
                            </div>
                          </div>
                          <div
                            id="location"
                            className=" flex md:items-center  gap-2"
                          >
                            <FaLocationDot className="text-red-600" />
                            <div className="flex flex-wrap text-sm gap-1">
                              <div>{myHomestay[indexHomesaty].location[0].house_no}</div>
                              <div>ม.{myHomestay[indexHomesaty].location[0].village_no}</div>
                              <div>
                                ต.
                                {myHomestay[indexHomesaty].location[0].subdistrict_location}
                              </div>
                              <div>
                                อ.
                                {myHomestay[indexHomesaty].location[0].district_location}
                              </div>
                              <div>
                                จ.
                                {myHomestay[indexHomesaty].location[0].province_location}
                              </div>
                              <div>{myHomestay[indexHomesaty].location[0].zipcode_location}</div>
                            </div>
                          </div>
                          <div id="policy">
                            <span className="text-sm flex gap-2">
                              <div className="pt-2">
                                <GoShieldCheck className="text-lg" />
                              </div>
                              {myHomestay[indexHomesaty]?.policy_cancel_homeStay}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="xl:w-2/6 flex flex-col w-full xl:border-l p-1">
                      <div className="flex flex-col justify-between h-full w-full gap-2">
                        <div className="w-full text-xs flex justify-end opacity-50">
                          {myHomestay[indexHomesaty]?.updatedAt ? (
                            <span>
                              อัปเดตเมื่อ {formatThaiDate(myHomestay[indexHomesaty]?.updatedAt)}
                            </span>
                          ) : myHomestay[indexHomesaty]?.createdAt ? (
                            <span>
                              สร้างเมื่อ {formatThaiDate(myHomestay[indexHomesaty]?.createdAt)}
                            </span>
                          ) : (
                            <div></div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailPackages;
