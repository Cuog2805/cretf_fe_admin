// pages/RealEstateList.tsx - Trang hiển thị danh sách bất động sản
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Card,
  Col,
  Row,
  Typography,
  Tag,
  Input,
  Select,
  Button,
  Space,
  Statistic,
  Badge,
  List,
  Carousel,
  Form,
  message,
  Modal,
  TreeSelect,
} from 'antd';
import {
  SearchOutlined,
  HomeOutlined,
  EnvironmentOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  HeartFilled,
  PlusOutlined,
  EditFilled,
  DeleteOutlined,
} from '@ant-design/icons';
import { deleteProperty, getAllProperties } from '@/services/apis/propertyController';
import useStatus from '@/selectors/useStatus';
import { useCurrentUser } from '@/selectors/useCurrentUser';
import { UNPAGED } from '@/core/constant';
import FileRenderer from '@/utils/file/fileRender';
import FormItem from 'antd/es/form/FormItem';
import usePagination from '@/utils/usePagination';
import usePropertyType from '@/selectors/usePropertyType';
import { PageContainer } from '@ant-design/pro-components';
import { findIdAndNodeChildrenIds, findNodeById, flatToTree } from '@/utils/treeUtil';
import { set } from 'lodash';
import useLocations from '@/selectors/useLocation';

const { Title, Text } = Typography;
const { Option } = Select;
const { Meta } = Card;

