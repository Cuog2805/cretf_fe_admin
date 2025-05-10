import useCategoryShareds from '@/selectors/useCategoryShareds';
import { useCurrentUser } from '@/selectors/useCurrentUser';
import { changePassword } from '@/services/apis/authController';
import { updateUser } from '@/services/apis/userController';
import FileRenderer from '@/utils/file/fileRender';
import FileUpload from '@/utils/file/fileUpload';
import { LockOutlined } from '@ant-design/icons';
import { ProFormText } from '@ant-design/pro-components';
import { Alert, Button, Card, Col, Form, Input, message, Row, Select, Typography } from 'antd';
import FormItem from 'antd/es/form/FormItem';
import TextArea from 'antd/es/input/TextArea';
import { useEffect, useState } from 'react';

const { Text } = Typography;

const ProfileChangePasswordContent = () => {
  const [form] = Form.useForm();
  const currentUser = useCurrentUser();

  const [confirmNewPassword, setConfirmNewPassword] = useState<{
    status?: 'error';
    message?: string;
  }>({});

  const handleSubmit = async () => {
    form
      .validateFields()
      .then((values: any) => {
        if (values.newPassword !== values.confirmNewPassword) {
          setConfirmNewPassword({
            status: 'error',
            message: 'Mật khẩu xác nhận không khớp!',
          });
          return;
        }
        if (values.password === values.newPassword) {
          setConfirmNewPassword({
            status: 'error',
            message: 'Mật khẩu mới không trùng mật khẩu cũ!',
          });
          return;
        }

        const body: any = {
          username: currentUser?.username,
          password: values.password,
          newPassword: values.newPassword,
        };
        changePassword(body).then((resp) => {
          if (resp.throwException) {
            message.error(resp.message);
            return;
          } else {
            message.success('Đổi mật khẩu thành công!');
            form.resetFields();
          }
        });
      })
      .catch((error) => {
        message.error('Đổi mật khẩu thất bại, vui lòng thử lại!');
      });
  };

  return (
    <Card title="ĐỔI MẬT KHẨU">
      <Form form={form}>
        {confirmNewPassword.status === 'error' && (
          <Alert
            message={confirmNewPassword.message}
            type="error"
            showIcon
            style={{ marginBottom: 24 }}
          />
        )}
        <Row gutter={12}>
          <Col span={12}>
            <Text strong>MẬT KHẨU CŨ</Text>
            <br />
            <ProFormText.Password
              name="password"
              fieldProps={{ prefix: <LockOutlined /> }}
              placeholder="Mật khẩu"
              rules={[
                { required: true, message: 'Vui lòng nhập mật khẩu!' },
                { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' },
              ]}
            />
          </Col>

          <Col span={12}></Col>

          <Col span={12}>
            <Text strong>MẬT KHẨU MỚI</Text>
            <br />
            <ProFormText.Password
              name="newPassword"
              fieldProps={{ prefix: <LockOutlined /> }}
              placeholder="Mật khẩu"
              rules={[
                { required: true, message: 'Vui lòng nhập mật khẩu!' },
                { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' },
              ]}
            />
          </Col>

          <Col span={12}></Col>

          <Col span={12}>
            <Text strong>NHẬP LẠI MẬT KHẨU MỚI</Text>
            <br />
            <ProFormText.Password
              name="confirmNewPassword"
              fieldProps={{ prefix: <LockOutlined /> }}
              placeholder="Mật khẩu"
              rules={[
                { required: true, message: 'Vui lòng nhập mật khẩu!' },
                { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' },
              ]}
            />
          </Col>

          <Col span={12}></Col>

          <Col span={24} style={{ textAlign: 'left', marginTop: 16 }}>
            <Button type="primary" ghost onClick={handleSubmit}>
              Lưu
            </Button>
          </Col>
        </Row>
      </Form>
    </Card>
  );
};

export default ProfileChangePasswordContent;
