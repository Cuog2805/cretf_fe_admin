import React, { useState } from 'react';
import { Modal, Form, Input, Typography, message } from 'antd';
import { approveProperty } from '@/services/apis/propertyController';
import { useCurrentUser } from '@/selectors/useCurrentUser';
import useStatus from '@/selectors/useStatus';
import useLocations from '@/selectors/useLocation';

const { TextArea } = Input;
const { Text } = Typography;

interface PropertyApprovalModalProps {
  visible: boolean;
  isApprove: boolean;
  property: API.PropertyDTO | null;
  onClose: () => void;
  onSuccess: () => void; // Refresh data callback
}

const PropertyApprovalModal: React.FC<PropertyApprovalModalProps> = ({
  visible,
  isApprove,
  property,
  onClose,
  onSuccess,
}) => {
  const [form] = Form.useForm();
  const { propertyRentStatusList, propertySoldStatusList } = useStatus();
  const { locationList } = useLocations();

  const [loading, setLoading] = useState(false);
  const currentUser = useCurrentUser();

  const handleConfirm = () => {
    if (!property) return;
    
    form.validateFields().then((values) => {
      setLoading(true);
      
      const statusId = (property.type === 'SOLD' ? propertySoldStatusList : propertyRentStatusList)
        .find((d) => d.code === (isApprove ? (property.type === 'SOLD' ? 'FORSOLD' : 'FORRENT') : 'REJECT'))?.statusId;

      const body: API.PropertyDTO = {
        propertyId: property.propertyId,
        approvalHistoryDTO: {
          statusId: statusId,
          approver: currentUser?.username,
          note: values.note,
        },
      };

      approveProperty(body)
        .then((res) => {
          if (res.success) {
            message.success(isApprove ? 'Đã phê duyệt bất động sản thành công' : 'Đã từ chối bất động sản thành công');
            handleClose();
            onSuccess();
          } else {
            message.error(isApprove ? 'Có lỗi khi phê duyệt bất động sản' : 'Có lỗi khi từ chối bất động sản');
          }
        })
        .catch((error) => {
          message.error(isApprove ? 'Có lỗi khi phê duyệt bất động sản' : 'Có lỗi khi từ chối bất động sản');
        })
        .finally(() => {
          setLoading(false);
        });
    });
  };

  const handleClose = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      title={isApprove ? 'Phê duyệt bất động sản' : 'Từ chối bất động sản'}
      open={visible}
      onOk={handleConfirm}
      onCancel={handleClose}
      okText={isApprove ? 'Phê duyệt' : 'Từ chối'}
      cancelText="Hủy"
      okButtonProps={{ 
        type: isApprove ? 'primary' : 'default',
        danger: !isApprove,
        loading
      }}
      cancelButtonProps={{ disabled: loading }}
      width={500}
      destroyOnHidden
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="note"
          label={isApprove ? 'Lý do phê duyệt' : 'Lý do từ chối'}
          rules={[
            { required: true, message: 'Vui lòng nhập lý do' }
          ]}
        >
          <TextArea
            rows={4}
            placeholder={
              isApprove 
                ? 'Nhập lý do phê duyệt bất động sản này...' 
                : 'Nhập lý do từ chối bất động sản này...'
            }
            maxLength={1000}
            showCount
            disabled={loading}
          />
        </Form.Item>
        
        {property && (
          <div style={{ 
            padding: '12px', 
            backgroundColor: '#f5f5f5', 
            borderRadius: '6px', 
            marginTop: '8px' 
          }}>
            <Text strong>Bất động sản: </Text>
            <Text>{property.name}, {property.addressSpecific}, {locationList.find((l) => l.locationId === property?.locationId)?.fullname}</Text>
            <br />
            <Text strong>Loại: </Text>
            <Text>{property.type === 'SOLD' ? 'Bán' : 'Cho thuê'}</Text>
            <br />
            <Text strong>Giá: </Text>
            <Text>
              {property.propertyPriceNewest?.value} {property.propertyPriceNewest?.scaleUnit}
            </Text>
          </div>
        )}
      </Form>
    </Modal>
  );
};

export default PropertyApprovalModal;