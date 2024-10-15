import { useEffect, useState } from "react";
import { usePackageData } from "../../../AuthContext/packageData";
import type { Location } from "../../../type";
import Maps from "../../../components/maps";

const Location = () => {
  const { setLocation } = usePackageData();

  const [locationPackage, setLocationPackage] = useState<Location[]>([
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
  ]);
  const [errors, setErrors] = useState({
    latitude: "",
    longitude: "",
  });

  useEffect(() => {
    setLocation(locationPackage);
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
                      value={locationPackage[0].latitude_location} // ให้ค่าเริ่มต้นจากสถานะ
                      className="input input-bordered w-full"
                    />
                    {errors.latitude && (
                      <p style={{ color: "red" }}>{errors.latitude}</p>
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
                      value={locationPackage[0].longitude_location} // ให้ค่าเริ่มต้นจากสถานะ
                      className="input input-bordered w-full"
                    />
                    {errors.longitude && (
                      <p style={{ color: "red" }}>{errors.longitude}</p>
                    )}
                  </label>

                  {/* ระยะทาง */}
                  <label className="form-control w-full max-w-xs">
                    <div className="label">
                      <span className="label-text">ระยะทาง</span>
                    </div>
                    <input
                      type="number"
                      name="radius_location"
                      onChange={handleChange}
                      placeholder="ระยะทาง (กิโลเมตร)"
                      className="input input-bordered w-full"
                    />
                  </label>
                </div>
              </div>
            </div>
            <div>
              <Maps
                lat={locationPackage[0].latitude_location}
                lng={locationPackage[0].longitude_location}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Location;
