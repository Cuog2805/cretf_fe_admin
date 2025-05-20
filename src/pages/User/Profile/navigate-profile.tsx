import { PageContainer } from '@ant-design/pro-components';
import { Card, Col, Menu, Row, Typography } from 'antd';
import {
  UserOutlined,
  FileTextOutlined,
  ShoppingOutlined,
  OrderedListOutlined,
  EditOutlined,
  HomeOutlined,
  MessageOutlined,
  LockOutlined,
  CreditCardOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useCurrentUser } from '@/selectors/useCurrentUser';

const { Title } = Typography;

const ProfileNavigate = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = useCurrentUser();

  const getSelectedKey = () => {
    const path = location.pathname;
    if (path.includes('/account/profile/edit')) return 'edit';
    if (path.includes('/account/profile/purchase')) return 'purchase';
    if (path.includes('/account/profile/password')) return 'password';
    if (path.includes('/account/profile/deposit')) return 'deposit';
    if (path.includes('/account/profile/appointment')) return 'appointment';
    if (path.includes('/account/profile/message')) return 'message';
    return 'profile';
  };

  const handleMenuClick = (e: any) => {
    if (e.key === 'profile') {
      navigate('/account/profile/detail');
    } else {
      navigate(`/account/profile/${e.key}`);
    }
  };

  const menuItems = [
    {
      key: 'profile',
      label: 'Hồ sơ',
      icon: <UserOutlined />,
    },
    {
      key: 'edit',
      label: 'Chỉnh sửa hồ sơ',
      icon: <EditOutlined />,
    },
    {
      key: 'password',
      label: 'Thay đổi mật khẩu của tôi',
      icon: <LockOutlined />,
    },
    {
      key: 'deposit',
      label: 'Danh sách hợp đồng cọc',
      icon: <ShoppingOutlined />,
    },
    {
      key: 'appointment',
      label: 'Danh sách cuộc hẹn',
      icon: <ShoppingOutlined />,
    },
    {
      key: 'message',
      label: 'Tin nhắn',
      icon: <MessageOutlined />,
    },
  ];

  return (
    <Card>
      <Menu
        mode="vertical"
        selectedKeys={[getSelectedKey()]}
        onClick={handleMenuClick}
        style={{ borderInlineEnd: 'none' }}
      >
        {menuItems.map((item) => (
          <Menu.Item key={item.key} icon={item.icon}>
            {item.label}
          </Menu.Item>
        ))}
      </Menu>
    </Card>
  );
};

export default ProfileNavigate;
