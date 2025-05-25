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
  Table,
  Form,
  TreeSelect,
  Tooltip,
  message,
  Image,
  Popconfirm,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { PageContainer, ProCard } from '@ant-design/pro-components';
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  HeartFilled,
  HeartOutlined,
  LeftOutlined,
  LikeOutlined,
  RightOutlined,
  EyeOutlined,
  LockOutlined,
  UnlockOutlined,
  CheckOutlined,
  CloseOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import {
  addToFavourite,
  approveProperty,
  getAllProperties,
  getOneDetailProperty,
  lockProperty,
  removeToFavourite,
  unLockProperty,
} from '@/services/apis/propertyController';
import { UNPAGED } from '@/core/constant';
import useStatus from '@/selectors/useStatus';
import FileRenderer from '@/components/FIle/fileRender';
import { useLocation, useNavigate, useParams } from '@umijs/max';
import useCategoryShareds from '@/selectors/useCategoryShareds';
import FormItem from 'antd/es/form/FormItem';
import { useCurrentUser } from '@/selectors/useCurrentUser';
import usePropertyType from '@/selectors/usePropertyType';
import usePagination from '@/components/EditableTable/usePagination';
import { findIdAndNodeChildrenIds, findNodeById } from '@/components/tree/treeUtil';
import useLocations from '@/selectors/useLocation';
import CustomTreeSelect from '@/components/tree/treeSelectCustom';
import PropertyApprovalModal from './approve-modal';

const { Title, Paragraph, Text } = Typography;
const { Option } = Select;

