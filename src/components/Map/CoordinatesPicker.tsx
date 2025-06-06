import React, { useEffect, useState } from 'react';
import { Form, Card, Row, Col, Typography, Divider, Input, Button } from 'antd';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const { Title, Text } = Typography;

interface CoordinatesPickerProps {
  value?: Partial<API.CoordinatesDTO>;
  onChange?: (value: API.CoordinatesDTO) => void;
}

interface MapClickHandlerProps {
  onChange: (coordinates: API.CoordinatesDTO) => void;
}

interface CenterUpdaterProps {
  coordinates: API.CoordinatesDTO;
}

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

L.Marker.prototype.options.icon = DefaultIcon;

// Component để lắng nghe sự kiện click trên bản đồ
const MapClickHandler: React.FC<MapClickHandlerProps> = ({ onChange }) => {
  const map = useMapEvents({
    click: (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      onChange({
        latitude: parseFloat(lat.toFixed(6)),
        longitude: parseFloat(lng.toFixed(6)),
      });
    },
  });

  return null;
};

// Component để cập nhật center khi coordinates thay đổi
const CenterUpdater: React.FC<CenterUpdaterProps> = ({ coordinates }) => {
  const map = useMap();

  useEffect(() => {
    if (coordinates.latitude && coordinates.longitude) {
      map.setView([coordinates.latitude, coordinates.longitude], 15);
    }
  }, [coordinates, map]);

  return null;
};

// Component để invalidate size sau khi render
const MapSizeInvalidator: React.FC = () => {
  const map = useMap();

  useEffect(() => {
    // Delay để đảm bảo container đã render xong
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 100);

    return () => clearTimeout(timer);
  }, [map]);

  return null;
};

const CoordinatesPicker: React.FC<CoordinatesPickerProps> = ({ value = {}, onChange }) => {
  // Hà Nội
  const defaultLocation = {
    latitude: 21.0227346,
    longitude: 105.7957638,
  };

  const [coordinates, setCoordinates] = useState<API.CoordinatesDTO>({
    latitude: value.latitude ?? defaultLocation.latitude,
    longitude: value.longitude ?? defaultLocation.longitude,
  });

  const [mapKey, setMapKey] = useState(0); // Key để force re-render map

  // Cập nhật state khi value thay đổi từ bên ngoài
  useEffect(() => {
    if (value && (value.latitude !== undefined || value.longitude !== undefined)) {
      const newCoordinates = {
        latitude: value.latitude !== undefined ? value.latitude : coordinates.latitude,
        longitude: value.longitude !== undefined ? value.longitude : coordinates.longitude,
      };
      setCoordinates(newCoordinates);
      // Force re-render map khi coordinates thay đổi từ bên ngoài
      setMapKey(prev => prev + 1);
    }
  }, [value]);

  // Xử lý khi coordinates thay đổi
  const handleCoordinatesChange = (newCoordinates: API.CoordinatesDTO): void => {
    setCoordinates(newCoordinates);
    if (onChange) {
      onChange(newCoordinates);
    }
  };

  // Xử lý khi nhập thủ công
  const handleLatitudeChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;
    const latitude = parseFloat(value);
    if (!isNaN(latitude) && latitude >= -90 && latitude <= 90) {
      const newCoordinates: API.CoordinatesDTO = {
        ...coordinates,
        latitude,
      };
      handleCoordinatesChange(newCoordinates);
    }
  };

  const handleLongitudeChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;
    const longitude = parseFloat(value);
    if (!isNaN(longitude) && longitude >= -180 && longitude <= 180) {
      const newCoordinates: API.CoordinatesDTO = {
        ...coordinates,
        longitude,
      };
      handleCoordinatesChange(newCoordinates);
    }
  };

  // Button để reset về vị trí mặc định
  const handleResetToDefault = () => {
    handleCoordinatesChange(defaultLocation);
  };

  return (
    <Card>
      <Title level={4}>Chọn vị trí trên bản đồ</Title>
      <Text type="secondary">Click trên bản đồ hoặc nhập tọa độ để chọn vị trí</Text>

      <Row gutter={16} style={{ marginTop: '16px', marginBottom: '16px' }}>
        <Col xs={24} sm={10}>
          <Input
            addonBefore="Vĩ độ"
            value={coordinates.latitude}
            onChange={handleLatitudeChange}
            placeholder="10.762622"
            type="number"
            step="0.000001"
            min="-90"
            max="90"
          />
        </Col>
        <Col xs={24} sm={10}>
          <Input
            addonBefore="Kinh độ"
            value={coordinates.longitude}
            onChange={handleLongitudeChange}
            placeholder="106.660172"
            type="number"
            step="0.000001"
            min="-180"
            max="180"
          />
        </Col>
        <Col xs={24} sm={4}>
          <Button onClick={handleResetToDefault} style={{ width: '100%' }}>
            Reset
          </Button>
        </Col>
      </Row>

      {/* Container với CSS inline để tránh conflict */}
      <div 
        style={{ 
          height: '400px', 
          width: '100%', 
          position: 'relative',
          border: '1px solid #d9d9d9',
          borderRadius: '6px',
          overflow: 'hidden'
        }}
      >
        <MapContainer
          key={mapKey} // Force re-render khi cần
          style={{ 
            width: '100%', 
            height: '100%',
            zIndex: 1
          }}
          center={[
            coordinates?.latitude ?? defaultLocation.latitude,
            coordinates?.longitude ?? defaultLocation.longitude,
          ]}
          zoom={15}
          scrollWheelZoom={true}
          zoomControl={true}
          attributionControl={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            maxZoom={19}
            tileSize={256}
          />

          {coordinates.latitude && coordinates.longitude && (
            <Marker
              position={[coordinates.latitude, coordinates.longitude]}
              draggable={true}
              eventHandlers={{
                dragend: (e) => {
                  const marker = e.target;
                  const position = marker.getLatLng();
                  handleCoordinatesChange({
                    latitude: parseFloat(position.lat.toFixed(6)),
                    longitude: parseFloat(position.lng.toFixed(6)),
                  });
                },
              }}
            >
              <Popup>
                <div>
                  <strong>Vị trí đã chọn</strong>
                  <br />
                  <Text style={{ fontSize: '12px' }}>
                    Lat: {coordinates.latitude?.toFixed(6)}
                    <br />
                    Lng: {coordinates.longitude?.toFixed(6)}
                  </Text>
                  <br />
                  <Text type="secondary" style={{ fontSize: '11px' }}>
                    Kéo thả marker để thay đổi vị trí
                  </Text>
                </div>
              </Popup>
            </Marker>
          )}

          <MapClickHandler onChange={handleCoordinatesChange} />
          <CenterUpdater coordinates={coordinates} />
          <MapSizeInvalidator />
        </MapContainer>
      </div>
    </Card>
  );
};

// CSS override để đảm bảo map hiển thị đúng
const mapStyles = `
  .leaflet-container {
    width: 100% !important;
    height: 100% !important;
  }
  
  .leaflet-tile-pane {
    filter: none !important;
  }
  
  .leaflet-control-zoom {
    margin-left: 10px !important;
    margin-top: 10px !important;
  }
`;

// Inject CSS styles
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = mapStyles;
  if (!document.head.querySelector('style[data-leaflet-fix]')) {
    styleElement.setAttribute('data-leaflet-fix', 'true');
    document.head.appendChild(styleElement);
  }
}

export default CoordinatesPicker;