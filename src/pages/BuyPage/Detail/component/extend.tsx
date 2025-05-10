import { Card, Row, Col, Typography } from 'antd';
import {
  ClockCircleOutlined,
  HomeOutlined,
  CarryOutOutlined,
  AreaChartOutlined,
  AppstoreOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import usePropertyType from '@/selectors/usePropertyType';

const { Text } = Typography;

const Extend = ({ propertyDetail }: { propertyDetail: API.PropertyDTO | null }) => {
  const { propertyTypeList } = usePropertyType();

  function timeAgo(date: any): string {
    const givenDate = new Date(date);
    const now = new Date();
    const diffInMs = now.getTime() - givenDate.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));

    if (diffInHours < 24) {
      return `${diffInHours} giờ trước`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} ngày trước`;
    }
  }

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
                <div>Thời gian đăng</div>
                <Text type="secondary">{timeAgo(propertyDetail?.dateCreated)}</Text>
              </div>
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <div style={{ fontSize: '24px' }}>
                <HomeOutlined />
              </div>
              <div>
                <div>Loại bất động sản</div>
                <Text type="secondary">
                  {
                    propertyTypeList.find(
                      (type) => type.propertyTypeId === propertyDetail?.propertyTypeId,
                    )?.name
                  }
                </Text>
              </div>
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <div style={{ fontSize: '24px' }}>
                <CarryOutOutlined />
              </div>
              <div>
                <div>Năm xây dựng</div>
                <Text type="secondary">{dayjs(propertyDetail?.buildIn).format('YYYY')}</Text>
              </div>
            </Card>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default Extend;
