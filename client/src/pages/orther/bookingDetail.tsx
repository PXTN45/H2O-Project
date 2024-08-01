import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const bookingDetail: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { item } = location.state || {};
  console.log(item.room_type[0].price_homeStay);
  if (!item) {
    // ถ้าไม่มีข้อมูล ให้ redirect ไปหน้าอื่นหรือแสดงข้อความเตือน
    navigate("/");
    return null;
  }
  const data = () => {
    navigate("/detailPayment", { state: { amount: item.room_type[0].price_homeStay } });
  };
  return (
    <div className="container-sm mx-auto px-60 m-10">
      <div>
        <h1>การจองที่พักของคุณ</h1>
      </div>
      <div className="flex flex-row mb-5">
        <div className="flex flex-col mb-5 w-2/3 ">
          <div className="shadow-boxShadow rounded-lg mb-5 mr-5 p-5 ">
            <h1>รายละเอียดการติดต่อ</h1>
            <div className="flex flex-row">
              <div className="flex flex-col mr-5">
                <h1>ชื่อ :</h1>
                <h1>Email</h1>
                <h1>หมายเลขโทรศัพท์มือถือ :</h1>
              </div>
              <div className="flex flex-col">
                <h1>Nattaphong Sriphaophan</h1>
                <h1>644259012@webmail.npru.ac.th</h1>
                <h1>0928983405</h1>
              </div>
            </div>
          </div>
          <div className="">
            <div className=" shadow-boxShadow rounded-lg mr-5 p-5 ">
              <p>รายละเอียดราคา</p>
              <div className="flex justify-between ">
                <p>ราคาห้องพัก</p>
                <p>{item.room_type[0].price_homeStay} บาท</p>
              </div>
              <div>
                <button className="btn btn-warning" onClick={data}>
                  Click
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="w-1/3 shadow-boxShadow rounded-lg mr-5">jgjg</div>
      </div>
    </div>
  );
};

export default bookingDetail;
