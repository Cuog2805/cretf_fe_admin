import React, { useEffect, useState } from 'react';
import {
  Button,
  Typography,
  Row,
  Col,
  Space,
  Card,
  Flex,
  Tag,
  Divider,
  Anchor,
  Modal,
  Tabs,
  Form,
  Select,
  TimePicker,
  DatePicker,
  Input,
  message,
} from 'antd';
import { createAppointment } from '@/services/apis/appointmentController';
import TextArea from 'antd/es/input/TextArea';
import moment from 'moment';
import useStatus from '@/selectors/useStatus';
import { useCurrentUser } from '@/selectors/useCurrentUser';
import { property, values } from 'lodash';
import useLocation from '@/selectors/useLocation';

const AppointmentModal = (props: {
  isModalAppointmentVisible: boolean;
  property?: API.PropertyDTO | null;
  appointmentUpdate?: API.AppointmentDTO | null;
  onCancel: () => void;
  type: 'create' | 'update';
}) => {
  const [formAppointment] = Form.useForm();
  const { appointmentStatusList } = useStatus();
  const currentUser = useCurrentUser();
  const { locationList } = useLocation();
  
  // Finding the scheduled status ID once and storing it
  const scheduledStatusId = appointmentStatusList.find((s) => s.code === 'SCHEDULED')?.statusId;

  // Set initial values based on whether we're creating or updating
  useEffect(() => {
    if (props.isModalAppointmentVisible) {
      // Reset form when modal opens/closes
      if (props.type === 'create') {
        formAppointment.setFieldsValue({
          propertyId: props.property?.propertyId,
          buyerId: currentUser?.userId,
          sellerId: currentUser?.userId,
          agentId: currentUser?.userId,
          statusId: scheduledStatusId, // Using the scheduled status ID
        });
      } else if (props.type === 'update' && props.appointmentUpdate) {
        formAppointment.setFieldsValue({
          propertyId: props.appointmentUpdate.propertyId,
          buyerId: props.appointmentUpdate.buyerId,
          sellerId: props.appointmentUpdate.sellerId,
          agentId: props.appointmentUpdate.agentId,
          statusId: props.appointmentUpdate.statusId || scheduledStatusId, // Fallback to scheduled if not provided
          date: props.appointmentUpdate.date ? moment(props.appointmentUpdate.date) : null,
          note: props.appointmentUpdate.note,
        });
      }
    }
  }, [
    props.isModalAppointmentVisible, 
    props.type, 
    props.property, 
    props.appointmentUpdate, 
    currentUser, 
    scheduledStatusId
  ]);

  const handleSubmit = () => {
    formAppointment.validateFields().then((formValue) => {
      console.log('formValue', formValue);
      createAppointment({
        ...formValue,
        // No need to override statusId here since it's already in the form values
      })
        .then((resp) => {
          if (resp.success) {
            message.success(
              props.type === 'create' ? 'Tạo cuộc hẹn thành công' : 'Cập nhật cuộc hẹn thành công',
            );
            //await fetchAppointments();
            formAppointment.resetFields();
            props.onCancel();
          } else {
            message.error(
              props.type === 'create' ? 'Tạo cuộc hẹn thất bại' : 'Cập nhật cuộc hẹn thất bại',
            );
          }
        })
        .catch((err) => {
          message.error(
            props.type === 'create' ? 'Tạo cuộc hẹn thất bại' : 'Cập nhật cuộc hẹn thất bại',
          );
        });
    });
  };

  const handleCancel = () => {
    formAppointment.resetFields();
    props.onCancel(); // Call parent handler
  };

  return (
    <>
      <Modal
        title={props.type === 'create' ? 'Tạo cuộc hẹn' : 'Cập nhật cuộc hẹn'}
        open={props.isModalAppointmentVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          form={formAppointment}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item name="propertyId" label="Bất động sản" rules={[{ required: true }]}>
            <Select placeholder="Chọn bất động sản" disabled>
              {props.property && (
                <Select.Option key={props.property.propertyId} value={props.property.propertyId}>
                  {props.property.addressSpecific}, {locationList.find((l) => l.locationId === props.property?.locationId)?.fullname}
                </Select.Option>
              )}
              {props.appointmentUpdate && (
                <Select.Option
                  key={props.appointmentUpdate.propertyId}
                  value={props.appointmentUpdate.propertyId}
                >
                  {props.appointmentUpdate.propertyAddress}
                </Select.Option>
              )}
            </Select>
          </Form.Item>

          <Form.Item name="buyerId" label="Người mua">
            <Select placeholder="Chọn người mua" disabled>
              {currentUser && (
                <Select.Option key={currentUser.userId} value={currentUser.userId}>
                  {currentUser.username}
                </Select.Option>
              )}
              {props.appointmentUpdate && (
                <Select.Option
                  key={props.appointmentUpdate.buyerId}
                  value={props.appointmentUpdate.buyerId}
                >
                  {props.appointmentUpdate.buyer}
                </Select.Option>
              )}
            </Select>
          </Form.Item>

          <Form.Item name="sellerId" label="Người bán">
            <Select placeholder="Chọn người bán" disabled>
              {currentUser && (
                <Select.Option key={currentUser.userId} value={currentUser.userId}>
                  {currentUser.username}
                </Select.Option>
              )}
              {props.appointmentUpdate && (
                <Select.Option
                  key={props.appointmentUpdate.sellerId}
                  value={props.appointmentUpdate.sellerId}
                >
                  {props.appointmentUpdate.seller}
                </Select.Option>
              )}
            </Select>
          </Form.Item>

          <Form.Item name="agentId" label="Người đại diện">
            <Select placeholder="Chọn người đại diện" disabled>
              {currentUser && (
                <Select.Option key={currentUser.userId} value={currentUser.userId}>
                  {currentUser.username}
                </Select.Option>
              )}
              {props.appointmentUpdate && (
                <Select.Option
                  key={props.appointmentUpdate.agentId}
                  value={props.appointmentUpdate.agentId}
                >
                  {props.appointmentUpdate.agent}
                </Select.Option>
              )}
            </Select>
          </Form.Item>

          <Form.Item
            name="date"
            label="Ngày & Giờ"
            rules={[{ required: true, message: 'Chọn lịch hẹn' }]}
          >
            <DatePicker
              showTime
              format="YYYY-MM-DD HH:mm"
              style={{ width: '100%' }}
              disabledDate={(current) => current && current < moment().startOf('day')}
            />
          </Form.Item>

          <Form.Item 
            name="statusId" 
            label="Trạng thái" 
            rules={[{ required: true, message: 'Chọn trạng thái' }]}
          >
            <Select placeholder="Chọn trạng thái" disabled>
              {appointmentStatusList.map((s) => (
                <Select.Option key={s.statusId} value={s.statusId}>
                  {s.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="note" label="Ghi chú" rules={[{ max: 1000 }]}>
            <TextArea rows={4} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" onClick={handleSubmit} style={{ marginRight: 8 }}>
              Đặt lịch hẹn
            </Button>
            <Button onClick={handleCancel}>Hủy</Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default AppointmentModal;