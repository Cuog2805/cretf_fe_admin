import React from 'react';
import { Card, Button, Typography, Row, Col, Space } from 'antd';
import { PageContainer } from '@ant-design/pro-components';

const { Title, Text } = Typography;

const Section2 = () => {
  return (
    <PageContainer>
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
                Start touring homes, no strings attached
              </Title>
              <Text style={{ color: '#666' }}>
                Unlike many other agents, Redfin agents won’t ask you to sign an exclusive
                commitment before they’ll take you on a first tour.
              </Text>
              <Button type="primary" size="large" style={{ marginTop: 20 }}>
                Search for homes
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>
    </PageContainer>
  );
};

export default Section2;
