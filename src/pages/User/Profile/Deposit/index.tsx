import { PageContainer } from '@ant-design/pro-components';
import { Col, Row, Typography } from 'antd';
import ProfileNavigate from '../navigate-profile';
import Deposit from './detail-deposit';

const { Title } = Typography;

const DepositDetail = () => {
  return (
    <PageContainer>
      <Row gutter={32}>
        <Col span={6}>
          <ProfileNavigate />
        </Col>

        <Col span={18}>
          <Deposit />
        </Col>
      </Row>
    </PageContainer>
  );
};

export default DepositDetail;
