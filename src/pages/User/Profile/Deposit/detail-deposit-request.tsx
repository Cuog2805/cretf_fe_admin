import usePagination from '@/components/EditableTable/usePagination';
import { useCurrentUser } from '@/selectors/useCurrentUser';
import useStatus from '@/selectors/useStatus';
import {
  confirmDepositContract,
  deleteDepositContract,
  getAllDepositContract,
  rejectDepositContract,
  searchDepositContract,
} from '@/services/apis/depositContractController';
import {
  CheckOutlined,
  CloseOutlined,
  DeleteOutlined,
  DownloadOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { Button, Card, Form, Input, message, Select, Space, Table, Tag, Tooltip } from 'antd';
import { get } from 'lodash';
import { useEffect, useState } from 'react';

const DepositRequest = () => {
  const [searchForm] = Form.useForm();
  const { depositStatusList } = useStatus();
  const currentUser = useCurrentUser();

  const [depositContract, setDepositContract] = useState<API.DepositContractDTO[]>([]);
  const [total, setTotal] = useState(0);
  const { tableProps, paginationQuery } = usePagination({
    sort: 'dateCreated,desc',
  });

  useEffect(() => {
    handleSearch();
  }, [paginationQuery]);

  const handleSearch = () => {
    searchForm.validateFields().then((values) => {
      const page: any = {
        page: paginationQuery.page,
        size: paginationQuery.size,
        sort: paginationQuery.sort,
      };
      const body: API.DepositContractDTO = {
        statusId: values.statusId,
        seller: currentUser?.username,
      };
      console.log('body', body);
      getAllDepositContract(page, body).then((resp) => {
        setDepositContract(resp.data);
        setTotal(resp.total);
      });
    });
  };

  const handleConfirm = async (id: string) => {
    try {
      confirmDepositContract({ depositContractId: id }).then((resp) => {
        message.success('Xác nhận thành công');
        handleSearch();
      });
    } catch (error) {
      message.error('Không thể Xác nhận');
      console.error(error);
    }
  };

  const handleReject = async (id: string) => {
    try {
      rejectDepositContract({ depositContractId: id }).then((resp) => {
        message.success('Từ chối thành công');
        handleSearch();
      });
    } catch (error) {
      message.error('Không thể Từ chối');
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
      title: 'Trạng thái',
      dataIndex: 'statusId',
      key: 'status',
      render: (statusId: string, record: any) => {
        const status = depositStatusList.find((s) => s.statusId === statusId);
        return <Tag color={status?.color}>{status?.name}</Tag>;
      },
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 160,
      render: (_: string, record: any) => (
        <Space size="small">
          <Tooltip title="Từ chối">
            <Button
              type="primary"
              icon={<DownloadOutlined />}
              onClick={() => window.open(record.downloadUrl, '_blank')}
            ></Button>
          </Tooltip>
          <Tooltip title="Đồng ý">
            <Button
              type="primary"
              danger
              icon={<CheckOutlined />}
              disabled={!(record.statusId === depositStatusList.find((s) => s.code === 'PROCESS')?.statusId)}
              onClick={() => handleConfirm(record.depositContractId)}
            ></Button>
          </Tooltip>
          <Tooltip title="Từ chối">
            <Button
              danger
              icon={<CloseOutlined />}
              disabled={!(record.statusId === depositStatusList.find((s) => s.code === 'PROCESS')?.statusId)}
              onClick={() => handleReject(record.depositContractId)}
            ></Button>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Card title="Danh sách hợp đồng yêu cầu đến bạn">
        <Form
          form={searchForm}
          onFinish={handleSearch}
          layout="inline"
          style={{ marginBottom: '24px' }}
        >
          <Form.Item name="statusId">
            <Select style={{ width: '200px' }} placeholder="Trạng thái" allowClear>
              {depositStatusList.map((s) => (
                <Select.Option key={s.statusId} value={s.statusId}>
                  {s.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
              Tìm kiếm
            </Button>
          </Form.Item>
          {/* <Form.Item>
            <Button onClick={handleSearch}>Xem tất cả</Button>
          </Form.Item> */}
        </Form>

        <Table
          columns={columns}
          dataSource={depositContract}
          rowKey="templateId"
          //loading={loading}
          {...tableProps(total)}
        />
      </Card>
    </>
  );
};

export default DepositRequest;
