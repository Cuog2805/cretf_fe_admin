import { login } from '@/services/apis/authController';
import { setToken } from '@/selectors/authService';
import { LockOutlined, MailOutlined, UserOutlined } from '@ant-design/icons';
import { PageContainer, ProForm, ProFormText } from '@ant-design/pro-components';
import { Alert, Button, Card, Col, Divider, Row, message } from 'antd';
import React, { useState } from 'react';
import { history, useModel } from '@umijs/max';

const Login: React.FC = () => {
  const [userLoginState, setUserLoginState] = useState<{ status?: 'error'; message?: string }>({});
  const { initialState, setInitialState } = useModel('@@initialState');

  const handleSubmit = async (values: API.UsersDTO) => {
    try {
      const response = await login(values);

      if (response?.data?.token) {
        message.success('Đăng nhập thành công!');
        setToken(response.data.token);

        const userInfo = await initialState?.fetchUserInfo?.();
        if (userInfo) {
          await setInitialState((s) => ({
            ...s,
            currentUser: userInfo,
          }));
          await new Promise((resolve) => setTimeout(resolve, 100));
          history.push('/welcome');
          return;
        } else {
          message.error('Không thể lấy thông tin người dùng');
        }
      }

      setUserLoginState({
        status: 'error',
        message: 'Đăng nhập thất bại, vui lòng kiểm tra tài khoản và mật khẩu!',
      });
    } catch (error) {
      console.error('Login error:', error);
      message.error('Đăng nhập thất bại, vui lòng thử lại!');
    }
  };

  return (
    <PageContainer title="Crane" style={{ alignItems: 'center' }}>
      <Card style={{ maxWidth: '1000px', margin: 'auto', padding: '40px 0' }}>
        <Row gutter={32}>
          {/* Form Đăng Nhập */}
          <Col xs={24} md={12}>
            <h1 style={{ fontSize: '28px', fontWeight: 'bold' }}>ĐĂNG NHẬP</h1>
            <p>Đăng nhập bằng địa chỉ email và mật khẩu của bạn.</p>

            <ProForm
              onFinish={handleSubmit}
              submitter={{
                render: (_, dom) => (
                  <Button type="primary" htmlType="submit" size="large">
                    ĐĂNG NHẬP
                  </Button>
                ),
              }}
            >
              {userLoginState.status === 'error' && (
                <Alert
                  message={userLoginState.message}
                  type="error"
                  showIcon
                  style={{ marginBottom: 24 }}
                />
              )}

              <ProFormText
                name="username"
                placeholder="Nhập tên đăng nhập"
                label="TÊN ĐĂNG NHẬP"
                fieldProps={{
                  prefix: <UserOutlined />,
                }}
                rules={[{ required: true, message: 'Vui lòng nhập địa chỉ email!' }]}
              />
              <ProFormText.Password
                name="password"
                label="MẬT KHẨU"
                fieldProps={{
                  prefix: <LockOutlined />,
                }}
                placeholder="Mật khẩu"
                rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
              />
            </ProForm>
          </Col>

          <Col span={1}>
            <Divider type="vertical" style={{ height: '100%' }} />
          </Col>

          {/* Tạo tài khoản */}
          <Col xs={23} md={11}>
            <h1 style={{ fontSize: '28px', fontWeight: 'bold' }}>TẠO MỘT TÀI KHOẢN</h1>
            <Button type="primary" ghost size="large" onClick={() => history.push('/auth/register')}>
              TẠO TÀI KHOẢN
            </Button>
            <p>Hãy tạo tài khoản ngay!</p>
          </Col>
        </Row>
      </Card>
    </PageContainer>
  );
};

export default Login;