const PropertyApprove = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = useCurrentUser();
  const { locationId } = useParams();

  const { propertyRentStatusList, propertySoldStatusList, propertyStatusList } = useStatus();
  const { propertyTypeList } = usePropertyType();
  const { locationList, locationTree } = useLocations();

  const [properties, setProperties] = useState<API.PropertyDTO[]>([]);
  const [total, setTotal] = useState(0);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  
  const [modalVisible, setModalVisible] = useState(false);
  const [modalIsApprove, setModalIsApprove] = useState(true);
  const [currentProperty, setCurrentProperty] = useState<API.PropertyDTO | null>(null);

  const { tableProps, paginationQuery } = usePagination({
    sort: 'createdAt,desc',
  });
  const { pagination } = tableProps(total);

  const type = Form.useWatch('type', form) ?? 'SOLD';

  useEffect(() => {
    if (locationId) {
      form.setFieldValue('locationIds', [locationId]);
    }
  }, [locationId]);

  useEffect(() => {
    if (
      propertyTypeList &&
      propertyTypeList.length > 0 &&
      propertySoldStatusList &&
      propertySoldStatusList.length > 0
    ) {
      handleSearch();
    }
  }, [paginationQuery, propertyTypeList, propertySoldStatusList]);

  const handleSearch = () => {
    form.validateFields().then((formValue) => {
      const body: API.PropertyDTO = {
        ...formValue,
        type: formValue.type,
        propertyTypeId: formValue.propertyTypeId,
        priceNewestScale: type === 'SOLD' ? 'SCALE_BILLION_VND' : 'SCALE_MILLION_VND_PER_MONTH',
        statusIds: [propertySoldStatusList.find((d) => d.code === 'WAITING')?.statusId],
        usernameFav: currentUser?.username,
      };
      console.log('body', body);
      const page: any = {
        page: paginationQuery.page,
        size: paginationQuery.size,
        sort: formValue.sortBy + ',' + formValue.sortDirection,
      };
      getAllProperties(page, body).then((res) => {
        setProperties(res?.data);
        setTotal(res?.total);
      });
    });
  };

  const toggleSortDirection = () => {
    const newDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    setSortDirection(newDirection);
    form.setFieldsValue({ sortDirection: newDirection });
  };

  const showApprovalModal = (property: API.PropertyDTO, isApprove: boolean) => {
    setCurrentProperty(property);
    setModalIsApprove(isApprove);
    setModalVisible(true);
  };

  const handleModalClose = () => {
    setModalVisible(false);
    setCurrentProperty(null);
  };

  const handleModalSuccess = () => {
    handleSearch(); // Refresh data
  };

  const columns: ColumnsType<API.PropertyDTO> = [
    {
      title: 'Hình ảnh',
      dataIndex: 'propertyFilesDTOs',
      key: 'image',
      width: 120,
      render: (propertyFiles, record) => {
        const firstImage = propertyFiles?.find((file: any) => file.category === 'COMMON')
          ?.fileIds?.[0];

        return firstImage ? (
          <div style={{ width: 80, height: 60, borderRadius: 4, overflow: 'hidden' }}>
            <FileRenderer
              fileId={firstImage}
              height={60}
              width={80}
              style={{ objectFit: 'cover' }}
            />
          </div>
        ) : (
          <div
            style={{
              width: 80,
              height: 60,
              backgroundColor: '#f5f5f5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 4,
            }}
          >
            <Text type="secondary">No Image</Text>
          </div>
        );
      },
    },
    {
      title: 'Thông tin cơ bản',
      dataIndex: 'propertyPriceNewest',
      key: 'basic_info',
      width: 200,
      render: (priceNewest, record) => (
        <div>
          <Title level={5} style={{ margin: 0, marginBottom: 4 }}>
            {priceNewest?.value}&ensp;{priceNewest?.scaleUnit}
          </Title>
          <Text>
            {record.amenityDTOs?.find((item) => item.code === 'BED')?.valueDisplay}
            &ensp;·&ensp;
            {record.amenityDTOs?.find((item) => item.code === 'BATH')?.valueDisplay}
            &ensp;·&ensp;
            {record.amenityDTOs?.find((item) => item.code === 'AREA')?.valueDisplay}
          </Text>
        </div>
      ),
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'addressSpecific',
      key: 'address',
      width: 250,
      render: (address, record) => (
        <div>
          <Text>{address}</Text>
          <br />
          <Text type="secondary">
            {locationList.find((l) => l.locationId === record.locationId)?.fullname}
          </Text>
        </div>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'statusIds',
      key: 'status',
      width: 120,
      render: (statusIds, record: API.PropertyDTO) => (
        <Space direction="vertical" size="small">
          {record.isDeleted === 0 ? (
            <>
              {statusIds?.map((statusId: any) => {
                const status = propertyStatusList.find((s) => s.statusId === statusId);
                return (
                  <Tag key={statusId} color={status?.color} style={{ fontWeight: 600 }}>
                    {status?.name?.toUpperCase()}
                  </Tag>
                );
              })}
            </>
          ) : (
            <>
              <Tag color={'red'} style={{ fontWeight: 600 }}>
                ĐÃ KHÓA
              </Tag>
            </>
          )}
        </Space>
      ),
    },
    {
      title: 'Tiện ích',
      dataIndex: 'amenityDTOs',
      key: 'amenities',
      width: 200,
      render: (amenities) => (
        <Space size="small" wrap>
          {amenities
            ?.filter((am: any) => am.amenityType === 'AMENITY_TYPE_02')
            .slice(0, 3) // Giới hạn hiển thị 3 tiện ích
            .map((am: any) => (
              <Tag key={am.amenityId} style={{ fontSize: '11px' }}>
                {am.name}
              </Tag>
            ))}
        </Space>
      ),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 150,
      render: (_, record) => (
        <Space>
          <Tooltip title="Xem chi tiết">
            <Button
              type="text"
              size="small"
              icon={<EyeOutlined />}
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/admin/manager-property/detail/${record.propertyId}`);
              }}
            />
          </Tooltip>
          
          <Tooltip title="Phê duyệt">
            <Button
              type="text"
              size="small"
              icon={<CheckCircleOutlined style={{ color: '#ff4d4f' }} />}
              onClick={(e) => {
                e.stopPropagation();
                showApprovalModal(record, true);
              }}
            />
          </Tooltip>
          
          <Tooltip title="Từ chối">
            <Button
              type="text"
              size="small"
              icon={<CloseCircleOutlined style={{ color: '#ff4d4f' }} />}
              onClick={(e) => {
                e.stopPropagation();
                showApprovalModal(record, false);
              }}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <PageContainer
      header={{
        title: null,
      }}
    >
      <Space direction="vertical" style={{ width: '100%' }}></Space>
      <Flex vertical gap="small">
        {/* Bộ lọc và tìm kiếm */}
        <Form
          form={form}
          initialValues={{ sortBy: 'dateCreated', sortDirection: 'desc', type: 'SOLD' }}
        >
          <Card style={{ marginBottom: 20 }}>
            <Row gutter={16}>
              <Col span={6}>
                <FormItem name="locationIds">
                  <CustomTreeSelect
                    showSearch
                    treeData={locationTree}
                    fieldNames={{ label: 'name', value: 'locationId', children: 'children' }}
                    placeholder="Chọn khu vực"
                    allowClear
                    treeDefaultExpandAll={false}
                    onChange={(value) => {
                      const node = findNodeById(locationTree, value);
                      form.setFieldValue('locationIds', findIdAndNodeChildrenIds(node));
                    }}
                  />
                </FormItem>
              </Col>
              <Col span={2}>
                <FormItem name="propertyTypeId">
                  <Select style={{ width: '100%' }} placeholder="Loại bất động sản" allowClear>
                    {propertyTypeList.map((d) => (
                      <Option key={d.propertyTypeId} value={d.propertyTypeId}>
                        {d.name}
                      </Option>
                    ))}
                  </Select>
                </FormItem>
              </Col>
              <Col span={2}>
                <FormItem name="type">
                  <Select style={{ width: '100%' }}>
                    {[
                      { code: 'SOLD', label: 'Bán' },
                      { code: 'RENT', label: 'Cho thuê' },
                    ].map((type) => (
                      <Option key={type.code} value={type.code}>
                        {type.label}
                      </Option>
                    ))}
                  </Select>
                </FormItem>
              </Col>
              <Col span={4}>
                <FormItem name="priceFrom">
                  <Select style={{ width: '100%' }} placeholder="Giá từ" allowClear>
                    {[0.5, 1, 2, 3, 4, 5, 10, 15, 20, 30, 50, 100].map((price) => (
                      <Option key={price} value={price}>
                        {price} {type === 'SOLD' ? 'Tỷ đồng' : 'Triệu đồng'}
                      </Option>
                    ))}
                  </Select>
                </FormItem>
              </Col>
              <Col span={4}>
                <FormItem name="priceTo">
                  <Select style={{ width: '100%' }} placeholder="Giá đến" allowClear>
                    {[0.5, 1, 2, 3, 4, 5, 10, 15, 20, 30, 50, 100].map((price) => (
                      <Option
                        key={price}
                        value={price}
                        disabled={
                          form.getFieldValue('priceFrom')
                            ? form.getFieldValue('priceFrom') >= price
                            : false
                        }
                      >
                        {price} {type === 'SOLD' ? 'Tỷ đồng' : 'Triệu đồng'}
                      </Option>
                    ))}
                  </Select>
                </FormItem>
              </Col>
              <Col span={2}>
                <FormItem name="sortBy">
                  <Select placeholder="Sắp xếp theo">
                    <Option key="dateCreated" value="dateCreated">
                      Mới nhất
                    </Option>
                    <Option key="priceNewestValue" value="priceNewestValue">
                      Giá
                    </Option>
                  </Select>
                </FormItem>
              </Col>
              <Col span={1}>
                <Form form={form}>
                  <Form.Item name="sortDirection">
                    <Button
                      icon={sortDirection === 'asc' ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                      onClick={toggleSortDirection}
                    />
                  </Form.Item>
                </Form>
              </Col>
              <Col span={3}>
                <Button type="primary" onClick={handleSearch} style={{ width: '100%' }}>
                  Tìm kiếm
                </Button>
              </Col>
            </Row>
          </Card>
        </Form>

        {/* Bảng hiển thị dữ liệu */}
        <Card>
          <Table
            columns={columns}
            dataSource={properties}
            rowKey="propertyId"
            {...tableProps(total)}
            size="middle"
            showSorterTooltip={false}
            scroll={{ x: 800 }}
          />
        </Card>
      </Flex>

      {/* Modal tự xử lý mọi thứ */}
      <PropertyApprovalModal
        visible={modalVisible}
        isApprove={modalIsApprove}
        property={currentProperty}
        onClose={handleModalClose}
        onSuccess={handleModalSuccess}
      />
    </PageContainer>
  );
};

export default PropertyApprove;