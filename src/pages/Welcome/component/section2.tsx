import React from 'react';
import { Card, Button, Typography, Row, Col, Space } from 'antd';
import { PageContainer } from '@ant-design/pro-components';
import { useNavigate } from '@umijs/max';

const { Title, Text } = Typography;

const Section2 = () => {
  const navigate = useNavigate();

  return (
    <PageContainer title={''}>
      <Card style={{ width: '100%' }}>
        <Row gutter={[24, 24]}>
          <Col span={8}>
            <div style={{ flex: 1 }}>
              <img
                src="/image/home-started-01.png"
                alt="Touring homes"
                style={{ width: '100%', borderRadius: 12 }}
              />
            </div>
          </Col>
          <Col span={16}>
            <Space direction="vertical">
              <Title level={3} style={{ fontWeight: 'bold' }}>
                Định giá nhà của bạn
              </Title>
              <Text style={{ color: '#666' }}>
                Đưa ra giá trị căn hộ hoặc nhà đang bán phù hợp với thị trường hiện nay.
              </Text>
              <Button type="primary" size="large" onClick={() => {navigate('/sell/my-homes-valuation')}} style={{ marginTop: 20 }}>
                Định giá
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>
    </PageContainer>
  );
};

export default Section2;
