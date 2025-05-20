import React, { useState, useEffect } from 'react';
import { Table, Button, Select, InputNumber, Form, Input, DatePicker, Typography } from 'antd';
import type { ColumnType } from 'antd/es/table';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import moment from 'moment';

const { Option } = Select;
const { TextArea } = Input;

// Định nghĩa các loại input có thể sử dụng
type InputTypes = 'text' | 'number' | 'select' | 'date' | 'textarea';

// Định nghĩa interface cho các cột
interface TableColumnConfig<T> {
  title: string; // Tiêu đề cột
  dataIndex: keyof T; // Key của dữ liệu
  editable?: boolean; // Có thể chỉnh sửa hay không
  inputType?: InputTypes; // Loại input khi chỉnh sửa
  required?: boolean; // Có bắt buộc không
  options?: Array<any>; // Options cho select
  optionLabelProp?: string; // Thuộc tính dùng làm label cho option
  optionValueProp?: string; // Thuộc tính dùng làm value cho option
  hideInTable?: boolean; // Ẩn cột trong bảng
  hideInForm?: boolean; // Ẩn trường trong form
  formItemProps?: any; // Props cho Form.Item
  inputProps?: any; // Props cho input
  // Hàm kiểm tra xem trường có thể chỉnh sửa hay không dựa vào record
  editableCondition?: (record: T) => boolean;
  // Hàm để thiết lập giá trị mặc định cho trường dựa vào record được chọn
  defaultValueFromRecord?: (record: T) => any;
  // Hàm để render nội dung hiển thị cho option trong dropdown
  renderOptions?: (item: any) => React.ReactNode;
  render?: (text: any, record: T, index: number, updateRecord: (record: T, field: keyof T, value: any) => void) => React.ReactNode;
}

// Props cho component
interface CloneableDataTableProps<T extends Record<string, any>> {
  // Danh sách dữ liệu nguồn để clone
  sourceData: T[];
  
  // Cấu hình các cột
  columns: TableColumnConfig<T>[];
  
  // Dữ liệu đã chọn ban đầu (nếu có)
  value?: T[];
  
  // Callback khi có thay đổi
  onChange?: (data: T[]) => void;
  
  // ID field của object
  rowKey: keyof T;
  
  // Thiết lập các trường có thể chỉnh sửa
  editableFields?: (keyof T)[];
  
  // Tiêu đề form thêm mới
  addFormTitle?: string;
  
  // Tiêu đề nút thêm mới
  addButtonText?: string;
  
  // Form layout
  formLayout?: 'horizontal' | 'vertical' | 'inline';
  
  // Hiển thị hoặc ẩn form thêm mới
  showAddForm?: boolean;
}

/**
 * Component bảng dữ liệu generic cho phép clone dữ liệu từ nguồn có sẵn
 * và chỉ cho phép chỉnh sửa một số trường nhất định
 */
