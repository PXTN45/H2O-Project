import L from "leaflet";
import { useContext, useEffect, useRef } from "react";
import { AuthContext } from "../AuthContext/auth.provider";

export const Maps: React.FC<{ lat?: number; lng?: number }> = ({ lat, lng }) => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error("AuthContext must be used within an AuthProvider");
  }

  const { setLoadPage } = authContext;

  useEffect(() => {
    if (mapRef.current) {
      const defaultLat = lat || 13.7563;
      const defaultLng = lng || 100.5018;

      const initMap = L.map(mapRef.current).setView([defaultLat, defaultLng], 13);

      L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      }).addTo(initMap);

      L.marker([defaultLat, defaultLng]).addTo(initMap);
      L.circle([defaultLat, defaultLng], {
        color: 'blue',
        fillColor: '#30aaff',
        fillOpacity: 0.5,
        radius: 1000,
      }).addTo(initMap);

      setLoadPage(true);

      return () => {
        if (initMap) {
          initMap.off();
          initMap.remove();
        }
      };
    }
  }, [mapRef, lat, lng]);

  return (
    <div>
      <div ref={mapRef} style={{ height: "400px", width: "100%" }} />
    </div>
  );
};


