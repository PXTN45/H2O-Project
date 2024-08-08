import React from 'react';
import { usePaymentContext } from '../../AuthContext/paymentContext';

const BookingDetail: React.FC = () => {
  const { paymentData } = usePaymentContext();

  if (!paymentData) {
    return <div>No booking details available.</div>; 
  }
  console.log(paymentData);
  

  return (
    <div className='container-lg mx-auto'>
      {/* <h2>Booking Details</h2>
      <p>HomeStay Name: {paymentData.homeStayName}</p>
      <p>Total Price: {paymentData.totalPrice}</p> */}
      {/* Render other booking details */}
        <div className='flex'>
          <div>1</div>
          <div>2</div>
        </div>
    </div>
  );
};

export default BookingDetail;
