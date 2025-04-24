import { FileOutlined, EllipsisOutlined } from "@ant-design/icons";
import { Card, Collapse, Space, Typography, Row, Col } from "antd";

const { Text, Title } = Typography;

const Detail = ({ propertyDetail }: { propertyDetail: API.PropertyDTO | null }) => {
  return (
    <div
      id="property-details"
      style={{
        paddingTop: '120px',
        marginTop: '-110px',
      }}
    >
      <Card title="Chi tiết">
        <Collapse
          defaultActiveKey={[]}
          items={[
            {
              key: '1',
              label: (
                <Space>
                  <FileOutlined />
                  <Text strong>Public facts</Text>
                </Space>
              ),
              children: (
                <>
                  <Row gutter={[48, 8]}>
                    <Col span={12}>
                      <Space direction="vertical" style={{ width: '100%' }}>
                        <div>
                          <Text>Beds: 3</Text>
                        </div>
                        <div>
                          <Text>Baths: 2.5</Text>
                        </div>
                        <div>
                          <Text>Finished Sq. Ft.: 1,878</Text>
                        </div>
                        <div>
                          <Text>Unfinished Sq. Ft.: —</Text>
                        </div>
                        <div>
                          <Text>Total Sq. Ft.: 1,878</Text>
                        </div>
                        <div>
                          <Text>Stories: 2.0</Text>
                        </div>
                      </Space>
                    </Col>
                    <Col span={12}>
                      <Space direction="vertical" style={{ width: '100%' }}>
                        <div>
                          <Text>Lot Size: 3,125 square feet</Text>
                        </div>
                        <div>
                          <Text>Style: Single Family Residential</Text>
                        </div>
                        <div>
                          <Text>Year Built: 1894</Text>
                        </div>
                        <div>
                          <Text>Year Renovated: —</Text>
                        </div>
                        <div>
                          <Text>County: Cook County</Text>
                        </div>
                        <div>
                          <Text>APN: 14192230160000</Text>
                        </div>
                      </Space>
                    </Col>
                  </Row>
                  <div style={{ marginTop: 16 }}>
                    <Text type="secondary">
                      Home facts updated by county records on Mar 27, 2025
                    </Text>
                  </div>
                </>
              ),
            },
            {
              key: '2',
              label: (
                <Space>
                  <EllipsisOutlined />
                  <Text strong>Other</Text>
                </Space>
              ),
              children: (
                <>
                  <Title level={5}>Listing Information</Title>
                  <Row gutter={[48, 8]}>
                    <Col span={12}>
                      <Space direction="vertical" style={{ width: '100%' }}>
                        <div>
                          <Text>List Price: 1300000</Text>
                        </div>
                        <div>
                          <Text>Target List Date: 2025-04-24T23:59:59</Text>
                        </div>
                        <div>
                          <Text>Property Type: Single Family Residential</Text>
                        </div>
                        <div>
                          <Text># of Bedrooms: 4</Text>
                        </div>
                      </Space>
                    </Col>
                    <Col span={12}>
                      <Space direction="vertical" style={{ width: '100%' }}>
                        <div>
                          <Text># of Bathrooms: 3.5</Text>
                        </div>
                        <div>
                          <Text>Year Built: 1896</Text>
                        </div>
                        <div>
                          <Text>Total Sq. Ft.: 1,878</Text>
                        </div>
                        <div>
                          <Text>Lot Sq. Ft.: 3125</Text>
                        </div>
                        <div>
                          <Text>Has Garage</Text>
                        </div>
                      </Space>
                    </Col>
                  </Row>
                </>
              ),
            },
          ]}
        />
      </Card>
    </div>
  );
};

export default Detail;
