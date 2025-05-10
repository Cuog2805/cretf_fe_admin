import { Card, Space, Tabs, List, Typography } from "antd";
import { ReadOutlined, ShopOutlined, CarOutlined } from "@ant-design/icons";

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
          <div style={{ height: '300px', background: '#f0f2f5', marginBottom: '16px' }}>
            {/* Map will be integrated here */}
            <iframe
              src="https://www.google.com/maps/embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
            />
          </div>

          <Tabs
            defaultActiveKey="schools"
            items={[
              {
                key: 'schools',
                label: (
                  <Space>
                    <ReadOutlined />
                    Schools
                  </Space>
                ),
                children: (
                  <div>
                    <Text>This home is within the Chicago Public Schools.</Text>
                    <List
                      itemLayout="horizontal"
                      dataSource={[
                        {
                          title: 'Blaine Elementary School',
                          description: 'Public, PreK-8 • Assigned • 0.3mi',
                        },
                        {
                          title: 'Lake View High School',
                          description: 'Public, 9-12 • Assigned • 0.4mi',
                        },
                      ]}
                      renderItem={(item) => (
                        <List.Item>
                          <List.Item.Meta title={item.title} description={item.description} />
                        </List.Item>
                      )}
                    />
                  </div>
                ),
              },
              {
                key: 'places',
                label: (
                  <Space>
                    <ShopOutlined />
                    Places
                  </Space>
                ),
                children: 'Places content',
              },
              {
                key: 'transit',
                label: (
                  <Space>
                    <CarOutlined />
                    Transit
                  </Space>
                ),
                children: 'Transit content',
              },
            ]}
          />
        </Space>
      </Card>
    </div>
  );
};

export default Neighborhood;
