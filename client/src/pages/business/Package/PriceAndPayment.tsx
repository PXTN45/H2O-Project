import { useContext, useEffect, useState } from "react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { usePackageData } from "../../../AuthContext/packageData";
import { AuthContext } from "../../../AuthContext/auth.provider";
import { Bank } from "../../../type";
import CryptoJS from "crypto-js";

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
  const [openBank, setOpenBank] = useState<boolean>(false);
  const [openDropdown, setOpenDropdown] = useState<boolean>(false);
  const [discount, setDiscounts] = useState<number>(0);
  const [selectedBank, setSelectedBank] = useState({
    name: "",
    logo: "",
  });

  useEffect(() => {
    const storedPackagePrice = localStorage.getItem("packagePrice");
    if (storedPackagePrice) {
      setPackagePrice(JSON.parse(storedPackagePrice));
    }

    const storedOpenDiscount = localStorage.getItem("openDiscount");
    if (storedOpenDiscount) {
      setOpenDiscount(JSON.parse(storedOpenDiscount));
    }
    const storedBankingUsername = localStorage.getItem("bankingUsername");
    if (storedBankingUsername) {
      setBankingUsername(JSON.parse(storedBankingUsername));
    }
    const storedBankingUserlastname = localStorage.getItem(
      "bankingUserlastname"
    );
    if (storedBankingUserlastname) {
      setBankingUserlastname(JSON.parse(storedBankingUserlastname));
    }

    const storedDiscounts = localStorage.getItem("discounts");
    if (storedDiscounts) {
      setDiscounts(JSON.parse(storedDiscounts));
    }

    const storedSelectedBank = localStorage.getItem("SelectedBank");
    if (storedSelectedBank) {
      setSelectedBank(JSON.parse(storedSelectedBank));
    }

    const storedOpenBank = localStorage.getItem("OpenBank");
    if (storedOpenBank) {
      setOpenBank(JSON.parse(storedOpenBank));
    }

    const storedIdCard = localStorage.getItem("idCard");
    if (storedIdCard) {
      const secretKey = import.meta.env.VITE_SECRET_KEY;
      const bytes = CryptoJS.AES.decrypt(storedIdCard, secretKey);
      const decryptedIdCard = bytes.toString(CryptoJS.enc.Utf8);
      setIdCard(decryptedIdCard);
    }

    const storedBankingCode = localStorage.getItem("bankingCode");
    if (storedBankingCode) {
      const secretKey = import.meta.env.VITE_SECRET_KEY;
      const bytes = CryptoJS.AES.decrypt(storedBankingCode, secretKey);
      const decryptedIdCard = bytes.toString(CryptoJS.enc.Utf8);
      setBankingCode(decryptedIdCard);
    }
  }, []);

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
        idcard: encryptData(idCard),
        BankingName: selectedBank.name,
        BankingUsername: bankingUsername,
        BankingUserlastname: bankingUserlastname,
        BankingCode: encryptData(bankingCode),
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
    localStorage.setItem("Bank", JSON.stringify(banking));
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

  const encryptData = (data: string) => {
    const secretKey = import.meta.env.VITE_SECRET_KEY;

    if (!secretKey) {
      throw new Error(
        "Secret key is not defined in the environment variables."
      );
    }

    return CryptoJS.AES.encrypt(data, secretKey).toString();
  };

  useEffect(() => {
    if (idCard.length === 13) {
      const encryptedIdCard = encryptData(idCard);
      localStorage.setItem("idCard", encryptedIdCard);
    }
  }, [idCard, openBank]);

  useEffect(() => {
    if (bankingCode.length === 10) {
      const encryptedBankingCode = encryptData(bankingCode);
      localStorage.setItem("bankingCode", encryptedBankingCode);
    }
  }, [bankingCode, openBank]);

  const openBanking = () => {
    setOpenBank(!openBank);
    localStorage.setItem("OpenBank", JSON.stringify(!openBank));
  };

  const decryptData = (encryptedData: string) => {
    const secretKey = import.meta.env.VITE_SECRET_KEY;

    if (!secretKey) {
      throw new Error(
        "Secret key is not defined in the environment variables."
      );
    }

    const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  };

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
                    <span className="label-text">กำหนดราคาแพคเกจของท่าน</span>
                  </div>
                  <div className="flex justify-start items-center">
                    <input
                      type="number"
                      placeholder="กำหนดราคาแพคเกจของท่าน"
                      className="input input-bordered w-full"
                      value={packagePrice}
                      onChange={(e) => {
                        setPackagePrice(Number(e.target.value));
                        localStorage.setItem(
                          "packagePrice",
                          JSON.stringify(Number(e.target.value))
                        );
                      }}
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
                      localStorage.setItem(
                        "openDiscount",
                        JSON.stringify(true)
                      );
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
                      localStorage.setItem(
                        "openDiscount",
                        JSON.stringify(false)
                      );
                      localStorage.setItem(
                        "discounts",
                        JSON.stringify(Number(e.target.value))
                      );
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
                        min={0}
                        max={100}
                        step={1}
                        onChange={(e) => {
                          const value = Number(e.target.value);
                          if (value >= 1 && value <= 100) {
                            setDiscounts(value);
                            localStorage.setItem(
                              "discounts",
                              JSON.stringify(Number(value))
                            );
                          } else if (e.target.value === "") {
                            setDiscounts(0);
                            localStorage.setItem(
                              "discounts",
                              JSON.stringify(Number(0))
                            );
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
                    onChange={openBanking}
                    checked={openBank === false}
                    disabled={
                      !(
                        userInfo?.BankingCode &&
                        userInfo?.idcard &&
                        userInfo?.BankingName &&
                        userInfo?.BankingUsername &&
                        userInfo?.BankingUserlastname
                      )
                    }
                  />
                  <span className="ml-2">บัญชีธนาคารที่ผูกไว้</span>
                </div>

                <div>
                  <input
                    type="radio"
                    name="Bank"
                    value={0}
                    className="radio radio-primary"
                    onChange={openBanking}
                    checked={openBank === true}
                  />
                  <span className="ml-2">ไม่ได้ผูกบัญชีธนาคาร</span>
                </div>
              </div>
            </div>
            {openBank === true ? (
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
                                localStorage.setItem(
                                  "SelectedBank",
                                  JSON.stringify(bank)
                                );
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
                  <label className="form-control w-full mt-3">
                    <span className="label-text">
                      กรุณากรอกหมายเลขบัตรประชาชน
                    </span>
                    <input
                      id="idCard"
                      type="text"
                      placeholder="กรอกบัตรประจำตัวประชาชน"
                      className="input input-bordered w-full"
                      value={idCard}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (/^[0-9]*$/.test(value) && value.length <= 13) {
                          setIdCard(value);
                        }
                      }}
                      maxLength={13}
                    />
                    {idCard.length < 13 && (
                      <p className="text-red-500">
                        กรุณากรอกบัตรประจำตัวประชาชนให้ถูกต้อง
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
                        maxLength={10}
                      />
                    </div>
                    {/* แสดงข้อความแจ้งเตือนถ้าไม่ครบ 12 ตัว */}
                    {bankingCode.length > 0 && bankingCode.length !== 10 && (
                      <p className="text-red-500">
                        เลขบัญชีต้องมีความยาว 10 ตัว
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
                          // อนุญาตให้กรอกตัวอักษรภาษาไทย, อังกฤษ และสระ
                          if (/^[A-Za-zก-ฮะ-์\s]*$/.test(value)) {
                            setBankingUsername(value);
                            localStorage.setItem(
                              "bankingUsername",
                              JSON.stringify(value)
                            );
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
                          if (/^[A-Za-zก-ฮะ-์\s]*$/.test(value)) {
                            setBankingUserlastname(value);
                            localStorage.setItem(
                              "bankingUserlastname",
                              JSON.stringify(value)
                            );
                          }
                        }}
                      />
                    </div>
                  </label>
                </div>
              </div>
            ) : (
              openBank === false && (
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
                          {banks.map(
                            (bank) =>
                              bank.name === userInfo?.BankingName && (
                                <img
                                  key={bank.name}
                                  src={bank.logo}
                                  alt={bank.name}
                                  className="w-10 h-10 mr-2 rounded-full"
                                />
                              )
                          )}

                          <span>{userInfo?.BankingName}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="w-full">
                    <label className="form-control w-full mt-3">
                      <span className="label-text">
                        กรุณากรอกหมายเลขบัตรประชาชน
                      </span>
                      <input
                        id="idCard"
                        type="text"
                        placeholder="กรอกบัตรประจำตัวประชาชน"
                        className="input input-bordered w-full"
                        value={
                          userInfo?.idcard ? decryptData(userInfo.idcard) : ""
                        }
                      />
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
                          value={
                            userInfo?.BankingCode
                              ? decryptData(userInfo.BankingCode)
                              : ""
                          }
                        />
                      </div>
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
                          value={userInfo?.BankingUsername}
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
                          value={userInfo?.BankingUserlastname}
                        />
                      </div>
                    </label>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Price;
