import { PageContainer } from '@ant-design/pro-components';
import { Col, Row, Typography } from 'antd';
import ProfileNavigate from '../navigate-profile';
import Appointment from './appointment';

const { Title } = Typography;

const AppointmentDetail = () => {
  return (
    <PageContainer>
      <Row gutter={32}>
        <Col span={6}>
          <ProfileNavigate />
        </Col>

        <Col span={18}>
          <Appointment />
        </Col>
      </Row>
    </PageContainer>
  );
};

export default AppointmentDetail;
