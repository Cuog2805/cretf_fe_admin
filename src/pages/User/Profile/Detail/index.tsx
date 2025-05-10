import { PageContainer } from '@ant-design/pro-components';
import { Col, Row, Typography } from 'antd';
import ProfileNavigate from '../navigate-profile';
import ProfileDetailContent from './detail-profile';

const { Title } = Typography;

const ProfileDetail = () => {
  return (
    <PageContainer>
      <Row gutter={32}>
        <Col span={6}>
          <ProfileNavigate />
        </Col>

        <Col span={18}>
          <ProfileDetailContent />
        </Col>
      </Row>
    </PageContainer>
  );
};

export default ProfileDetail;
