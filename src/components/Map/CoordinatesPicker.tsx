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

const CoordinatesPicker: React.FC<CoordinatesPickerProps> = ({ value = {}, onChange }) => {
  // Mặc định tọa độ Hà Nội nếu không có giá trị
  const defaultLocation = {
    latitude: 21.0278,
    longitude: 105.8342,
  };

  const [coordinates, setCoordinates] = useState<API.CoordinatesDTO>({
    latitude: value.latitude ?? defaultLocation.latitude,
    longitude: value.longitude ?? defaultLocation.longitude,
  });

  // Cập nhật state khi value thay đổi từ bên ngoài
  useEffect(() => {
    if (value && (value.latitude !== undefined || value.longitude !== undefined)) {
      setCoordinates({
        latitude: value.latitude !== undefined ? value.latitude : coordinates.latitude,
        longitude: value.longitude !== undefined ? value.longitude : coordinates.longitude,
      });
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
    if (!isNaN(latitude)) {
      const newCoordinates: API.CoordinatesDTO = {
        ...coordinates,
        latitude,
      };
      setCoordinates(newCoordinates);
      if (onChange) {
        onChange(newCoordinates);
      }
    }
  };

  const handleLongitudeChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;
    const longitude = parseFloat(value);
    if (!isNaN(longitude)) {
      const newCoordinates: API.CoordinatesDTO = {
        ...coordinates,
        longitude,
      };
      setCoordinates(newCoordinates);
      if (onChange) {
        onChange(newCoordinates);
      }
    }
  };

  return (
    <Card>
      <Title level={4}>Vị trí tài sản</Title>

      <Row gutter={16} style={{ marginTop: '16px', marginBottom: '16px' }}>
        <Col xs={24} sm={12}>
          <Input
            addonBefore="Vĩ độ (Latitude)"
            value={coordinates.latitude}
            onChange={handleLatitudeChange}
            placeholder="Nhập vĩ độ"
          />
        </Col>
        <Col xs={24} sm={12}>
          <Input
            addonBefore="Kinh độ (Longitude)"
            value={coordinates.longitude}
            onChange={handleLongitudeChange}
            placeholder="Nhập kinh độ"
          />
        </Col>
      </Row>

      <div style={{ height: '300px', width: '100%', position: 'relative' }}>
        <MapContainer
          style={{ width: '100%', height: '100%', borderRadius: '4px' }}
          center={[
            coordinates?.latitude ?? defaultLocation.latitude,
            coordinates?.longitude ?? defaultLocation.longitude,
          ]}
          zoom={15}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <Marker
            position={[
              coordinates?.latitude ?? defaultLocation.latitude,
              coordinates?.longitude ?? defaultLocation.longitude,
            ]}
          >
            <Popup>
              <div>
                <strong>Vị trí tài sản</strong>
                <div>
                  Tọa độ: {coordinates.latitude}, {coordinates.longitude}
                </div>
              </div>
            </Popup>
          </Marker>

          <MapClickHandler onChange={handleCoordinatesChange} />
          <CenterUpdater coordinates={coordinates} />
        </MapContainer>
      </div>
    </Card>
  );
};

export default CoordinatesPicker;
