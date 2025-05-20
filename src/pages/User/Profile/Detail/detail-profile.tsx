import { Card, Col, Row, Typography } from 'antd';
import { useCurrentUser } from '@/selectors/useCurrentUser';
import FileRenderer from '@/components/FIle/fileRender';
import useCategoryShareds from '@/selectors/useCategoryShareds';

const { Text } = Typography;

const ProfileDetailContent = () => {
  const currentUser = useCurrentUser();
  const { dmGender } = useCategoryShareds();

  return (
    <Card title="HỒ SƠ">
      <Row gutter={[0, 16]}>
        <Col span={12}>
          <Text strong>TÊN</Text>
          <br />
          <Text>{currentUser?.userDetailDTO?.fullName}</Text>
        </Col>
        <Col span={12}>
          <Text strong>ĐỊA CHỈ EMAIL</Text>
          <br />
          <Text>{currentUser?.email}</Text>
        </Col>
        <Col span={12}>
          <Text strong>ĐIỆN THOẠI</Text>
          <br />
          <Text>{currentUser?.userDetailDTO?.phone}</Text>
        </Col>
        <Col span={12}>
          <Text strong>GIỚI TÍNH</Text>
          <br />
          <Text>{dmGender.find(d => d.code === currentUser?.userDetailDTO?.gender)?.name}</Text>
        </Col>
        <Col span={12}>
          <Text strong>ẢNH ĐẠI DIỆN</Text>
          <br />
          <FileRenderer
            fileId={currentUser?.userDetailDTO?.avatar ?? ''}
            width={100}
          ></FileRenderer>
        </Col>
        <Col span={12}>
          <Text strong>GIỚI THIỆU</Text>
          <br />
          <Text>{currentUser?.userDetailDTO?.bio}</Text>
        </Col>
      </Row>
    </Card>
  );
};

export default ProfileDetailContent;