const MyPropertyList = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const currentUser = useCurrentUser();
  const { propertySoldStatusList, propertyStatusList } = useStatus();
  const { propertyTypeList } = usePropertyType();
  const { locationList, locationTree } = useLocations();

  const [properties, setProperties] = useState<API.PropertyDTO[]>([]);
  const [total, setTotal] = useState(0);
  const [totalValue, setTotalValue] = useState(0);
  const [totalSale, setTotalSale] = useState(0);
  const [totalRent, setTotalRent] = useState(0);
  const [searchText, setSearchText] = useState('');
  const [propertyType, setPropertyType] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [deletingIds, setDeletingIds] = useState<string[]>([]);

  const { tableProps, paginationQuery } = usePagination({
    sort: 'createdAt,desc',
  });
  const { pagination } = tableProps(total);

  useEffect(() => {
    handleSearch();
  }, [paginationQuery]);

  const handleSearch = () => {
    form.validateFields().then((formValue) => {
      console.log('formValue', formValue);
      const body: API.PropertyDTO = {
        ...formValue,
        creator: currentUser?.username,
      };
      const page: any = {
        page: paginationQuery.page,
        size: paginationQuery.size,
        sort: formValue.sortBy + ',' + formValue.sortDirection,
      };
      console.log('page', page);
      getAllProperties(page, body).then((res) => {
        setProperties(res?.data);
        setTotal(res?.total);
        setTotalValue(res?.data.reduce((sum, p) => {
          if(p.priceNewestValue){
            return sum + p.priceNewestValue
          }
          return sum + 0;
        }, 0));
        setTotalSale(res?.data.reduce((sum, p) => {
          if(p.type === 'SOLD'){
            return sum + 1;
          }else{
            return sum + 0;
          }
        }, 0));
        setTotalRent(res?.data.reduce((sum, p) => {
          if(p.type === 'RENT'){
            return sum + 1;
          }else{
            return sum + 0;
          }
        }, 0));
      });
    });
  };

  const toggleSortDirection = () => {
    const newDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    setSortDirection(newDirection);
    form.setFieldsValue({ sortDirection: newDirection }); // cập nhật vào form
  };

  // Reset bộ lọc
  const resetFilters = () => {
    form.setFieldsValue({
      locationId: null,
      propertyTypeId: null,
      statusIds: null,
    });
  };

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc chắn muốn xóa bất động sản này không?',
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          setDeletingIds((prev) => [...prev, id]);
          const resp = await deleteProperty({ id: id });
          message.success(resp.data || 'Đã xóa bất động sản thành công');
          // Refresh the property list after deletion
          handleSearch();
        } catch (error) {
          console.error('Error deleting property:', error);
          message.error('Không thể xóa bất động sản. Vui lòng thử lại sau.');
        } finally {
          setDeletingIds((prev) => prev.filter((item) => item !== id));
        }
      },
    });
  };

  return (
    <PageContainer title="Bất động sản của tôi">
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={24}>
          <Card>
            <Button
              type="primary"
              ghost
              icon={<PlusOutlined />}
              size="large"
              style={{ width: '100%', height: '100px' }}
              onClick={() => navigate('/account/my-property/create')}
            >
              Thêm một bất động sản mới
            </Button>
          </Card>
        </Col>
      </Row>
      {/* Thống kê tổng quan */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={8}>
          <Card>
            <Statistic
              title="Tổng số bất động sản"
              value={total}
              prefix={<HomeOutlined />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title="Đang bán" value={totalSale} suffix={`/ ${total}`} />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title="Cho thuê" value={totalRent} suffix={`/ ${total}`} />
          </Card>
        </Col>
      </Row>

      {/* Bộ lọc và tìm kiếm */}
      <Form form={form} initialValues={{ sortBy: 'dateCreated', sortDirection: 'desc' }}>
        <Card style={{ marginBottom: 20 }}>
          <Row gutter={16}>
            <Col span={8}>
              <FormItem name="locationIds">
                <TreeSelect
                  showSearch
                  dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                  treeData={locationTree}
                  fieldNames={{ label: 'name', value: 'locationId', children: 'children' }}
                  placeholder="Chọn khu vực"
                  allowClear
                  treeDefaultExpandAll
                  onChange={(value) => {
                      const node = findNodeById(locationTree, value);
                      form.setFieldValue('locationIds', findIdAndNodeChildrenIds(node));
                  }}  
                />
              </FormItem>
            </Col>
            <Col span={4}>
              <FormItem name="propertyTypeId">
                <Select
                  style={{ width: '100%' }}
                  placeholder="Loại bất động sản"
                  value={propertyType || undefined}
                  onChange={setPropertyType}
                  allowClear
                >
                  {propertyTypeList.map((type) => (
                    <Option key={type.propertyTypeId} value={type.propertyTypeId}>
                      {type.name}
                    </Option>
                  ))}
                </Select>
              </FormItem>
            </Col>
            <Col span={4}>
              <FormItem name="statusIds">
                <Select
                  mode="multiple"
                  style={{ width: '100%' }}
                  placeholder="Trạng thái"
                  //   value={propertyStatus || undefined}
                  //   onChange={setPropertyStatus}
                  allowClear
                >
                  {propertySoldStatusList.map((status) => (
                    <Option key={status.statusId} value={status.statusId}>
                      {status.name}
                    </Option>
                  ))}
                </Select>
              </FormItem>
            </Col>
            <Col span={3}>
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
            <Col span={4}>
              <Space
                direction="horizontal"
                style={{ display: 'flex', justifyContent: 'space-evenly' }}
              >
                <Button type="primary" ghost onClick={resetFilters}>
                  Đặt lại
                </Button>
                <Button type="primary" onClick={handleSearch}>
                  Tìm kiếm
                </Button>
              </Space>
            </Col>
          </Row>
        </Card>
      </Form>

      {/* Danh sách bất động sản */}
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
        dataSource={properties}
        {...tableProps(total)}
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
                  <Carousel arrows dots={true} infinite={true} autoplay={true}>
                    {item.propertyFilesDTOs
                      ?.filter((file) => file.category === 'COMMON')
                      .flatMap((fileGroup) => fileGroup.fileIds || [])
                      .map((fileId) => (
                        <div
                          key={fileId}
                          style={{
                            height: 240,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}
                        >
                          <FileRenderer
                            fileId={fileId}
                            height={240}
                            width="100%"
                            style={{ objectFit: 'cover' }}
                          />
                        </div>
                      ))}
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
                  <Text type="secondary">{item.addressSpecific}, {locationList.find((l) => l.locationId === item.locationId)?.fullname}</Text>
                  <br />
                  <br />
                  <Space size="small" wrap>
                    {item.amenityDTOs
                      ?.filter((am) => am.amenityType === 'AMENITY_TYPE_02')
                      .map((am) => <Text type="secondary">{am.name}</Text>)}
                  </Space>
                </div>

                {/* Action section */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    background: '#fff',
                    padding: '8px 0 0 8px',
                  }}
                >
                  <Space direction="horizontal">
                    <Button
                      type="text"
                      size="large"
                      icon={<EditFilled style={{ color: '#ff4d4f' }} />}
                      onClick={(e) => {
                        navigate(`/account/my-property/edit/${item.propertyId}`);
                        e.stopPropagation();
                      }}
                    ></Button>
                    <Button
                      type="text"
                      size="large"
                      icon={<DeleteOutlined style={{ color: '#ff4d4f' }} />}
                      loading={deletingIds.includes(item.propertyId ?? '')}
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent navigating to detail page
                        handleDelete(item.propertyId ?? '');
                      }}
                    />
                  </Space>
                </div>
              </div>
            </Card>
          </List.Item>
        )}
      />
    </PageContainer>
  );
};

export default MyPropertyList;
