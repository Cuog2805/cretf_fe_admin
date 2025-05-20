import { Avatar, Form, Popconfirm, Table, Tabs, TimePicker } from 'antd';
import { useEffect, useState } from 'react';
import moment from 'moment';
import {
  Calendar,
  Badge,
  Button,
  Card,
  Col,
  DatePicker,
  Divider,
  Input,
  List,
  Modal,
  Row,
  Select,
  Space,
  Tag,
  Typography,
  message,
} from 'antd';
import {
  EnvironmentOutlined,
  VideoCameraOutlined,
  PhoneOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import {
  confirmAppointment,
  createAppointment,
  deleteAppointment,
  getAppointmentBySearch,
  rejectAppointment,
  updateAppointment,
} from '@/services/apis/appointmentController';
import dayjs from 'dayjs';
import { UNPAGED } from '@/core/constant';
import useStatus from '@/selectors/useStatus';
import { PageContainer } from '@ant-design/pro-components';
import TabPane from 'antd/es/tabs/TabPane';
import AppointmentModal from './appointment-modal';
import usePagination from '@/components/EditableTable/usePagination';
import { useCurrentUser } from '@/selectors/useCurrentUser';

const { Title, Paragraph } = Typography;

const Appointment: React.FC = () => {
  const currentUser = useCurrentUser();

  const [appointments, setAppointments] = useState<API.AppointmentDTO[]>([]);
  const [appointmentsUpdate, setAppointmentsUpdate] = useState<API.AppointmentDTO | null>(null);
  const [isModalAppointmentVisible, setIsModalAppointmentVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);

  const { tableProps } = usePagination();
  const { pagination } = tableProps(total);

  const { appointmentStatusList } = useStatus();

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = () => {
    setLoading(true);
    getAppointmentBySearch(UNPAGED, {} as API.AppointmentDTO)
      .then((response) => {
        if (response.success) {
          setAppointments(response.data || []);
          setTotal(response.total || 0);
        } else {
          message.error('Failed to fetch appointments');
        }
      })
      .catch((error) => {
        message.error('Failed to fetch appointments');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleCancelAppointment = async (id: string) => {
    deleteAppointment({ id: id})
      .then((resp) => {
        if (resp.success) {
          message.success('Đã hủy cuộc hẹn thành công');
          fetchAppointments();
        } else {
          message.error('Hủy cuộc hẹn thất bại');
        }
      })
      .catch((error) => {
        message.error('Có lỗi xảy ra khi hủy cuộc hẹn');
      });
  };

  const handleConfirmAppointment = async (id: string) => {
    confirmAppointment({ appointmentId: id })
      .then((resp) => {
        if (resp.success) {
          message.success('Đã xác nhận cuộc hẹn thành công');
          fetchAppointments();
        } else {
          message.error('Xác nhận cuộc hẹn thất bại');
        }
      })
      .catch((error) => {
        message.error('Có lỗi xảy ra khi xác nhận cuộc hẹn');
      });
  };

  const handleRejectAppointment = async (id: string) => {
    rejectAppointment({ appointmentId: id })
      .then((resp) => {
        if (resp.success) {
          message.success('Đã từ chối cuộc hẹn thành công');
          fetchAppointments();
        } else {
          message.error('Từ chối cuộc hẹn thất bại');
        }
      })
      .catch((error) => {
        message.error('Có lỗi xảy ra khi từ chối cuộc hẹn');
      });
  };

  const showModal = (appointment: API.AppointmentDTO) => {
    console.log('appointment', appointment);
    setAppointmentsUpdate(appointment);
    setIsModalAppointmentVisible(true);
  };

  const handleCancelAppointmentModal = () => {
    setIsModalAppointmentVisible(false);
  };

  const getAppointmentsByDate = (date: dayjs.Dayjs) => {
    return appointments.filter((appointment) => {
      const appointmentDate = dayjs(appointment.date);
      return appointmentDate.format('YYYY-MM-DD') === date.format('YYYY-MM-DD');
    });
  };

  const dateCellRender = (date: dayjs.Dayjs) => {
    const appointments = getAppointmentsByDate(date);
    if (appointments.length === 0) return null;

    return (
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {appointments.map((appointment) => (
          <li key={appointment.appointmentId}>
            <Badge
              style={{ width: '150px' }}
              color={appointmentStatusList.find((s) => s.statusId === appointment.statusId)?.color}
              text={`${moment(appointment.date).format('HH:mm')} - ${appointment.propertyAddress}`}
            />
          </li>
        ))}
      </ul>
    );
  };

  const handleCalendarSelect = (date: dayjs.Dayjs) => {
    const appointments = getAppointmentsByDate(date);
  };

  const columns = [
    {
      title: 'Bất động sản',
      dataIndex: 'propertyAddress',
      key: 'propertyAddress',
      render: (text: string) => <strong>{text}</strong>,
    },
    {
      title: 'Thời gian',
      dataIndex: 'date',
      key: 'date',
      render: (date: string) => moment(date).format('DD/MM/YYYY HH:mm'),
    },
    {
      title: 'Người mua',
      dataIndex: 'buyer',
      key: 'buyer',
      render: (buyer: string) => buyer || '___',
    },
    {
      title: 'Người bán',
      dataIndex: 'seller',
      key: 'seller',
      render: (seller: string) => seller || '___',
    },
    // {
    //   title: 'Người đại diện',
    //   dataIndex: 'agent',
    //   key: 'agent',
    //   render: (agent: string) => agent || '___',
    // },
    {
      title: 'Ghi chú',
      dataIndex: 'note',
      key: 'note',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'statusId',
      key: 'status',
      render: (statusId: string, record: any) => {
        const status = appointmentStatusList.find((s) => s.statusId === statusId);
        return <Tag color={status?.color}>{status?.name}</Tag>;
      },
    },
    {
      title: 'Hành động',
      key: 'actions',
      render: (_: any, record: any) =>
        record.buyer === currentUser?.username ? (
          <>
            <Space>
              <Button
                disabled={
                  !(
                    appointmentStatusList.find((s) => s.statusId === record.statusId)?.code ===
                    'PROCESS'
                  )
                }
                onClick={() => {
                  showModal(record);
                }}
              >
                Rời lịch
              </Button>
              <Popconfirm
                title="Bạn có chắc muốn hủy cuộc hẹn này không?"
                onConfirm={() => handleCancelAppointment(record.appointmentId)}
                okText="Đồng ý"
                cancelText="Hủy"
              >
                <Button
                  disabled={
                    !(
                      appointmentStatusList.find((s) => s.statusId === record.statusId)?.code ===
                      'PROCESS'
                    )
                  }
                  danger
                >
                  Hủy hẹn
                </Button>
              </Popconfirm>
            </Space>
          </>
        ) : (
          <>
            <Space>
              <Popconfirm
                title="Bạn có chắc muốn xác nhận cuộc hẹn này không?"
                onConfirm={() => handleConfirmAppointment(record.appointmentId)}
                okText="Đồng ý"
                cancelText="Hủy"
              >
                <Button
                  disabled={
                    !(
                      appointmentStatusList.find((s) => s.statusId === record.statusId)?.code ===
                      'PROCESS'
                    )
                  }
                  danger
                >
                  Xác nhận
                </Button>
              </Popconfirm>
              <Popconfirm
                title="Bạn có chắc muốn từ chối cuộc hẹn này không?"
                onConfirm={() => handleRejectAppointment(record.appointmentId)}
                okText="Đồng ý"
                cancelText="Hủy"
              >
                <Button
                  disabled={
                    !(
                      appointmentStatusList.find((s) => s.statusId === record.statusId)?.code ===
                      'PROCESS'
                    )
                  }
                  danger
                >
                  Từ chối
                </Button>
              </Popconfirm>
            </Space>
          </>
        ),
    },
  ];

  return (
    <PageContainer title="Lịch hẹn">
      <Card>
        <Tabs defaultActiveKey="1">
          <TabPane tab="Lịch" key="1">
            <Calendar cellRender={dateCellRender} onSelect={handleCalendarSelect} />
          </TabPane>
          <TabPane tab="Danh sách cuộc hẹn" key="2">
            <Table
              //pagination={false}
              rowKey="appointmentId"
              dataSource={appointments}
              columns={columns}
              loading={loading}
              {...tableProps(total ?? 0)}
            />
          </TabPane>
        </Tabs>
      </Card>
      <AppointmentModal
        isModalAppointmentVisible={isModalAppointmentVisible}
        appointmentUpdate={appointmentsUpdate}
        onCancel={handleCancelAppointmentModal}
        type="update"
      />
    </PageContainer>
  );
};

export default Appointment;
