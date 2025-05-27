import React, { useEffect, useState } from 'react';
import {
  Card,
  Row,
  Col,
  Statistic,
  Typography,
  Select,
  DatePicker,
  Space,
  Spin,
  Tag,
  Progress,
  Table,
  Form,
  message,
  Divider,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { PageContainer } from '@ant-design/pro-components';
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  HomeOutlined,
  DollarOutlined,
  BarChartOutlined,
  LineChartOutlined,
} from '@ant-design/icons';
import { Column, Pie, Line, Area, Bar, DualAxes, Scatter, Rose } from '@ant-design/plots';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import FormItem from 'antd/es/form/FormItem';
import {
  getPriceTrendOverTime,
  getPropertyTypeStatic,
  getSummaryPriceAvarageLocation,
  getSummaryPriceRange,
  getSummaryTotalStat,
  getSummaryTransaction,
  getTopTransactionRegions,
} from '@/services/apis/dashBoardController';
import { tooltip } from 'leaflet';
import useScale from '@/selectors/useScale';

const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

const Dashboard = () => {
  const [type, setType] = useState('SOLD');
  const [loading, setLoading] = useState(true);
  const { moneyScaleList } = useScale();

  // API data states
  const [priceRangeData, setPriceRangeData] = useState<API.DashBoardDTO[]>([]);
  const [summaryTransaction, setSummaryTransaction] = useState<API.DashBoardDTO[]>([]);
  const [priceAvarageLocation, setPriceAvarageLocation] = useState<API.DashBoardDTO[]>([]);
  const [summaryTotalStat, setSummaryTotalStat] = useState<API.DashBoardDTO[]>([]);
  const [topTransactionRegions, setTopTransactionRegions] = useState<API.DashBoardDTO[]>([]);
  const [priceTrendOverTime, setPriceTrendOverTime] = useState<API.DashBoardDTO[]>([]);
  const [propertyTypeStatic, setPropertyTypeStatic] = useState<API.DashBoardDTO[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, [type]);

  const loadDashboardData = async () => {
    setLoading(true);

    const body: API.DashBoardDTO = {
      type: type,
    };

    try {
      // Query 1: Price Range Distribution
      const priceRangeResp = await getSummaryPriceRange(body);
      if (priceRangeResp.success) {
        setPriceRangeData(priceRangeResp.data);
      } else {
        message.error('Lỗi khi lấy dữ liệu phân bổ giá: ' + priceRangeResp.message);
      }

      // Query 2: Monthly Transaction Volume
      const transactionResp = await getSummaryTransaction(body);
      if (transactionResp.success) {
        setSummaryTransaction(transactionResp.data);
      } else {
        message.error('Lỗi khi lấy dữ liệu giao dịch: ' + transactionResp.message);
      }

      // Query 3: Average Price by Region
      const priceLocationResp = await getSummaryPriceAvarageLocation(body);
      if (priceLocationResp.success) {
        setPriceAvarageLocation(priceLocationResp.data);
      } else {
        message.error('Lỗi khi lấy giá trung bình theo khu vực: ' + priceLocationResp.message);
      }

      // Query 7: Overview Statistics
      const totalStatResp = await getSummaryTotalStat(body);
      if (totalStatResp.success) {
        setSummaryTotalStat(totalStatResp.data);
      } else {
        message.error('Lỗi khi lấy thống kê tổng quan: ' + totalStatResp.message);
      }

      // Query 6: Top Transaction Regions
      const topRegionsResp = await getTopTransactionRegions(body);
      if (topRegionsResp.success) {
        setTopTransactionRegions(topRegionsResp.data);
      } else {
        message.error('Lỗi khi lấy top khu vực giao dịch: ' + topRegionsResp.message);
      }

      // Query 5: Price Trend Over Time
      const priceTrendResp = await getPriceTrendOverTime(body);
      if (priceTrendResp.success) {
        setPriceTrendOverTime(priceTrendResp.data);
      } else {
        message.error('Lỗi khi lấy xu hướng giá: ' + priceTrendResp.message);
      }

      // Query 4: Property Type Statistics
      const propertyTypeResp = await getPropertyTypeStatic(body);
      if (propertyTypeResp.success) {
        setPropertyTypeStatic(propertyTypeResp.data);
      } else {
        message.error('Lỗi khi lấy thống kê loại BĐS: ' + propertyTypeResp.message);
      }
    } catch (error) {
      message.error('Có lỗi xảy ra khi tải dữ liệu dashboard');
    } finally {
      setLoading(false);
    }
  };

  // Query 1: Price Range Distribution - Pie Chart
  const priceRangeConfig = {
    data: priceRangeData,
    angleField: 'value',
    colorField: 'title',
    radius: 0.8,
    label: {
      text: 'value',
      style: {
        fontWeight: 'bold',
      },
    },
    interactions: [{ type: 'element-active' }],
    legend: {
      position: 'bottom' as const,
    },
    tooltip: false,
  };

  // Query 3: Average Price by Region - Column Chart
  const regionPriceConfig = {
    data: priceAvarageLocation.filter((item) => item.value != null && !isNaN(item.value)),
    xField: 'title',
    yField: 'value',
    seriesField: 'category',
    isGroup: true,
    columnStyle: {
      radius: [4, 4, 0, 0],
    },
    color: ['#1890ff', '#52c41a', '#fa8c16', '#722ed1', '#13c2c2'],
    label: {
      position: 'middle' as const,
      style: {
        fill: '#FFFFFF',
        opacity: 0.8,
        fontSize: 10,
      },
      formatter: (datum: any) => {
        const value = datum?.value || 0;
        return value > 1 ? `${value.toFixed(1)}` : '';
      },
    },
    legend: {
      position: 'top' as const,
      title: {
        text: 'Loại bất động sản',
        style: {
          fontSize: 12,
          fontWeight: 'bold',
        },
      },
    },
    interactions: [{ type: 'active-region' }, { type: 'legend-highlight' }],
  };

  // Query 2: Monthly Transaction Volume - Line Chart
  const monthlyTransactionConfig = {
    data: summaryTransaction,
    xField: 'title',
    yField: 'value',
    point: {
      size: 5,
      shape: 'diamond',
    },
    color: '#52c41a',
    smooth: true,
    tooltip: false,
  };

  // Query 5: Price Trend Over Time - Area Chart
  const priceTrendConfig = {
    data: priceTrendOverTime
      .filter((item) => item.value != null)
      .map((item) => [
        // Transform data for dual line chart
        {
          title: item.title,
          type: 'Giá tối thiểu',
          value: item.minValue || 0,
          originalData: item,
        },
        {
          title: item.title,
          type: 'Giá trung bình',
          value: item.value || 0,
          originalData: item,
        },
        {
          title: item.title,
          type: 'Giá tối đa',
          value: item.maxValue || 0,
          originalData: item,
        },
      ])
      .flat(),
    xField: 'title',
    yField: 'value',
    seriesField: 'type',
    smooth: true,
    color: ['#ff4d4f', '#1890ff', '#52c41a'], // Red-Blue-Green for Min-Avg-Max
    point: {
      size: 4,
      shape: 'circle',
    },
    lineStyle: {
      lineWidth: 2,
    },
    legend: {
      position: 'top' as const,
      marker: {
        symbol: 'line',
      },
    },
    yAxis: {
      label: {
        formatter: (val: string) => `${val}`,
      },
    },
    interactions: [{ type: 'legend-highlight' }, { type: 'active-region' }],
  };

  // Query 6: Top Transaction Regions - Bar Chart
  const topRegionsConfig = {
    data: topTransactionRegions.slice(0, 8), // Top 8 regions
    xField: 'title',
    yField: 'value',
    color: '#fa8c16',
    label: {
      position: 'middle' as const,
      style: {
        fill: '#FFFFFF',
        opacity: 0.8,
      },
    },
  };

  // Table columns for region details
  const regionColumns: ColumnsType<API.DashBoardDTO> = [
    {
      title: 'Khu vực',
      dataIndex: 'title',
      key: 'title',
      render: (title) => <Text strong>{title}</Text>,
    },
    {
      title: 'Giá trung bình ',
      dataIndex: 'value',
      key: 'value',
      align: 'right',
      render: (price) => <Text>{price?.toFixed(2)} {type === 'SOLD' ? 'tỷ VNĐ' : 'triệu VND'}</Text>,
    },
    {
      title: 'Số lượng',
      dataIndex: 'count',
      key: 'count',
      align: 'right',
      render: (count) => <Text>{count || 0}</Text>,
    },
    {
      title: 'Loại BĐS',
      dataIndex: 'category',
      key: 'category',
      render: (category) => <Tag color="blue">{category}</Tag>,
    },
  ];

  // Top regions table columns
  const topRegionsColumns: ColumnsType<API.DashBoardDTO> = [
    {
      title: 'STT',
      key: 'index',
      width: 50,
      render: (_, __, index) => index + 1,
    },
    {
      title: 'Khu vực',
      dataIndex: 'title',
      key: 'title',
      render: (title) => <Text strong>{title}</Text>,
    },
    {
      title: 'Số giao dịch',
      dataIndex: 'value',
      key: 'value',
      align: 'right',
      render: (value) => <Tag color="green">{value}</Tag>,
    },
    {
      title: 'Giá trị TB',
      dataIndex: 'avgValue',
      key: 'avgValue',
      align: 'right',
      render: (avgValue, record) => <Text>{avgValue?.toFixed(2)} {moneyScaleList.find((scale) => scale.scaleId === record.scaleUnit)?.unit}</Text>,
    },
  ];

  return (
    <PageContainer
      header={{
        title: 'Dashboard Thống kê',
        subTitle: 'Tổng quan thị trường bất động sản',
      }}
    >
      <Spin spinning={loading}>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          {/* Filter Controls */}
          <Card>
            <Row gutter={16} align="middle">
              <Col>
                <Text strong>Loại bất động sản: </Text>
              </Col>
              <Col>
                <Select style={{ width: 200 }} value={type} onChange={(value) => setType(value)}>
                  <Option value="SOLD">Bất động sản bán</Option>
                  <Option value="RENT">Bất động sản cho thuê</Option>
                </Select>
              </Col>
            </Row>
          </Card>

          {/* Key Statistics Cards - Query 7 */}
          <Row gutter={16}>
            {summaryTotalStat.map((stat, index) => (
              <Col span={6} key={index}>
                <Card>
                  <Statistic
                    title={stat.title}
                    value={stat.value}
                  />
                </Card>
              </Col>
            ))}
          </Row>

          {/* Charts Row 1 */}
          <Row gutter={16}>
            <Col span={16}>
              <Card title="Giá trung bình theo khu vực" extra={<BarChartOutlined />}>
                <Column {...regionPriceConfig} height={300} />
              </Card>
            </Col>
            <Col span={8}>
              <Card title="Phân bổ theo mức giá">
                <Pie {...priceRangeConfig} height={300} />
              </Card>
            </Col>
          </Row>

          {/* Charts Row 2 */}
          <Row gutter={16}>
            <Col span={12}>
              <Card title="Lượng giao dịch theo tháng">
                <Line {...monthlyTransactionConfig} height={300} />
              </Card>
            </Col>
            <Col span={12}>
              <Card title="Xu hướng giá theo thời gian">
                <Line {...priceTrendConfig} height={300} />
              </Card>
            </Col>
          </Row>

          {/* Charts Row 3 */}
          <Row gutter={16}>
            <Col span={12}>
              <Card title="Thống kê theo loại bất động sản">
                {propertyTypeStatic.map((item, index) => (
                  <>
                    <Card size="small">
                      <Statistic
                        title={item.title}
                        value={item.value}
                        suffix="BĐS"
                        valueStyle={{ color: '#1890ff' }}
                      />
                      {item.percentage && (
                        <Progress percent={item.percentage} strokeColor="#52c41a" size="small" />
                      )}
                    </Card>
                    <Divider />
                  </>
                ))}
              </Card>
            </Col>
            <Col span={12}>
              <Card title="Top khu vực giao dịch">
                <Column {...topRegionsConfig} height={300} />
              </Card>
            </Col>
          </Row>

          {/* Detailed Data Tables */}
          <Row gutter={16}>
            <Col span={12}>
              <Card title="Chi tiết giá theo khu vực">
                <Table
                  columns={regionColumns}
                  dataSource={priceAvarageLocation}
                  rowKey="dashBoardId"
                  size="small"
                  pagination={{ pageSize: 10 }}
                  scroll={{ y: 400 }}
                />
              </Card>
            </Col>
            <Col span={12}>
              <Card title="Top 10 khu vực giao dịch">
                <Table
                  columns={topRegionsColumns}
                  dataSource={topTransactionRegions.slice(0, 10)}
                  rowKey="dashBoardId"
                  size="small"
                  pagination={false}
                  scroll={{ y: 400 }}
                />
              </Card>
            </Col>
          </Row>
        </Space>
      </Spin>
    </PageContainer>
  );
};

export default Dashboard;
