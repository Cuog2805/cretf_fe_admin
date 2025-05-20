import React, { useState } from 'react';
import {
  Form,
  Input,
  Button,
  InputNumber,
  Select,
  Card,
  Space,
  Typography,
  Divider,
  Spin,
  Result,
} from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import { useLocation } from '@umijs/max';
import useLocations from '@/selectors/useLocation';
import CustomTreeSelect from '@/components/tree/treeSelectCustom';
//import { HomeOutlined, DollarOutlined, EnvironmentOutlined, ApiOutlined } from 'antd';

const { Title, Text } = Typography;
const { Option } = Select;

// Định nghĩa kiểu dữ liệu cho form
interface FormValues {
  price: number;
  area: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
}

// Định nghĩa kết quả dự đoán
interface PredictionResult {
  estimatedPrice: number;
  priceRange: {
    min: number;
    max: number;
  };
  confidence: number;
}

const RealEstatePrediction: React.FC = () => {
  const [form] = Form.useForm();
  const { locationTree } = useLocations();

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  
  // Hàm dự đoán giá (mô phỏng)
  const predictPrice = (values: FormValues): Promise<PredictionResult> => {
    return new Promise((resolve) => {
      // Mô phỏng quá trình dự đoán
      setTimeout(() => {
        // Công thức dự đoán đơn giản (thay thế bằng mô hình thực tế)
        const locationFactor =
          {
            'Ba Đình': 1.5,
            'Hoàn Kiếm': 1.6,
            'Tây Hồ': 1.4,
            'Cầu Giấy': 1.3,
            'Đống Đa': 1.2,
            'Hai Bà Trưng': 1.25,
            'Long Biên': 0.9,
            'Hoàng Mai': 0.85,
            'Thanh Xuân': 1.1,
            'Hà Đông': 0.8,
          }[values.location] || 0.7;

        const bedroomFactor = 0.15 * values.bedrooms;
        const bathroomFactor = 0.1 * values.bathrooms;

        const basePrice = values.area * 35000000; // Giá cơ bản 35 triệu/m2
        const estimatedPrice = basePrice * locationFactor * (1 + bedroomFactor + bathroomFactor);

        // Tạo khoảng giá và độ tin cậy
        const priceVariation = 0.1; // Biến động 10%
        const minPrice = estimatedPrice * (1 - priceVariation);
        const maxPrice = estimatedPrice * (1 + priceVariation);

        resolve({
          estimatedPrice,
          priceRange: {
            min: minPrice,
            max: maxPrice,
          },
          confidence: 0.85, // Độ tin cậy 85%
        });
      }, 1500); // Giả lập độ trễ 1.5 giây
    });
  };

  const onFinish = async (values: FormValues) => {
    setLoading(true);
    try {
      const prediction = await predictPrice(values);
      setResult(prediction);
    } catch (error) {
      console.error('Lỗi dự đoán:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
    }).format(value);
  };

  const resetForm = () => {
    form.resetFields();
    setResult(null);
  };

  return (
    <Space direction="vertical" style={{ width: '100%' }} size="large">
      <Card
        title={
          <Space>
            <HomeOutlined />
            <Title level={4} style={{ margin: 0 }}>
              Dự Đoán Giá Bất Động Sản
            </Title>
          </Space>
        }
        style={{ maxWidth: '800px', margin: '0 auto' }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            price: undefined,
            area: undefined,
            location: undefined,
            bedrooms: 2,
            bathrooms: 1,
          }}
        >
          <Form.Item
            label="Diện tích (m²)"
            name="area"
            rules={[{ required: true, message: 'Vui lòng nhập diện tích!' }]}
          >
            <InputNumber
              style={{ width: '100%' }}
              min={1}
              placeholder="Nhập diện tích"
              addonAfter="m²"
            />
          </Form.Item>

          <Form.Item
            label="Vị trí"
            name="locationId"
            rules={[{ required: true, message: 'Vui lòng chọn vị trí!' }]}
          >
            <CustomTreeSelect
                showSearch
                treeData={locationTree}
                fieldNames={{ label: 'name', value: 'locationId', children: 'children' }}
                placeholder="Chọn khu vực"
                allowClear
                treeDefaultExpandAll
                // onChange={(value) => {
                //   const node = findNodeById(locationTree, value);
                //   form.setFieldValue('locationIds', findIdAndNodeChildrenIds(node));
                // }}
              />
          </Form.Item>

          <Form.Item
            label="Số phòng ngủ"
            name="bedrooms"
            rules={[{ required: true, message: 'Vui lòng nhập số phòng ngủ!' }]}
          >
            <InputNumber style={{ width: '100%' }} min={0} placeholder="Nhập số phòng ngủ" />
          </Form.Item>

          <Form.Item
            label="Số phòng tắm"
            name="bathrooms"
            rules={[{ required: true, message: 'Vui lòng nhập số phòng tắm!' }]}
          >
            <InputNumber style={{ width: '100%' }} min={0} placeholder="Nhập số phòng tắm" />
          </Form.Item>

          {/* <Form.Item
            label="Giá tham khảo (VND)"
            name="price"
            rules={[{ required: true, message: 'Vui lòng nhập giá tham khảo!' }]}
          >
            <InputNumber
              style={{ width: '100%' }}
              min={0}
              step={100000000}
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              placeholder="Nhập giá tham khảo"
              addonAfter="VND"
            />
          </Form.Item> */}

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={loading}>
                Dự đoán giá
              </Button>
              <Button onClick={resetForm}>Làm mới</Button>
            </Space>
          </Form.Item>
        </Form>

        {loading && (
          <div style={{ textAlign: 'center', padding: '30px' }}>
            <Spin size="large" />
            <div style={{ marginTop: '10px' }}>Đang phân tích dữ liệu...</div>
          </div>
        )}

        {result && !loading && (
          <>
            <Divider />
            <Result
              status="success"
              title="Kết quả dự đoán"
              subTitle={`Dựa trên các thông số bạn đã nhập, chúng tôi dự đoán giá bất động sản như sau:`}
            >
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <Title level={3} style={{ color: '#1890ff' }}>
                  {formatCurrency(result.estimatedPrice)}
                </Title>
                <Text>
                  Khoảng giá: {formatCurrency(result.priceRange.min)} -{' '}
                  {formatCurrency(result.priceRange.max)}
                </Text>
                <div style={{ marginTop: '10px' }}>
                  <Text>Độ tin cậy: {result.confidence * 100}%</Text>
                </div>
              </div>
            </Result>
          </>
        )}
      </Card>
    </Space>
  );
};

export default RealEstatePrediction;
