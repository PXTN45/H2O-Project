import React, { useState } from "react";
import { useContext } from "react";
import { AuthContext } from "../../AuthContext/auth.provider";
import { TbPointFilled } from "react-icons/tb";

const myAccount = () => {
  // const [openUpdateFrom, setOpenUpdateFrom] = useState<boolean>(false);
  const [openUpdateUser, setOpenUpdateUser] = useState<boolean>(false);
  const [openUpdatePassword, setOpenUpdatePassword] = useState<boolean>(false);
  const [openUpdateAddress, setOpenUpdateAddress] = useState<boolean>(false);
  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error("AuthContext must be used within an AuthProvider");
  }

  const { userInfo } = authContext;
  // console.log(userInfo?.addresses[0].city);
  console.log(userInfo);

  return (
    <div className="my-5 w-full ">
      <div className="mb-5">
        <span className="text-2xl">ข้อมูลผู้ใช้</span>
      </div>
      {userInfo ? (
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
                    <span className="text-lg flex gap-5 mt-2" >
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
                <div className="flex justify-end">
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
                  <div>
                    <span>รหัสผ่านปัจจุบัน</span>
                    <div className="flex gap-2 my-5">
                      <input
                        type="password"
                        placeholder="รหัสผ่านปัจจุบัน"
                        className="input input-bordered w-full"
                      />
                    </div>
                  </div>
                  <div>
                    <span>รหัสผ่านใหม่</span>
                    <div className="flex gap-2 my-5">
                      <input
                        type="password"
                        placeholder="รหัสผ่านใหม่"
                        className="input input-bordered w-full"
                      />
                    </div>
                  </div>
                  <div>
                    <span>ยืนยันรหัสผ่านใหม่</span>
                    <div className="flex gap-2 my-5">
                      <input
                        type="password"
                        placeholder="ยืนยันรหัสผ่านใหม่"
                        className="input input-bordered w-full"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button
                      onClick={() => setOpenUpdatePassword(false)}
                      className="bg-red-500 mx-2 px-5 py-2 rounded-full text-white hover:bg-red-700"
                    >
                      ยกเลิก
                    </button>
                    <button className="bg-green-400 mx-2 px-5 py-2 rounded-full text-white hover:bg-green-600">
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
                        144 ม.5 ต.หัวเขา อ.เดิมบางนางบวช จ.สุพรรณบุรี 72120
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
                    <span>ที่อยู่</span>
                    <div className="flex flex-col gap-2 my-5">
                      <div className="flex gap-5">
                        <input
                          type="text"
                          placeholder="บ้านเลขที่"
                          className="input input-bordered w-full"
                        />
                        <input
                          type="text"
                          placeholder="ถนน / ซอย"
                          className="input input-bordered w-full"
                        />
                        <input
                          type="text"
                          placeholder="ตำบล"
                          className="input input-bordered w-full"
                        />
                      </div>
                      <div className="flex gap-5">
                        <input
                          type="text"
                          placeholder="อำเภอ"
                          className="input input-bordered w-full"
                        />
                        <input
                          type="text"
                          placeholder="จังหวัด"
                          className="input input-bordered w-full"
                        />
                        <input
                          type="text"
                          placeholder="รหัสไปรษณีย์"
                          className="input input-bordered w-full"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button
                      onClick={() => setOpenUpdateAddress(false)}
                      className="bg-red-500 mx-2 px-5 py-2 rounded-full text-white hover:bg-red-700"
                    >
                      ยกเลิก
                    </button>
                    <button className="bg-green-400 mx-2 px-5 py-2 rounded-full text-white hover:bg-green-600">
                      บันทึก
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end">
            <button className="p-3 bg-red-500 hover:bg-red-700 rounded-lg my-3 text-xs text-white">
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
