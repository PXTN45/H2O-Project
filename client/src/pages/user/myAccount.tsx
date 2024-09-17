import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../AuthContext/auth.provider";
import axiosPrivateUser from "../../hook/axiosPrivateUser";
import { TbPointFilled } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { LuEye, LuEyeOff } from "react-icons/lu";
import axios from "axios";

interface Password {
  email: string;
  password: string;
  newPass: string;
  confirmPass: string;
}
interface Address {
  houseNumber: string;
  street: string;
  village: string;
  subdistrict: string;
  district: string;
  city: string;
  country: string;
  postalCode: string;
}

interface User {
  _id?: string;
  name?: string;
  lastName?: string;
  businessName?: string;
  email: string;
  password: string;
  phone: string | undefined;
  image: string;
  address: Address[];
  birthday: Date;
  role: string;
}
const myAccount = () => {
  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error("AuthContext must be used within an AuthProvider");
  }

  const { userInfo } = authContext;
  // const [openUpdateFrom, setOpenUpdateFrom] = useState<boolean>(false);
  const [openUpdateUser, setOpenUpdateUser] = useState<boolean>(false);
  const [userData, setUserData] = useState<User>();
  const [openUpdatePassword, setOpenUpdatePassword] = useState<boolean>(false);
  const [openUpdateAddress, setOpenUpdateAddress] = useState<boolean>(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [passwords, setPasswords] = useState<Password>({
    email: "",
    password: "",
    newPass: "",
    confirmPass: "",
  });
  const [address, setAddress] = useState<Address>({
    houseNumber: userData?.address[0]?.houseNumber || "",
    street: userData?.address[0]?.street || "",
    village: userData?.address[0]?.village || "",
    subdistrict: userData?.address[0]?.subdistrict || "",
    district: userData?.address[0]?.district || "",
    city: userData?.address[0]?.city || "",
    country: userData?.address[0]?.country || "",
    postalCode: userData?.address[0]?.postalCode || "",
  });
  const navigate = useNavigate();
  console.log(passwords);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axiosPrivateUser.get(
          `/user/userData/${userInfo?._id}`
        );
        setUserData(response.data);
        setAddress(response.data.address[0]);
        setPasswords({
          email: response.data.email,
          password: "",
          newPass: "",
          confirmPass: "",
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [userInfo?._id, openUpdateAddress]);

  // ฟังก์ชันจัดการการเปลี่ยนแปลงฟิลด์ฟอร์ม
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numericFields = ["houseNumber", "postalCode", "village"];
    const numericValue = numericFields.includes(name)
      ? value.replace(/[^0-9/-]/g, "")
      : value.replace(/[^a-zA-Zก-๙]/g, "");

    setAddress((prevAddress) => ({
      ...prevAddress,
      [name]: numericValue,
    }));
  };
  const handleChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setPasswords((prevPassword) => ({
      ...prevPassword,
      [name]: value, // ตั้งค่า value โดยตรง
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    Swal.fire({
      title: "คุณแน่ใจหรือไม่?",
      text: "คุณจะไม่สามารถย้อนกลับได้!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ใช่, อัปเดตเลย!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axiosPrivateUser.put(`/user/updateAddress/${userInfo?._id}`, {
            houseNumber: address.houseNumber,
            village: address.village,
            street: address.street,
            district: address.district,
            subdistrict: address.subdistrict,
            city: address.city,
            country: address.country,
            postalCode: address.postalCode,
          });
          setOpenUpdateAddress(false);

          // แจ้งเตือนว่าการอัปเดตสำเร็จ
          Swal.fire({
            title: "อัปเดตแล้ว!",
            text: "ที่อยู่ของคุณได้รับการอัปเดตแล้ว.",
            icon: "success",
          });
        } catch (error) {
          // แจ้งเตือนหากเกิดข้อผิดพลาด
          Swal.fire({
            title: "ข้อผิดพลาด!",
            text: "เกิดปัญหาในการอัปเดตที่อยู่ของคุณ.",
            icon: "error",
          });
        }
      }
    });
  };

  const handleDeleteUser = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Deleted!",
          text: "Your file has been deleted.",
          icon: "success",
        });
        navigate("/");
      }
    });
  };
  console.log(passwords);

  const togglePasswordVisibility = (field: "current" | "new" | "confirm") => {
    setShowPasswords((prevState) => ({
      ...prevState,
      [field]: !prevState[field],
    }));
  };

  const changePassword = async () => {
    if (
      passwords.password === "" ||
      passwords.newPass === "" ||
      passwords.confirmPass === ""
    ) {
      Swal.fire({
        title: "กรุณากรอกข้อมูลให้ครบ",
        text: "โปรดตรวจสอบและกรอกข้อมูลทุกช่องให้ครบก่อนดำเนินการ",
        icon: "warning",
      });
      return;
    }

    try {
      const change = await axiosPrivateUser.put(
        "/user/update-password",
        passwords
      );
      if (change.status === 200) {
        Swal.fire({
          title: "สำเร็จ!",
          text: "รหัสผ่านของคุณได้ถูกเปลี่ยนเรียบร้อยแล้ว.",
          icon: "success",
        });
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        Swal.fire({
          title: "ข้อผิดพลาด!",
          text: error.response.data.message,
          icon: "error",
        });
        console.log(error.response.data.message);
      } else {
        Swal.fire({
          title: "ข้อผิดพลาด!",
          text: "เกิดข้อผิดพลาดบางอย่าง!",
          icon: "error",
        });
        console.log("Unknown error:", error);
      }
    }
  };

  return (
    <div className="my-5 w-full">
      <div className="mb-5">
        <span className="text-2xl">ข้อมูลผู้ใช้</span>
      </div>
      {userInfo && userData ? (
        <div>
          <div className="shadow-boxShadow pb-10  rounded-lg">
            {openUpdateUser === false ? (
              <div className="flex justify-between items-center hover:bg-gray-300 p-5">
                <div className="flex gap-5 items-center p-5 ">
                  <div>
                    <img
                      src={userInfo?.image}
                      className="rounded-full w-14 h-14"
                      alt="รูปโปรไฟล์"
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm">ชื่อผู้ใช้</span>
                    <span className="text-lg">
                      {userInfo?.name} {userInfo?.lastName}
                    </span>
                  </div>
                </div>
                <div onClick={() => setOpenUpdateUser(true)}>
                  <span>แก้ไข</span>
                </div>
              </div>
            ) : (
              <div className="flex justify-between items-center hover:bg-gray-300 p-5">
                <div className="w-3/4 flex gap-5 items-end p-5 ">
                  <div>
                    <img
                      src={userInfo?.image}
                      className="rounded-full w-14 h-14"
                      alt="รูปโปรไฟล์"
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm">ชื่อผู้ใช้</span>
                    <span className="text-lg flex gap-5 mt-2">
                      <div>
                        {" "}
                        <input
                          type="text"
                          placeholder="ชื่อ"
                          value={userInfo?.name}
                          className="input input-bordered w-full"
                        />
                      </div>
                      <div>
                        {" "}
                        <input
                          type="text"
                          placeholder="นามสกุล"
                          value={userInfo?.lastName}
                          className="input input-bordered w-full"
                        />
                      </div>
                    </span>
                  </div>
                </div>
                <div className="w-1/4 flex justify-end items-end">
                  <button
                    onClick={() => setOpenUpdateUser(false)}
                    className="bg-red-500 mx-2 px-4 py-2 rounded-full text-white hover:bg-red-700"
                  >
                    ยกเลิก
                  </button>
                  <button className="bg-green-400 mx-2 px-4 py-2 rounded-full text-white hover:bg-green-600">
                    บันทึก
                  </button>
                </div>
              </div>
            )}

            <div className=" hover:bg-gray-300 p-5">
              <div className="flex gap-5 items-center  ">
                <div className="flex flex-col">
                  <span className="text-sm">อีเมล</span>
                  <span className="text-lg flex items-center gap-5 mt-3">
                    {userInfo?.email}{" "}
                    {userInfo?.isVerified === true ? (
                      <div className="text-xs bg-green-400 rounded-full px-1">
                        ยืนยันแล้ว
                      </div>
                    ) : (
                      <div></div>
                    )}
                  </span>
                </div>
              </div>
            </div>

            {openUpdatePassword === false ? (
              <div className="flex justify-between items-center hover:bg-gray-300 p-5 transition-all duration-700 ease-in-out">
                <div className="flex gap-5 items-center">
                  <div className="flex flex-col">
                    <span className="text-sm">รหัสผ่าน</span>
                    <div className="flex space-x-1 mt-3">
                      {Array.from({ length: 10 }).map((_, index) => (
                        <span key={index} className="text-sm">
                          <TbPointFilled />
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div onClick={() => setOpenUpdatePassword(true)}>
                  <button>แก้ไข</button>
                </div>
              </div>
            ) : (
              <div className="p-5 transition-all duration-700 ease-in-out">
                <div className="shadow-boxShadow p-5 rounded-lg">
                  <div className="text-lg mb-5 font-bold">
                    <span>แก้ไขรหัสผ่าน</span>
                  </div>
                  <div>
                    {/* รหัสผ่านปัจจุบัน */}
                    <div>
                      <span>รหัสผ่านปัจจุบัน</span>
                      <div className="flex gap-2 my-5">
                        <input
                          name="password"
                          value={passwords.password}
                          onChange={handleChangePassword}
                          type={showPasswords.current ? "text" : "password"}
                          placeholder="รหัสผ่านปัจจุบัน"
                          className="input input-bordered w-full"
                        />
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility("current")}
                        >
                          {showPasswords.current ? <LuEye /> : <LuEyeOff />}
                        </button>
                      </div>
                    </div>

                    {/* รหัสผ่านใหม่ */}
                    <div>
                      <span>รหัสผ่านใหม่</span>
                      <div className="flex gap-2 my-5">
                        <input
                          name="newPass"
                          value={passwords.newPass}
                          onChange={handleChangePassword}
                          type={showPasswords.new ? "text" : "password"}
                          placeholder="รหัสผ่านใหม่"
                          className="input input-bordered w-full"
                        />
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility("new")}
                        >
                          {showPasswords.new ? <LuEye /> : <LuEyeOff />}
                        </button>
                      </div>
                    </div>

                    {/* ยืนยันรหัสผ่านใหม่ */}
                    <div>
                      <span>ยืนยันรหัสผ่านใหม่</span>
                      <div className="flex gap-2 my-5">
                        <input
                          name="confirmPass"
                          value={passwords.confirmPass}
                          onChange={handleChangePassword}
                          type={showPasswords.confirm ? "text" : "password"}
                          placeholder="ยืนยันรหัสผ่านใหม่"
                          className="input input-bordered w-full"
                        />
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility("confirm")}
                        >
                          {showPasswords.confirm ? <LuEye /> : <LuEyeOff />}
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button
                      onClick={() => setOpenUpdatePassword(false)}
                      className="bg-red-500 mx-2 px-5 py-2 rounded-full text-white hover:bg-red-700"
                    >
                      ยกเลิก
                    </button>
                    <button
                      onClick={changePassword}
                      className="bg-green-400 mx-2 px-5 py-2 rounded-full text-white hover:bg-green-600"
                    >
                      บันทึก
                    </button>
                  </div>
                </div>
              </div>
            )}

            {openUpdateAddress === false ? (
              <div className="flex justify-between items-center hover:bg-gray-300 p-5 transition-all duration-700 ease-in-out">
                <div className="flex gap-5 items-center">
                  <div className="flex flex-col">
                    <span className="text-sm">ที่อยู่</span>
                    <div className="mt-3">
                      <span>
                        {userData?.address[0].houseNumber} ถนน.
                        {userData?.address[0].street} ม.
                        {userData?.address[0].village} ต.
                        {userData?.address[0].subdistrict} อ.
                        {userData?.address[0].district} จ.
                        {userData?.address[0].city}{" "}
                        {userData?.address[0].postalCode}
                      </span>
                    </div>
                  </div>
                </div>
                <div onClick={() => setOpenUpdateAddress(true)}>
                  <button>แก้ไข</button>
                </div>
              </div>
            ) : (
              <div className="p-5 transition-all duration-700 ease-in-out">
                <div className="shadow-boxShadow p-5 rounded-lg">
                  <div>
                    <div className="text-lg mb-5 font-bold">
                      <span>ที่อยู่</span>
                    </div>
                    <form onSubmit={handleSubmit}>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className="form-control w-full max-w-xs">
                            <div className="label">
                              <span className="label-text">บ้านเลขที่</span>
                            </div>
                            <input
                              type="text"
                              name="houseNumber"
                              value={address.houseNumber}
                              onChange={handleChange}
                              placeholder="บ้านเลขที่"
                              className="input input-bordered w-full"
                            />
                          </label>
                        </div>
                        <div>
                          <label className="form-control w-full max-w-xs">
                            <div className="label">
                              <span className="label-text">ถนน / ซอย</span>
                            </div>
                            <input
                              type="text"
                              name="street"
                              value={address.street}
                              onChange={handleChange}
                              placeholder="ถนน / ซอย"
                              className="input input-bordered w-full"
                            />
                          </label>
                        </div>
                        <div>
                          <label className="form-control w-full max-w-xs">
                            <div className="label">
                              <span className="label-text">หมู่</span>
                            </div>
                            <input
                              type="text"
                              name="village"
                              value={address.village}
                              onChange={handleChange}
                              placeholder="หมู่"
                              className="input input-bordered w-full"
                            />
                          </label>
                        </div>
                        <div>
                          <label className="form-control w-full max-w-xs">
                            <div className="label">
                              <span className="label-text">ตำบล</span>
                            </div>
                            <input
                              type="text"
                              name="subdistrict"
                              value={address.subdistrict}
                              onChange={handleChange}
                              placeholder="ตำบล"
                              className="input input-bordered w-full"
                            />
                          </label>
                        </div>
                        <div>
                          <label className="form-control w-full max-w-xs">
                            <div className="label">
                              <span className="label-text">อำเภอ</span>
                            </div>
                            <input
                              type="text"
                              name="district"
                              value={address.district}
                              onChange={handleChange}
                              placeholder="อำเภอ"
                              className="input input-bordered w-full"
                            />
                          </label>
                        </div>
                        <div>
                          <label className="form-control w-full max-w-xs">
                            <div className="label">
                              <span className="label-text">จังหวัด</span>
                            </div>
                            <input
                              type="text"
                              name="city"
                              value={address.city}
                              onChange={handleChange}
                              placeholder="จังหวัด"
                              className="input input-bordered w-full"
                            />
                          </label>
                        </div>
                        <div>
                          <label className="form-control w-full max-w-xs">
                            <div className="label">
                              <span className="label-text">ประเทศ</span>
                            </div>
                            <input
                              type="text"
                              name="country"
                              value={address.country}
                              onChange={handleChange}
                              placeholder="ประเทศ"
                              className="input input-bordered w-full"
                            />
                          </label>
                        </div>
                        <div>
                          <label className="form-control w-full max-w-xs">
                            <div className="label">
                              <span className="label-text">รหัสไปรษณีย์</span>
                            </div>
                            <input
                              type="text"
                              name="postalCode"
                              value={address.postalCode}
                              onChange={handleChange}
                              placeholder="รหัสไปรษณีย์"
                              className="input input-bordered w-full"
                            />
                          </label>
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <button
                          onClick={() => setOpenUpdateAddress(false)}
                          className="bg-red-500 mx-2 px-3 w-18 py-1 rounded-full text-white hover:bg-red-700"
                        >
                          ยกเลิก
                        </button>
                        <button
                          type="submit"
                          className="bg-green-400 mx-2 px-3 w-18 py-1 rounded-full text-white hover:bg-green-600"
                        >
                          แก้ไข
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="flex justify-end">
            <button
              onClick={handleDeleteUser}
              className="p-3 bg-red-500 hover:bg-red-700 rounded-lg my-3 text-xs text-white"
            >
              ลบบัญชีผู้ใช้
            </button>
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center w-full p-20">
          <span className="loading loading-infinity loading-lg"></span>
          <span className="text-2xl">ไม่พบข้อมูล</span>
        </div>
      )}
    </div>
  );
};

export default myAccount;
