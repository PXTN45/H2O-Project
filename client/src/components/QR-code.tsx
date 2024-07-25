import React from "react";
import { useNavigate } from "react-router-dom";

const QRcode: React.FC = () => {
  const price = 1000;
  const navigate = useNavigate();
  const data = () => {
    navigate("/detailPayment", { state: { amount: price } });
  };
  return (
    <div>
      <button onClick={data}>Click</button>
    </div>
  );
};

export default QRcode;
