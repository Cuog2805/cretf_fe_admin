import { register } from '@/services/apis/authController';
import { LockOutlined, UserOutlined, MailOutlined } from '@ant-design/icons';
import { PageContainer, ProFormItem, ProFormText } from '@ant-design/pro-components';
import { message, Alert, Card, Select, Button, Form } from 'antd';
import React, { useState } from 'react';
import { LoginForm } from '@ant-design/pro-components';
import { history } from '@umijs/max';
import useCategoryShareds from '@/selectors/useCategoryShareds';

interface RegisterFormData extends API.UsersDTO {
  confirmPassword?: string;
}

const Register: React.FC = () => {
  const [form] = Form.useForm();

  const { dmGender } = useCategoryShareds();

  const [registerState, setRegisterState] = useState<{
    status?: 'error';
    message?: string;
  }>({});

  const handleSubmit = async () => {
    form
      .validateFields()
      .then((values: RegisterFormData) => {
        if (values.password !== values.confirmPassword) {
          setRegisterState({
            status: 'error',
            message: 'Mật khẩu xác nhận không khớp!',
          });
          return;
        }

        register({ ...values }).then((response) => {
          if (response?.throwException) {
            message.error(response?.message || 'Đăng ký thất bại!');
            return;
          }
          if (response?.success) {
            message.success('Đăng ký thành công!');
            history.push('/auth/login');
            return;
          }
        });
      })
      .catch((error) => {
        message.error('Đăng ký thất bại, vui lòng thử lại!');
      });
  };

  return (
    <PageContainer title="Crane" style={{ alignItems: 'center' }}>
      <Card
        title={<div style={{ textAlign: 'center' }}>Đăng ký tài khoản</div>}
        style={{ maxWidth: '500px', margin: 'auto' }}
      >
        <Form form={form}>
          {registerState.status === 'error' && (
            <Alert
              message={registerState.message}
              type="error"
              showIcon
              style={{ marginBottom: 24 }}
            />
          )}

          {/* UsersDTO */}
          <ProFormText
            name="username"
            fieldProps={{ prefix: <UserOutlined /> }}
            placeholder="Tên đăng nhập"
            rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]}
          />

          <ProFormText
            name="email"
            fieldProps={{ prefix: <MailOutlined /> }}
            placeholder="Email"
            rules={[
              { required: true, message: 'Vui lòng nhập email!' },
              { type: 'email', message: 'Email không hợp lệ!' },
            ]}
          />

          <ProFormText.Password
            name="password"
            fieldProps={{ prefix: <LockOutlined /> }}
            placeholder="Mật khẩu"
            rules={[
              { required: true, message: 'Vui lòng nhập mật khẩu!' },
              { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' },
            ]}
          />

          <ProFormText.Password
            name="confirmPassword"
            fieldProps={{ prefix: <LockOutlined /> }}
            placeholder="Xác nhận mật khẩu"
            rules={[{ required: true, message: 'Vui lòng xác nhận mật khẩu!' }]}
          />

          {/* UserDetailDTO */}
          <ProFormText
            name={['userDetailDTO', 'fullName']}
            placeholder="Họ và tên"
            rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}
          />

          <ProFormText
            name={['userDetailDTO', 'phone']}
            placeholder="Số điện thoại"
            rules={[
              { required: true, message: 'Vui lòng nhập số điện thoại!' },
              {
                pattern: /^[0-9]{10,11}$/,
                message: 'Số điện thoại không hợp lệ!',
              },
            ]}
          />

          <ProFormText
            name={['userDetailDTO', 'identificationNumber']}
            placeholder="Số CCCD/CMND"
            rules={[{ required: false, message: 'Vui lòng nhập số CCCD/CMND!' }]}
          />

          <ProFormItem
            name={['userDetailDTO', 'gender']}
            rules={[{ required: true, message: 'Vui lòng nhập giới tính!' }]}
          >
            <Select placeholder="Chọn giới tính">
              {dmGender.map((gender) => (
                <Select.Option key={gender.code} value={gender.code}>
                  {gender.name}
                </Select.Option>
              ))}
            </Select>
          </ProFormItem>

          <ProFormItem>
            <Button
              type="primary"
              size="large"
              onClick={handleSubmit}
              style={{ width: '100%' }}
              shape="round"
            >
              Tạo tài khoản
            </Button>
          </ProFormItem>

          <ProFormItem>
            <Button
              type="primary"
              ghost
              size="large"
              onClick={() => {
                history.push('/auth/login');
              }}
              style={{ width: '100%' }}
              shape="round"
            >
              Trở lại
            </Button>
          </ProFormItem>
        </Form>
      </Card>
    </PageContainer>
  );
};

export default Register;
