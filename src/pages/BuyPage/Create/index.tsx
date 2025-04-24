import React, { useState, useEffect } from 'react';
import { Form, Input, DatePicker, Select, Button, message } from 'antd';
//import FileUpload from '../../../utils/fileUtil';
import moment from 'moment';
import axios from 'axios';
import type { Moment } from 'moment';
import FileUpload from '@/utils/file/fileUpload';

const { Option } = Select;

const PropertyForm = () => {
  const [form] = Form.useForm();

  const handleSubmit = () => {
    form.validateFields().then((formValue) => {
        // formValue sẽ chứa fileIds là mảng các fileId
        console.log(formValue);
    })    
  };

  return (
    <Form<API.PropertyDTO> form={form} layout="vertical">
      <Form.Item
        name="code"
        label="Mã property"
        rules={[{ required: true, message: 'Vui lòng nhập mã property' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="name"
        label="Tên property"
        rules={[{ required: true, message: 'Vui lòng nhập tên property' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item name="addressSpecific" label="Địa chỉ cụ thể">
        <Input />
      </Form.Item>

      <Form.Item name="buildIn" label="Ngày xây dựng">
        <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} />
      </Form.Item>

      {/* Các field khác của property... */}

      <Form.Item name="fileIds" 
        //normalize={(value) => value?.map((f: any) => f.fileId)} 
        label="Hình ảnh / Tài liệu">
        <FileUpload 
            multiple={true}
            maxCount={5}
        />
      </Form.Item>

      <Button type="primary" onClick={handleSubmit}>
        Lưu
      </Button>
    </Form>
  );
};

export default PropertyForm;
