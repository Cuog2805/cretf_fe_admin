import { PageContainer } from '@ant-design/pro-components';
import { Col, Row, Typography } from 'antd';
import ProfileNavigate from '../navigate-profile';
import ProfileChangePasswordContent from './change-password';
const { Title } = Typography;

const ProfileEdit = () => {
  return (
    <PageContainer>
      <Row gutter={32}>
        <Col span={6}>
          <ProfileNavigate />
        </Col>

        <Col span={18}>
            <ProfileChangePasswordContent></ProfileChangePasswordContent>
        </Col>
      </Row>
    </PageContainer>
  );
};

export default ProfileEdit;
