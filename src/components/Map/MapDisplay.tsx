import React, { useEffect } from 'react';
import { Card } from 'antd';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Sửa lỗi icon Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

// Interface cho marker
export interface MarkerData {
  latitude: number;
  longitude: number;
  label?: string;
}

// Props cho component MapDisplay
export interface MapDisplayProps {
  markers: MarkerData[];
  title?: string;
  height?: number | string;
  zoom?: number;
  focusFirstMarker?: boolean;
}

// Tạo icon mặc định cho Leaflet
const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34]
});

// Gán icon mặc định cho tất cả marker
L.Marker.prototype.options.icon = DefaultIcon;

// Component để fit tất cả markers vào view
const FitBounds: React.FC<{ markers: MarkerData[] }> = ({ markers }) => {
  const map = useMap();
  
  useEffect(() => {
    if (markers.length > 0) {
      const bounds = L.latLngBounds(markers.map(marker => [marker.latitude, marker.longitude]));
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [map, markers]);
  
  return null;
};

// Component mới để focus vào marker đầu tiên
const FocusFirstMarker: React.FC<{ 
  marker: MarkerData, 
  zoom: number,
  openPopup?: boolean
}> = ({ marker, zoom, openPopup = false }) => {
  const map = useMap();
  
  useEffect(() => {
    if (marker) {
      // Đặt view tới marker đầu tiên với mức zoom xác định
      map.setView([marker.latitude, marker.longitude], zoom);
      
      // Nếu muốn tự động mở popup của marker đầu tiên
      if (openPopup) {
        // Tìm marker trong bản đồ và mở popup của nó
        setTimeout(() => {
          map.eachLayer((layer) => {
            if (layer instanceof L.Marker) {
              const markerLatLng = layer.getLatLng();
              if (
                markerLatLng.lat === marker.latitude && 
                markerLatLng.lng === marker.longitude
              ) {
                layer.openPopup();
              }
            }
          });
        }, 100); // Đợi một chút để marker được render
      }
    }
  }, [map, marker, zoom, openPopup]);
  
  return null;
};

const MapDisplay: React.FC<MapDisplayProps> = ({
  markers = [],
  title = "Bản đồ",
  height = 400,
  zoom = 13, // Mức zoom cao hơn khi focus vào marker đầu tiên
  focusFirstMarker = true,
}) => {
  const defaultCenter: [number, number] = markers.length > 0 
    ? [
        markers.reduce((sum, marker) => sum + marker.latitude, 0) / markers.length,
        markers.reduce((sum, marker) => sum + marker.longitude, 0) / markers.length
      ] 
    : [21.0278, 105.8342]; // Hà Nội

  return (
    <Card title={title}>
      <div style={{ 
        height: typeof height === 'number' ? `${height}px` : height,
        width: '100%',
        position: 'relative'
      }}>
        <MapContainer
          style={{ width: '100%', height: '100%', borderRadius: '4px' }}
          center={defaultCenter}
          zoom={markers.length === 1 ? zoom : 5}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {markers.map((marker, index) => (
            <Marker 
              key={`marker-${index}-${marker.latitude}-${marker.longitude}`} 
              position={[marker.latitude, marker.longitude]}
            >
              {marker.label && (
                <Popup>
                  <div>{marker.label}</div>
                </Popup>
              )}
            </Marker>
          ))}
          
          {markers.length > 1 && !focusFirstMarker && <FitBounds markers={markers} />}
          
          {markers.length > 0 && focusFirstMarker && (
            <FocusFirstMarker 
              marker={markers[0]} 
              zoom={zoom}
              openPopup={true}
            />
          )}
        </MapContainer>
      </div>
    </Card>
  );
};

export default MapDisplay;