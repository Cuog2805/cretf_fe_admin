import useCategoryShareds from '@/selectors/useCategoryShareds';
import { useCurrentUser } from '@/selectors/useCurrentUser';
import { updateUser } from '@/services/apis/userController';
import FileRenderer from '@/utils/file/fileRender';
import FileUpload from '@/utils/file/fileUpload';
import { Button, Card, Col, Form, Input, message, Row, Select, Typography } from 'antd';
import FormItem from 'antd/es/form/FormItem';
import TextArea from 'antd/es/input/TextArea';
import { useEffect } from 'react';

const { Text } = Typography;

const ProfileEditContent = () => {
  const [form] = Form.useForm();
  const { dmGender } = useCategoryShareds();
  const currentUser = useCurrentUser();

  // Prepare the initial values with the nested structure
  const initialValues = {
    userId: currentUser?.userId,
    email: currentUser?.email,
    username: currentUser?.username,
    userDetailDTO: {
      userDetailId: currentUser?.userDetailDTO?.userDetailId,
      avatar: currentUser?.userDetailDTO?.avatar,
      fullName: currentUser?.userDetailDTO?.fullName,
      phone: currentUser?.userDetailDTO?.phone,
      gender: currentUser?.userDetailDTO?.gender,
      bio: currentUser?.userDetailDTO?.bio,
      experience: currentUser?.userDetailDTO?.experience,
      identificationNumber: currentUser?.userDetailDTO?.identificationNumber,
    },
  };

  useEffect(() => {
    form.setFieldsValue(initialValues);
  }, [currentUser]);

  const handleSubmit = () => {
    form.validateFields().then((formValue) => {
      const body = {
        ...formValue,
        //avatar: JSON.stringify(formValue.userDetailDTO.avatar)
      };

      updateUser(body)
        .then((response) => {
          if (response.success) {
            message.success('Cập nhật thành công');
          } else {
            message.error('Cập nhật thất bại');
          }
        })
        .catch((err) => {
          message.error('Cập nhật thất bại');
        });
    });
  };

  return (
    <Card title="HỒ SƠ">
      <Form form={form} initialValues={initialValues}>
        {/* Main user fields */}
        <FormItem name="userId" hidden>
          <Input />
        </FormItem>

        <Row gutter={12}>
          <Col span={12}>
            <Text strong>ĐỊA CHỈ EMAIL</Text>
            <br />
            <FormItem name="email">
              <Input />
            </FormItem>
          </Col>

          {/* Nested userDetailDTO fields */}
          <Col span={12}>
            <Text strong>TÊN</Text>
            <br />
            <FormItem name={['userDetailDTO', 'fullName']}>
              <Input />
            </FormItem>
          </Col>

          <Col span={12}>
            <Text strong>ĐIỆN THOẠI</Text>
            <br />
            <FormItem name={['userDetailDTO', 'phone']}>
              <Input />
            </FormItem>
          </Col>

          <Col span={12}>
            <Text strong>GIỚI TÍNH</Text>
            <br />
            <FormItem name={['userDetailDTO', 'gender']}>
              <Select placeholder="Chọn giới tính">
                {dmGender.map((gender) => (
                  <Select.Option key={gender.code} value={gender.code}>
                    {gender.name}
                  </Select.Option>
                ))}
              </Select>
            </FormItem>
            <Text>{dmGender.find((d) => d.code === currentUser?.userDetailDTO?.gender)?.name}</Text>
          </Col>

          <Col span={12}>
            <Text strong>ẢNH ĐẠI DIỆN HIỆN TẠI</Text>
            <br />
            <FileRenderer
              fileId={currentUser?.userDetailDTO?.avatar ?? ''}
              width={100}
            ></FileRenderer>
            <br />
            <Text strong>CHỌN ẢNH ĐẠI DIỆN KHÁC</Text>
            <FormItem name={['userDetailDTO', 'avatar']}>
              <FileUpload
                multiple={false}
                acceptedFileExtensions={['.png', '.jpg']}
                uploadType="avatar"
                value={currentUser?.userDetailDTO?.avatar}
              />
            </FormItem>
          </Col>

          <Col span={12}>
            <Text strong>GIỚI THIỆU</Text>
            <br />
            <FormItem name={['userDetailDTO', 'bio']}>
              <TextArea />
            </FormItem>
          </Col>

          {/* <Col span={12}>
            <Text strong>KINH NGHIỆM</Text>
            <br />
            <FormItem name={['userDetailDTO', 'experience']}>
              <TextArea />
            </FormItem>
          </Col>

          <Col span={12}>
            <Text strong>SỐ CMND/CCCD</Text>
            <br />
            <FormItem name={['userDetailDTO', 'identificationNumber']}>
              <Input />
            </FormItem>
          </Col> */}

          <Col span={24} style={{ textAlign: 'right', marginTop: 16 }}>
            <Button type="primary" ghost onClick={handleSubmit}>
              Lưu
            </Button>
          </Col>
        </Row>
      </Form>
    </Card>
  );
};

export default ProfileEditContent;
