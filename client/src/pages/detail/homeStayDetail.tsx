import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { RxRulerSquare } from "react-icons/rx";
import { useLocation, useNavigate } from "react-router-dom";
import OpenStreetMap from "../../components/OpenStreetMap";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  FaStar,
  FaStarHalfAlt,
  FaRegStar,
  FaCheck,
  FaMale,
} from "react-icons/fa";
import {
  MdOutlineBathroom,
  MdOutlineBedroomChild,
  MdOutlineBedroomParent,
} from "react-icons/md";
import axiosPrivateUser from "../../hook/axiosPrivateUser";

const homeStayDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const { item } = location.state || {};
  console.log(item);
  // const [items, setItem] = useState<any>(null);

  console.log(id);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       console.log("1"); // Output before fetch
  //       const response = await axiosPrivateUser.get(`/homestay/${id}`);
  //       console.log(response.data); // Output after fetch
  //       setItem(response.data);
  //     } catch (error) {
  //       console.log("Error fetching additional data:", error);
  //     }
  //   };

  //   fetchData();
  // }, [id]);

  // console.log(item);

  const images = item.image.slice(1, 7).map((img: any, index: number) => {
    const specialClasses: { [key: number]: string } = {
      2: "rounded-tr-lg",
      5: "rounded-br-lg",
    };

    return (
      <div key={index} className="w-full h-full">
        <img
          className={`w-[250px] h-full object-cover ${
            specialClasses[index] || ""
          }`}
          src={img.image_upload}
          alt=""
        />
      </div>
    );
  });

  const radialProgress = (rating: number) => {
    if (rating) {
      const progress = (rating * 100) / 5;
      return progress;
    }
  };

  const facilities = item.facilities.map((facility: any, index: number) => {
    return (
      <div key={index} className="flex items-center gap-4">
        <FaCheck />
        {facility.facilities_name}
      </div>
    );
  });

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

  const handleScrollToElement =
    (id: string) =>
    (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
      event.preventDefault();
      const targetElement = document.getElementById(id);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: "smooth" });
      }
    };

  const handleButtonClick = () => {
    navigate("/bookingDetail", { state: { item } });
  };
  const num = 20;
  const discount = (num: number) => {
    const price = item.room_type[0].price_homeStay;
    if (price > 0) {
      const discount = (100 - num) / 100;
      const newPrice = price * discount;
      return newPrice;
    }
  };
  return (
    <div>
      <div className="container-sm mx-10">
        {/* รูปภาพ */}
        <div className="flex justify-center gap-4 mt-10 mb-5">
          <div>
            <img
              className="w-[600px] h-full object-cover rounded-l-lg "
              src={item.image[0]?.image_upload}
              alt=""
            />
          </div>
          <div className="grid grid-cols-3 gap-4">{images}</div>
        </div>

        <div className="flex shadow-boxShadow rounded-lg  w-full mb-5 p-5">
          <div className="flex items-center gap-4 w-1/2">
            <a
              href="homeStayDetail"
              className="text-decoration text-md "
              onClick={handleScrollToElement("homeStayDetail")}
            >
              รายละเอียดที่พัก
            </a>

            <a
              href="facilities"
              className="text-decoration"
              onClick={handleScrollToElement("facilities")}
            >
              สิ่งอำนวยความสะดวก
            </a>
            <a
              href="detailRoom"
              className="text-decoration"
              onClick={handleScrollToElement("detailRoom")}
            >
              ห้องพัก
            </a>
            <a
              href="review"
              className="text-decoration"
              onClick={handleScrollToElement("review")}
            >
              รีวิว
            </a>
          </div>
          <div className="flex flex-row justify-end w-1/2">
            <div className="flex items-center  ">
              <div className="flex font-bold  text-primaryUser">
                {renderStars(item.review_rating_homeStay || 0)}
              </div>
              <div className="flex gap-4 ml-2">
                <h1>{item.review_rating_homeStay}</h1>
                <h1>1350 รีวิว</h1>
              </div>
            </div>
          </div>
        </div>
        <div className="flex mb-10 gap-4">
          {/* homeStay Detail */}
          <div className="flex flex-col w-4/6 ">
            <div
              id="homeStayDetail"
              className="rounded-lg shadow-boxShadow p-10 mb-5"
            >
              <h1 className="font-bold text-xl">{item.name_homeStay}</h1>
              <p>{item.detail_homeStay}</p>
            </div>
            {/* facilities */}
            <div
              id="facilities"
              className="rounded-lg shadow-boxShadow p-10 mb-5"
            >
              <h1 className="font-bold text-xl mb-5">สิ่งอำนวยความสะดวก</h1>
              <div className="grid grid-cols-3 gap-4 ">{facilities}</div>
            </div>
          </div>
          {/* Maps */}
          <div className="flex flex-wrap w-2/6 h-[300px] shadow-boxShadow">
            <OpenStreetMap />
          </div>
        </div>
        {/* ส่วนการ์ดประเภทห้อง */}
        <div className="mb-5">
          <h1 id="detailRoom" className="font-bold text-3xl ">
            ประเภทห้อง
          </h1>
          <h1 className="text-lg mb-5">
            ห้องพัก 1 ประเภท | ข้อเสนอห้องพัก 1 ข้อเสนอ
          </h1>
          <div className="rounded-lg shadow-boxShadow p-10">
            ห้องเตียงใหญ่พร้อมระเบียง (Double Room with Balcony)
            <div className="flex gap-4 mt-3">
              <div className="">
                <p className="mb-5">ห้องพัก</p>
                {/* carousel */}
                <div className="carousel w-[400px]">
                  <div id="slide1" className="carousel-item relative w-full">
                    <img
                      src={item.image[0]?.image_upload}
                      className="w-full rounded-lg"
                    />
                    <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
                      <a
                        href="#slide4"
                        className="text-white hover:bg-white hover:text-dark rounded-2xl px-2 "
                      >
                        ❮
                      </a>
                      <a
                        href="#slide2"
                        className="text-white hover:bg-white hover:text-dark rounded-2xl px-2 "
                      >
                        ❯
                      </a>
                    </div>
                  </div>
                  <div id="slide2" className="carousel-item relative w-full">
                    <img
                      src="https://img.daisyui.com/images/stock/photo-1609621838510-5ad474b7d25d.webp"
                      className="w-full"
                    />
                    <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
                      <a
                        href="#slide1"
                        className="text-white hover:bg-white hover:text-dark rounded-2xl px-2 "
                      >
                        ❮
                      </a>
                      <a
                        href="#slide3"
                        className="text-white hover:bg-white hover:text-dark rounded-2xl px-2 "
                      >
                        ❯
                      </a>
                    </div>
                  </div>
                  <div id="slide3" className="carousel-item relative w-full">
                    <img
                      src="https://img.daisyui.com/images/stock/photo-1414694762283-acccc27bca85.webp"
                      className="w-full"
                    />
                    <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
                      <a
                        href="#slide2"
                        className="text-white hover:bg-white hover:text-dark rounded-2xl px-2 "
                      >
                        ❮
                      </a>
                      <a
                        href="#slide4"
                        className="text-white hover:bg-white hover:text-dark rounded-2xl px-2 "
                      >
                        ❯
                      </a>
                    </div>
                  </div>
                  <div id="slide4" className="carousel-item relative w-full">
                    <img
                      src="https://img.daisyui.com/images/stock/photo-1665553365602-b2fb8e5d1707.webp"
                      className="w-full"
                    />
                    <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
                      <a
                        href="#slide3"
                        className="text-white hover:bg-white hover:text-dark rounded-2xl px-2 "
                      >
                        ❮
                      </a>
                      <a
                        href="#slide1"
                        className="text-white hover:bg-white hover:text-dark rounded-2xl px-2 "
                      >
                        ❯
                      </a>
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <ul className="flex flex-col gap-3">
                    <li className="flex items-center">
                      <RxRulerSquare className="mr-2 text-2xl" />{" "}
                      {item.room_type[0].sizeBedroom_homeStay}
                    </li>
                    <li className="flex items-center">
                      <MdOutlineBathroom className="mr-2 text-2xl" />{" "}
                      {item.room_type[0].bathroom_homeStay} ห้องน้ำ
                    </li>

                    {item.room_type[0].bedroom_homeStay > 1 ? (
                      <li className="flex items-center">
                        <MdOutlineBedroomParent className="mr-2 text-2xl" />{" "}
                        {item.room_type[0].bedroom_homeStay} เตียงคู่
                      </li>
                    ) : (
                      <li className="flex items-center">
                        <MdOutlineBedroomChild className="mr-2 text-2xl" />{" "}
                        {item.room_type[0].bedroom_homeStay} เตียงเดี่ยว
                      </li>
                    )}
                  </ul>
                </div>
              </div>

              <div className="w-full">
                <div className="flex flex-row mb-5">
                  <h1 className="w-2/5">สิทธิประโยชน์</h1>
                  <h1 className="w-1/5">ผู้เข้าพัก</h1>
                  <p className="w-2/5">ราคา ต่อห้อง ต่อคืน</p>
                </div>
                <div className="shadow-boxShadow flex rounded-lg p-10 ">
                  <div className="w-2/6 border-r text-md">{facilities}</div>
                  <div className="w-1/6 flex justify-center border-r">
                    <FaMale className="text-xl" />{" "}
                    <FaMale className="text-xl" />{" "}
                  </div>
                  <div className="w-2/6 flex flex-col justify-end border-r p-2">
                    {num <= 0 ? (
                      <p className="flex justify-end font-bold text-alert text-3xl">
                        {item.room_type[0].price_homeStay} บาท
                      </p>
                    ) : (
                      <div>
                        <div className=" text-white w-1/2 rounded-xl flex justify-center item-center bg-alert">
                          SALE! ลด {num} %
                        </div>
                        <p className="flex justify-end text-sm ">
                          <del>{item.room_type[0].price_homeStay}</del> บาท
                        </p>
                        <p className="flex justify-end font-bold text-alert text-3xl">
                          {discount(num) || 0} บาท
                        </p>
                      </div>
                    )}

                    <p className="flex justify-end text-xs">ราคาต่อคืน</p>
                    <p className="flex justify-end text-xs">
                      (ก่อนรวมภาษีและค่าธรรมเนียม)
                    </p>
                  </div>
                  <div className="w-1/6 flex justify-center items-center pl-3">
                    <button
                      className="btn btn-warning w-full sm:btn-sm md:btn-md lg:btn-lg"
                      onClick={handleButtonClick}
                    >
                      จอง
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* review */}
        <div>
          <div id="review" className="text-2xl font-bold mb-5">
            รีวิวจากผู้เข้าพักจริง - {item.name_homeStay}
          </div>
          <div id="review" className="shadow-boxShadow rounded-lg p-10">
            <div className="text-xl"> คะแนนรีวิวโดยรวม</div>
            <div>
              <div className="flex flex-row gap-10 justify-around items-center p-10">
                <div
                  className="radial-progress  text-primaryUser text-5xl font-bold "
                  style={{
                    "--value": `${radialProgress(item.review_rating_homeStay)}`,
                    "--size": "12rem",
                    "--thickness": "2rem",
                  }}
                  role="progressbar"
                >
                  {item.review_rating_homeStay}
                </div>
                <div className="flex flex-row items-center gap-10">
                  <div className="flex flex-col gap-4 text-lg">
                    <p>ดีเยี่ยม</p>
                    <p>ดีมาก</p>
                    <p>ดี</p>
                    <p>ปานกลาง</p>
                    <p>ต้องปรับปรุง</p>
                  </div>
                  <div className="flex flex-col-reverse gap-5">
                    <progress
                      className="progress progress-info w-[400px] h-5"
                      value={10}
                      max="100"
                    ></progress>
                    <progress
                      className="progress progress-info w-[400px] h-5"
                      value="20"
                      max="100"
                    ></progress>
                    <progress
                      className="progress progress-info w-[400px] h-5"
                      value="40"
                      max="100"
                    ></progress>
                    <progress
                      className="progress progress-info w-[400px] h-5"
                      value="60"
                      max="100"
                    ></progress>
                    <progress
                      className="progress progress-info w-[400px] h-5"
                      value="80"
                      max="100"
                    ></progress>
                  </div>
                  <div className="flex flex-col gap-5  text-xl text-primaryUser">
                    <p className="flex gap-3 ">
                      <FaStar />
                      <FaStar />
                      <FaStar />
                      <FaStar />
                      <FaStar />
                    </p>
                    <p className="flex gap-3">
                      <FaStar />
                      <FaStar />
                      <FaStar />
                      <FaStar />
                      <FaRegStar />
                    </p>
                    <p className="flex gap-3">
                      <FaStar />
                      <FaStar />
                      <FaStar />
                      <FaRegStar />
                      <FaRegStar />
                    </p>
                    <p className="flex gap-3">
                      <FaStar />
                      <FaStar />
                      <FaRegStar />
                      <FaRegStar />
                      <FaRegStar />
                    </p>
                    <p className="flex gap-3">
                      <FaStar />
                      <FaRegStar />
                      <FaRegStar />
                      <FaRegStar />
                      <FaRegStar />
                    </p>
                  </div>
                </div>
              </div>
            </div>
            {/* Review */}
            <div className="flex gap-4 my-5 shadow-boxShadow rounded-xl p-5">
              <div className="w-1/4 p-5">
                <div className="flex gap-5 items-center text-xl">
                  <div className="avatar">
                    <div className="ring-primary ring-offset-base-100 w-12 rounded-full ring ring-offset-2">
                      <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
                    </div>
                  </div>
                  <div>Nattaphong</div>
                </div>
              </div>
              <div className="w-3/4 shadow-boxShadow p-5 rounded-lg">
                <div className="flex justify-between mb-5">
                  <div className="bg-primaryUser rounded-xl px-2 text-l text-white">
                    4.5/5
                  </div>
                  <div>02/สิงหาคม/2567</div>
                </div>
                <div>
                  เป็นโรงแรมและที่พักที่สะอาดมากๆถูกใจมากในการดูแลเรื่องของความสะอาด
                  แม่บ้านทำความสะอาดทุกอย่างในห้องได้ดีมากๆ
                  ถ้าเปรียบกับที่อื่นในราคาเท่ากันที่อื่นทำความสะอาดทุกวันเหมือนกัน
                  แต่ไม่เช็ดโต๊ะและถูกพื้นฯลฯ ฝักบัวอาบน้ำน้ำไหลมาก
                  เทวัญสะดวกทุกอย่างไม่ว่าจะเป็นแหล่งเที่ยวแหล่งของกิน
                  เราเลยพักต่ออีกสองคืน😊😊พนักงานทุกคนให้การบริการยิ้มแย้มแจ่มใสดีมากๆๆ
                </div>
              </div>
            </div>
            <div className="flex gap-4 my-5 shadow-boxShadow rounded-xl p-5">
              <div className="w-1/4 p-5">
                <div className="flex gap-5 items-center text-xl">
                  <div className="avatar">
                    <div className="ring-primary ring-offset-base-100 w-12 rounded-full ring ring-offset-2">
                      <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
                    </div>
                  </div>
                  <div>Suttiporn</div>
                </div>
              </div>
              <div className="w-3/4 shadow-boxShadow p-5 rounded-lg">
                <div className="flex justify-between mb-5">
                  <div className="bg-primaryUser rounded-xl px-2 text-l text-white">
                    4/5
                  </div>
                  <div>02/สิงหาคม/2567</div>
                </div>
                <div>
                  บริการดีค่ะ ห้องพักสะอาด แต่เสียงดังค่ะ แม่บ้านทำความสะอาด
                  วันที่เข้าพัก มีเด็กฝรั่งเสียงดังร้องไห้ นานมากค่ะ
                  ตั้งแต่เช้าเลย หลายชั่วโมง และได้ยินเสียงทีวีห้องติดกันชัดมาก
                  แต่ครั้งแรกค่ะที่เข้าพัก รอบหน้าก็ว่าจะไปอีกค่ะ ชอบการบริการ
                  ราคาถูก ใกล้ของกิน แนะนำค่ะ ใครที่หาโรงแรมที่พัก😊👍
                </div>
              </div>
            </div>
            <div className="flex gap-4 my-5 shadow-boxShadow rounded-xl p-5">
              <div className="w-1/4 p-5">
                <div className="flex gap-5 items-center text-xl">
                  <div className="avatar">
                    <div className="ring-primary ring-offset-base-100 w-12 rounded-full ring ring-offset-2">
                      <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
                    </div>
                  </div>
                  <div>Athiphong</div>
                </div>
              </div>
              <div className="w-3/4 shadow-boxShadow p-5 rounded-lg">
                <div className="flex justify-between mb-5">
                  <div className="bg-primaryUser rounded-xl px-2 text-l text-white">
                    4.5/5
                  </div>
                  <div>02/สิงหาคม/2567</div>
                </div>
                <div>
                  ส่วนตัวอ่านรีวิวมาบ้างแล้วก่อนพัก แย่บ้าง ดีบ้างปนๆกันไป
                  แถวที่พักร้านอาหาร โลตัส เซเว่นฉ่ำมาก ไม่ต้องไปไหนไกล
                  ห้องก็คุ้มราคามากกก ราคานี้ไม่มีอุปกรณ์ยาสระผม
                  หมวกครอบผมไดร์เป่าผม ถือว่าคุ้มแล้วค่ะคืนละ 4-500
                  แถมมีสระว่ายน้ำให้เล่นด้วย 08:00-20:00 แอร์เย็นดี ห้องกว้าง
                  เตียงใหญ่ ห้องน้ำสวย มีตู้เย็น ตู้เสื้อผ้า ทีวี ผ้าเช็ดตัว
                  ห้องพักดีแบบมากๆๆ ติดแค่เรื่องเสียงคอมแอร์ดัง+เสียงตู้เย็น
                  แต่ถ้าใครไม่ติดแนะนำเลยค่ะต้องมาลองพักซักครั้ง
                  ถ้ามีมีโอกาสก็จะไปพักอีกแน่นอนค่าา♥️♥️♥️
                </div>
              </div>
            </div>
            <div className="flex gap-4 my-5 shadow-boxShadow rounded-xl p-5">
              <div className="w-1/4 p-5">
                <div className="flex gap-5 items-center text-xl">
                  <div className="avatar">
                    <div className="ring-primary ring-offset-base-100 w-12 rounded-full ring ring-offset-2">
                      <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
                    </div>
                  </div>
                  <div>Supphalak</div>
                </div>
              </div>
              <div className="w-3/4 shadow-boxShadow p-5 rounded-lg">
                <div className="flex justify-between mb-5">
                  <div className="bg-primaryUser rounded-xl px-2 text-l text-white">
                    5/5
                  </div>
                  <div>02/สิงหาคม/2567</div>
                </div>
                <div>
                  แนะนำที่นี้คะ มากี่รอบก็ประทับใจ แต่รอบนี้ได้ชั้น 4
                  ติดหน้าลิฟต์ เราจองช่วงวันหยุดและด่วน
                  เข้าใจพนักงานคะเหลือห้องสุดท้าย ห้องใหญ่ สะอาดมากๆ
                  สามีชอบเพราะห้องไม่มีกลิ่นอับคะ แอร์เย็นไม่เสียงดัง
                  ผ้าเช็ดตัวสะอาด แต่วันเข้าพักมี 1
                  ผืนที่ขาดแต่แจ้งพนักงานเปลี่ยนมาเปลี่ยนให้ แม่บ้านมาเปลี่ยนให้
                  ไวมากคะ จะครั้งไหนๆก็จะไปพักอีกคะ
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default homeStayDetail;
