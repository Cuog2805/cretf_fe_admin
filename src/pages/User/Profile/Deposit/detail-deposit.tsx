import {
  deleteDepositContract,
  getAllDepositContract,
  searchDepositContract,
} from '@/services/apis/depositContractController';
import { DeleteOutlined, DownloadOutlined, SearchOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { Button, Card, Form, Input, message, Space, Table } from 'antd';
import { useEffect, useState } from 'react';

const Deposit = () => {
  const [searchForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [templates, setTemplates] = useState<API.DepositContractDTO[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    setLoading(true);
    try {
      getAllDepositContract().then((response) => {
        setTemplates(response?.data);
      });
    } catch (error) {
      message.error('Không thể tải danh sách mẫu');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (values: any) => {
    if (!values.keyword) {
      fetchTemplates();
      return;
    }

    setSearchLoading(true);
    try {
      searchDepositContract({ keyword: values.keyword }).then((resp) => {
        setTemplates(resp.data);
      });
    } catch (error) {
      message.error('Không thể tìm kiếm mẫu');
      console.error(error);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleDelete = async (templateId: string) => {
    try {
      deleteDepositContract({ templateId: templateId }).then((resp) => {
        message.success('Xóa mẫu thành công');
        fetchTemplates();
      });
    } catch (error) {
      message.error('Không thể xóa mẫu');
      console.error(error);
    }
  };

  const columns = [
    {
      title: 'Tên file',
      dataIndex: 'fileName',
      key: 'fileName',
      ellipsis: true,
    },
    {
      title: 'Người bán',
      dataIndex: 'seller',
      key: 'seller',
    },
    {
      title: 'Người mua',
      dataIndex: 'buyer',
      key: 'buyer',
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'dateCreated',
      key: 'dateCreated',
      render: (text: string) => new Date(text).toLocaleString(),
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 160,
      render: (_: string, record: any) => (
        <Space size="small">
          <Button
            type="primary"
            icon={<DownloadOutlined />}
            onClick={() => window.open(record.downloadUrl, '_blank')}
          ></Button>
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.templateId)}
          ></Button>
        </Space>
      ),
    },
  ];

  return (
    <Card title="Danh sách hợp đồng">
      <Form
        form={searchForm}
        onFinish={handleSearch}
        layout="inline"
        style={{ marginBottom: '24px' }}
      >
        <Form.Item name="keyword">
          <Input placeholder="Tìm kiếm theo người bán/người mua" allowClear />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={searchLoading}
            icon={<SearchOutlined />}
          >
            Tìm kiếm
          </Button>
        </Form.Item>
        <Form.Item>
          <Button onClick={fetchTemplates}>Xem tất cả</Button>
        </Form.Item>
      </Form>

      <Table
        columns={columns}
        dataSource={templates}
        rowKey="templateId"
        loading={loading}
        pagination={{ defaultPageSize: 10 }}
      />
    </Card>
  );
};

export default Deposit;
