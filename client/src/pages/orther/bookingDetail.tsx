import React from "react";
import { useNavigate } from "react-router-dom";

const bookingDetail: React.FC = () => {
  const price = 1000;
  const navigate = useNavigate();
  const data = () => {
    navigate("/detailPayment", { state: { amount: price } });
  };
  return (
    <div className="container-sm mx-auto px-60 m-10">
      <div>
        <h1>การจองที่พักของคุณ</h1>
      </div>
      <div className="flex flex-row mb-5">
        <div className="flex flex-col mb-5 w-2/3 ">
          <div className="shadow-lg border rounded-lg mb-5 mr-5 p-5 ">
            <h1>รายละเอียดการติดต่อ</h1>
            <h1>
              กรุณากรอกข้อมูลให้ถูกต้องครบทุกช่อง
              เพื่อให้แน่ใจว่าคุณจะได้รับบัตรยืนยันการจองในอีเมลของคุณ
            </h1>
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
            <div className=" shadow-lg border rounded-lg mr-5 p-5 ">
              <p>รายละเอียดราคา</p>
              <div className="flex justify-between border-b border-indigo-100 ">
                <p>ราคาห้องพัก</p>
                <p>943.08 บาท</p>
              </div>
              <div>
                <button className="btn btn-warning" onClick={data}>
                  Click
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="w-1/3 shadow-lg border rounded-lg mr-5">jgjg</div>
      </div>
    </div>
  );
};

export default bookingDetail;
