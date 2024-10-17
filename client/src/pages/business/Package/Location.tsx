import { useEffect, useState } from "react";
import { usePackageData } from "../../../AuthContext/packageData";
import type { Location } from "../../../type";
import Maps from "../../../components/Maps";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const Location = () => {
  const { setLocation, setCurrentStep } = usePackageData();
  const navigate = useNavigate()

  const [locationPackage, setLocationPackage] = useState<Location[]>(() => {
    const savedLocation = localStorage.getItem("locationPackage");
    return savedLocation
      ? JSON.parse(savedLocation)
      : [
          {
            name_location: "",
            province_location: "",
            house_no: "",
            village: "",
            village_no: "",
            alley: "",
            street: "",
            district_location: "",
            subdistrict_location: "",
            zipcode_location: 0,
            latitude_location: 0,
            longitude_location: 0,
            radius_location: 0,
          },
        ];
  });

  const [errors, setErrors] = useState({
    latitude: "",
    longitude: "",
  });

  useEffect(() => {
    setLocation(locationPackage);
    localStorage.setItem("locationPackage", JSON.stringify(locationPackage));
  }, [locationPackage]);

  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // กำหนดตัวแปรสำหรับค่าใหม่
    let newValue: number | string;
    let errorMessage = "";

    // เช็คชื่อ input และจัดการประเภทข้อมูล
    switch (name) {
      case "latitude_location":
        newValue = parseFloat(value);
        if (isNaN(newValue) || newValue < -180 || newValue > 180) {
          errorMessage = "ละติจูดต้องอยู่ระหว่าง -180 ถึง 180";
        }
        break;
      case "longitude_location":
        newValue = parseFloat(value);
        if (isNaN(newValue) || newValue < -180 || newValue > 180) {
          errorMessage = "ลองจิจูดต้องอยู่ระหว่าง -180 ถึง 180";
        }
        break;
      case "zipcode_location":
      case "radius_location":
        newValue = parseFloat(value);
        if (isNaN(newValue)) {
          newValue = value;
        }
        break;
      default:
        newValue = value;
    }

    // อัปเดตสถานะถ้ามี error
    if (errorMessage) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name === "latitude_location" ? "latitude" : "longitude"]: errorMessage,
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name === "latitude_location" ? "latitude" : "longitude"]: "",
      }));
    }

    // อัปเดตข้อมูล location
    setLocationPackage((prevLocations) => {
      const updatedLocation = { ...prevLocations[0], [name]: newValue };
      return [updatedLocation];
    });
  };

  const nextStep = () => {
    // เช็คว่า locationPackage มีข้อมูลที่จำเป็น
    const isLocationValid = locationPackage.every(location => 
      location.name_location !== "" &&
      location.province_location !== "" &&
      location.zipcode_location !== 0
    );
  
    if (isLocationValid) {
      navigate("/create-package/images");
      setCurrentStep(3);
      localStorage.setItem("currentStep", JSON.stringify(3));
    } else {
      // แจ้งเตือนถ้าข้อมูลไม่ครบถ้วน
      Swal.fire({
        icon: 'warning',
        title: 'กรุณากรอกข้อมูลสถานที่ให้ครบถ้วน',
        text: 'ชื่อสถานที่, จังหวัด, และรหัสไปรษณีย์ เป็นข้อมูลที่จำเป็น',
        confirmButtonText: 'ตกลง'
      });
    }
  };
  

  const prevStep = () => {
    navigate("/create-package/basic-information-package");
    setCurrentStep(1)
    localStorage.setItem("currentStep" , JSON.stringify(1))
  };

  useEffect(() => {
    setCurrentStep(2)
    localStorage.setItem("currentStep" , JSON.stringify(2))
  } , [])

  return (
    <div>
      <div className="w-full flex justify-center items-center pt-10">
        <div className="w-full shadow-boxShadow rounded-lg  h-full">
          <div className="py-3 bg-primaryBusiness w-full rounded-t-lg"></div>
          <div className="p-5 transition-all duration-700 ease-in-out">
            <div className="shadow-boxShadow p-5 rounded-lg">
              <div>
                <div className="text-lg mb-5 font-bold">
                  <span>ที่อยู่</span>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  {/* ชื่อสถานที่ */}
                  <label className="form-control w-full max-w-xs">
                    <div className="label">
                      <span className="label-text">ชื่อสถานที่</span>
                    </div>
                    <input
                      type="text"
                      name="name_location"
                      onChange={handleChange}
                      placeholder="ชื่อสถานที่"
                      className="input input-bordered w-full"
                      value={locationPackage[0].name_location}
                    />
                  </label>

                  {/* จังหวัด */}
                  <label className="form-control w-full max-w-xs">
                    <div className="label">
                      <span className="label-text">จังหวัด</span>
                    </div>
                    <input
                      type="text"
                      name="province_location"
                      onChange={handleChange}
                      placeholder="จังหวัด"
                      className="input input-bordered w-full"
                      value={locationPackage[0].province_location}
                    />
                  </label>

                  {/* บ้านเลขที่ */}
                  <label className="form-control w-full max-w-xs">
                    <div className="label">
                      <span className="label-text">บ้านเลขที่</span>
                    </div>
                    <input
                      type="text"
                      name="house_no"
                      onChange={handleChange}
                      placeholder="บ้านเลขที่"
                      className="input input-bordered w-full"
                      value={locationPackage[0].house_no}
                    />
                  </label>

                  {/* หมู่บ้าน */}
                  <label className="form-control w-full max-w-xs">
                    <div className="label">
                      <span className="label-text">หมู่บ้าน</span>
                    </div>
                    <input
                      type="text"
                      name="village"
                      onChange={handleChange}
                      placeholder="หมู่บ้าน (ถ้ามี)"
                      className="input input-bordered w-full"
                      value={locationPackage[0].village}
                    />
                  </label>

                  {/* หมู่ที่ */}
                  <label className="form-control w-full max-w-xs">
                    <div className="label">
                      <span className="label-text">หมู่ที่</span>
                    </div>
                    <input
                      type="text"
                      name="village_no"
                      onChange={handleChange}
                      placeholder="หมู่ที่"
                      className="input input-bordered w-full"
                      value={locationPackage[0].village_no}
                    />
                  </label>

                  {/* ซอย */}
                  <label className="form-control w-full max-w-xs">
                    <div className="label">
                      <span className="label-text">ซอย</span>
                    </div>
                    <input
                      type="text"
                      name="alley"
                      onChange={handleChange}
                      placeholder="ซอย (ถ้ามี)"
                      className="input input-bordered w-full"
                      value={locationPackage[0].alley}
                    />
                  </label>

                  {/* ถนน */}
                  <label className="form-control w-full max-w-xs">
                    <div className="label">
                      <span className="label-text">ถนน</span>
                    </div>
                    <input
                      type="text"
                      name="street"
                      onChange={handleChange}
                      placeholder="ถนน (ถ้ามี)"
                      className="input input-bordered w-full"
                      value={locationPackage[0].street}
                    />
                  </label>

                  {/* อำเภอ/เขต */}
                  <label className="form-control w-full max-w-xs">
                    <div className="label">
                      <span className="label-text">อำเภอ/เขต</span>
                    </div>
                    <input
                      type="text"
                      name="district_location"
                      onChange={handleChange}
                      placeholder="อำเภอ/เขต"
                      className="input input-bordered w-full"
                      value={locationPackage[0].district_location}
                    />
                  </label>

                  {/* ตำบล/แขวง */}
                  <label className="form-control w-full max-w-xs">
                    <div className="label">
                      <span className="label-text">ตำบล/แขวง</span>
                    </div>
                    <input
                      type="text"
                      name="subdistrict_location"
                      onChange={handleChange}
                      placeholder="ตำบล/แขวง"
                      className="input input-bordered w-full"
                      value={locationPackage[0].subdistrict_location}
                    />
                  </label>

                  {/* รหัสไปรษณีย์ */}
                  <label className="form-control w-full max-w-xs">
                    <div className="label">
                      <span className="label-text">รหัสไปรษณีย์</span>
                    </div>
                    <input
                      type="number"
                      name="zipcode_location"
                      onChange={handleChange}
                      placeholder="รหัสไปรษณีย์"
                      className="input input-bordered w-full"
                      value={locationPackage[0].zipcode_location || ""}
                    />
                  </label>

                  {/* ละติจูด */}
                  <label className="form-control w-full max-w-xs">
                    <div className="label">
                      <span className="label-text">ละติจูด</span>
                    </div>
                    <input
                      type="number"
                      name="latitude_location"
                      onChange={handleChange}
                      placeholder="ละติจูด"
                      className="input input-bordered w-full"
                      value={locationPackage[0].latitude_location}
                    />
                    {errors.latitude && (
                      <span className="text-error">{errors.latitude}</span>
                    )}
                  </label>

                  {/* ลองจิจูด */}
                  <label className="form-control w-full max-w-xs">
                    <div className="label">
                      <span className="label-text">ลองจิจูด</span>
                    </div>
                    <input
                      type="number"
                      name="longitude_location"
                      onChange={handleChange}
                      placeholder="ลองจิจูด"
                      className="input input-bordered w-full"
                      value={locationPackage[0].longitude_location}
                    />
                    {errors.longitude && (
                      <span className="text-error">{errors.longitude}</span>
                    )}
                  </label>

                  {/* รัศมี */}
                  <label className="form-control w-full max-w-xs">
                    <div className="label">
                      <span className="label-text">รัศมี (กม.)</span>
                    </div>
                    <input
                      type="number"
                      name="radius_location"
                      onChange={handleChange}
                      placeholder="ระบุรัศมี"
                      className="input input-bordered w-full"
                      value={locationPackage[0].radius_location || ""}
                    />
                  </label>
                </div>
              </div>
              <div className="divider"></div>
              <div>
                <Maps />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full my-5">
        <div className="flex justify-between">
          <button
            className="shadow-boxShadow px-3 py-2 rounded-lg hover:bg-secondBusiness
             bg-primaryBusiness text-white w-24 h-12"
            onClick={prevStep}
          >
            ก่อนหน้า
          </button>
          <button
            className="shadow-boxShadow px-3 py-2 rounded-lg hover:bg-secondBusiness
             bg-primaryBusiness text-white w-20 h-12"
            onClick={nextStep}
          >
            ต่อไป
          </button>
        </div>
      </div>
    </div>
  );
};

export default Location;
