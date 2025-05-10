import React, { useEffect, useState } from 'react';
import {
  Form,
  Input,
  Button,
  Card,
  DatePicker,
  InputNumber,
  Select,
  message,
  Row,
  Col,
  Divider,
  Typography,
  Radio,
  Tabs,
  Spin,
  TreeSelect,
} from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import { EditableProTable } from '@ant-design/pro-components';
import useStatus from '@/selectors/useStatus';
import useScale from '@/selectors/useScale';
import usePropertyType from '@/selectors/usePropertyType';
import useAmenity from '@/selectors/useAmenity';
import EditableTable from '@/utils/EditableTable';
import {
  createProperty,
  getOneDetailProperty,
  updateProperty,
} from '@/services/apis/propertyController';
import { useCurrentUser } from '@/selectors/useCurrentUser';
import { useParams, history } from 'umi';
import moment from 'moment';
import PropertyFilesUpload from '../Create/property-file-upload';
import FileUpload from '@/utils/file/fileUpload';
import useLocations from '@/selectors/useLocation';
import dayjs from 'dayjs';

const { Title } = Typography;
const { Option } = Select;
const { TextArea } = Input;
const { TabPane } = Tabs;

const MyPropertyForm = () => {
  const { propertyId } = useParams();
  const isUpdateMode = !!propertyId;
  const [form] = Form.useForm();
  const currentUser = useCurrentUser();
  const { propertySoldStatusList, propertyRentStatusList } = useStatus();
  const { moneyScaleList, primitiveScaleList } = useScale();
  const { propertyTypeList } = usePropertyType();
  const { amenityRoomList, amenityOtherList, amenityInfoList } = useAmenity();
  const { locationTree } = useLocations();

  const [loading, setLoading] = useState(isUpdateMode);
  const [formInitialized, setFormInitialized] = useState<boolean>(false);
  const [propertyPurpose, setPropertyPurpose] = useState<string>('SOLD');
  const [propertyFiles, setPropertyFiles] = useState<API.PropertyFilesDTO[]>([]);
  const [amenityRoomListAdd, setAmenityRoomListAdd] = useState<API.AmenityDTO[]>([]);
  const [amenityOtherListAdd, setAmenityOtherListAdd] = useState<API.AmenityDTO[]>([]);
  const [amenityInfoListAdd, setAmenityInfoListAdd] = useState<API.AmenityDTO[]>([]);
  const [originalProperty, setOriginalProperty] = useState<API.PropertyDTO | null>(null);

  // Fetch property details if in update mode
  useEffect(() => {
    if (isUpdateMode) {
      const fetchPropertyDetails = async () => {
        try {
          setLoading(true);
          const response = await getOneDetailProperty({ propertyId });
          if (response.success && response.data) {
            setOriginalProperty(response.data);

            setPropertyPurpose(response.data.type ?? 'SOLD');

            // Process amenities
            if (response.data.amenityDTOs) {
              const roomAmenities = response.data.amenityDTOs.filter(
                (amenity) => amenity.amenityType === 'AMENITY_TYPE_01',
              );
              const otherAmenities = response.data.amenityDTOs.filter(
                (amenity) => amenity.amenityType === 'AMENITY_TYPE_02',
              );
              const infoAmenities = response.data.amenityDTOs.filter(
                (amenity) => amenity.amenityType === 'AMENITY_TYPE_03',
              );

              setAmenityRoomListAdd(roomAmenities);
              setAmenityOtherListAdd(otherAmenities);
              setAmenityInfoListAdd(infoAmenities);
            }

            // Set property files
            if (response.data.propertyFilesDTOs) {
              setPropertyFiles(response.data.propertyFilesDTOs);
            }
            // Prepare form values
            const formValues = {
              propertyPurpose: propertyPurpose,
              name: response.data.name,
              code: response.data.code,
              addressSpecific: response.data.addressSpecific,
              propertyTypeId: response.data.propertyTypeId,
              statusIds: response.data.statusIds,
              price: response.data.propertyPriceNewest?.value,
              priceScaleId: response.data.propertyPriceNewest?.scaleId,
              buildIn: response.data.buildIn ? moment(response.data.buildIn) : null,
              depositValue: response.data.depositDTO?.value,
              depositScaleUnit: response.data.depositDTO?.scaleUnit,
              depositDueDate: response.data.depositDTO?.dueDate,
              depositNote: response.data.depositDTO?.note,
            };

            form.setFieldsValue(formValues);
          } else {
            message.error('Không tìm thấy thông tin tài sản');
          }
        } catch (error) {
          console.error('Error fetching property details:', error);
          message.error('Lỗi khi lấy thông tin tài sản');
        } finally {
          setLoading(false);
          setFormInitialized(true);
        }
      };

      fetchPropertyDetails();
    }
  }, [propertyId, isUpdateMode, propertySoldStatusList, propertyRentStatusList]);

  // Initialize amenities when amenity lists are loaded
  useEffect(() => {
    if (!isUpdateMode && amenityRoomList && amenityRoomList.length > 0) {
      console.log('amenityRoomList', amenityRoomList);
      setAmenityRoomListAdd(amenityRoomList);
    }
  }, [amenityRoomList, isUpdateMode]);

  useEffect(() => {
    if (!isUpdateMode && amenityInfoList && amenityInfoList.length > 0) {
      console.log('amenityInfoList', amenityInfoList);
      setAmenityInfoListAdd(amenityInfoList);
    }
  }, [amenityInfoList, isUpdateMode]);

  useEffect(() => {
    if (
      !isUpdateMode &&
      !formInitialized &&
      propertySoldStatusList.length > 0 &&
      propertyRentStatusList.length > 0
    ) {
      const defaultStatus =
        propertyPurpose === 'SOLD'
          ? propertySoldStatusList.find((d) => d.code === 'FORSOLD')?.statusId
          : propertyRentStatusList.find((d) => d.code === 'FORRENT')?.statusId;

      // Set initial values
      form.setFieldsValue({
        propertyPurpose: propertyPurpose,
        statusIds: defaultStatus ? [defaultStatus] : [],
      });

      setFormInitialized(true);
    }
  }, [
    form,
    propertyPurpose,
    propertySoldStatusList,
    propertyRentStatusList,
    formInitialized,
    isUpdateMode,
  ]);

  // Update status when property purpose changes
  useEffect(() => {
    if (formInitialized && !isUpdateMode) {
      const defaultStatus =
        propertyPurpose === 'SOLD'
          ? propertySoldStatusList.find((d) => d.code === 'FORSOLD')?.statusId
          : propertyRentStatusList.find((d) => d.code === 'FORRENT')?.statusId;

      form.setFieldsValue({
        statusIds: defaultStatus ? [defaultStatus] : [],
      });
    }
  }, [
    propertyPurpose,
    formInitialized,
    isUpdateMode,
    propertySoldStatusList,
    propertyRentStatusList,
  ]);

  const handleSubmit = async (values: any) => {
    try {
      const body: API.PropertyDTO = {
        ...values,
        propertyId: isUpdateMode ? propertyId : undefined,
        propertyPriceNewest: {
          value: values.price,
          scaleUnit: values.priceScaleId,
        },
        depositDTO: {
          value: values.depositValue,
          scaleUnit: values.depositScaleUnit,
          dueDate: values.depositDueDate,
          note: values.depositNote,
        },
        amenityDTOs: [...amenityRoomListAdd, ...amenityOtherListAdd, ...amenityInfoListAdd],
        propertyFilesDTOs: propertyFiles,
        creator: isUpdateMode ? originalProperty?.creator : currentUser?.username,
        modifier: isUpdateMode ? currentUser?.username : undefined,
        dateModified: isUpdateMode ? new Date().toISOString() : undefined,
        type: propertyPurpose,
      };

      console.log('Submitting property:', body);

      if (isUpdateMode) {
        updateProperty(body)
          .then((resp) => {
            console.log('resp', resp);
            message.success('Cập nhật thành công');
            history.push('/account/my-property');
          })
          .catch((err) => {
            message.error('Cập nhật thất bại');
          });
      } else {
        // For create mode, use existing implementation
        createProperty(body)
          .then((resp) => {
            console.log('resp', resp);
            message.success('Đăng thành công');
            history.push('/account/my-property');
          })
          .catch((err) => {
            message.error('Đăng thất bại');
          });
      }
    } catch (error) {
      console.error('Đăng thất bại: ', error);
      message.error('Đăng thất bại');
    }
  };

  const handlePropertyPurposeChange = (e: any) => {
    const newValue = e.target.value;
    setPropertyPurpose(newValue);
  };

  const handlePropertyFilesChange = (files: API.PropertyFilesDTO[]) => {
    setPropertyFiles(files);
  };

  const columns: any[] = [
    {
      title: 'Tiện ích',
      dataIndex: 'amenityId',
      inputType: 'select',
      optionLabelProp: 'name',
      optionValueProp: 'amenityId',
      options: amenityOtherList,
      required: true,
      render: (text: string, record: any) => record.name || text,
      renderOptions: (item: any) => item.name,
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      editable: false,
    },
    {
      title: 'Giá trị',
      dataIndex: 'value',
      inputType: 'number',
      editable: true,
      required: true,
      defaultValueFromRecord: (record: any) => {
        if (record.scaleId === 'SCALE_BOOL') {
          return 1;
        }
        return record.value || 0;
      },
      hideInForm: true,
      inputProps: {
        min: 0,
        placeholder: 'Nhập giá trị',
      },
      render: (text: string, record: any, index: number, updateRecord: Function) => {
        if (record.scaleId === 'SCALE_BOOL') {
          return <span>Có</span>;
        } else {
          return (
            <InputNumber
              value={Number(text) || 0}
              onChange={(value) => updateRecord(record, 'value', value)}
              min={0}
              placeholder="Nhập giá trị"
            />
          );
        }
      },
    },
    {
      title: 'Đơn vị',
      dataIndex: 'scaleId',
      editable: false,
      render: (text: string, record: any) => <>{record.scaleUnit}</>,
    },
  ];

  return (
    <PageContainer
      header={{
        title: isUpdateMode ? 'Cập nhật tài sản' : 'Thêm mới tài sản',
        breadcrumb: {
          routes: [],
        },
      }}
    >
      <Spin spinning={loading} tip="Đang tải...">
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Card>
            <Title level={4}>Thông tin cơ bản</Title>

            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="propertyPurpose"
                  label="Mục đích"
                  rules={[{ required: true, message: 'Vui lòng chọn mục đích' }]}
                >
                  <Radio.Group onChange={handlePropertyPurposeChange} disabled={isUpdateMode}>
                    <Radio.Button value="SOLD">Bán</Radio.Button>
                    <Radio.Button value="RENT">Cho thuê</Radio.Button>
                  </Radio.Group>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="locationId"
                  label="Khu vực"
                  rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}
                >
                  <TreeSelect
                    showSearch
                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
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
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="addressSpecific"
                  label="Địa chỉ cụ thể"
                  rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}
                >
                  <Input placeholder="Nhập địa chỉ tài sản" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="name"
                  label="Tên tài sản"
                  rules={[{ required: true, message: 'Vui lòng nhập tên tài sản' }]}
                >
                  <Input placeholder="Nhập tên tài sản" />
                </Form.Item>
              </Col>

              <Col xs={24} sm={12}>
                <Form.Item
                  name="propertyTypeId"
                  label="Loại tài sản"
                  rules={[{ required: true, message: 'Vui lòng chọn loại tài sản' }]}
                >
                  <Select placeholder="Chọn loại tài sản">
                    {propertyTypeList.map((type) => (
                      <Option key={type.propertyTypeId} value={type.propertyTypeId}>
                        {type.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Form.Item name="buildIn" label="Năm xây dựng">
                  <DatePicker
                    picker="year"
                    style={{ width: '100%' }}
                    disabledDate={(current) => {
                      return current && current.year() > dayjs().year();
                    }}
                  />
                </Form.Item>
              </Col>

              <Col xs={24} sm={12}>
                <Form.Item
                  name="statusIds"
                  label="Trạng thái"
                  rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
                >
                  <Select mode="multiple" placeholder="Chọn trạng thái" disabled={!isUpdateMode}>
                    {(propertyPurpose === 'SOLD'
                      ? propertySoldStatusList
                      : propertyRentStatusList
                    ).map((option) => (
                      <Option key={option.statusId} value={option.statusId}>
                        {option.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </Card>

          <Divider />

          <Card>
            <Title level={4}>
              {propertyPurpose === 'SOLD' ? 'Thông tin giá bán' : 'Thông tin giá thuê'}
            </Title>
            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="price"
                  label={propertyPurpose === 'SOLD' ? 'Giá bán' : 'Giá thuê'}
                  rules={[{ required: true, message: 'Vui lòng nhập giá' }]}
                >
                  <InputNumber
                    style={{ width: '100%' }}
                    placeholder={propertyPurpose === 'SOLD' ? 'Nhập giá bán' : 'Nhập giá thuê'}
                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={(value) => (value ? value.replace(/\$\s?|(,*)/g, '') : '')}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="priceScaleId"
                  label="Đơn vị tiền tệ"
                  rules={[{ required: true, message: 'Vui lòng chọn đơn vị tiền tệ' }]}
                >
                  <Select placeholder="Chọn đơn vị tiền tệ">
                    {moneyScaleList.map((option) => (
                      <Option key={option.scaleId} value={option.scaleId}>
                        {option.unit}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </Card>

          <Divider />

          <Card>
            <Title level={4}>Thông tin phòng</Title>
            <Row gutter={16}>
              <Col span={24}>
                <EditableTable
                  sourceData={amenityRoomList}
                  columns={columns}
                  value={amenityRoomListAdd}
                  onChange={(values) => {
                    console.log('Room amenities updated:', values);
                    setAmenityRoomListAdd(values);
                  }}
                  rowKey="amenityId"
                  editableFields={['value']}
                  showAddForm={false}
                />
              </Col>
            </Row>
          </Card>

          <Divider />

          <Card>
            <Title level={4}>Thông tin diện tích</Title>
            <Row gutter={16}>
              <Col span={24}>
                <EditableTable
                  sourceData={amenityInfoList}
                  columns={columns}
                  value={amenityInfoListAdd}
                  onChange={(values) => {
                    console.log('Info amenities updated:', values);
                    setAmenityInfoListAdd(values);
                  }}
                  rowKey="amenityId"
                  editableFields={['value']}
                  showAddForm={false}
                />
              </Col>
            </Row>
          </Card>

          <Divider />

          <Card>
            <Title level={4}>Tiện ích khác</Title>
            <Row gutter={16}>
              <Col span={24}>
                <EditableTable
                  sourceData={amenityOtherList}
                  columns={columns}
                  value={amenityOtherListAdd}
                  onChange={(values) => {
                    console.log('Other amenities updated:', values);
                    setAmenityOtherListAdd(values);
                  }}
                  rowKey="amenityId"
                  editableFields={['value']}
                  addFormTitle="Thêm tiện ích mới"
                  addButtonText="Thêm tiện ích"
                  formLayout="inline"
                />
              </Col>
            </Row>
          </Card>

          <Divider />
          <Form.Item name="propertyFiles" label="">
            {isUpdateMode && originalProperty ? (
              <PropertyFilesUpload
                initialFiles={originalProperty.propertyFilesDTOs}
                propertyId={propertyId}
                onChange={handlePropertyFilesChange}
              />
            ) : (
              <PropertyFilesUpload onChange={handlePropertyFilesChange} />
            )}
          </Form.Item>

          <Divider />
          <Card>
            <Title level={4}>Thông tin cọc</Title>

            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="depositValue"
                  label="Giá trị đặt cọc"
                  rules={[
                    {
                      required: true,
                      message: 'Vui lòng nhập giá trị đặt cọc',
                    },
                  ]}
                >
                  <InputNumber
                    style={{ width: '100%' }}
                    placeholder="Nhập giá trị đặt cọc"
                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={(value) => (value ? value.replace(/\$\s?|(,*)/g, '') : '')}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="depositScaleUnit"
                  label="Đơn vị tiền tệ đặt cọc"
                  rules={[
                    {
                      required: true,
                      message: 'Vui lòng chọn đơn vị tiền tệ',
                    },
                  ]}
                >
                  <Select placeholder="Chọn đơn vị tiền tệ">
                    {moneyScaleList.map((option) => (
                      <Option key={option.scaleId} value={option.scaleId}>
                        {option.unit}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="depositDueDate"
                  label="Hạn đặt cọc (ngày)"
                  rules={[
                    {
                      required: true,
                      message: 'Vui lòng nhập hạn đặt cọc',
                    },
                  ]}
                >
                  <InputNumber
                    style={{ width: '100%' }}
                    min={1}
                    max={365}
                    placeholder="Nhập số ngày"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item name="depositNote" label="Ghi chú đặt cọc">
                  <TextArea rows={4} placeholder="Nhập ghi chú về đặt cọc (không bắt buộc)" />
                </Form.Item>
              </Col>
            </Row>
          </Card>

          <Form.Item>
            <Button type="primary" htmlType="submit" size="large" style={{ marginTop: 16 }}>
              {isUpdateMode
                ? propertyPurpose === 'SOLD'
                  ? 'Cập nhật thông tin bán'
                  : 'Cập nhật thông tin cho thuê'
                : propertyPurpose === 'SOLD'
                  ? 'Đăng bán tài sản'
                  : 'Đăng cho thuê tài sản'}
            </Button>
            {isUpdateMode && (
              <Button
                htmlType="button"
                size="large"
                style={{ marginTop: 16, marginLeft: 16 }}
                onClick={() => history.back()}
              >
                Hủy
              </Button>
            )}
          </Form.Item>
        </Form>
      </Spin>
    </PageContainer>
  );
};

export default MyPropertyForm;
