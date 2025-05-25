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
  Table,
  Form,
  Modal,
  message,
  Popconfirm,
  Tooltip,
  Tag,
  InputNumber,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { PageContainer } from '@ant-design/pro-components';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  EnvironmentOutlined,
  SearchOutlined,
  ReloadOutlined,
  LockOutlined,
  UnlockOutlined,
} from '@ant-design/icons';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
// import { getAllPublicFacilities, createPublicFacility, updatePublicFacility, deletePublicFacility } from '@/services/apis/publicFacilityController';
import useLocations from '@/selectors/useLocation';
import CustomTreeSelect from '@/components/tree/treeSelectCustom';
import { findIdAndNodeChildrenIds, findNodeById } from '@/components/tree/treeUtil';
import usePagination from '@/components/EditableTable/usePagination';
import { useCurrentUser } from '@/selectors/useCurrentUser';
import {
  createPublicFacility,
  getAllPublicFacility,
  lockPublicFacility,
  unLockPublicFacility,
} from '@/services/apis/publicFacilityController';
import { create } from 'lodash';
import CoordinatesPicker from '@/components/Map/CoordinatesPicker';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const PublicFacilityManagement = () => {
  const [form] = Form.useForm();
  const [modalForm] = Form.useForm();
  const currentUser = useCurrentUser();
  const { locationList, locationTree } = useLocations();

  const [facilities, setFacilities] = useState<API.PublicFacilityDTO[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  // Modal states
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState<'create' | 'edit' | 'view'>('create');
  const [currentFacility, setCurrentFacility] = useState<API.PublicFacilityDTO | null>(null);
  const [modalLoading, setModalLoading] = useState(false);

  const { tableProps, paginationQuery } = usePagination({
    sort: 'dateCreated,desc',
  });

  useEffect(() => {
    handleSearch();
  }, [paginationQuery]);

  const handleSearch = () => {
    setLoading(true);
    form.validateFields().then((formValue) => {
      const page: any = {
        page: paginationQuery.page,
        size: paginationQuery.size,
        sort: paginationQuery.sort,
      };
      const body: API.PublicFacilityDTO = {
        locationIds: formValue.locationIds,
      };

      getAllPublicFacility(page, body)
        .then((res) => {
          if (res.success) {
            setFacilities(res.data);
            setTotal(res.total);
          } else {
            message.error('Có lỗi xảy ra');
          }
        })
        .catch(() => {
          message.error('Có lỗi xảy ra');
        })
        .finally(() => {
          setLoading(false);
        });
    });
  };

  // Format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'dd/MM/yyyy HH:mm', { locale: vi });
    } catch {
      return dateString;
    }
  };

  // Show modal
  const showModal = (type: 'create' | 'edit' | 'view', facility?: API.PublicFacilityDTO) => {
    setModalType(type);
    setCurrentFacility(facility || null);
    setModalVisible(true);

    if ((type === 'edit' || type === 'view') && facility) {
      modalForm.setFieldsValue({
        ...facility,
        coordinates: facility.coordinatesDTO
          ? {
              latitude: facility.coordinatesDTO.latitude,
              longitude: facility.coordinatesDTO.longitude,
            }
          : undefined,
      });
    } else {
      modalForm.resetFields();
    }
  };

  // Handle modal OK
  const handleModalOk = () => {
    if (modalType === 'view') {
      setModalVisible(false);
      return;
    }

    modalForm.validateFields().then((values) => {
      setModalLoading(true);

      const facilityData: API.PublicFacilityDTO = {
        ...values,
        publicFacilityId: modalType === 'edit' ? currentFacility?.publicFacilityId : undefined,
        creator: currentUser.username,
        coordinatesDTO: values.coordinates
          ? {
              latitude: values.coordinates.latitude,
              longitude: values.coordinates.longitude,
              type: 'PUBLIC_FACILITY',
            }
          : {
              latitude: 21.0278,
              longitude: 105.8342,
              type: 'PUBLIC_FACILITY',
            },
      };

      createPublicFacility(facilityData)
        .then((res) => {
          if (res.success) {
            message.success('Thêm dịch vụ công cộng thành công');
            handleSearch();
          } else {
            message.error('Có lỗi xảy ra');
          }
          setModalLoading(false);
          setModalVisible(false);
        })
        .catch(() => {
          message.error('Có lỗi xảy ra');
          setModalLoading(false);
        });
    });
  };

  // Handle modal cancel
  const handleModalCancel = () => {
    setModalVisible(false);
    setCurrentFacility(null);
    modalForm.resetFields();
  };

  const handleLock = (id: string) => {
    lockPublicFacility({ publicFacilityId: id })
      .then((res) => {
        if (res.success) {
          handleSearch();
          message.success('Đã khóa dịch vụ công cộng thành công');
        } else {
          message.error('Có lỗi khi khóa dịch vụ công cộng');
        }
      })
      .catch((error) => {
        message.error('Có lỗi khi khóa dịch vụ công cộng');
      });
  };

  const handleUnlock = (id: string) => {
    unLockPublicFacility({ publicFacilityId: id })
      .then((res) => {
        if (res.success) {
          handleSearch();
          message.success('Đã mở khóa dịch vụ công cộng khỏi danh sách đã lưu thành công');
        } else {
          message.error('Có lỗi khi mở khó dịch vụ công cộng');
        }
      })
      .catch((error) => {
        message.error('Có lỗi khi mở khó dịch vụ công cộng');
      });
  };

  // Table columns
  const columns: ColumnsType<API.PublicFacilityDTO> = [
    {
      title: 'Tên dịch vụ',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      ellipsis: true,
      render: (name) => <Text strong>{name}</Text>,
    },
    {
      title: 'Vị trí',
      dataIndex: 'locationId',
      key: 'location',
      width: 180,
      render: (locationId) => {
        const location = locationList.find((l) => l.locationId === locationId);
        return <Text>{location?.fullname || 'N/A'}</Text>;
      },
    },
    {
      title: 'Người tạo',
      dataIndex: 'creator',
      key: 'creator',
      width: 120,
      render: (creator) => <Text type="secondary">{creator}</Text>,
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'dateCreated',
      key: 'dateCreated',
      width: 140,
      sorter: (a, b) => {
        const dateA = new Date(a.dateCreated || 0).getTime();
        const dateB = new Date(b.dateCreated || 0).getTime();
        return dateB - dateA;
      },
      render: (date) => <Text style={{ fontSize: 12 }}>{formatDate(date)}</Text>,
    },
    {
      title: 'Người thay đổi',
      dataIndex: 'modifier',
      key: 'modifier',
      width: 120,
      render: (modifier) => <Text type="secondary">{modifier || 'N/A'}</Text>,
    },
    {
      title: 'Ngày thay đổi',
      dataIndex: 'dateModified',
      key: 'dateModified',
      width: 140,
      render: (date) => <Text style={{ fontSize: 12 }}>{formatDate(date)}</Text>,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'isDeleted',
      key: 'status',
      width: 100,
      align: 'center',
      render: (isDeleted) => (
        <Tag color={isDeleted === 0 ? 'success' : 'error'}>
          {isDeleted === 0 ? 'Hoạt động' : 'Đã khóa'}
        </Tag>
      ),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      fixed: 'right',
      width: 120,
      render: (_, record) => (
        <Space>
          <Tooltip title="Xem chi tiết">
            <Button
              type="text"
              size="small"
              icon={<EyeOutlined />}
              onClick={() => showModal('view', record)}
            />
          </Tooltip>

          <Tooltip title="Sửa">
            <Button
              type="text"
              size="small"
              icon={<EditOutlined />}
              onClick={() => showModal('edit', record)}
            />
          </Tooltip>

          {record.isDeleted === 1 ? (
            <Popconfirm
              title="Bạn có chắc chắn muốn bỏ khóa dịch vụ công cộng không?"
              onConfirm={() => {
                handleUnlock(record.publicFacilityId ?? '');
              }}
              okText="OK"
              cancelText="Hủy"
            >
              <Button
                type="text"
                size="small"
                icon={<UnlockOutlined style={{ color: '#ff4d4f' }} />}
              />
            </Popconfirm>
          ) : (
            <Popconfirm
              title="Bạn có chắc chắn muốn khóa dịch vụ công cộng không?"
              onConfirm={() => {
                handleLock(record.publicFacilityId ?? '');
              }}
              okText="OK"
              cancelText="Hủy"
            >
              <Button
                type="text"
                size="small"
                icon={<LockOutlined style={{ color: '#ff4d4f' }} />}
              />
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  return (
    <PageContainer
      header={{
        title: 'Quản lý dịch vụ công cộng',
        extra: [
          <Button
            key="create"
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => showModal('create')}
          >
            Thêm mới
          </Button>,
        ],
      }}
    >
      <Space direction="vertical" style={{ width: '100%' }} size="middle">
        {/* Search Form */}
        <Card>
          <Form form={form} layout="vertical">
            <Row gutter={12}>
              <Col span={4}>
                <Form.Item name="locationIds">
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
                </Form.Item>
              </Col>

              <Col span={4}>
                <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
                  Tìm kiếm
                </Button>
              </Col>
            </Row>
          </Form>
        </Card>

        {/* Data Table */}
        <Card>
          <Table
            columns={columns}
            dataSource={facilities}
            rowKey="publicFacilityId"
            loading={loading}
            {...tableProps(total)}
            scroll={{ x: 800 }}
            size="middle"
            bordered
          />
        </Card>
      </Space>

      {/* Modal Form */}
      <Modal
        title={
          modalType === 'create'
            ? 'Thêm dịch vụ công cộng'
            : modalType === 'edit'
              ? 'Sửa dịch vụ công cộng'
              : 'Chi tiết dịch vụ công cộng'
        }
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        okText={modalType === 'view' ? 'Đóng' : modalType === 'create' ? 'Tạo' : 'Cập nhật'}
        cancelText={modalType === 'view' ? undefined : 'Hủy'}
        confirmLoading={modalLoading}
        width={1200}
        destroyOnHidden
      >
        <Form form={modalForm} layout="vertical" disabled={modalType === 'view'}>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="name"
                label="Tên dịch vụ"
                rules={[{ required: true, message: 'Vui lòng nhập tên dịch vụ' }]}
              >
                <Input placeholder="Nhập tên dịch vụ công cộng" />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item
                name="locationId"
                label="Khu vực"
                rules={[{ required: true, message: 'Vui lòng chọn khu vực' }]}
              >
                <CustomTreeSelect
                  showSearch
                  treeData={locationTree}
                  fieldNames={{ label: 'name', value: 'locationId', children: 'children' }}
                  placeholder="Chọn khu vực"
                  allowClear
                  treeDefaultExpandAll={false}
                />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item
                name="coordinates"
                label=""
                getValueFromEvent={(value) => value}
                getValueProps={(value) => ({ value })}
              >
                <CoordinatesPicker />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </PageContainer>
  );
};

export default PublicFacilityManagement;
