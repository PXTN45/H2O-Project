import React from "react";
import { FaCheck } from "react-icons/fa";
import { IoBedOutline } from "react-icons/io5";
import { TbSmokingNo } from "react-icons/tb";
import { FaMale } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import OpenStreetMap from "../../components/OpenStreetMap";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

const homeStayDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { item } = location.state || {};
  console.log(item);
  if (!item) {
    // ถ้าไม่มีข้อมูล ให้ redirect ไปหน้าอื่นหรือแสดงข้อความเตือน
    navigate("/");
    return null;
  }

  const images = item.image.slice(0, 7).map((img: any, index: number) => {
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
  const imagesCarousel = item.image.map((img: any, index: number) => {
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

  const handleScrollToElement = (id: string) => (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    event.preventDefault();
    const targetElement = document.getElementById(id);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleButtonClick = () => {
    navigate("/bookingDetail", { state: { item } });
  };

  const discount = (100-0)/100
  console.log(discount);
  const newPrice = 1500 * discount
  console.log(newPrice);
  
  const discount1 = () => {
    const price = item.room_type[0].price_homeStay
    const discount = 20/100
    const newPrice = price * discount
  }
  return (
    <div>
      <div className="container-sm mx-10">
        <div className="flex justify-center gap-4 mt-10 mb-5">
          <div className="">
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
          <a href="homeStayDetail" className="text-decoration" onClick={handleScrollToElement('homeStayDetail')}>รายละเอียดที่พัก</a>
          <a href="detailRoom" className="text-decoration" onClick={handleScrollToElement('detailRoom')}>ห้องพัก</a>
          <a href="facilities" className="text-decoration" onClick={handleScrollToElement('facilities')}>สิ่งอำนวยความสะดวก</a>
          <a href="homeStayDetail" className="text-decoration" onClick={handleScrollToElement('target-element-1')}>รีวิว</a>
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
          <div className="flex flex-col w-4/6 ">
            <div id="homeStayDetail" className="rounded-lg shadow-boxShadow p-10 mb-5">
              <h1 className="font-bold text-xl">{item.name_homeStay}</h1>
              <p>{item.detail_homeStay}</p>
            </div>
            <div id="facilities" className="rounded-lg shadow-boxShadow p-10 mb-5">
              <h1 className="font-bold text-xl mb-5">สิ่งอำนวยความสะดวก</h1>
              <div className="grid grid-cols-4 gap-4">{facilities}</div>
            </div>
          </div>
          <div className="flex flex-wrap w-2/6 h-[300px] shadow-boxShadow">
            <OpenStreetMap />
          </div>
          <div></div>
        </div>
        <div>
          <div >
            <h1 id="detailRoom" className="font-bold text-3xl ">ประเภทห้อง</h1>
            <h1 className="text-lg mb-5">
              ห้องพัก 4 ประเภท | ข้อเสนอห้องพัก 14 ข้อเสนอ
            </h1>
            <div className="rounded-lg shadow-boxShadow p-10">
              ห้องเตียงใหญ่พร้อมระเบียง (Double Room with Balcony)
              <div className="flex gap-4 mt-3">
                <div className="">
                  <p className="mb-5">ห้องพัก</p>

                  <div className="carousel w-[400px]">
                    <div id="slide1" className="carousel-item relative w-full">
                      <img
                        src={item.image[0]?.image_upload}
                        className="w-full rounded-lg"
                      />
                      <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
                        <a href="#slide4">❮</a>
                        <a href="#slide2">❯</a>
                      </div>
                    </div>
                    <div id="slide2" className="carousel-item relative w-full">
                      <img
                        src="https://img.daisyui.com/images/stock/photo-1609621838510-5ad474b7d25d.webp"
                        className="w-full"
                      />
                      <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
                        <a href="#slide1">❮</a>
                        <a href="#slide3">❯</a>
                      </div>
                    </div>
                    <div id="slide3" className="carousel-item relative w-full">
                      <img
                        src="https://img.daisyui.com/images/stock/photo-1414694762283-acccc27bca85.webp"
                        className="w-full"
                      />
                      <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
                        <a href="#slide2">❮</a>
                        <a href="#slide4">❯</a>
                      </div>
                    </div>
                    <div id="slide4" className="carousel-item relative w-full">
                      <img
                        src="https://img.daisyui.com/images/stock/photo-1665553365602-b2fb8e5d1707.webp"
                        className="w-full"
                      />
                      <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
                        <a href="#slide3">❮</a>
                        <a href="#slide1">❯</a>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <ul>
                      <li className="flex items-center">
                        <IoBedOutline className="mr-2" /> 1 เตียงใหญ่
                      </li>
                      <li className="flex items-center">
                        <TbSmokingNo className="mr-2" /> ห้องปลอดบุหรี่
                      </li>
                      <li className="flex items-center">
                        <IoBedOutline className="mr-2" /> 1 เตียงใหญ่
                      </li>
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
                      <p className="flex justify-end text-sm ">
                        <del>{item.room_type[0].price_homeStay}</del> บาท
                      </p>
                      <p className="flex justify-end font-bold text-alert text-3xl">
                        {item.room_type[0].price_homeStay} บาท
                      </p>
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
        </div>
      </div>
    </div>
  );
};

export default homeStayDetail;
