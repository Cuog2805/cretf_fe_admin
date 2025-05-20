import React, { useEffect, useState } from 'react';
import { Layout, Input, Menu, Avatar, Select, Button, Form, Typography, Row, Col } from 'antd';
import { NodeCollapseOutlined, SearchOutlined, UserOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { Content } from 'antd/es/layout/layout';
import { Option } from 'antd/es/mentions';
import useCategoryShareds from '@/selectors/useCategoryShareds';
import CustomTreeSelect from '@/components/tree/treeSelectCustom';
import { findIdAndNodeChildrenIds, findNodeById } from '@/components/tree/treeUtil';
import useLocations from '@/selectors/useLocation';
import { useNavigate } from '@umijs/max';

const { Title, Paragraph } = Typography;

const Banner: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { dmMainMenu } = useCategoryShareds();
  const { locationTree } = useLocations();

  useEffect(() => {
    //form.setFieldValue('type', dmMainMenu.find((d) => d.code === '01')?.categorySharedId);
  }, []);

  const handleSearch = () => {
    form.validateFields().then(values => {
      console.log('Search values:', values);
      // Xử lý tìm kiếm
      if(values.type === 'SOLD')
        navigate(`/buy/houses-for-sale/${values.locationId ?? ''}`);
      if(values.type === 'RENT')
        navigate(`/rent/houses-for-rent/${values.locationId ?? ''}`);
    });
  };

  return (
    <div className="banner-container">
      <div 
        className="banner-background"
        style={{
          background: "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('/image/banner-01.png') center/cover no-repeat",
          height: 600,
          position: 'relative',
        }}
      >
        <div 
          className="banner-content"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '100%',
            maxWidth: 1200,
            padding: '0 24px',
          }}
        >
          <Row justify="center">
            <Col xs={24} sm={24} md={20} lg={18} xl={16}>
              <div style={{ textAlign: 'center', marginBottom: 32 }}>
                <Title 
                  level={1} 
                  style={{ 
                    color: 'white', 
                    fontSize: '42px', 
                    fontWeight: 'bold',
                    margin: 0,
                    marginBottom: 16,
                    textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
                  }}
                >
                  Tìm ngôi nhà phù hợp
                </Title>
                <Paragraph 
                  style={{ 
                    color: 'white', 
                    fontSize: '18px',
                    marginBottom: 32,
                    textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)'
                  }}
                >
                  Khám phá hàng ngàn bất động sản với mức giá phù hợp ngân sách của bạn
                </Paragraph>
              </div>

              <Form 
                form={form} 
                layout="horizontal"
                style={{ 
                  background: 'white',
                  padding: '24px 32px',
                  borderRadius: '8px',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
                }}
                initialValues={{ type: 'SOLD' }}
              >
                <Row gutter={16} align="middle">
                  <Col xs={24} sm={24} md={6} lg={6}>
                    <Form.Item 
                      name="type" 
                      rules={[{ required: true, message: 'Vui lòng chọn loại' }]}
                    >
                      <Select 
                        size="large"
                        style={{ width: '100%' }}
                        placeholder="Loại giao dịch"
                        dropdownStyle={{ borderRadius: '4px' }}
                      >
                        {[{type: 'SOLD', label: 'Đang bán'}, {type: 'RENT', label: 'Cho thuê'}].map((d) => (
                            <Option key={d.type} value={d.type}>
                              {d.label}
                            </Option>
                          ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={24} md={14} lg={14}>
                    <Form.Item 
                      name="locationId"
                    >
                      <CustomTreeSelect
                        size="large"
                        style={{ width: '100%' }}
                        dropdownStyle={{ maxHeight: 400, overflow: 'auto', borderRadius: '4px' }}
                        treeData={locationTree}
                        fieldNames={{ label: 'name', value: 'locationId', children: 'children' }}
                        placeholder="Nhập địa điểm bạn muốn tìm kiếm"
                        allowClear
                        treeDefaultExpandAll
                        suffixIcon={<EnvironmentOutlined />}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={24} md={4} lg={4}>
                    <Form.Item>
                      <Button
                        type="primary"
                        size="large"
                        icon={<SearchOutlined />}
                        onClick={handleSearch}
                        block
                      >
                      </Button>
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
};

export default Banner;