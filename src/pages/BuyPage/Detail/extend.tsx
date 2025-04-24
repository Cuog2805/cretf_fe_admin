import { Card, Row, Col, Typography } from "antd";
import { ClockCircleOutlined, HomeOutlined, CarryOutOutlined, AreaChartOutlined, AppstoreOutlined } from "@ant-design/icons";

const { Text } = Typography;

const Extend = ({ propertyDetail }: { propertyDetail: API.PropertyDTO | null }) => {
  return (
    <div
      id="extend"
      style={{
        paddingTop: '120px',
        marginTop: '-110px',
      }}
    >
      <Card title="Thông tin thêm">
        <Row gutter={[24, 24]}>
          <Col span={8}>
            <Card>
              <div style={{ fontSize: '24px' }}>
                <ClockCircleOutlined />
              </div>
              <div>
                <div>Single-family</div>
                <Text type="secondary">Property Type</Text>
              </div>
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <div style={{ fontSize: '24px' }}>
                <HomeOutlined />
              </div>
              <div>
                <div>Single-family</div>
                <Text type="secondary">Property Type</Text>
              </div>
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <div style={{ fontSize: '24px' }}>
                <CarryOutOutlined />
              </div>
              <div>
                <div>1896</div>
                <Text type="secondary">Year Built</Text>
              </div>
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <div style={{ fontSize: '24px' }}>
                <AreaChartOutlined />
              </div>
              <div>
                <div>3,125 sq ft</div>
                <Text type="secondary">Lot Size</Text>
              </div>
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <div style={{ fontSize: '24px' }}>
                <AppstoreOutlined />
              </div>
              <div>
                <div>$692</div>
                <Text type="secondary">Price/Sq.Ft.</Text>
              </div>
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <div style={{ fontSize: '24px' }}>
                <AppstoreOutlined />
              </div>
              <div>
                <div>Has garage</div>
                <Text type="secondary">Parking</Text>
              </div>
            </Card>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default Extend;
