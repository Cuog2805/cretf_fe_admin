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
  Table,
  Form,
  Modal,
  message,
  Popconfirm,
  Tooltip,
  Tag,
  Drawer,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { PageContainer } from '@ant-design/pro-components';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  SearchOutlined,
  ReloadOutlined,
  UserOutlined,
  SafetyOutlined,
  RestOutlined,
} from '@ant-design/icons';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
// import { getAllRoles, createRole, updateRole, deleteRole, restoreRole } from '@/services/apis/roleController';
import usePagination from '@/components/EditableTable/usePagination';
import { useCurrentUser } from '@/selectors/useCurrentUser';
import {
  createRole,
  deleteRole,
  getAllRoles,
  restoreRole,
  updateRole,
} from '@/services/apis/roleController';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const RoleManagement = () => {
  const [form] = Form.useForm();
  const [modalForm] = Form.useForm();
  const currentUser = useCurrentUser();

  const [roles, setRoles] = useState<API.RoleDTO[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  // Modal states
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState<'create' | 'edit' | 'view'>('create');
  const [currentRole, setCurrentRole] = useState<API.RoleDTO | null>(null);
  const [modalLoading, setModalLoading] = useState(false);

  // Detail drawer
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedRole, setSelectedRole] = useState<API.RoleDTO | null>(null);

  const { tableProps, paginationQuery } = usePagination({
    sort: 'dateCreated,desc',
  });
  const { pagination } = tableProps(total);

  useEffect(() => {
    handleSearch();
  }, [paginationQuery]);

  // Format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'dd/MM/yyyy HH:mm', { locale: vi });
    } catch {
      return dateString;
    }
  };

  // Search roles
  const handleSearch = () => {
    setLoading(true);
    form.validateFields().then((formValue) => {
      const params = {
        page: paginationQuery.page,
        size: paginationQuery.size,
        sort: [],
      };

      const body: API.RoleDTO = {
        ...formValue,
      };

      getAllRoles(params, body)
        .then((res) => {
          setRoles(res?.data || []);
          setTotal(res?.total || 0);
        })
        .finally(() => {
          setLoading(false);
        });
    });
  };

  // Show modal
  const showModal = (type: 'create' | 'edit' | 'view', role?: API.RoleDTO) => {
    setModalType(type);
    setCurrentRole(role || null);
    setModalVisible(true);

    if (type === 'edit' && role) {
      modalForm.setFieldsValue(role);
    } else if (type === 'create') {
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

      const roleData: API.RoleDTO = {
        ...values,
        roleId: modalType === 'edit' ? currentRole?.roleId : undefined,
      };

      // TODO: Replace with actual API calls
      const apiCall =
        modalType === 'create'
          ? createRole(roleData) // createRole(roleData)
          : updateRole(roleData); // updateRole(roleData)

      apiCall
        .then((res) => {
          if (res.success) {
            message.success(
              modalType === 'create' ? 'Tạo vai trò thành công' : 'Cập nhật vai trò thành công',
            );
            handleModalCancel();
            handleSearch();
          } else {
            message.error('Có lỗi xảy ra');
          }
        })
        .catch(() => {
          message.error('Có lỗi xảy ra');
        })
        .finally(() => {
          setModalLoading(false);
        });
    });
  };

  // Handle modal cancel
  const handleModalCancel = () => {
    setModalVisible(false);
    setCurrentRole(null);
    modalForm.resetFields();
  };

  // Delete role
  const handleDelete = (id: string) => {
    deleteRole({ id: id }).then((res) => {
      if (res.success) {
        message.success('Xóa vai trò thành công');
        handleSearch();
      } else {
        message.error('Có lỗi xảy ra');
      }
    });

    handleSearch();
  };

  // Restore role
  const handleRestore = (id: string) => {
    restoreRole({ id: id }).then((res) => {
      if (res.success) {
        message.success('Khôi phục vai trò thành công');
        handleSearch();
      } else {
        message.error('Có lỗi xảy ra');
      }
    });

    handleSearch();
  };

  // Show role detail
  const showRoleDetail = (role: API.RoleDTO) => {
    setSelectedRole(role);
    setDrawerVisible(true);
  };

  // Table columns
  const columns: ColumnsType<API.RoleDTO> = [
    {
      title: 'Tên vai trò',
      dataIndex: 'name',
      key: 'name',
      render: (name, record) => (
        <Text strong style={{ color: record.isDeleted === 1 ? '#999' : undefined }}>
          {name}
        </Text>
      ),
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      ellipsis: {
        showTitle: false,
      },
      width: '30%',
      render: (description) => (
        <Tooltip title={description} placement="topLeft">
          <Text style={{ fontSize: 13 }}>{description}</Text>
        </Tooltip>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'isDeleted',
      key: 'isDeleted',
      render: (_, record) =>
        record.isDeleted === 1 ? <Tag color="red">Đã xóa</Tag> : <Tag color="green">Hoạt động</Tag>,
    },
    {
      title: 'Người tạo',
      dataIndex: 'creator',
      key: 'creator',
      render: (creator) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <UserOutlined style={{ fontSize: 12, color: '#666' }} />
          <Text type="secondary" style={{ fontSize: 12 }}>
            {creator}
          </Text>
        </div>
      ),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'dateCreated',
      key: 'dateCreated',
      sorter: (a, b) => {
        const dateA = new Date(a.dateCreated || 0).getTime();
        const dateB = new Date(b.dateCreated || 0).getTime();
        return dateB - dateA;
      },
      render: (date) => <Text style={{ fontSize: 12 }}>{formatDate(date)}</Text>,
    },
    {
      title: 'Cập nhật cuối',
      dataIndex: 'dateModified',
      key: 'dateModified',
      render: (date, record) => (
        <div>
          <Text style={{ fontSize: 12 }}>{formatDate(date)}</Text>
          {record.modifier && (
            <div>
              <Text type="secondary" style={{ fontSize: 11 }}>
                bởi {record.modifier}
              </Text>
            </div>
          )}
        </div>
      ),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      fixed: 'right',
      render: (_, record) => {
        const isDeleted = record.isDeleted === 1;

        return (
          <Space>
            <Tooltip title={isDeleted ? 'Vai trò đã bị xóa' : 'Xem chi tiết'}>
              <Button
                type="text"
                size="small"
                icon={<EyeOutlined />}
                onClick={() => showRoleDetail(record)}
                disabled={isDeleted}
                style={{ opacity: isDeleted ? 0.5 : 1 }}
              />
            </Tooltip>

            <Tooltip title={isDeleted ? 'Vai trò đã bị xóa' : 'Chỉnh sửa'}>
              <Button
                type="text"
                size="small"
                icon={<EditOutlined />}
                onClick={() => showModal('edit', record)}
                disabled={isDeleted}
                style={{ opacity: isDeleted ? 0.5 : 1 }}
              />
            </Tooltip>

            {isDeleted ? (
              <Popconfirm
                title="Bạn có chắc chắn muốn khôi phục vai trò này không?"
                onConfirm={() => handleRestore(record.roleId!)}
                okText="Khôi phục"
                cancelText="Hủy"
              >
                <Tooltip title="Khôi phục">
                  <Button
                    type="text"
                    size="small"
                    icon={<ReloadOutlined />}
                    style={{ color: '#52c41a' }}
                  />
                </Tooltip>
              </Popconfirm>
            ) : (
              <Popconfirm
                title="Bạn có chắc chắn muốn xóa vai trò này không?"
                description="Hành động này sẽ ảnh hưởng đến tất cả người dùng có vai trò này."
                onConfirm={() => handleDelete(record.roleId!)}
                okText="Xóa"
                cancelText="Hủy"
              >
                <Tooltip title="Xóa">
                  <Button type="text" size="small" icon={<DeleteOutlined />} danger />
                </Tooltip>
              </Popconfirm>
            )}
          </Space>
        );
      },
    },
  ];

  return (
    <PageContainer
      header={{
        title: 'Quản lý vai trò',
        subTitle: 'Quản lý các vai trò và quyền hạn trong hệ thống',
        extra: [
          <Button
            key="create"
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => showModal('create')}
          >
            Thêm vai trò mới
          </Button>,
        ],
      }}
    >
      <Space direction="vertical" style={{ width: '100%' }} size="middle">
        {/* Search Form */}
        <Card>
          <Form form={form} layout="vertical">
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item name="name" label="Tìm kiếm">
                  <Input placeholder="Nhập tên vai trò..." prefix={<SearchOutlined />} allowClear />
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item label=" ">
                  <Space>
                    <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
                      Tìm kiếm
                    </Button>
                  </Space>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>

        {/* Data Table */}
        <Card>
          <Table
            columns={columns}
            dataSource={roles}
            rowKey="roleId"
            loading={loading}
            {...tableProps(total)}
            scroll={{ x: 1000 }}
            size="middle"
            bordered
            rowClassName={(record) => (record.isDeleted === 1 ? 'row-deleted' : '')}
          />
        </Card>
      </Space>

      {/* Create/Edit Modal */}
      <Modal
        title={
          modalType === 'create'
            ? 'Thêm vai trò mới'
            : modalType === 'edit'
              ? 'Chỉnh sửa vai trò'
              : 'Chi tiết vai trò'
        }
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        okText={modalType === 'view' ? 'Đóng' : modalType === 'create' ? 'Tạo mới' : 'Cập nhật'}
        cancelText={modalType === 'view' ? undefined : 'Hủy'}
        confirmLoading={modalLoading}
        width={600}
        destroyOnClose
      >
        <Form form={modalForm} layout="vertical" disabled={modalType === 'view'}>
          <Form.Item
            name="name"
            label="Tên vai trò"
            rules={[
              { required: true, message: 'Vui lòng nhập tên vai trò' },
              { min: 2, message: 'Tên vai trò tối thiểu 2 ký tự' },
              { max: 50, message: 'Tên vai trò tối đa 50 ký tự' },
            ]}
          >
            <Input placeholder="Nhập tên vai trò" prefix={<SafetyOutlined />} />
          </Form.Item>

          <Form.Item
            name="description"
            label="Mô tả"
            rules={[
              { required: true, message: 'Vui lòng nhập mô tả vai trò' },
              { min: 10, message: 'Mô tả tối thiểu 10 ký tự' },
              { max: 500, message: 'Mô tả tối đa 500 ký tự' },
            ]}
          >
            <TextArea
              rows={4}
              placeholder="Nhập mô tả chi tiết về vai trò này..."
              maxLength={500}
              showCount
            />
          </Form.Item>

          {modalType === 'view' && currentRole && (
            <div
              style={{
                padding: '16px',
                backgroundColor: '#f5f5f5',
                borderRadius: '6px',
                marginTop: '16px',
              }}
            >
              <Row gutter={[16, 8]}>
                <Col span={12}>
                  <Text strong>Người tạo: </Text>
                  <Text>{currentRole.creator}</Text>
                </Col>
                <Col span={12}>
                  <Text strong>Ngày tạo: </Text>
                  <Text>{formatDate(currentRole.dateCreated)}</Text>
                </Col>
                {currentRole.modifier && (
                  <>
                    <Col span={12}>
                      <Text strong>Người sửa: </Text>
                      <Text>{currentRole.modifier}</Text>
                    </Col>
                    <Col span={12}>
                      <Text strong>Ngày sửa: </Text>
                      <Text>{formatDate(currentRole.dateModified)}</Text>
                    </Col>
                  </>
                )}
              </Row>
            </div>
          )}
        </Form>
      </Modal>

      {/* Role Detail Drawer */}
      <Drawer
        title="Chi tiết vai trò"
        placement="right"
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        width={500}
      >
        {selectedRole && (
          <Space direction="vertical" style={{ width: '100%' }} size="large">
            <div style={{ textAlign: 'center' }}>
              <Title level={4}>{selectedRole.name}</Title>
              {selectedRole.isDeleted === 1 && <Tag color="red">Đã xóa</Tag>}
            </div>

            <Card title="Thông tin cơ bản" size="small">
              <div style={{ marginBottom: 16 }}>
                <Text strong>Mô tả:</Text>
                <div style={{ marginTop: 8 }}>
                  <Text>{selectedRole.description}</Text>
                </div>
              </div>
            </Card>

            <Card title="Thông tin hệ thống" size="small">
              <Row gutter={[16, 12]}>
                <Col span={24}>
                  <Text strong>Người tạo: </Text>
                  <Text>{selectedRole.creator || 'N/A'}</Text>
                </Col>

                <Col span={24}>
                  <Text strong>Ngày tạo: </Text>
                  <Text>{formatDate(selectedRole.dateCreated)}</Text>
                </Col>

                {selectedRole.modifier && (
                  <Col span={24}>
                    <Text strong>Người cập nhật cuối: </Text>
                    <Text>{selectedRole.modifier}</Text>
                  </Col>
                )}

                {selectedRole.dateModified && (
                  <Col span={24}>
                    <Text strong>Ngày cập nhật cuối: </Text>
                    <Text>{formatDate(selectedRole.dateModified)}</Text>
                  </Col>
                )}

                <Col span={24}>
                  <Text strong>Trạng thái: </Text>
                  <Tag color={selectedRole.isDeleted === 1 ? 'red' : 'green'}>
                    {selectedRole.isDeleted === 1 ? 'Đã xóa' : 'Hoạt động'}
                  </Tag>
                </Col>
              </Row>
            </Card>

            <div style={{ display: 'flex', gap: 8 }}>
              <Button
                type="primary"
                icon={<EditOutlined />}
                onClick={() => {
                  setDrawerVisible(false);
                  showModal('edit', selectedRole);
                }}
                disabled={selectedRole.isDeleted === 1}
              >
                Chỉnh sửa
              </Button>
              {selectedRole.isDeleted === 1 ? (
                <Button
                  icon={<RestOutlined />}
                  onClick={() => {
                    setDrawerVisible(false);
                    handleRestore(selectedRole.roleId!);
                  }}
                  style={{ color: '#52c41a', borderColor: '#52c41a' }}
                >
                  Khôi phục
                </Button>
              ) : (
                <Button
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => {
                    setDrawerVisible(false);
                    handleDelete(selectedRole.roleId!);
                  }}
                >
                  Xóa
                </Button>
              )}
            </div>
          </Space>
        )}
      </Drawer>
    </PageContainer>
  );
};

export default RoleManagement;
