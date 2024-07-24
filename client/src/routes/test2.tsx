import React, { useEffect, useState, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Modal from 'react-modal';

// Make sure to bind modal to your appElement (important for accessibility)
Modal.setAppElement('#root');

const MapComponent: React.FC = () => {
  const [map, setMap] = useState<L.Map | null>(null);
  const [marker, setMarker] = useState<L.Marker | null>(null);
  const [circle, setCircle] = useState<L.Circle | null>(null);
  const [places, setPlaces] = useState<string[]>([]);
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
  const mapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (modalIsOpen) {
      // Delay map initialization to ensure modal is fully opened
      setTimeout(() => {
        if (mapRef.current && !map) {
          // Initialize map only if it doesn't already exist
          const initMap = L.map(mapRef.current, {
            center: [13.7563, 100.5018],
            zoom: 15,
          });

          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
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

        // Remove old marker and circle
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
          color: 'red',
          fillColor: '#f03',
          fillOpacity: 0.3,
          radius: 1000, // 1,000 เมตร = 1 กิโลเมตร
        }).addTo(map);
        setCircle(newCircle);

        try {
          const response = await fetch(
            `https://overpass-api.de/api/interpreter?data=[out:json];node(around:1000,${e.latlng.lat},${e.latlng.lng})["tourism"];out;`
          );
          const data = await response.json();

          const newPlaces: string[] = [];
          data.elements.forEach((element: any) => {
            const placeName = element.tags.name;
            if (placeName) {
              newPlaces.push(placeName);
            }
          });
          setPlaces(newPlaces.length > 0 ? newPlaces : ['ไม่มีสถานที่ท่องเที่ยวในรัศมีนี้']);
        } catch (error) {
          console.error('เกิดข้อผิดพลาดในการดึงข้อมูล:', error);
        }

        // Close the map modal after adding marker and circle
        setModalIsOpen(false);
      };

      map.on('click', handleMapClick);

      return () => {
        map.off('click', handleMapClick);
      };
    }
  }, [map, marker, circle]);

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  return (
    <div>
      <h2>แผนที่</h2>
      <button onClick={openModal}>เปิดแผนที่</button>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Map Modal"
        style={{
          content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            width: '80%',
            height: '80%',
            overflow: 'hidden',
          },
        }}
      >
        <h2>แผนที่</h2>
        <button onClick={closeModal}>ปิด</button>
        <div id="map" ref={mapRef} style={{ height: '100%', width: '100%' }}></div>
      </Modal>
      <div id="places">
        <h3>สถานที่ท่องเที่ยว:</h3>
        {places.length > 0 ? (
          places.map((place, index) => (
            <div key={index}>{place}</div>
          ))
        ) : (
          <div>ยังไม่มีข้อมูลสถานที่ท่องเที่ยว</div>
        )}
      </div>
    </div>
  );
};

export default MapComponent;
