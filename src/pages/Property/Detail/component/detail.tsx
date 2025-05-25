import React from 'react';
import { FileOutlined, EllipsisOutlined } from '@ant-design/icons';
import { Card, Collapse, Space, Typography, Row, Col } from 'antd';
import moment from 'moment';
import usePropertyType from '@/selectors/usePropertyType';
import dayjs from 'dayjs';
import useScale from '@/selectors/useScale';

const { Text, Title } = Typography;

const Detail = ({ propertyDetail }: { propertyDetail: API.PropertyDTO | null }) => {
  const { propertyTypeList } = usePropertyType();
  const { moneyScaleList } = useScale();

  return (
    <div
      id="property-details"
      style={{
        paddingTop: '120px',
        marginTop: '-110px',
      }}
    >
      <Card title="Chi tiết">
        <Collapse
          defaultActiveKey={['1', '2']}
          items={[
            {
              key: '1',
              label: (
                <Space>
                  <FileOutlined />
                  <Text strong>Thông tin bất động sản</Text>
                </Space>
              ),
              children: (
                <>
                  <Row gutter={[48, 8]}>
                    <Col span={12}>
                      <Space direction="vertical" style={{ width: '100%' }}>
                        <div>
                          <Text>
                            Phòng ngủ:{' '}
                            {
                              propertyDetail?.amenityDTOs?.find((item) => item.code === 'BED')
                                ?.valueDisplay
                            }
                          </Text>
                        </div>
                        <div>
                          <Text>
                            Phòng tắm:{' '}
                            {
                              propertyDetail?.amenityDTOs?.find((item) => item.code === 'BATH')
                                ?.valueDisplay
                            }
                          </Text>
                        </div>
                        <div>
                          <Text>
                            Diện tích sử dụng:{' '}
                            {
                              propertyDetail?.amenityDTOs?.find((item) => item.code === 'USAGE')
                                ?.valueDisplay
                            }
                          </Text>
                        </div>
                        <div>
                          <Text>
                            Diện tích sân vườn:{' '}
                            {
                              propertyDetail?.amenityDTOs?.find((item) => item.code === 'GARDEN')
                                ?.valueDisplay
                            }
                          </Text>
                        </div>
                        <div>
                          <Text>
                            Tổng diện tích:{' '}
                            {
                              propertyDetail?.amenityDTOs?.find((item) => item.code === 'AREA')
                                ?.valueDisplay
                            }
                          </Text>
                        </div>
                        <div>
                          <Text>
                            Loại bất động sản:{' '}
                            {
                              propertyTypeList.find(
                                (type) => type.propertyTypeId === propertyDetail?.propertyTypeId,
                              )?.name
                            }
                          </Text>
                        </div>
                        <div>
                          <Text>Năm xây dựng: {dayjs(propertyDetail?.buildIn).format('YYYY')}</Text>
                        </div>
                      </Space>
                    </Col>
                    <Col span={12}>
                      <Space direction="vertical" style={{ width: '100%' }}>
                        {propertyDetail?.amenityDTOs
                          ?.filter((d) => d.amenityType === 'AMENITY_TYPE_02')
                          .map((d) => (
                            <div>
                              <Text>{d.name}</Text>
                            </div>
                          ))}
                      </Space>
                    </Col>
                  </Row>
                </>
              ),
            },
            {
              key: '2',
              label: (
                <Space>
                  <Text strong>Thông tin giá</Text>
                </Space>
              ),
              children: (
                <>
                  <Title level={5}>Lịch sử giá</Title>
                  <Row gutter={[48, 8]}>
                    <Col span={24}>
                      <Space direction="vertical" style={{ width: '100%' }}>
                        {propertyDetail?.propertyPriceHistoryDTOs &&
                        propertyDetail?.propertyPriceHistoryDTOs.length > 0 ? (
                          propertyDetail?.propertyPriceHistoryDTOs.map((price, index) => (
                            <div key={price.propertyPriceHistoryId || index}>
                              <Text>
                                Giá niêm yết: {price.value} {moneyScaleList.find(d => d.scaleId === price.scaleUnit)?.unit} - Ngày:{' '}
                                {moment(price.dateCreated).format('DD/MM/YYYY')}
                              </Text>
                            </div>
                          ))
                        ) : (
                          <Text type="secondary">Không có dữ liệu lịch sử giá</Text>
                        )}
                      </Space>
                    </Col>
                  </Row>
                </>
              ),
            },
          ]}
        />
      </Card>
    </div>
  );
};

export default Detail;
