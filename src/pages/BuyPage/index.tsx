import React, { useEffect, useState } from 'react';
import {
  Input,
  Select,
  Button,
  Typography,
  Row,
  Col,
  Card,
  Space,
  Flex,
  Carousel,
  Tag,
  List,
} from 'antd';
import { PageContainer, ProCard } from '@ant-design/pro-components';
import { HeartFilled, HeartOutlined, LeftOutlined, LikeOutlined, RightOutlined } from '@ant-design/icons';
import { getAllProperties, getOneDetailProperty } from '@/services/apis/propertyController';
import { UNPAGED } from '@/core/constant';
import useStatus from '@/selectors/useStatus';
import FileRenderer from '@/utils/file/fileRender';
import { useNavigate } from '@umijs/max';
import useCategoryShareds from '@/selectors/useCategoryShareds';
const { Title, Paragraph, Text } = Typography;
const { Option } = Select;

const priceOptions = [
  'No min',
  '$50k',
  '$100k',
  '$150k',
  '$200k',
  '$300k',
  '$400k',
  '$500k',
  '$750k',
  '$1M+',
];

const BuyPage = () => {
  const navigate = useNavigate();
  const { propertyStatusList } = useStatus();
  const { dmAmenityType} = useCategoryShareds()

  const [propertyList, setPropertyList] = useState<API.PropertyDTO[]>([]);

  useEffect(() => {
    getAllProperties(UNPAGED, {}).then((res) => {
      setPropertyList(res.content ?? []);
    });
  }, []);

  return (
    <PageContainer
      header={{
        title: null,
      }}
    >
      <Space direction="vertical" style={{ width: '100%' }}></Space>
      <Flex vertical gap="small">
        <Card>
          <Row gutter={12}>
            <Col xs={24} sm={24} md={12}>
              <Title level={2} style={{ fontWeight: 700 }}>
                Nhà đang bán gần bạn
              </Title>
              <Paragraph style={{ fontSize: 16, marginBottom: 32 }}>
                Tìm nhà để bán gần bạn. Xem ảnh, thông tin nhà mở cửa và thông tin chi tiết về bất
                động sản gần đó.
              </Paragraph>
            </Col>
            <Col xs={24} sm={24} md={12}>
              <img
                src="/image/banner-homes-for-sale.png"
                alt="House preview"
                style={{
                  width: '100%',
                  maxHeight: '300px',
                  borderRadius: 12,
                  objectFit: 'cover',
                }}
              />
            </Col>
          </Row>
        </Card>
        <Card>
          <Row gutter={12}>
            <Col xs={24} sm={12} md={8}>
              <Input
                size="large"
                placeholder="Thành phố, Địa chỉ, Trường học, ZIP"
                style={{ marginBottom: 16, width: '100%' }}
              />
            </Col>
            <Col xs={24} sm={24} md={12}>
              <Row gutter={12}>
                <Col span={12}>
                  <Select defaultValue="No min" size="large" style={{ width: '100%' }}>
                    {priceOptions.map((value) => (
                      <Option key={value} value={value}>
                        {value}
                      </Option>
                    ))}
                  </Select>
                </Col>
                <Col span={12}>
                  <Select defaultValue="No max" size="large" style={{ width: '100%' }}>
                    {priceOptions.map((value) => (
                      <Option key={value} value={value}>
                        {value}
                      </Option>
                    ))}
                  </Select>
                </Col>
              </Row>
            </Col>
            <Col xs={24} sm={24} md={4}>
              <Button type="primary" size="large" block>
                Tìm kiếm
              </Button>
            </Col>
          </Row>
        </Card>

        <List
          grid={{
            gutter: 16,
            xs: 1,
            sm: 2,
            md: 2,
            lg: 3,
            xl: 3,
            xxl: 3,
          }}
          dataSource={propertyList}
          renderItem={(item) => (
            <List.Item>
              <Card
                hoverable
                style={{ width: '100%', borderRadius: 12, overflow: 'hidden' }}
                onClick={() => {
                  navigate(`/buy/houses-for-sale/detail/${item.propertyId}`);
                }}
                cover={
                  <div style={{ position: 'relative' }}>
                    <Carousel 
                      arrows 
                      dots={true}
                      infinite={true}
                      autoplay={true}
                    >
                      {item.propertyFilesDTOs
                        ?.filter((file) => file.category === 'COMMON')
                        .flatMap(fileGroup => fileGroup.fileIds || [])
                        .map((fileId) => (
                          <div key={fileId} style={{ height: 240, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <FileRenderer 
                              fileId={fileId} 
                              height={240} 
                              width="100%"
                              style={{ objectFit: 'cover' }}
                            />
                          </div>
                        ))
                      }
                    </Carousel>

                    {/* Tags section */}
                    <div
                      style={{
                        position: 'absolute',
                        top: 12,
                        left: 12,
                        zIndex: 1,
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 8,
                      }}
                    >
                      {item.statusIds?.map((statusId) => {
                        const status = propertyStatusList.find((s) => s.statusId === statusId);
                        return (
                          <Tag
                            key={statusId}
                            color={status?.color}
                            style={{
                              fontWeight: 600,
                            }}
                          >
                            {status?.name?.toUpperCase()}
                          </Tag>
                        );
                      })}
                    </div>
                  </div>
                }
              >
                <div style={{ position: 'relative', minHeight: '180px' }}>
                  <div>
                    <Title level={4} style={{ marginBottom: 8 }}>
                      {item.propertyPriceNewest?.value}&ensp;{item.propertyPriceNewest?.scaleUnit}
                    </Title>
                    <Text>
                      {item.amenityDTOs?.find((item) => item.code === 'BED')?.valueDisplay}
                      &ensp;·&ensp;
                      {item.amenityDTOs?.find((item) => item.code === 'BATH')?.valueDisplay}
                      &ensp;·&ensp;
                      {item.amenityDTOs?.find((item) => item.code === 'AREA')?.valueDisplay}
                    </Text>
                    <br />
                    <Text type="secondary">{item.addressSpecific}</Text>
                    <br />
                    <br />
                    <Space size="small" wrap>
                      {item.amenityDTOs
                        ?.filter((am) => am.amenityType === 'AMENITY_TYPE_02')
                        .map((am) => <Text type="secondary">{am.name}</Text>)}
                    </Space>
                  </div>
                  
                  {/* Action section */}
                  <div style={{ 
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    background: '#fff',
                    padding: '8px 0 0 8px'
                  }}>
                    <Space>
                      <Button 
                        type="text" 
                        size="large"
                        icon={<HeartFilled style={{ color: '#ff4d4f' }} />}
                        onClick={(e) => {
                          e.stopPropagation();
                          
                        }}
                      >
                      </Button>
                    </Space>
                  </div>
                </div>
              </Card>
            </List.Item>
          )}
        />
      </Flex>
    </PageContainer>
  );
};

export default BuyPage;
