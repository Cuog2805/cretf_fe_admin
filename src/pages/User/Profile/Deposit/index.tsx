import { PageContainer } from '@ant-design/pro-components';
import { Col, Divider, Row, Typography } from 'antd';
import ProfileNavigate from '../navigate-profile';
import Deposit from './detail-deposit';
import DepositRequest from './detail-deposit-request';

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
          <DepositRequest />
        </Col>
      </Row>
    </PageContainer>
  );
};

export default DepositDetail;
