import React, { useEffect, useState, useRef, useContext } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { AuthContext } from "../AuthContext/auth.provider";

const Maps: React.FC<{ lat?: number; lng?: number }> = ({ lat, lng }) => {
  const [map, setMap] = useState<L.Map | null>(null);
  const mapRef = useRef<HTMLDivElement | null>(null);
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error("AuthContext must be used within an AuthProvider");
  }

  const { setLoadPage } = authContext;

  useEffect(() => {
    // เช็คว่า mapRef.current มีอยู่ก่อนที่จะสร้างแผนที่
    if (mapRef.current) {
      // กำหนดค่าพื้นฐานสำหรับตำแหน่ง
      const defaultLat = lat || 13.7563; // ใช้ค่าเริ่มต้น ถ้าตำแหน่ง lat ไม่ถูกส่งมา
      const defaultLng = lng || 100.5018; // ใช้ค่าเริ่มต้น ถ้าตำแหน่ง lng ไม่ถูกส่งมา

      // สร้างแผนที่ใหม่
      const initMap = L.map(mapRef.current).setView([defaultLat, defaultLng], 13);

      // ใช้ tile layer ที่สวยงาม
      L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      }).addTo(initMap);

      // เพิ่ม marker และ circle
      L.marker([defaultLat, defaultLng]).addTo(initMap);
      L.circle([defaultLat, defaultLng], {
        color: 'blue',
        fillColor: '#30aaff',
        fillOpacity: 0.5,
        radius: 1000, // ตัวอย่างรัศมี 1 กิโลเมตร
      }).addTo(initMap);

      setMap(initMap);
      setLoadPage(true);
      
      // ทำความสะอาดเมื่อคอมโพเนนต์ถูกลบ
      return () => {
        if (initMap) {
          initMap.off(); // ยกเลิกการฟังเหตุการณ์
          initMap.remove(); // ลบแผนที่
        }
      };
    }
  }, [mapRef, lat, lng]); // เพิ่ม lat และ lng เป็น dependencies
  

  return (
    <div>
      <div ref={mapRef} style={{ height: "400px", width: "100%" }} />
    </div>
  );
};

export default Maps;
