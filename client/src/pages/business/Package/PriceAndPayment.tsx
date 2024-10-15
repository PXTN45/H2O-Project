import { useContext, useEffect, useState } from "react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { usePackageData } from "../../../AuthContext/packageData";
import { AuthContext } from "../../../AuthContext/auth.provider";
import { Bank } from "../../../type";

const Price = () => {
  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error("AuthContext must be used within an AuthProvider");
  }
  const { userInfo } = authContext;
  const { setBank, setDiscount, setPrice } = usePackageData();
  const [packagePrice, setPackagePrice] = useState<number>(1000);

  const [idCard, setIdCard] = useState<string>("");
  const [bankingCode, setBankingCode] = useState<string>("");
  const [bankingUsername, setBankingUsername] = useState<string>("");
  const [bankingUserlastname, setBankingUserlastname] = useState<string>("");

  const [openDiscount, setOpenDiscount] = useState<boolean>(false);
  const [openBank, setOpenBank] = useState<boolean>(true);
  const [openDropdown, setOpenDropdown] = useState<boolean>(false);
  const [discount, setDiscounts] = useState<number>(10);
  const [selectedBank, setSelectedBank] = useState({
    name: "",
    logo: "",
  });

  const OpenDropdownBank = () => {
    setOpenDropdown(!openDropdown);
  };


  const banks = [
    {
      name: "ธนาคารกสิกรไทย",
      logo: "https://www.kasikornbank.com/SiteCollectionDocuments/about/img/logo/logo.png",
    },
    {
      name: "ธนาคารกรุงไทย",
      logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS9MyvFi65duU6oPJ85J8C_LX3OjktcgB34-Q&s",
    },
    {
      name: "ธนาคารกรุงเทพ",
      logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3oLrPMl6-IsQWnOqXU2M3etI_pZrUyndYtEdwO-MGx7ZsWIt78dMEOwcb8DcP8_PKCPw&usqp=CAU",
    },
  ];

  useEffect(() => {
    let banking: Bank | undefined;

    if (
      openBank === true &&
      idCard &&
      selectedBank?.name &&
      bankingUsername &&
      bankingUserlastname &&
      bankingCode
    ) {
      banking = {
        idcard: idCard,
        BankingName: selectedBank.name,
        BankingUsername: bankingUsername,
        BankingUserlastname: bankingUserlastname,
        BankingCode: bankingCode,
      };
    } else if (
      openBank === false &&
      userInfo?.idcard &&
      userInfo?.BankingName &&
      userInfo?.BankingUsername &&
      userInfo?.BankingUserlastname &&
      userInfo?.BankingCode
    ) {
      banking = {
        idcard: userInfo.idcard,
        BankingName: userInfo.BankingName,
        BankingUsername: userInfo.BankingUsername,
        BankingUserlastname: userInfo.BankingUserlastname,
        BankingCode: userInfo.BankingCode,
      };
    }

    setBank(banking);
  }, [
    idCard,
    selectedBank,
    bankingUsername,
    bankingUserlastname,
    bankingCode,
    openBank,
    userInfo,
  ]);

  useEffect(() => {
    setPrice(packagePrice);
  }, [packagePrice]);

  useEffect(() => {
    setDiscount(discount);
  }, [discount]);

  return (
    <div className="mt-10 w-full flex justify-center items-center flex-col gap-10">
      <div id="price" className="w-full">
        <div className="flex flex-col">
          <span className="text-lg">ราคาตลอดการเดินทาง</span>
          <span className="text-sm">
            กรุณาระบุราคาต่อคนที่คุณต้องการสำหรับแพ็คเกจนี้
          </span>
        </div>
        <div className="shadow-boxShadow rounded-lg mt-5">
          <div className="p-3 rounded-t-lg bg-primaryBusiness"></div>
          <div className="p-5">
            <div className="flex flex-row gap-5 justify-between">
              <div className="w-1/2">
                <label className="form-control w-full">
                  <div className="label">
                    <span className="label-text">
                      ตั้งชื่อที่แพ็คเกจของท่าน
                    </span>
                  </div>
                  <div className="flex justify-start items-center">
                    <input
                      type="text"
                      placeholder="ตั้งชื่อที่แพ็คเกจของท่าน"
                      className="input input-bordered w-full"
                      value={packagePrice}
                      onChange={(e) => setPackagePrice(Number(e.target.value))}
                    />

                    <span className="p-3 bg-primaryBusiness rounded-r-lg border">
                      บาท
                    </span>
                  </div>
                </label>
              </div>
              <div className="flex flex-col gap-3 my-3">
                <div>
                  <input
                    type="radio"
                    name="Discount"
                    className="radio radio-primary"
                    onChange={() => {
                      setOpenDiscount(true);
                    }}
                    checked={openDiscount === true}
                  />
                  <span className="ml-2">ฉันมีส่วนลด</span>
                </div>
                <div>
                  <input
                    type="radio"
                    name="Discount"
                    value={0}
                    className="radio radio-primary"
                    onChange={(e) => {
                      setDiscounts(Number(e.target.value));
                      setOpenDiscount(false);
                    }}
                    checked={openDiscount === false}
                  />
                  <span className="ml-2">ฉันไม่มีส่วนลด</span>
                </div>
              </div>
            </div>

            {openDiscount === true && (
              <div className="w-1/2">
                <div>
                  <label className="form-control w-full">
                    <div className="label">
                      <span className="label-text">
                        กรุณาใส่ส่วนลดที่คุณต้องการใช้
                      </span>
                    </div>
                    <div className="flex justify-start items-center">
                      <input
                        type="number"
                        placeholder="ส่วนลด"
                        className="input input-bordered w-full"
                        value={discount}
                        min={1}
                        max={100}
                        step={1} // กำหนดการเพิ่มขึ้นหรือลดลงเป็น 1
                        onChange={(e) => {
                          const value = Number(e.target.value);
                          if (value >= 1 && value <= 100) {
                            setDiscounts(value);
                          } else if (e.target.value === "") {
                            setDiscounts(0);
                          }
                        }}
                      />

                      <span className="px-5 py-3 bg-primaryBusiness rounded-r-lg border">
                        %
                      </span>
                    </div>
                  </label>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div id="paymentMethod" className="w-full">
        <div className="flex flex-col">
          <span className="text-lg">วิธีการชำระเงิน</span>
          <span className="text-sm">โปรดเลือกวิธีการชำระเงินที่คุณต้องการ</span>
        </div>
        <div className="shadow-boxShadow rounded-lg mt-5">
          <div className="p-3 rounded-t-lg bg-primaryBusiness"></div>
          <div className="p-5">
            <div className="flex flex-col gap-5 ">
              <div>
                <span className="text-lg">เลือกบัญชีธนาคาร</span>
              </div>
              <div className="flex lfex-row gap-5">
                <div>
                  <input
                    type="radio"
                    name="Bank"
                    className="radio radio-primary"
                    onChange={() => {
                      setOpenBank(false);
                    }}
                    checked={openBank === false}
                    disabled={
                      !(
                        userInfo?.BankingCode &&
                        userInfo?.idcard &&
                        userInfo?.BankingName &&
                        userInfo?.BankingUsername &&
                        userInfo?.BankingUserlastname
                      )
                    } // ปุ่มจะ disable ถ้าข้อมูลไม่ครบ
                  />
                  <span className="ml-2">บัญชีธนาคารที่ผูกไว้</span>
                </div>

                <div>
                  <input
                    type="radio"
                    name="Bank"
                    value={0}
                    className="radio radio-primary"
                    onChange={(e) => {
                      setDiscounts(Number(e.target.value));
                      setOpenBank(true);
                    }}
                    checked={openBank === true} // ตรวจสอบว่าค่าของ discount ตรงกับ 0 หรือไม่
                  />
                  <span className="ml-2">ไม่ได้ผูกบัญชีธนาคาร</span>
                </div>
              </div>
            </div>
            {openBank === true && (
              <div className="w-full">
                <div className="my-4">
                  <div className="w-full">
                    <div
                      tabIndex={0}
                      role="button"
                      onClick={OpenDropdownBank}
                      className="min-w-full m-1 bg-white shadow-boxShadow py-2 px-3 rounded-lg flex justify-between items-center cursor-pointer"
                    >
                      <div className="flex items-center">
                        {selectedBank.logo && (
                          <img
                            src={selectedBank.logo}
                            alt={selectedBank.name}
                            className="w-10 h-10 mr-2 rounded-full"
                          />
                        )}
                        <span>{selectedBank.name || "เลือกบัญชีธนาคาร"}</span>
                      </div>
                      <span>
                        {openDropdown ? <IoIosArrowUp /> : <IoIosArrowDown />}
                      </span>
                    </div>
                    <div
                      className={`transition-max-height duration-300 ease-in-out overflow-hidden ${
                        openDropdown ? "max-h-full" : "max-h-0"
                      }`}
                    >
                      <ul className="dropdown-content border menu bg-white rounded-lg z-[1] p-2  w-full">
                        {banks.map((bank) => (
                          <li key={bank.name}>
                            <div
                              className="flex items-center cursor-pointer"
                              onClick={() => {
                                setSelectedBank(bank);
                                setOpenDropdown(false);
                              }}
                            >
                              <img
                                src={bank.logo}
                                alt={bank.name}
                                className="w-10 h-10 mr-2 rounded-full"
                              />
                              <span>{bank.name}</span>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="w-full">
                  <label className="form-control w-full">
                    <div className="label">
                      <span className="label-text">บัตรประจำตัวประชาชน</span>
                    </div>
                    <div className="flex justify-start items-center">
                      <input
                        id="idCard"
                        type="text"
                        placeholder="กรอกบัตรประจำตัวประชาชน"
                        className="input input-bordered w-full"
                        value={idCard}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (/^[0-9]*$/.test(value)) {
                            setIdCard(value);
                          }
                        }}
                        maxLength={13}
                      />
                    </div>
                    {idCard.length > 0 && idCard.length !== 13 && (
                      <p className="text-red-500">
                        เลขบัตรประจำตัวประชาชนต้องมีความยาว 13 ตัว
                      </p>
                    )}
                  </label>
                </div>
                <div className="w-full">
                  <label className="form-control w-full">
                    <div className="label">
                      <span className="label-text">เลขบัญชี</span>
                    </div>
                    <div className="flex justify-start items-center">
                      <input
                        id="bankingCode"
                        type="text"
                        placeholder="กรอกหมายเลขบัญชี"
                        className="input input-bordered w-full"
                        value={bankingCode}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (/^[0-9]*$/.test(value)) {
                            setBankingCode(value);
                          }
                        }}
                        maxLength={12}
                      />
                    </div>
                    {/* แสดงข้อความแจ้งเตือนถ้าไม่ครบ 12 ตัว */}
                    {bankingCode.length > 0 && bankingCode.length !== 12 && (
                      <p className="text-red-500">
                        เลขบัญชีต้องมีความยาว 12 ตัว
                      </p>
                    )}
                  </label>
                </div>
                <div
                  id="userNameBank"
                  className="w-full flex justify-between gap-5"
                >
                  <label className="form-control w-1/2">
                    <div className="label">
                      <span className="label-text">ชื่อ</span>
                    </div>
                    <div className="flex justify-start items-center">
                      <input
                        type="text"
                        placeholder="กรอกชื่อ"
                        className="input input-bordered w-full"
                        value={bankingUsername}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (/^[A-Za-zก-ฮ\s]*$/.test(value)) {
                            setBankingUsername(value);
                          }
                        }}
                      />
                    </div>
                  </label>

                  <label className="form-control w-1/2">
                    <div className="label">
                      <span className="label-text">กรอกนามสกุล</span>
                    </div>
                    <div className="flex justify-start items-center">
                      <input
                        type="text"
                        placeholder="กรอกนามสกุล"
                        className="input input-bordered w-full"
                        value={bankingUserlastname}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (/^[A-Za-zก-ฮ\s]*$/.test(value)) {
                            setBankingUserlastname(value);
                          }
                        }}
                      />
                    </div>
                  </label>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Price;
