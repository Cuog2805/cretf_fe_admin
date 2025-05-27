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
  Avatar,
  Upload,
  Radio,
  DatePicker,
  Drawer,
  Alert,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { UploadProps } from 'antd/es/upload';
import { PageContainer, ProFormItem, ProFormText } from '@ant-design/pro-components';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  SearchOutlined,
  ReloadOutlined,
  UserOutlined,
  LockOutlined,
  UnlockOutlined,
  UploadOutlined,
  KeyOutlined,
  MailOutlined,
} from '@ant-design/icons';
import { format } from 'date-fns';
import { el, vi } from 'date-fns/locale';
// import { getAllUsers, createUser, updateUser, deleteUser, resetPassword } from '@/services/apis/userController';
import useLocations from '@/selectors/useLocation';
import CustomTreeSelect from '@/components/tree/treeSelectCustom';
import { findIdAndNodeChildrenIds, findNodeById } from '@/components/tree/treeUtil';
import usePagination from '@/components/EditableTable/usePagination';
import { useCurrentUser } from '@/selectors/useCurrentUser';
import {
  deleteUser,
  getAllUsers,
  lockUser,
  restoreUser,
  unlockUser,
  updateUser,
} from '@/services/apis/userController';
import { UNPAGED } from '@/core/constant';
import useStatus from '@/selectors/useStatus';
import useCategoryShareds from '@/selectors/useCategoryShareds';
import useRole from '@/selectors/useRole';
import { changePassword, register, resetPassword } from '@/services/apis/authController';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const UserManagement = () => {
  const [form] = Form.useForm();
  const [modalForm] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const currentUser = useCurrentUser();
  const { locationList, locationTree } = useLocations();
  const { userStatusList } = useStatus();
  const { dmGender } = useCategoryShareds();
  const { roleList } = useRole();

  const [users, setUsers] = useState<API.UsersDTO[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState<'create' | 'edit' | 'view'>('create');
  const [currentUserData, setCurrentUserData] = useState<API.UsersDTO | null>(null);
  const [modalLoading, setModalLoading] = useState(false);

  const [passwordModalVisible, setPasswordModalVisible] = useState(false);

  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<API.UsersDTO | null>(null);

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

  // Search users
  const handleSearch = () => {
    setLoading(true);
    form.validateFields().then((formValue) => {
      const params = {
        page: paginationQuery.page,
        size: paginationQuery.size,
        sort: [],
      };

      const body: API.UsersDTO = {
        username: formValue.username,
      };

      getAllUsers(UNPAGED, body)
        .then((res) => {
          if (res?.success) {
            setUsers(res?.data || []);
            setTotal(res?.total || 0);
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

  // Show modal
  const showModal = (type: 'create' | 'edit' | 'view', user?: API.UsersDTO) => {
    setModalType(type);
    setCurrentUserData(user || null);
    setModalVisible(true);

    if (type === 'edit' && user) {
      modalForm.setFieldsValue({
        ...user,
        ...user.userDetailDTO,
      });
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

      const userData: API.UsersDTO = {
        ...values,
        userId: modalType === 'edit' ? currentUserData?.userId : undefined,
        userDetailDTO: {
          fullName: values.fullName,
          phone: values.phone,
          gender: values.gender,
          bio: values.bio,
          experience: values.experience,
          identificationNumber: values.identificationNumber,
        },
      };

      const apiCall =
        modalType === 'create'
          ? register(userData) // createUser(userData)
          : updateUser(userData); // updateUser(userData)

      apiCall
        .then((res) => {
          if (res.success) {
            message.success(
              modalType === 'create'
                ? 'Tạo người dùng thành công'
                : 'Cập nhật người dùng thành công',
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
    setCurrentUserData(null);
    modalForm.resetFields();
  };

  const handleLock = (id: string) => {
    lockUser({ userId: id }).then((res) => {
      if (res.success) {
        message.success('Khóa người dùng thành công');
        handleSearch();
      } else {
        message.error('Có lỗi xảy ra');
      }
    });
    handleSearch();
  };

  const handleUnlock = (id: string) => {
    unlockUser({ userId: id }).then((res) => {
      if (res.success) {
        message.success('Mở khóa người dùng thành công');
        handleSearch();
      } else {
        message.error('Có lỗi xảy ra');
      }
    });
    handleSearch();
  };

  const handleDelete = (id: string) => {
    deleteUser({ userId: id }).then((res) => {
      if (res.success) {
        message.success('Xóa người dùng thành công');
        handleSearch();
      } else {
        message.error('Có lỗi xảy ra');
      }
    });
    handleSearch();
  };

  const handleRestore = (id: string) => {
    restoreUser({ userId: id }).then((res) => {
      if (res.success) {
        message.success('Khôi phục người dùng thành công');
        handleSearch();
      } else {
        message.error('Có lỗi xảy ra');
      }
    });
    handleSearch();
  };

  // Reset password
  const handleResetPassword = () => {
    passwordForm.validateFields().then((values) => {
      const body: any = {
        username: currentUserData?.username,
        newPassword: values.newPassword,
      };
      resetPassword(body).then((resp) => {
        if (resp.throwException) {
          message.error(resp.message);
          return;
        } else {
          message.success('Đổi mật khẩu thành công!');
          form.resetFields();
        }
      });

      setPasswordModalVisible(false);
      passwordForm.resetFields();
    });
  };

  // Show user detail
  const showUserDetail = (user: API.UsersDTO) => {
    setSelectedUser(user);
    setDrawerVisible(true);
  };

  // Table columns
  const columns: ColumnsType<API.UsersDTO> = [
    {
      title: 'Thông tin cơ bản',
      key: 'basicInfo',
      width: 200,
      render: (_, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Avatar size={40} src={record.userDetailDTO?.avatar} icon={<UserOutlined />} />
          <div>
            <div>
              <Text strong>{record.userDetailDTO?.fullName || record.username}</Text>
            </div>
            <div>
              <Text type="secondary" style={{ fontSize: 12 }}>
                @{record.username}
              </Text>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Liên hệ',
      key: 'contact',
      width: 180,
      render: (_, record) => (
        <div>
          <div>{record.email}</div>
          <div style={{ fontSize: 12, color: '#666' }}>{record.userDetailDTO?.phone || 'N/A'}</div>
        </div>
      ),
    },
    {
      title: 'Vai trò',
      dataIndex: 'roleId',
      key: 'role',
      width: 100,
      render: (roleId) => {
        return <Tag>{roleId}</Tag>;
      },
    },
    {
      title: 'Trạng thái',
      dataIndex: 'statusId',
      key: 'status',
      width: 100,
      align: 'center',
      render: (statusId, record) => {
        if (record.isDeleted) {
          return <Tag color={'red'}>Đã bị xóa</Tag>;
        } else {
          const status = userStatusList.find((s) => s.statusId === statusId);
          return <Tag color={status?.color}>{status?.name}</Tag>;
        }
      },
    },
    {
      title: 'Khu vực',
      dataIndex: 'locationId',
      key: 'location',
      width: 120,
      render: (locationId) => {
        const location = locationList.find((l) => l.locationId === locationId);
        return <Text>{location?.name || 'N/A'}</Text>;
      },
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'dateCreated',
      key: 'dateCreated',
      width: 130,
      sorter: (a, b) => {
        const dateA = new Date(a.dateCreated || 0).getTime();
        const dateB = new Date(b.dateCreated || 0).getTime();
        return dateB - dateA;
      },
      render: (date) => <Text style={{ fontSize: 12 }}>{formatDate(date)}</Text>,
    },
    {
      title: 'Thao tác',
      key: 'actions',
      fixed: 'right',
      width: 200,
      render: (_, record) => (
        <Space>
          <Tooltip title="Xem chi tiết">
            <Button
              type="text"
              size="small"
              icon={<EyeOutlined />}
              onClick={() => showUserDetail(record)}
            />
          </Tooltip>

          <Tooltip title="Sửa">
            <Button
              type="text"
              size="small"
              icon={<EditOutlined />}
              onClick={() => showModal('edit', record)}
              disabled={record.isDeleted === 1}
            />
          </Tooltip>

          <Tooltip title="Đặt lại mật khẩu">
            <Button
              type="text"
              size="small"
              icon={<KeyOutlined />}
              onClick={() => {
                setCurrentUserData(record);
                setPasswordModalVisible(true);
              }}
              disabled={record.isDeleted === 1}
            />
          </Tooltip>

          {record.statusId === userStatusList.find((s) => s.code === 'BANNED')?.statusId ? (
            <Tooltip title="Mở khóa">
              <Button
                type="text"
                size="small"
                icon={<UnlockOutlined />}
                danger
                onClick={() => handleUnlock(record.userId!)}
                disabled={record.isDeleted === 1}
              />
            </Tooltip>
          ) : (
            <Tooltip title="Khóa">
              <Button
                type="text"
                size="small"
                icon={<LockOutlined />}
                danger
                onClick={() => handleLock(record.userId!)}
                disabled={record.isDeleted === 1}
              />
            </Tooltip>
          )}

          {record.isDeleted === 1 ? (
            <Popconfirm
              title="Bạn có chắc chắn muốn khôi phục người dùng này không?"
              onConfirm={() => handleRestore(record.userId!)}
              okText="Khôi phục"
              cancelText="Hủy"
            >
              <Tooltip title="Khôi phục">
                <Button type="text" size="small" icon={<ReloadOutlined />} danger />
              </Tooltip>
            </Popconfirm>
          ) : (
            <Popconfirm
              title="Bạn có chắc chắn muốn xóa người dùng này không?"
              onConfirm={() => handleDelete(record.userId!)}
              okText="Xóa"
              cancelText="Hủy"
            >
              <Tooltip title="Xóa">
                <Button type="text" size="small" icon={<DeleteOutlined />} danger />
              </Tooltip>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  return (
    <PageContainer
      header={{
        title: 'Quản lý người dùng',
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
            <Row gutter={16}>
              <Col span={6}>
                <Form.Item name="username" label="Từ khóa">
                  <Input placeholder="Nhập username..." prefix={<SearchOutlined />} />
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
            dataSource={users}
            rowKey="userId"
            loading={loading}
            {...tableProps(total)}
            scroll={{ x: 1200 }}
            size="middle"
            bordered
          />
        </Card>
      </Space>

      {/* Create/Edit Modal */}
      <Modal
        title={
          modalType === 'create'
            ? 'Thêm người dùng mới'
            : modalType === 'edit'
              ? 'Sửa thông tin người dùng'
              : 'Chi tiết người dùng'
        }
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        okText={modalType === 'view' ? 'Đóng' : modalType === 'create' ? 'Tạo' : 'Cập nhật'}
        cancelText={modalType === 'view' ? undefined : 'Hủy'}
        confirmLoading={modalLoading}
        width={1000}
        destroyOnHidden
      >
        <Form form={modalForm} layout="vertical" disabled={modalType === 'view'}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="username"
                label="Tên đăng nhập"
                rules={[
                  { required: true, message: 'Vui lòng nhập tên đăng nhập' },
                  { min: 4, message: 'Tên đăng nhập tối thiểu 4 ký tự' },
                ]}
              >
                <Input placeholder="Nhập tên đăng nhập" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: 'Vui lòng nhập email' },
                  { type: 'email', message: 'Email không hợp lệ' },
                ]}
              >
                <Input placeholder="Nhập email" />
              </Form.Item>
            </Col>

            {modalType === 'create' && (
              <Col span={12}>
                <Form.Item
                  name="password"
                  label="Mật khẩu"
                  rules={[
                    { required: true, message: 'Vui lòng nhập mật khẩu' },
                    { min: 6, message: 'Mật khẩu tối thiểu 6 ký tự' },
                  ]}
                >
                  <Input.Password placeholder="Nhập mật khẩu" />
                </Form.Item>
              </Col>
            )}

            <Col span={12}>
              <Form.Item
                name="roleId"
                label="Vai trò"
                rules={[{ required: true, message: 'Vui lòng chọn vai trò' }]}
              >
                <Select placeholder="Chọn vai trò">
                  {roleList.map((role) => (
                    <Option key={role.roleId} value={role.roleId}>
                      {role.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="statusId"
                label="Trạng thái"
                rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
              >
                <Select placeholder="Chọn trạng thái" disabled>
                  {userStatusList.map((status) => (
                    <Option key={status.statusId} value={status.statusId}>
                      {status.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item name="locationId" label="Khu vực">
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
              <Title level={5}>Thông tin chi tiết</Title>
            </Col>

            <Col span={12}>
              <Form.Item
                name="fullName"
                label="Họ và tên"
                rules={[{ required: true, message: 'Vui lòng nhập họ và tên' }]}
              >
                <Input placeholder="Nhập họ và tên" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="phone"
                label="Số điện thoại"
                rules={[{ pattern: /^[0-9]{10,11}$/, message: 'Số điện thoại không hợp lệ' }]}
              >
                <Input placeholder="Nhập số điện thoại" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item name="gender" label="Giới tính">
                <Select placeholder="Chọn giới tính">
                  {dmGender.map((gender) => (
                    <Select.Option key={gender.code} value={gender.code}>
                      {gender.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item name="identificationNumber" label="CCCD/CMND">
                <Input placeholder="Nhập số CCCD/CMND" />
              </Form.Item>
            </Col>

            {/* <Col span={12}>
              <Form.Item name="experience" label="Kinh nghiệm">
                <Input placeholder="Ví dụ: 3 years" />
              </Form.Item>
            </Col> */}

            <Col span={24}>
              <Form.Item name="bio" label="Mô tả">
                <TextArea
                  rows={3}
                  placeholder="Nhập mô tả về người dùng..."
                  maxLength={500}
                  showCount
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      {/* Password Reset Modal */}
      <Modal
        title="Đặt lại mật khẩu"
        open={passwordModalVisible}
        onOk={handleResetPassword}
        onCancel={() => {
          setPasswordModalVisible(false);
          passwordForm.resetFields();
        }}
        okText="Đặt lại"
        cancelText="Hủy"
        width={400}
      >
        <Form form={passwordForm} layout="vertical">
          <Form.Item
            name="newPassword"
            label="Mật khẩu mới"
            rules={[
              { required: true, message: 'Vui lòng nhập mật khẩu mới' },
              { min: 6, message: 'Mật khẩu tối thiểu 6 ký tự' },
            ]}
          >
            <Input.Password placeholder="Nhập mật khẩu mới" />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="Xác nhận mật khẩu"
            dependencies={['newPassword']}
            rules={[
              { required: true, message: 'Vui lòng xác nhận mật khẩu' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                },
              }),
            ]}
          >
            <Input.Password placeholder="Nhập lại mật khẩu mới" />
          </Form.Item>

          <div style={{ padding: '12px', backgroundColor: '#f0f2f5', borderRadius: '6px' }}>
            <Text strong>Người dùng: </Text>
            <Text>{currentUserData?.userDetailDTO?.fullName || currentUserData?.username}</Text>
          </div>
        </Form>
      </Modal>

      {/* User Detail Drawer */}
      <Drawer
        title="Chi tiết người dùng"
        placement="right"
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        width={500}
      >
        {selectedUser && (
          <Space direction="vertical" style={{ width: '100%' }} size="large">
            <div style={{ textAlign: 'center' }}>
              <Avatar size={80} src={selectedUser.userDetailDTO?.avatar} icon={<UserOutlined />} />
              <div style={{ marginTop: 16 }}>
                <Title level={4}>{selectedUser.userDetailDTO?.fullName}</Title>
                <Text type="secondary">@{selectedUser.username}</Text>
              </div>
            </div>

            <Card title="Thông tin cơ bản" size="small">
              <Row gutter={[16, 8]}>
                <Col span={8}>
                  <Text strong>Email:</Text>
                </Col>
                <Col span={16}>
                  <Text>{selectedUser.email}</Text>
                </Col>

                <Col span={8}>
                  <Text strong>Điện thoại:</Text>
                </Col>
                <Col span={16}>
                  <Text>{selectedUser.userDetailDTO?.phone || 'N/A'}</Text>
                </Col>

                <Col span={8}>
                  <Text strong>Giới tính:</Text>
                </Col>
                <Col span={16}>
                  {(() => {
                    const gender = dmGender.find(
                      (s) => s.code === selectedUser.userDetailDTO?.gender,
                    );
                    return <Tag color={'blue'}>{gender?.name}</Tag>;
                  })()}
                </Col>

                <Col span={8}>
                  <Text strong>CCCD/CMND:</Text>
                </Col>
                <Col span={16}>
                  <Text>{selectedUser.userDetailDTO?.identificationNumber || 'N/A'}</Text>
                </Col>
              </Row>
            </Card>

            <Card title="Thông tin hệ thống" size="small">
              <Row gutter={[16, 8]}>
                <Col span={8}>
                  <Text strong>Vai trò:</Text>
                </Col>
                <Col span={16}>
                  <Tag color="blue">{selectedUser.roleId}</Tag>
                </Col>

                <Col span={8}>
                  <Text strong>Trạng thái:</Text>
                </Col>
                <Col span={16}>
                  {(() => {
                    const status = userStatusList.find((s) => s.statusId === selectedUser.statusId);
                    return <Tag color={status?.color}>{status?.name}</Tag>;
                  })()}
                </Col>

                <Col span={8}>
                  <Text strong>Khu vực:</Text>
                </Col>
                <Col span={16}>
                  <Text>
                    {locationList.find((l) => l.locationId === selectedUser.locationId)?.fullname ||
                      'N/A'}
                  </Text>
                </Col>

                <Col span={8}>
                  <Text strong>Ngày tạo:</Text>
                </Col>
                <Col span={16}>
                  <Text>{formatDate(selectedUser.dateCreated)}</Text>
                </Col>

                <Col span={8}>
                  <Text strong>Người tạo:</Text>
                </Col>
                <Col span={16}>
                  <Text>{selectedUser.creator || 'N/A'}</Text>
                </Col>
              </Row>
            </Card>

            {selectedUser.userDetailDTO?.bio && (
              <Card title="Mô tả" size="small">
                <Text>{selectedUser.userDetailDTO.bio}</Text>
              </Card>
            )}

            {selectedUser.userDetailDTO?.experience && (
              <Card title="Kinh nghiệm" size="small">
                <Text>{selectedUser.userDetailDTO.experience}</Text>
              </Card>
            )}

            <div style={{ display: 'flex', gap: 8 }}>
              <Button
                type="primary"
                icon={<EditOutlined />}
                onClick={() => {
                  setDrawerVisible(false);
                  showModal('edit', selectedUser);
                }}
              >
                Chỉnh sửa
              </Button>
              <Button
                icon={<LockOutlined />}
                onClick={() => {
                  setDrawerVisible(false);
                  setCurrentUserData(selectedUser);
                  setPasswordModalVisible(true);
                }}
              >
                Đặt lại mật khẩu
              </Button>
            </div>
          </Space>
        )}
      </Drawer>
    </PageContainer>
  );
};

export default UserManagement;
