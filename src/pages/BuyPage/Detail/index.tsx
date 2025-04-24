import React, { useEffect, useState } from 'react';
import {
  Button,
  Typography,
  Row,
  Col,
  Space,
  Card,
  Flex,
  Tag,
  Divider,
  Anchor,
  Modal,
  Tabs,
} from 'antd';
import { PageContainer } from '@ant-design/pro-components';
import { HeartOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import FileRenderer from '@/utils/file/fileRender';
import { useParams } from '@umijs/max';
import { getOneDetailProperty } from '@/services/apis/propertyController';
import useStatus from '@/selectors/useStatus';
import Neighborhood from './neighborhood';
import Extend from './extend';
import Detail from './detail';
import Overview from './overview';
const { Title, Text } = Typography;

const PropertyDetail = () => {
  const { propertyId } = useParams();
  const { propertyStatusList } = useStatus();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('COMMON');
  const [propertyDetail, setPropertyDetail] = useState<API.PropertyDTO | null>(null);
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    getOneDetailProperty({ propertyId: propertyId }).then((res) => {
      setPropertyDetail(res);
    });
  }, [propertyId]);

  const imageCategories = {
    all: {
      title: 'All',
      count: 27,
      images: [
        '/image/banner-homes-for-sale.png',
        '/image/banner-homes-for-sale.png',
        '/image/banner-homes-for-sale.png',
        '/image/banner-homes-for-sale.png',
        '/image/banner-homes-for-sale.png',
        '/image/banner-homes-for-sale.png',
      ],
    },
    kitchen: {
      title: 'Kitchen',
      count: 4,
      images: ['/image/banner-homes-for-sale.png', '/image/banner-homes-for-sale.png'],
    },
    bathroom: {
      title: 'Bathroom',
      count: 3,
      images: ['/image/banner-homes-for-sale.png', '/image/banner-homes-for-sale.png'],
    },
    bedroom: {
      title: 'Bedroom',
      count: 5,
      images: ['/image/banner-homes-for-sale.png', '/image/banner-homes-for-sale.png'],
    },
    living: {
      title: 'Living',
      count: 4,
      images: ['/image/banner-homes-for-sale.png', '/image/banner-homes-for-sale.png'],
    },
    dining: {
      title: 'Dining',
      count: 2,
      images: ['/image/banner-homes-for-sale.png'],
    },
  };

  const handleImageClick = () => {
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
  };

  const [imageUrl, setImageUrl] = useState('#');

  useEffect(() => {
    // Giả sử fileId được truyền vào component
    const fileId = '3ab76eae-ba7a-4c57-99ce-d1abb45cf3ce';
    fetch(`/api/files/${fileId}/url`)
      .then((response) => response.json())
      .then((data) => {
        setImageUrl(data.url);
      });
  }, []);

  return (
    <>
      <div style={{ margin: '-24px' }}>
        {/* Header Section */}
        <div
          style={{
            position: 'fixed',
            top: '60px',
            left: 0,
            right: 0,
            backgroundColor: '#fff',
            zIndex: 1000,
            borderBottom: '1px solid #f0f0f0',
            width: '100%',
          }}
        >
          <div
            style={{
              maxWidth: '1200px',
              margin: '0 auto',
              padding: '0 24px',
              display: 'flex',
              alignItems: 'center',
              height: '56px',
            }}
          >
            <Button icon={<ArrowLeftOutlined />} type="text" style={{ marginRight: '24px' }}>
              Trở lại
            </Button>

            <div
              style={{
                flex: 1,
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <Anchor
                direction="horizontal"
                affix={false}
                items={[
                  {
                    key: 'overview',
                    href: '#overview',
                    title: 'Thông tin chung',
                  },
                  {
                    key: 'extend',
                    href: '#extend',
                    title: 'Thông tin thêm',
                  },
                  {
                    key: 'neighborhood',
                    href: '#neighborhood',
                    title: 'Khu vực xung quanh',
                  },
                  {
                    key: 'property-details',
                    href: '#property-details',
                    title: 'Chi tiết',
                  },
                ]}
                style={{
                  padding: '12px 16px',
                }}
              />
            </div>

            <Space style={{ marginLeft: '24px' }}>
              <Button icon={<HeartOutlined />}>Yêu thích</Button>
            </Space>
          </div>
        </div>
      </div>

      <PageContainer
        header={{
          title: '',
          breadcrumb: {
            routes: [],
          },
        }}
        style={{
          marginTop: '60px',
        }}
      >
        {/* Main Content */}
        <div
          style={{
            margin: '0 auto',
            padding: '24px',
            scrollPaddingTop: '180px',
            scrollBehavior: 'smooth',
          }}
        >
          <Card>
            <Row gutter={[8, 8]} style={{ marginBottom: 24 }}>
              <Col span={16}>
                <div onClick={handleImageClick} style={{ cursor: 'pointer' }}>
                  <FileRenderer
                    fileId={
                      propertyDetail?.propertyFilesDTOs?.find((file) => file.category === 'COMMON')
                        ?.fileIds?.[0] || ''
                    }
                    width="100%"
                    height={400}
                  />
                </div>
              </Col>
              <Col span={8}>
                <Row gutter={[8, 8]}>
                  {propertyDetail?.propertyFilesDTOs
                    ?.find((file) => file.category === 'COMMON')
                    ?.fileIds?.map((fileId) => (
                      <Col span={12} key={fileId}>
                        <div onClick={handleImageClick} style={{ cursor: 'pointer' }}>
                          <FileRenderer fileId={fileId} width="100%" height={196} />
                        </div>
                      </Col>
                    ))}
                </Row>
              </Col>
            </Row>
          </Card>

          {/* Image Preview Modal */}
          <Modal
            open={isModalVisible}
            onCancel={handleModalClose}
            footer={null}
            width="90%"
            style={{ top: 20 }}
          >
            <Tabs
              activeKey={activeTab}
              onChange={setActiveTab}
              items={propertyDetail?.propertyFilesDTOs?.map((file) => ({
                key: `${file.category}`,
                label: `${file.category}`,
                children: (
                  <div style={{ padding: '24px 0' }}>
                    <Row gutter={[16, 16]}>
                      {file.fileIds?.map((fileId, index) => (
                        <Col span={8} key={index}>
                          <FileRenderer fileId={fileId} width="100%" height={250} />
                        </Col>
                      ))}
                    </Row>
                  </div>
                ),
              }))}
            />
          </Modal>

          {/* Property Info */}
          <Row gutter={24}>
            <Col sm={24} md={16} lg={16}>
              <div id="overview">
                <Overview propertyDetail={propertyDetail} />
              </div>

              <div id="extend">
                <Extend propertyDetail={propertyDetail} />
              </div>

              <div id="neighborhood">
                <Neighborhood propertyDetail={propertyDetail} />
              </div>

              <div id="property-details">
                <Detail propertyDetail={propertyDetail} />
              </div>

              <div id="sale-tax-history">
                <Card title="Khác" style={{ height: '300px' }}>
                  {/* Sale & tax history content */}
                </Card>
              </div>
            </Col>
            <Col sm={24} md={8} lg={8}>
              <div
                style={{
                  position: 'sticky',
                  top: '60px',
                  zIndex: 99,
                }}
              >
                <Card style={{ marginTop: '24px' }}>
                  <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                    <Button type="primary" block size="large">
                      Đặt hẹn
                    </Button>
                    <Text type="secondary" style={{ textAlign: 'center', display: 'block' }}>
                      Tour for free, no strings attached
                    </Text>
                    <Button block size="large">
                      Bắt đầu offer
                    </Button>
                    <Text type="secondary" style={{ textAlign: 'center', display: 'block' }}>
                      Make a winning offer with the help of a local agent
                    </Text>
                  </Space>
                </Card>
              </div>
            </Col>
          </Row>
        </div>
      </PageContainer>
    </>
  );
};

export default PropertyDetail;
