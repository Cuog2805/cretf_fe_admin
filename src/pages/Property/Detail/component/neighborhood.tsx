import { Card, Space, Tabs, List, Typography, Row, Col, Divider } from 'antd';
import { ReadOutlined, ShopOutlined, CarOutlined } from '@ant-design/icons';
import MapDisplay from '@/components/Map/MapDisplay';

const { Text } = Typography;

const Neighborhood = ({ propertyDetail }: { propertyDetail: API.PropertyDTO | null }) => {
  return (
    <div
      id="neighborhood"
      style={{
        paddingTop: '120px',
        marginTop: '-110px',
      }}
    >
      <Card title="Khu vực xung quanh">
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <MapDisplay
            markers={[
              {
                latitude: propertyDetail?.coordinatesDTO?.latitude ?? 21.0278,
                longitude: propertyDetail?.coordinatesDTO?.longitude ?? 105.8342,
                label: propertyDetail?.addressSpecific ?? '',
              },
              ...(propertyDetail?.publicFacilityDTOs?.map((facility) => {
                return {
                  latitude: facility?.coordinatesDTO?.latitude ?? 21.0278,
                  longitude: facility?.coordinatesDTO?.longitude ?? 105.8342,
                  label: facility.name ?? '',
                };
              }) ?? []),
            ]}
            height={300}
          />

          <Card>
            <List
              itemLayout="horizontal"
              dataSource={propertyDetail?.publicFacilityDTOs}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    title={item.name}
                    description={'Khoảng cách: ' + item.distance?.toPrecision(5) + ' m'}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Space>
      </Card>
    </div>
  );
};

export default Neighborhood;