function EditableTable<T extends Record<string, any>>(props: CloneableDataTableProps<T>) {
  const {
    sourceData,
    columns,
    value = [],
    onChange,
    rowKey,
    editableFields = [],
    addFormTitle = 'Thêm mới',
    addButtonText = 'Thêm',
    formLayout = 'inline',
    showAddForm = true  // Giá trị mặc định là true - hiển thị form
  } = props;

  // State lưu trữ dữ liệu đã chọn
  const [selectedData, setSelectedData] = useState<T[]>(value);
  
  // Form thêm mới
  const [form] = Form.useForm();
  
  // State để lưu item đang được chọn trong form
  const [selectedFormItem, setSelectedFormItem] = useState<T | null>(null);

  // Cập nhật selectedData khi prop value thay đổi
  useEffect(() => {
    setSelectedData(value);
  }, [value]);

  // Hàm thêm dữ liệu mới
  const addData = () => {
    form.validateFields().then(values => {
      // Tìm item được chọn từ sourceData
      const selectedItem = sourceData.find(item => String(item[rowKey]) === String(values[rowKey]));
      
      if (selectedItem) {
        // Tạo bản sao của item với các giá trị từ form
        const newItem = { ...selectedItem };
        
        // Cập nhật các trường có thể chỉnh sửa từ giá trị trong form
        columns.forEach(col => {
          const field = col.dataIndex;
          
          // Nếu có hàm tạo giá trị mặc định, sử dụng nó
          if (col.defaultValueFromRecord) {
            newItem[field] = col.defaultValueFromRecord(selectedItem);
          } else if (values[field] !== undefined) {
            // Kiểm tra điều kiện có thể chỉnh sửa
            const isEditable = col.editableCondition 
              ? col.editableCondition(selectedItem) && editableFields.includes(field)
              : editableFields.includes(field);
            
            // Nếu trường có thể chỉnh sửa, lấy giá trị từ form
            if (isEditable) {
              newItem[field] = values[field];
            }
          }
        });
        
        // Thêm vào danh sách đã chọn
        const newSelectedData = [...selectedData, newItem];
        setSelectedData(newSelectedData);
        
        // Gọi callback onChange
        if (onChange) {
          onChange(newSelectedData);
        }
        
        // Reset form
        form.resetFields();
        setSelectedFormItem(null);
      }
    });
  };

  // Hàm xóa dữ liệu
  const removeData = (itemKey: any) => {
    const newSelectedData = selectedData.filter(item => String(item[rowKey]) !== String(itemKey));
    setSelectedData(newSelectedData);
    
    if (onChange) {
      onChange(newSelectedData);
    }
  };

  // Hàm cập nhật dữ liệu
  const updateData = (record: T, field: keyof T, value: any) => {
    // Tìm cấu hình cột cho trường này
    const columnConfig = columns.find(col => col.dataIndex === field);
    
    // Kiểm tra điều kiện có thể chỉnh sửa
    const isEditable = columnConfig?.editableCondition 
      ? columnConfig.editableCondition(record) && editableFields.includes(field)
      : editableFields.includes(field);
    
    // Nếu không thể chỉnh sửa, không làm gì cả
    if (!isEditable) {
      return;
    }
    
    const newSelectedData = selectedData.map(item => {
      if (String(item[rowKey]) === String(record[rowKey])) {
        return { ...item, [field]: value };
      }
      return item;
    });
    
    setSelectedData(newSelectedData);
    
    if (onChange) {
      onChange(newSelectedData);
    }
  };

  // Hàm kiểm tra hiển thị form item dựa vào item đã chọn
  const shouldShowFormItem = (column: TableColumnConfig<T>, selectedItem: T | null) => {
    if (!selectedItem) return false;
    
    // Nếu có điều kiện hiển thị, kiểm tra điều kiện
    if (column.editableCondition && !column.editableCondition(selectedItem)) {
      return false;
    }
    
    return true;
  };
  
  // Xử lý khi chọn item trong dropdown
  const handleSelectItem = (value: any) => {
    const selected = sourceData.find(item => String(item[rowKey]) === String(value));
    if (selected) {
      setSelectedFormItem(selected);
      
      // Đặt lại giá trị cho các trường dựa trên item đã chọn
      const values: any = { [rowKey]: value };
      
      // Duyệt qua các cột
      columns.forEach(col => {
        const field = col.dataIndex;
        
        // Nếu có hàm tạo giá trị mặc định, sử dụng nó
        if (col.defaultValueFromRecord) {
          values[field] = col.defaultValueFromRecord(selected);
        }
      });
      
      // Cập nhật giá trị form
      form.setFieldsValue(values);
    }
  };

  // Tạo các cột cho Table
  const tableColumns: ColumnType<T>[] = columns
    .filter(col => !col.hideInTable)
    .map(col => {
      const isEditable = editableFields.includes(col.dataIndex);
      
      return {
        title: col.title,
        dataIndex: col.dataIndex as string,
        key: col.dataIndex as string,
        render: (text: any, record: T, index: number) => {
          // Nếu có render custom
          if (col.render) {
            return col.render(text, record, index, updateData);
          }
          
          // Kiểm tra điều kiện có thể chỉnh sửa dựa vào record
          const editableByCondition = col.editableCondition ? col.editableCondition(record) : true;
          
          // Nếu không có quyền chỉnh sửa hoặc không thỏa mãn điều kiện
          if (!isEditable || !editableByCondition) {
            // Hiển thị giá trị mặc định nếu có điều kiện và có defaultValueFromRecord
            if (!editableByCondition && col.defaultValueFromRecord) {
              const defaultValue = col.defaultValueFromRecord(record);
              return defaultValue;
            }
            
            // Hiển thị label cho trường select
            if (col.inputType === 'select' && Array.isArray(col.options)) {
              const optionValueProp = col.optionValueProp || 'value';
              const optionLabelProp = col.optionLabelProp || 'label';
              const option = col.options.find(opt => String(opt[optionValueProp]) === String(text));
              return option ? option[optionLabelProp] : text;
            }
            
            // Hiển thị text thông thường
            return text;
          }
          
          // Hiển thị control tương ứng cho từng loại input
          switch (col.inputType) {
            case 'number':
              return (
                <InputNumber
                  value={text}
                  onChange={(value) => updateData(record, col.dataIndex, value)}
                  {...(col.inputProps || {})}
                />
              );
            
            case 'select':
              return (
                <Select
                  value={text}
                  style={{ width: '100%' }}
                  onChange={(value) => updateData(record, col.dataIndex, value)}
                  {...(col.inputProps || {})}
                >
                  {col.options?.map(option => {
                    const optionValueProp = col.optionValueProp || 'value';
                    const optionLabelProp = col.optionLabelProp || 'label';
                    return (
                      <Option key={option[optionValueProp]} value={option[optionValueProp]}>
                        {option[optionLabelProp]}
                      </Option>
                    );
                  })}
                </Select>
              );
            
            case 'date':
              return (
                <DatePicker
                  value={text ? moment(text) : null}
                  onChange={(_, dateString) => updateData(record, col.dataIndex, dateString)}
                  {...(col.inputProps || {})}
                />
              );
            
            case 'textarea':
              return (
                <TextArea
                  value={text}
                  onChange={(e) => updateData(record, col.dataIndex, e.target.value)}
                  {...(col.inputProps || {})}
                />
              );
            
            case 'text':
            default:
              return (
                <Input
                  value={text}
                  onChange={(e) => updateData(record, col.dataIndex, e.target.value)}
                  {...(col.inputProps || {})}
                />
              );
          }
        }
      };
    });

  // Thêm cột thao tác
  const actionColumn: ColumnType<T> = {
    title: 'Thao tác',
    key: 'action',
    render: (_, record) => (
      <Button
        type="text"
        danger
        icon={<DeleteOutlined />}
        onClick={() => removeData(record[rowKey])}
      />
    ),
  };

  // Danh sách các khóa đã chọn
  const selectedKeys = selectedData.map(item => String(item[rowKey]));
  
  // Danh sách dữ liệu còn lại có thể chọn
  const availableData = sourceData.filter(item => !selectedKeys.includes(String(item[rowKey])));

  // Tạo các Form.Item cho form thêm mới
  const formItems = columns
    .filter(col => !col.hideInForm)
    .map(col => {
      const fieldName = col.dataIndex;
      let formItem;
      
      // Xử lý đặc biệt cho trường đầu tiên là rowKey
      if (fieldName === rowKey) {
        formItem = (
          <Form.Item
            key={fieldName as string}
            name={fieldName as string}
            label={col.title}
            rules={[{ required: true, message: `Vui lòng chọn ${col.title.toLowerCase()}!` }]}
            {...(col.formItemProps || {})}
          >
            <Select
              style={{ width: '100%' }}
              placeholder={`Chọn ${col.title.toLowerCase()}`}
              showSearch
              filterOption={(input, option) =>
                (option?.children as any)?.toString().toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              onChange={handleSelectItem}
              {...(col.inputProps || {})}
            >
              {availableData.map(item => {
                // Sử dụng renderOptions nếu có, nếu không thì hiển thị theo optionLabelProp hoặc trực tiếp giá trị
                const displayContent = col.renderOptions 
                  ? col.renderOptions(item)
                  : (col.inputType === 'select' && col.optionLabelProp && col.options
                      ? col.options.find(opt => opt[col.optionValueProp || 'value'] === item[fieldName])?.[col.optionLabelProp]
                      : item[fieldName]);
                
                return (
                  <Option key={item[rowKey]} value={item[rowKey]}>
                    {displayContent}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>
        );
      } else if (editableFields.includes(fieldName)) {
        // Kiểm tra xem có nên hiển thị form item này không
        const visible = selectedFormItem ? shouldShowFormItem(col, selectedFormItem) : true;
        
        if (!visible) return null;
        
        // Tạo form item cho các trường có thể chỉnh sửa
        const inputComponent = (() => {
          switch (col.inputType) {
            case 'number':
              return <InputNumber style={{ width: '100%' }} {...(col.inputProps || {})} />;
            
            case 'select':
              return (
                <Select style={{ width: '100%' }} {...(col.inputProps || {})}>
                  {col.options?.map(option => {
                    const optionValueProp = col.optionValueProp || 'value';
                    const optionLabelProp = col.optionLabelProp || 'label';
                    const displayContent = col.renderOptions 
                      ? col.renderOptions(option)
                      : option[optionLabelProp];
                      
                    return (
                      <Option key={option[optionValueProp]} value={option[optionValueProp]}>
                        {displayContent}
                      </Option>
                    );
                  })}
                </Select>
              );
            
            case 'date':
              return <DatePicker style={{ width: '100%' }} {...(col.inputProps || {})} />;
            
            case 'textarea':
              return <TextArea {...(col.inputProps || {})} />;
            
            case 'text':
            default:
              return <Input {...(col.inputProps || {})} />;
          }
        })();
        
        formItem = (
          <Form.Item
            key={fieldName as string}
            name={fieldName as string}
            label={col.title}
            rules={col.required ? [{ required: true, message: `Vui lòng nhập ${col.title.toLowerCase()}!` }] : undefined}
            {...(col.formItemProps || {})}
          >
            {inputComponent}
          </Form.Item>
        );
      }
      
      return formItem;
    }).filter(Boolean); // Lọc bỏ các item null

  return (
    <div className="cloneable-data-table">
      {/* Chỉ hiển thị form thêm mới nếu showAddForm là true */}
      {showAddForm && (
        <>
          {addFormTitle && <Typography.Title level={5}>{addFormTitle}</Typography.Title>}
          
          <Form
            form={form}
            layout={formLayout}
            style={{ marginBottom: 16 }}
          >
            {formItems}
            
            <Form.Item>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={addData}
                disabled={availableData.length === 0}
              >
                {addButtonText}
              </Button>
            </Form.Item>
          </Form>
        </>
      )}
      
      <Table
        columns={[...tableColumns, actionColumn]}
        dataSource={selectedData}
        rowKey={rowKey as string}
        pagination={false}
        bordered
      />
    </div>
  );
}

export default EditableTable;