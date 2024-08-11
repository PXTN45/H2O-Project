import React, { useEffect, useState, useRef, useContext } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Modal from "react-modal";
import axiosPublic from "../hook/axiosPublic";
import { AuthContext } from "../AuthContext/auth.provider";
import { MdClose } from "react-icons/md";
import { FaMapMarkerAlt } from "react-icons/fa";

Modal.setAppElement("#root");

type Location = {
  latitude_location: number;
  longitude_location: number;
};

type HomeStayAndPackage = {
  _id: string;
  location: Location[];
};

type Coordinate = HomeStayAndPackage & {
  lat: number;
  lng: number;
};

interface OverpassTags {
  name?: string;
  amenity?: string;
  shop?: string;
}

interface OverpassElement {
  type: string;
  id: number;
  tags: OverpassTags;
}

interface OverpassResponse {
  elements: OverpassElement[];
}

interface Coordinates {
  HomeStay: Coordinate[];
  Packages: Coordinate[];
}

interface CoordinatedArrays {
  coordinates: Coordinates[];
  places: string[];
}

const OpenStreetMap: React.FC = () => {
  const [map, setMap] = useState<L.Map | null>(null);
  const [marker, setMarker] = useState<L.Marker | null>(null);
  const [circle, setCircle] = useState<L.Circle | null>(null);
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
  const mapRef = useRef<HTMLDivElement | null>(null);

  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error("AuthContext must be used within an AuthProvider");
  }

  const { setMapData , setDrawerData } = authContext;

  useEffect(() => {
    if (modalIsOpen) {
      setTimeout(() => {
        if (mapRef.current && !map) {
          const initMap = L.map(mapRef.current, {
            center: [13.7563, 100.5018],
            zoom: 15,
          });

          L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: "© OpenStreetMap contributors",
          }).addTo(initMap);

          setMap(initMap);
        }
      }, 100); // 100ms delay for modal to render completely
    } else {
      // Clean up map when modal is closed
      if (map) {
        map.off();
        map.remove();
        setMap(null);
      }
    }
  }, [modalIsOpen, map]);

  useEffect(() => {
    if (map) {
      const handleMapClick = async (e: L.LeafletMouseEvent) => {
        if (!map) return;

        if (marker) {
          marker.remove();
        }
        if (circle) {
          circle.remove();
        }

        const popupContent = `ตำแหน่งที่คุณคลิก: ${e.latlng.toString()}`;

        const newMarker = L.marker(e.latlng)
          .addTo(map)
          .bindPopup(popupContent)
          .openPopup();
        setMarker(newMarker);

        const newCircle = L.circle(e.latlng, {
          color: "#4B99FA",
          fillColor: "#72B1FF",
          fillOpacity: 0.3,
          radius: 1000, // 1,000 เมตร = 1 กิโลเมตร
        }).addTo(map);
        setCircle(newCircle);

        try {
          const responseHomeStay = await axiosPublic.get<HomeStayAndPackage[]>(
            "/homestay"
          );
          const responsePackage = await axiosPublic.get<HomeStayAndPackage[]>(
            "/package"
          );

          const HomeStayData: HomeStayAndPackage[] = responseHomeStay.data;
          const PackageData: HomeStayAndPackage[] = responsePackage.data;

          const CoordinatesHomestay: Coordinate[] = HomeStayData.map((element) => ({
            ...element,
            lat: element.location[0].latitude_location,
            lng: element.location[0].longitude_location,
          }));

          const CoordinatesPackages: Coordinate[] = PackageData.map((element) => ({
            ...element,
            lat: element.location[0].latitude_location,
            lng: element.location[0].longitude_location,
          }));

          // Filter coordinates within the circle
          const filteredCoordinatesHomestay: Coordinate[] = CoordinatesHomestay.filter(
            (coord) =>
              newCircle.getLatLng().distanceTo([coord.lat, coord.lng]) <=
              newCircle.getRadius()
          );

          const filteredCoordinatesPackages: Coordinate[] = CoordinatesPackages.filter(
            (coord) =>
              newCircle.getLatLng().distanceTo([coord.lat, coord.lng]) <=
              newCircle.getRadius()
          );

          // Fetch places from Overpass API
          const response = await fetch(
            `https://overpass-api.de/api/interpreter?data=[out:json];node(around:1000,${e.latlng.lat},${e.latlng.lng})["tourism"];out;`
          );
          const data: OverpassResponse = await response.json();

          const newPlaces = data.elements
            .filter((element) => element.tags.name)
            .map((element) => element.tags.name!);

          const places =
            newPlaces.length > 0
              ? newPlaces
              : ["ไม่มีสถานที่ท่องเที่ยวในรัศมีนี้"];

          const coordinates: Coordinates = {
            HomeStay: filteredCoordinatesHomestay,
            Packages: filteredCoordinatesPackages,
          };

          const coordinatedArrays: CoordinatedArrays = {
            coordinates: [coordinates],
            places: [...places],
          };

          setMapData(coordinatedArrays);
          setDrawerData(null)
        } catch (error) {
          console.error("เกิดข้อผิดพลาดในการดึงข้อมูล:", error);
        }

        setModalIsOpen(false);
      };

      map.on("click", handleMapClick);

      return () => {
        map.off("click", handleMapClick);
      };
    }
  }, [map, marker, circle, setMapData]);

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  return (
    <div id="map_Search" className="w-full h-full">
      <button
        className="bg-map w-full h-full text-dark font-bold rounded-md hover:text-primaryBusiness"
        onClick={openModal}
      >
        <div className="flex flex-col items-center justify-center w-full h-full">
          <FaMapMarkerAlt className="text-alert text-[64px]" />
          <div className="mt-3">SEARCH ON MAP</div>
        </div>
      </button>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Map Modal"
        className="modal-map relative w-4/5 h-4/5 overflow-hidden flex flex-col translate-x-[-50%] translate-y-[-50%] top-[50%] left-[50%] rounded-xl"
        overlayClassName="fixed inset-0 bg-white bg-opacity-80 z-[60]"
      >
        <div className="flex items-center justify-between p-2 rounded-tl-[10px]">
          <h1 className="font-bold ml-2">OpenStreetMap</h1>
          <button
            onClick={closeModal}
            className="text-[16px] border-none bg-transparent"
          >
            <MdClose />
          </button>
        </div>
        <div id="map" ref={mapRef} className="w-full h-[90%]" />
        <footer className="text-center p-2">
          <p>แผนที่แสดงข้อมูลในรัศมี 1 กิโลเมตร</p>
        </footer>
      </Modal>
    </div>
  );
};

export default OpenStreetMap;
