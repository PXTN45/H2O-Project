import React from 'react'
import QRcode from '../../components/QR-code'


const MakePayment = () => {
  // ดึงขอมูลการจองโดยเลข id หากเป็น ที่พักเอา id ของ room มาด้วย มันดึงได้แหละ ^^
  return (
    <div>
        {/* ส่งจำนวนเงินไปกับ props QRcode */}
        <QRcode />
    </div>
  )
}

export default MakePayment
  