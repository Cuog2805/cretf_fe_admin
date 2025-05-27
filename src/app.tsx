import { Footer } from '@/components';
import { ConfigProvider } from 'antd';
import type { Settings as LayoutSettings } from '@ant-design/pro-components';
import type { RunTimeLayoutConfig } from '@umijs/max';
import { history } from '@umijs/max';
import React from 'react';
import defaultSettings from '../config/defaultSettings';
import { errorConfig } from './requestErrorConfig';
import Navbar from './components/Header';
import { getCurrentUser } from './services/apis/userController';
import { getToken } from './selectors/authService';
import AvatarDropdown from '@/components/RightContent/AvatarDropdown';

const isDev = process.env.NODE_ENV === 'development';
const loginPath = '/admin/auth/login';

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  currentUser?: API.UsersDTO;
  loading?: boolean;
  fetchUserInfo?: () => Promise<any | undefined>;
}> {
  const fetchUserInfo = async () => {
    try {
      const token = getToken();
      if (!token) return undefined;
      const response = await getCurrentUser();
      return response?.data;
    } catch (error) {
      return undefined;
    }
  };

  // Nếu đang ở trang đăng nhập: không cần lấy thông tin người dùng
  if (window.location.pathname === '/admin/auth/login') {
    return {
      fetchUserInfo,
      currentUser: undefined,
      settings: defaultSettings as Partial<LayoutSettings>,
    };
  }

  // Các trang khác: lấy thông tin user
  const currentUser = await fetchUserInfo();
  return {
    fetchUserInfo,
    currentUser,
    settings: defaultSettings as Partial<LayoutSettings>,
  };
}

export const layout: RunTimeLayoutConfig = ({ initialState, setInitialState }) => {
  return {
    childrenRender: (children) => {
      return (
        <>
          <ConfigProvider
            theme={{
              token: {
                colorPrimary: '#ff4d4f',
              },
            }}
          >
            {children}
          </ConfigProvider>
        </>
      );
    },
    headerContentRender: () => <Navbar />,
    rightContentRender: () => <AvatarDropdown></AvatarDropdown>,
    footerRender: () => <Footer />,
    siderRender: false,
    menuRender: false, // Thêm dòng này
    menuHeaderRender: false, // Và dòng này
    collapsed: false,
    collapsedButtonRender: false,
    headerHeight: 60,
    onPageChange: () => {
      const { location } = history;
      // If not logged in, redirect to login page
      if (!initialState?.currentUser && location.pathname !== loginPath) {
        history.push(loginPath);
      } else if (initialState?.currentUser && location.pathname === loginPath) {
        history.push('/admin/auth/dashboard');
      }
    },
    ...initialState?.settings
  };
};

/**
 * @name request 配置，可以配置错误处理
 * 它基于 axios 和 ahooks 的 useRequest 提供了一套统一的网络请求和错误处理方案。
 * @doc https://umijs.org/docs/max/request#配置
 */
export const request = {
  ...errorConfig,
};
