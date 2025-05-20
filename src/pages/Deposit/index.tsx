import React, { useState, useEffect } from 'react';
import {
  Card,
  Form,
  Button,
  message,
  Descriptions,
  Row,
  Col,
  Typography,
  Space,
  Spin,
  Tag,
  Divider,
  Statistic,
} from 'antd';
import {
  FileTextOutlined,
  DownloadOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  HomeOutlined,
  UserOutlined,
  DollarOutlined,
} from '@ant-design/icons';
import { createDepositContract } from '@/services/apis/depositContractController';
import { PageContainer } from '@ant-design/pro-components';
import { useParams } from '@umijs/max';
import { getOneDetailProperty } from '@/services/apis/propertyController';
import { useCurrentUser } from '@/selectors/useCurrentUser';
import useScale from '@/selectors/useScale';
import usePropertyType from '@/selectors/usePropertyType';
import useLocations from '@/selectors/useLocation';
import useStatus from '@/selectors/useStatus';

const { Title, Text, Paragraph } = Typography;

const Deposit: React.FC = () => {
  //const [form] = Form.useForm();
  const { propertyId } = useParams();
  const currentUser = useCurrentUser();
  const { moneyScaleList } = useScale();
  const { propertyTypeList } = usePropertyType();
  const { locationList } = useLocations();
  const { depositStatusList } = useStatus();

  const [loading, setLoading] = useState<boolean>(false);
  const [propertyDetail, setPropertyDetail] = useState<API.PropertyDTO | null>(null);
  const [fetchingProperty, setFetchingProperty] = useState<boolean>(true);

  useEffect(() => {
    const fetchPropertyDetails = async () => {
      setFetchingProperty(true);
      try {
        const body: { propertyId: string } = {
          propertyId: propertyId as string,
        };
        const resp = await getOneDetailProperty(body);
        setPropertyDetail(resp.data);
      } catch (error) {
        message.error('Không thể tải thông tin tài sản');
        console.error('Error fetching property:', error);
      } finally {
        setFetchingProperty(false);
      }
    };

    if (propertyId) {
      fetchPropertyDetails();
    }
  }, [propertyId]);

  const handleCreateContract = async () => {
    setLoading(true);
    try {
      const body: API.DepositContractDTO = {
        seller: propertyDetail?.creator,
        buyer: currentUser?.username,
        propertyId: propertyId as string,
        depositDTO: {
          ...propertyDetail?.depositDTO,
          scaleUnit: moneyScaleList.find((d) => d.scaleId === propertyDetail?.depositDTO?.scaleUnit)?.unit
        },
        statusId: depositStatusList.find((d) => d.code === 'PROCESS')?.statusId,
      };
      createDepositContract(body).then((resp) => {
        message.success('Tạo hợp đồng thành công!');
        window.open(resp.data.downloadUrl, '_blank');
      });
    } catch (error) {
      message.error('Không thể tạo hợp đồng');
      console.error('Error creating contract:', error);
    } finally {
      setLoading(false);
    }
  };

  if (fetchingProperty) {
    return (
      <PageContainer>
        <Card>
          <div style={{ textAlign: 'center', padding: '50px 0' }}>
            <Spin size="large" />
            <p style={{ marginTop: 20 }}>Đang tải thông tin tài sản...</p>
          </div>
        </Card>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title="Tạo hợp đồng đặt cọc"
      header={{
        extra: [
          <Button
            key="create"
            type="primary"
            icon={<FileTextOutlined />}
            size="large"
            loading={loading}
            onClick={handleCreateContract}
          >
            Tạo hợp đồng
          </Button>,
        ],
      }}
    >
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          <Card
            title={
              <>
                <HomeOutlined /> Thông tin tài sản
              </>
            }
            className="shadow-card"
          >
            <Descriptions bordered column={{ xs: 1, sm: 1, md: 1, lg: 1, xl: 1, xxl: 1 }} size="middle">
              <Descriptions.Item label="Tên tài sản" span={2}>
                <Text strong>
                  {propertyDetail?.name}, {propertyDetail?.addressSpecific}, {locationList.find((l) => l.locationId === propertyDetail?.locationId)?.fullname}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label="Loại tài sản">
                {
                  propertyTypeList.find(
                    (type) => type.propertyTypeId === propertyDetail?.propertyTypeId,
                  )?.name
                }
              </Descriptions.Item>
              <Descriptions.Item label="Diện tích">
                {propertyDetail?.amenityDTOs?.find((item) => item.code === 'AREA')?.valueDisplay}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card
            title={
              <>
                <DollarOutlined /> Thông tin đặt cọc
              </>
            }
            bordered={false}
            className="shadow-card"
          >
            <Statistic
              title="Giá trị đặt cọc"
              value={propertyDetail?.depositDTO?.value}
              suffix={
                moneyScaleList.find((d) => d.scaleId === propertyDetail?.depositDTO?.scaleUnit)
                  ?.unit
              }
              style={{ marginBottom: 24 }}
            />
            <Statistic
              title="Thời hạn đặt cọc"
              value={propertyDetail?.depositDTO?.dueDate || 0}
              suffix="ngày"
              //valueStyle={{ color: '#1890ff' }}
              prefix={<ClockCircleOutlined />}
            />
          </Card>
        </Col>

        <Col xs={24}>
          <Card
            title={
              <>
                <UserOutlined /> Thông tin các bên
              </>
            }
            className="shadow-card"
          >
            <Row gutter={48}>
              <Col xs={24} md={12}>
                <Descriptions title="Bên bán" bordered column={1} size="middle">
                  <Descriptions.Item label="Họ tên">
                    <Text strong>{propertyDetail?.creator || 'Không có thông tin'}</Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="Vai trò">
                    <Tag color="red">Chủ sở hữu</Tag>
                  </Descriptions.Item>
                </Descriptions>
              </Col>
              <Col xs={24} md={12}>
                <Descriptions title="Bên mua" bordered column={1} size="middle">
                  <Descriptions.Item label="Họ tên">
                    <Text strong>{currentUser?.username || 'Không có thông tin'}</Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="Vai trò">
                    <Tag color="blue">Người đặt cọc</Tag>
                  </Descriptions.Item>
                </Descriptions>
              </Col>
            </Row>
          </Card>
        </Col>

        <Col xs={24}>
          <Card className="shadow-card">
            <div style={{ textAlign: 'center' }}>
              <Button
                type="primary"
                size="large"
                icon={<DownloadOutlined />}
                loading={loading}
                onClick={handleCreateContract}
                style={{ minWidth: 200 }}
              >
                Tạo hợp đồng
              </Button>
            </div>
          </Card>
        </Col>
      </Row>
    </PageContainer>
  );
};

export default Deposit;
