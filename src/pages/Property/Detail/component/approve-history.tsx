import React from 'react';
import { Table, Card, Empty, Tag, Typography, Space } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import useStatus from '@/selectors/useStatus';

const { Text, Title } = Typography;

interface ApprovalHistoryProps {
  propertyDetail: API.PropertyDTO | null;
}

const ApprovalHistory: React.FC<ApprovalHistoryProps> = ({ propertyDetail }) => {
  const { propertyStatusList } = useStatus();

  const approvalHistories = propertyDetail?.approvalHistoryDTOs || [];

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'dd/MM/yyyy HH:mm', { locale: vi });
    } catch {
      return dateString;
    }
  };

  const columns: ColumnsType<API.ApprovalHistoryDTO> = [
    {
      title: 'Thời gian',
      dataIndex: 'approvalDate',
      key: 'approvalDate',
      sorter: (a, b) => {
        const dateA = new Date(a.approvalDate || 0).getTime();
        const dateB = new Date(b.approvalDate || 0).getTime();
        return dateB - dateA;
      },
      render: (date) => <Text style={{ fontSize: 13 }}>{formatDate(date)}</Text>,
    },
    {
      title: 'Trạng thái',
      key: 'status',
      align: 'center',
      render: (_, record) => {
        const status = propertyStatusList.find((s) => s.statusId === record.statusId);
        return (
          <Tag key={status?.statusId} color={status?.color} style={{ fontWeight: 600 }}>
            {status?.name?.toUpperCase()}
          </Tag>
        );
      },
    },
    {
      title: 'Người xử lý',
      dataIndex: 'approver',
      key: 'approver',
      render: (approver) => (
        approver || 'N/A'
      ),
    },
    {
      title: 'Ghi chú',
      dataIndex: 'note',
      key: 'note',
      width: '40%',
      ellipsis: {
        showTitle: false,
      },
      render: (note, record) => {
        return <Text style={{ fontSize: 13 }}>{note || 'Không có ghi chú'}</Text>;
      },
    },
  ];

  return (
    <div
      id="property-details"
      style={{
        paddingTop: '120px',
        marginTop: '-110px',
      }}
    >
      <Card
        title={
            <Title level={5} style={{ margin: 0 }}>
            Lịch sử phê duyệt
          </Title>
        }
      >
        {approvalHistories.length === 0 ? (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Chưa có lịch sử phê duyệt" />
        ) : (
          <>
            <Table
              columns={columns}
              dataSource={approvalHistories}
              rowKey="approvalId"
              size="small"
              bordered
              pagination={false}
              scroll={{ x: 800 }}
            />

            {/* Thông tin tổng quan */}
            <div
              style={{
                marginTop: 16,
                padding: '12px',
                backgroundColor: '#fafafa',
                borderRadius: '6px',
                display: 'flex',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 16,
              }}
            >
              <div>
                <Text type="secondary">Tổng số lần xử lý: </Text>
                <Text strong>{approvalHistories.length}</Text>
              </div>
              <div>
                <Text type="secondary">Lần cuối cập nhật: </Text>
                <Text strong>
                  {approvalHistories.length > 0
                    ? formatDate(approvalHistories[0].approvalDate)
                    : 'N/A'}
                </Text>
              </div>
              <div>
                <Text type="secondary">Người xử lý cuối: </Text>
                <Text strong>
                  {approvalHistories.length > 0 ? approvalHistories[0].approver || 'N/A' : 'N/A'}
                </Text>
              </div>
            </div>
          </>
        )}
      </Card>
    </div>
  );
};

export default ApprovalHistory;
