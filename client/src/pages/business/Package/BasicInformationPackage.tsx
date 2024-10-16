import React, { useEffect, useState } from "react";
import { IoIosAddCircleOutline, IoMdClose } from "react-icons/io";
import { IoTrashBin } from "react-icons/io5";
import { usePackageData } from "../../../AuthContext/packageData";
import DetailPackages from "./DetailPackages";
import { values } from "lodash";

interface Activity {
  activity_name: string;
}

interface ActivityDays {
  activity_days: Activity[];
}

const BasicInformationPackage = () => {
  const { setPackageData } = usePackageData();
  const [selectedId, setSelectedId] = useState<string | null>(
    "การท่องเที่ยวธรรมชาติ"
  );
  const [activityPackages, setActivityPackages] = useState<ActivityDays[]>([]);
  const [newActivities, setNewActivities] = useState<string[]>([]);
  const [packageName, setPackageName] = useState<string>("");
  const [maxTourists, setMaxTourists] = useState<number>(1);
  const [description, setDescription] = useState<string>("");
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [cancellationPolicy, setCancellationPolicy] = useState<string>(
    "ยกเลิกมากกว่า 7 วันล่วงหน้า ลูกค้าจะได้รับ คืนเงิน 100% ของจำนวนเงินที่ชำระ"
  );
  const [isChildren, setIsChildren] = useState<boolean>(true);
  const [isFood, setIsFood] = useState<boolean>(true);

  useEffect(() => {
    const storedSelectedId = localStorage.getItem("selectedId");
    const storedPackageName = localStorage.getItem("packageName");
    const storedMaxTourists = localStorage.getItem("maxTourists");
    const storedIsChildren = localStorage.getItem("isChildren");
    const storedIsFood = localStorage.getItem("isFood");
    const storedStartDate = localStorage.getItem("startDate");
    const storedEndDate = localStorage.getItem("endDate");
    const storedDescription = localStorage.getItem("description");
    const storedPackages = localStorage.getItem("activityPackages");
    const storedActivities = localStorage.getItem("newActivities");
    const storedCancellationPolicy = localStorage.getItem("cancellationPolicy");

    if (storedSelectedId) {
      setSelectedId(JSON.parse(storedSelectedId));
    }
    if (storedPackageName) {
      setPackageName(JSON.parse(storedPackageName));
    }
    if (storedMaxTourists) {
      setMaxTourists(JSON.parse(storedMaxTourists));
    }
    if (storedIsChildren) {
      setIsChildren(JSON.parse(storedIsChildren));
    }
    if (storedIsFood) {
      setIsFood(JSON.parse(storedIsFood));
    }
    if (storedStartDate) {
      const date = new Date(JSON.parse(storedStartDate));
      setStartDate(date);
    }
    if (storedEndDate) {
      const date = new Date(JSON.parse(storedEndDate));
      setEndDate(date);
    }
    if (storedDescription) {
      setDescription(JSON.parse(storedDescription));
    }

    if (storedPackages) {
      setActivityPackages(JSON.parse(storedPackages));
    }

    if (storedActivities) {
      setNewActivities(JSON.parse(storedActivities));
    }

    if (storedCancellationPolicy) {
      setCancellationPolicy(JSON.parse(storedCancellationPolicy));
    }
  }, []);

  const handleCancellationChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    setCancellationPolicy(value);
    localStorage.setItem("cancellationPolicy", JSON.stringify(value));
  };

  const handleSelect = (id: string) => {
    setSelectedId(id);
    localStorage.setItem("selectedId", JSON.stringify(id));
  };

  const addDay = () => {
    // เพิ่มวันใหม่
    setActivityPackages([...activityPackages, { activity_days: [] }]);
    setNewActivities([...newActivities, ""]);
  };

  const removeDay = (index: number) => {
    // ลบวัน
    const updatedPackages = activityPackages.filter((_, i) => i !== index);
    const updatedActivities = newActivities.filter((_, i) => i !== index);
    setActivityPackages(updatedPackages);
    setNewActivities(updatedActivities);
  };

  const handleActivityChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    // อัปเดตกิจกรรมใหม่ที่กำลังจะเพิ่ม
    const updatedActivities = [...newActivities];
    updatedActivities[index] = event.target.value;
    setNewActivities(updatedActivities);
  };

  const addActivity = (index: number) => {
    // เพิ่มกิจกรรมใหม่ในวันนั้น ๆ
    if (newActivities[index].trim()) {
      const updatedPackages = [...activityPackages];
      updatedPackages[index].activity_days.push({
        activity_name: newActivities[index],
      });
      setActivityPackages(updatedPackages);
      setNewActivities((prev) => {
        const newActivitiesCopy = [...prev];
        newActivitiesCopy[index] = ""; // เคลียร์ input หลังเพิ่มกิจกรรม
        return newActivitiesCopy;
      });
    }
  };

  const removeActivity = (dayIndex: number, activityIndex: number) => {
    // ลบกิจกรรมในวันนั้น
    const updatedPackages = [...activityPackages];
    updatedPackages[dayIndex].activity_days.splice(activityIndex, 1);
    setActivityPackages(updatedPackages);
  };

  useEffect(() => {
    localStorage.setItem("activityPackages", JSON.stringify(activityPackages));
    localStorage.setItem("newActivities", JSON.stringify(newActivities));
  }, [activityPackages, newActivities]);

  const handleStartDateChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedDate = new Date(event.target.value);
    setStartDate(selectedDate);
    localStorage.setItem("startDate", JSON.stringify(selectedDate));
  };

  const handleEndDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = new Date(event.target.value);
    setEndDate(selectedDate);
    localStorage.setItem("endDate", JSON.stringify(selectedDate));
  };

  useEffect(() => {
    const packageData = {
      name_package: packageName,
      type_package: selectedId || "",
      max_people: maxTourists || 0,
      detail_package: description,
      time_start_package: startDate ?? new Date(),
      time_end_package: endDate ?? new Date(),
      activity_package: activityPackages,
      policy_cancel_package: cancellationPolicy,
      isChildren,
      isFood,
    };

    setPackageData(packageData);
    localStorage.setItem("packageData", JSON.stringify(packageData))
  }, [
    packageName,
    selectedId,
    maxTourists,
    description,
    startDate,
    endDate,
    activityPackages,
    cancellationPolicy,
    isChildren,
    isFood,
  ]);

  return (
    <div className="flex flex-col items-center ">
      <div id="namePackage" className="w-full my-5">
        <label className="form-control w-full">
          <div className="label">
            <span className="label-text">ตั้งชื่อที่แพ็คเกจของท่าน</span>
          </div>
          <input
            type="text"
            placeholder="ตั้งชื่อที่แพ็คเกจของท่าน"
            className="input input-bordered w-full"
            value={packageName}
            onChange={(e) => {
              setPackageName(e.target.value);
              localStorage.setItem(
                "packageName",
                JSON.stringify(e.target.value)
              );
            }}
          />
        </label>
      </div>
      <div id="typePackage" className="w-full my-5">
        <span>เลือกประเภทแพ็คเกจของท่าน</span>
        <div className="shadow-boxShadow w-full h-full mt-2 rounded-lg">
          <div>
            <div className="bg-primaryBusiness p-2 rounded-t-lg"></div>
            <div className="my-3 px-5">
              <span className="text-lg">ประเภทที่พัก</span>
            </div>
            <div className="flex items-center justify-center gap-5 p-5">
              {[
                "การท่องเที่ยวธรรมชาติ",
                "การท่องเที่ยวทางน้ำ",
                "การท่องเที่ยวเชิงวัฒนธรรม",
              ].map((type) => (
                <div
                  key={type}
                  onClick={() => handleSelect(type)}
                  className={`p-5 flex flex-col items-center shadow-boxShadow w-[200px] h-[200px] rounded-lg transition-all duration-300 ease-in-out cursor-pointer ${
                    selectedId === type ? "border-4 border-blue-500" : ""
                  }`}
                >
                  <div>
                    <img
                      className="object-cover w-[120px] h-[120px] hover:scale-110 transition-all duration-300 ease-in-out"
                      src={
                        type === "การท่องเที่ยวธรรมชาติ"
                          ? "https://firebasestorage.googleapis.com/v0/b/h2o-project-ts.appspot.com/o/Icon%2Fforest.gif?alt=media&token=aee73937-b5c8-42c1-8c52-c6edb8995260"
                          : type === "การท่องเที่ยวทางน้ำ"
                          ? "https://firebasestorage.googleapis.com/v0/b/h2o-project-ts.appspot.com/o/Icon%2Fwaterway.gif?alt=media&token=ac6af24b-4968-41af-b8c6-c1aa9954cef4"
                          : "https://firebasestorage.googleapis.com/v0/b/h2o-project-ts.appspot.com/o/Icon%2Fbangkok.gif?alt=media&token=5c5925d4-22b5-4a53-9cf7-0e124529d22c"
                      }
                      alt={
                        type === "การท่องเที่ยวธรรมชาติ"
                          ? "การท่องเที่ยวธรรมชาติ"
                          : type === "การท่องเที่ยวทางน้ำ"
                          ? "การท่องเที่ยวทางน้ำ"
                          : "การท่องเที่ยวเชิงวัฒนธรรม"
                      }
                    />
                  </div>
                  <div className="mt-5 text-sm">
                    <span>
                      {type === "การท่องเที่ยวธรรมชาติ"
                        ? "การท่องเที่ยวธรรมชาติ"
                        : type === "การท่องเที่ยวทางน้ำ"
                        ? "การท่องเที่ยวทางน้ำ"
                        : "การท่องเที่ยวเชิงวัฒนธรรม"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="w-full my-5">
        <div>
          <span>รายละเอียดของแพ็กเกจ</span>
        </div>
        <div className="shadow-boxShadow w-full h-full mt-2 rounded-lg">
          <div className="">
            <div className="bg-primaryBusiness p-2 rounded-t-lg"></div>
            <div className="flex p-5 gap-4">
              <div id="numberOfTourists" className="w-1/2 flex flex-col ">
                <label className="block text-gray-700 font-bold mb-2">
                  โปรดระบุจำนวน
                </label>
                <input
                  type="number"
                  placeholder="ระบุจำนวน"
                  className="border p-2 border-gray-300 rounded-md"
                  value={maxTourists}
                  onChange={(e) => {
                    setMaxTourists(Number(e.target.value));
                    localStorage.setItem(
                      "maxTourists",
                      JSON.stringify(Number(e.target.value))
                    );
                  }}
                />
                <div className="flex gap-5 mt-4">
                  <div>
                    <input
                      type="checkbox"
                      name="isChildren"
                      className="checkbox checkbox-primary"
                      checked={isChildren === true}
                      onChange={(e) => {
                        setIsChildren(e.target.checked);
                        localStorage.setItem(
                          "isChildren",
                          JSON.stringify(e.target.checked)
                        );
                      }}
                    />
                    <span> เด็กไม่เสียค่าใช้จ่าย </span>
                  </div>
                </div>
                <div className="flex gap-5 my-4">
                  <div>
                    <input
                      type="checkbox"
                      name="isFood"
                      className="checkbox checkbox-primary"
                      checked={isFood === true}
                      onChange={(e) => {
                        setIsFood(e.target.checked);
                        localStorage.setItem(
                          "isFood",
                          JSON.stringify(e.target.checked)
                        );
                      }}
                    />
                    <span> อาหารฟรีตลอดการเดินทาง </span>
                  </div>
                </div>
              </div>
              <div id="reservationTime" className="w-1/2">
                <div className="flex flex-col gap-4">
                  {/* Start Date */}
                  <div>
                    <label className="block text-gray-700 font-bold mb-2">
                      วันที่เริ่มต้น
                    </label>
                    <input
                      type="date"
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={
                        startDate ? startDate.toISOString().split("T")[0] : ""
                      }
                      onChange={handleStartDateChange}
                    />
                  </div>

                  {/* End Date */}
                  <div>
                    <label className="block text-gray-700 font-bold mb-2">
                      วันที่สิ้นสุด
                    </label>
                    <input
                      type="date"
                      value={endDate ? endDate.toISOString().split("T")[0] : ""}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onChange={handleEndDateChange}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div id="Description" className="w-full my-5">
        <div>
          <span>กรอกคำอธิบายเกี่ยวกับที่แพ็คเกจ</span>
        </div>
        <div className="shadow-boxShadow w-full h-full mt-2 rounded-lg">
          <textarea
            className="w-full h-[200px] border-none rounded-lg"
            placeholder="กรอกคำอธิบายเกี่ยวกับที่แพ็คเกจ"
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              localStorage.setItem(
                "description",
                JSON.stringify(e.target.value)
              );
            }}
          ></textarea>
        </div>
      </div>
      <div className="w-full my-5 mx-auto">
        <span className="font-bold">เพิ่มกิจกรรมของคุณ</span>
        <div className="shadow-boxShadow rounded-lg">
          <div className="bg-primaryBusiness p-2 rounded-t-lg"></div>
          <div className="p-5 flex flex-col">
            <div className="mt-5">
              <button
                onClick={addDay}
                className="bg-blue-500 flex items-center gap-2 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300"
              >
                <IoIosAddCircleOutline className="text-lg" /> วัน
              </button>
            </div>
            <div className="grid grid-cols-2 w-full">
              {activityPackages.map((dayPackage, index) => (
                <div key={index} className="mt-5">
                  <div className="shadow-lg p-5 rounded-lg shadow-boxShadow m-2 hover:scale-101 transition-all duration-300 ease-in-out">
                    <div className="flex justify-between">
                      <span>วันที่ {index + 1}</span>
                      <button
                        onClick={() => removeDay(index)}
                        className="hover:text-red-600"
                      >
                        <IoMdClose />
                      </button>
                    </div>
                    <div className="flex items-center mt-2">
                      <input
                        type="text"
                        className="input input-bordered w-full"
                        value={newActivities[index]}
                        onChange={(e) => handleActivityChange(index, e)}
                        placeholder="เพิ่มกิจกรรม"
                      />
                      <button
                        onClick={() => addActivity(index)}
                        className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition duration-300 ml-2"
                      >
                        <IoIosAddCircleOutline />
                      </button>
                    </div>
                    <div className="mt-5">
                      {dayPackage.activity_days.map((activity, actIndex) => (
                        <div
                          key={actIndex}
                          className="flex justify-between items-center"
                        >
                          <span>{activity.activity_name}</span>
                          <button
                            onClick={() => removeActivity(index, actIndex)}
                            className="hover:text-red-600"
                          >
                            <IoTrashBin />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div id="cancellationPolicy" className="w-full my-5">
        <span className="font-bold">นโยบายการยกเลิกการจอง</span>
        <div className="shadow-boxShadow w-full h-full mt-2 rounded-lg">
          <div>
            <div className="bg-primaryBusiness p-2 rounded-t-lg"></div>
            <div className="p-5 flex flex-col gap-3">
              <div>
                <input
                  type="radio"
                  name="cancellationPolicy"
                  value="ยกเลิกมากกว่า 7 วันล่วงหน้า ลูกค้าจะได้รับ คืนเงิน 100% ของจำนวนเงินที่ชำระ"
                  className="radio radio-primary"
                  onChange={handleCancellationChange}
                  checked={cancellationPolicy === "ยกเลิกมากกว่า 7 วันล่วงหน้า ลูกค้าจะได้รับ คืนเงิน 100% ของจำนวนเงินที่ชำระ"}
                />
                <span>
                  {" "}
                  ยกเลิกมากกว่า 7 วันล่วงหน้า ลูกค้าจะได้รับ คืนเงิน 100%
                  ของจำนวนเงินที่ชำระ
                </span>
              </div>
              <div>
                <input
                  type="radio"
                  name="cancellationPolicy"
                  value="ยกเลิกมากกว่า 5 วันล่วงหน้า ลูกค้าจะได้รับ คืนเงิน 50% ของจำนวนเงินที่ชำระ"
                  className="radio radio-primary"
                  onChange={handleCancellationChange}
                  checked={cancellationPolicy === "ยกเลิกมากกว่า 5 วันล่วงหน้า ลูกค้าจะได้รับ คืนเงิน 50% ของจำนวนเงินที่ชำระ"}
                />
                <span>
                  {" "}
                  ยกเลิกมากกว่า 5 วันล่วงหน้า ลูกค้าจะได้รับ คืนเงิน 50%
                  ของจำนวนเงินที่ชำระ
                </span>
              </div>
              <div>
                <input
                  type="radio"
                  name="cancellationPolicy"
                  value="ยกเลิกมากกว่า 3 วันล่วงหน้า ลูกค้าจะได้รับ คืนเงิน 30% ของจำนวนเงินที่ชำระ"
                  className="radio radio-primary"
                  onChange={handleCancellationChange}
                  checked={cancellationPolicy === "ยกเลิกมากกว่า 3 วันล่วงหน้า ลูกค้าจะได้รับ คืนเงิน 30% ของจำนวนเงินที่ชำระ"}
                />
                <span>
                  {" "}
                  ยกเลิกมากกว่า 3 วันล่วงหน้า ลูกค้าจะได้รับ คืนเงิน 30%
                  ของจำนวนเงินที่ชำระ
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full">
        <DetailPackages />
      </div>
    </div>
  );
};

export default BasicInformationPackage;
