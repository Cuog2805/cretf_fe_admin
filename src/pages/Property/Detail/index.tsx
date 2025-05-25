import React, { useEffect, useState } from 'react';
import { Button, Typography, Row, Col, Space, Card, Anchor, Modal, Tabs, message } from 'antd';
import { PageContainer } from '@ant-design/pro-components';
import { HeartOutlined, ArrowLeftOutlined, HeartFilled } from '@ant-design/icons';
import FileRenderer from '@/components/FIle/fileRender';
import { useNavigate, useParams } from '@umijs/max';
import { addToFavourite, getOneDetailProperty, removeToFavourite } from '@/services/apis/propertyController';
import useStatus from '@/selectors/useStatus';
import Neighborhood from './component/neighborhood';
import Extend from './component/extend';
import Detail from './component/detail';
import Overview from './component/overview';
import { useCurrentUser } from '@/selectors/useCurrentUser';
import MapDisplay from '@/components/Map/MapDisplay';
import AppointmentModal from '@/pages/User/Profile/Appointment/appointment-modal';
import Comment from './component/commnet';
import PropertyComment from './component/commnet';
import ApprovalHistory from './component/approve-history';
const { Title, Text } = Typography;

const PropertyDetail = () => {
  const { propertyId } = useParams();
  const currentUser = useCurrentUser();
  const { propertyStatusList } = useStatus();
  const navigate = useNavigate();

  const [isModalImagesVisible, setIsModalImagesVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('COMMON');
  const [propertyDetail, setPropertyDetail] = useState<API.PropertyDTO | null>(null);
  const [isModalAppointmentVisible, setIsModalAppointmentVisible] = useState(false);

  const showModalAppointment = () => {
    setIsModalAppointmentVisible(true);
  };

  const handleCancelAppointmentModal = () => {
    setIsModalAppointmentVisible(false);
  };

  useEffect(() => {
    getOneDetailProperty({ propertyId: propertyId }).then((res) => {
      setPropertyDetail(res.data ?? {});
    });
  }, [propertyId]);

  const handleImageClick = () => {
    setIsModalImagesVisible(true);
  };

  const handleModalClose = () => {
    setIsModalImagesVisible(false);
  };

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
            <Button
              icon={<ArrowLeftOutlined />}
              type="text"
              style={{ marginRight: '24px' }}
              onClick={() => history.back()}
            >
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
                  {
                    key: 'property-comment',
                    href: '#property-comment',
                    title: 'Nhận xét',
                  },
                  {
                    key: 'approve-history',
                    href: '#approve-history',
                    title: 'Lịch sử duyệt',
                  },
                ]}
                style={{
                  padding: '12px 16px',
                }}
              />
            </div>
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
              <Col sm={24} md={24} lg={12}>
                <Card title="Hình ảnh">
                  <div onClick={handleImageClick} style={{ cursor: 'pointer' }}>
                    <Row gutter={[8, 8]}>
                      {propertyDetail?.propertyFilesDTOs
                        ?.flatMap((file) => file.fileIds || [])
                        .slice(0, 4)
                        .map((fileId) => (
                          <Col span={12} key={fileId}>
                            <div onClick={handleImageClick} style={{ cursor: 'pointer' }}>
                              <FileRenderer fileId={fileId} width="100%" height={196} />
                            </div>
                          </Col>
                        ))}
                    </Row>
                  </div>
                </Card>
              </Col>
              <Col sm={24} md={24} lg={12}>
                <MapDisplay
                  markers={[
                    {
                      latitude: propertyDetail?.coordinatesDTO?.latitude ?? 21.0227784,
                      longitude: propertyDetail?.coordinatesDTO?.longitude ?? 105.8163641,
                      label: propertyDetail?.addressSpecific,
                    },
                  ]}
                />
              </Col>
            </Row>
          </Card>

          {/* Image Preview Modal */}
          <Modal
            open={isModalImagesVisible}
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
            <Col sm={24} md={24} lg={24}>
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

              <div id="property-comment">
                <PropertyComment propertyDetail={propertyDetail} />
              </div>

              <div id="approve-history">
                <ApprovalHistory propertyDetail={propertyDetail} />
              </div>
            </Col>
            {/* <Col sm={24} md={8} lg={8}>
              <div
                style={{
                  position: 'sticky',
                  top: '60px',
                  paddingTop: '50px',
                  marginTop: '-65px',
                  zIndex: 99,
                }}
              >
                <Card style={{ marginTop: '24px' }}>
                  <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                    <Button
                      type="primary"
                      block
                      size="large"
                      onClick={showModalAppointment}
                      disabled={propertyDetail?.creator === currentUser.username}
                    >
                      Đặt hẹn
                    </Button>
                    <Text type="secondary" style={{ textAlign: 'center', display: 'block' }}>
                      Đặt hẹn đến xem bất động sản
                    </Text>
                    <Button
                      block
                      size="large"
                      onClick={() => navigate(`/deposit/${propertyId}`)}
                      disabled={propertyDetail?.creator === currentUser.username}
                    >
                      Đặt cọc
                    </Button>
                    <Text type="secondary" style={{ textAlign: 'center', display: 'block' }}>
                      Tạo thỏa thuận đặt cọc
                    </Text>
                  </Space>
                </Card>
              </div>
            </Col> */}
          </Row>

          {/* Modal Appointment */}
          <AppointmentModal
            isModalAppointmentVisible={isModalAppointmentVisible}
            property={propertyDetail}
            onCancel={handleCancelAppointmentModal}
            type="create"
          />
        </div>
      </PageContainer>
    </>
  );
};

export default PropertyDetail;
