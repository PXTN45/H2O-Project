import React, { useState } from 'react';

const createHomeStay: React.FC = () => {
    const [checkInTime, setCheckInTime] = useState('15:00');
    const [checkOutTime, setCheckOutTime] = useState('12:00');
    const [cancellationPolicy, setCancellationPolicy] = useState('option1');

    return (
        <div className="flex max-w-7xl mx-auto p-4">
            {/* Left Sidebar */}
            <aside className="w-1/4 p-4">
                <div className="bg-white rounded-md shadow-md">
                    <ul className="space-y-4 p-4">
                        <li className="flex items-center space-x-2">
                            <div className="bg-blue-500 w-6 h-6 rounded-full flex items-center justify-center text-white font-bold">1</div>
                            <span className="font-medium">ข้อมูลพื้นฐาน</span>
                        </li>
                        <li className="flex items-center space-x-2">
                            <div className="bg-gray-300 w-6 h-6 rounded-full flex items-center justify-center text-white font-bold">2</div>
                            <span className="font-medium text-gray-500">สถานที่</span>
                        </li>
                        <li className="flex items-center space-x-2">
                            <div className="bg-gray-300 w-6 h-6 rounded-full flex items-center justify-center text-white font-bold">3</div>
                            <span className="font-medium text-gray-500">รายละเอียดที่พัก</span>
                        </li>
                        <li className="flex items-center space-x-2">
                            <div className="bg-gray-300 w-6 h-6 rounded-full flex items-center justify-center text-white font-bold">4</div>
                            <span className="font-medium text-gray-500">การตั้งค่าการจอง</span>
                        </li>
                        <li className="flex items-center space-x-2">
                            <div className="bg-gray-300 w-6 h-6 rounded-full flex items-center justify-center text-white font-bold">5</div>
                            <span className="font-medium text-gray-500">ราคา</span>
                        </li>
                        <li className="flex items-center space-x-2">
                            <div className="bg-gray-300 w-6 h-6 rounded-full flex items-center justify-center text-white font-bold">6</div>
                            <span className="font-medium text-gray-500">ข้อกำหนด</span>
                        </li>
                    </ul>
                </div>
            </aside>

            {/* Main Form Section */}
            <main className="w-3/4 p-6 bg-white rounded-md shadow-md">
                <h2 className="text-2xl font-semibold mb-4">สร้างที่พักของท่านที่เหมาะสม</h2>

                <div className="mb-6">
                    <label className="block font-medium mb-2">ตั้งชื่อที่พักของท่าน</label>
                    <input type="text" className="w-full border rounded-md p-2" />
                </div>

                <div className="mb-6">
                    <label className="block font-medium mb-2">เลือกประเภทที่พักของท่าน</label>
                    <div className="border rounded-md p-4">
                        <h3 className="text-lg font-semibold mb-3">ประเภทที่พัก</h3>
                        <div className="flex space-x-4">
                            <button className="border rounded-md p-4 flex flex-col items-center">
                                <img src="/path/to/house1.png" alt="บ้านพักตากอากาศ" className="h-12 mb-2" />
                                <span>บ้านพักตากอากาศ</span>
                            </button>
                            <button className="border rounded-md p-4 flex flex-col items-center">
                                <img src="/path/to/house2.png" alt="โฮมสเตย์" className="h-12 mb-2" />
                                <span>โฮมสเตย์</span>
                            </button>
                            <button className="border rounded-md p-4 flex flex-col items-center">
                                <img src="/path/to/house3.png" alt="วิลลา" className="h-12 mb-2" />
                                <span>วิลลา</span>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="mb-6">
                    <label className="block font-medium mb-2">กรอกคำอธิบายเกี่ยวกับที่พัก</label>
                    <textarea className="w-full border rounded-md p-2 h-24" />
                </div>

                <div className="mb-6">
                    <label className="block font-medium mb-2">เวลาเช็คอิน/เช็คเอาท์</label>
                    <div className="border rounded-md p-4">
                        <div className="flex justify-between items-center mb-4">
                            <label>ผู้เข้าพักสามารถเช็คอินได้ตั้งแต่</label>
                            <input
                                type="time"
                                className="border rounded-md p-2"
                                value={checkInTime}
                                onChange={(e) => setCheckInTime(e.target.value)}
                            />
                            <span>ถึง</span>
                            <input type="time" className="border rounded-md p-2" />
                        </div>
                        <div className="flex justify-between items-center">
                            <label>ผู้เข้าพักสามารถเช็คเอาท์ได้ถึง</label>
                            <input
                                type="time"
                                className="border rounded-md p-2"
                                value={checkOutTime}
                                onChange={(e) => setCheckOutTime(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <div className="mb-6">
                    <label className="block font-medium mb-2">นโยบายการยกเลิกการจอง</label>
                    <div className="border rounded-md p-4">
                        <div className="flex items-center mb-2">
                            <input
                                type="radio"
                                id="option1"
                                name="cancellationPolicy"
                                value="option1"
                                checked={cancellationPolicy === 'option1'}
                                onChange={() => setCancellationPolicy('option1')}
                                className="mr-2"
                            />
                            <label htmlFor="option1">คืนเงิน 100% หากทำการยกเลิกภายใน 7 วันก่อนการเข้าพัก</label>
                        </div>
                        <div className="flex items-center mb-2">
                            <input
                                type="radio"
                                id="option2"
                                name="cancellationPolicy"
                                value="option2"
                                checked={cancellationPolicy === 'option2'}
                                onChange={() => setCancellationPolicy('option2')}
                                className="mr-2"
                            />
                            <label htmlFor="option2">คืนเงิน 50% หากทำการยกเลิกภายใน 3 วันก่อนการเข้าพัก</label>
                        </div>
                        <div className="flex items-center">
                            <input
                                type="radio"
                                id="option3"
                                name="cancellationPolicy"
                                value="option3"
                                checked={cancellationPolicy === 'option3'}
                                onChange={() => setCancellationPolicy('option3')}
                                className="mr-2"
                            />
                            <label htmlFor="option3">คืนเงิน 50% หากทำการยกเลิกภายใน 7 วันหลังการเข้าพัก</label>
                        </div>
                    </div>
                </div>

                <button className="w-full bg-blue-500 text-white py-2 rounded-md">
                    ต่อไป
                </button>
            </main>
        </div>
    );
};

export default createHomeStay;