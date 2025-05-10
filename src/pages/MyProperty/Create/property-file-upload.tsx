import React, { useState, useEffect, useRef } from 'react';
import { Tabs, Card, Typography, Divider, Row, Col, Alert, Button, Space, Empty, Modal, message } from 'antd';
import { DeleteOutlined, EyeOutlined, PlusOutlined } from '@ant-design/icons';
import FileUpload from '@/utils/file/fileUpload';
import FileRenderer from '@/utils/file/fileRender';
import { deleteFile } from '@/services/apis/fileController';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

interface PropertyFilesUploadProps {
  onChange?: (files: API.PropertyFilesDTO[]) => void;
  value?: API.PropertyFilesDTO[];
  initialFiles?: API.PropertyFilesDTO[];
  propertyId?: string;
  customCategories?: Array<{
    key: string;
    label: string;
    description: string;
  }>;
}

interface PropertyFileCategory {
  key: string;
  label: string;
  description: string;
}

const PROPERTY_FILE_CATEGORIES: PropertyFileCategory[] = [
  { key: 'COMMON', label: 'Khu vực chung', description: 'Hình ảnh, tài liệu cho toàn bộ căn nhà' },
  { key: 'LIVING', label: 'Phòng khách', description: 'Hình ảnh, tài liệu cho phòng khách' },
  { key: 'KITCHEN', label: 'Nhà bếp', description: 'Hình ảnh, tài liệu cho nhà bếp' },
  { key: 'BATHROOM', label: 'Phòng tắm', description: 'Hình ảnh, tài liệu cho phòng tắm' },
  { key: 'BEDROOM', label: 'Phòng ngủ', description: 'Hình ảnh, tài liệu cho phòng ngủ' },
  { key: 'OTHER', label: 'Tiện ích khác', description: 'Hình ảnh, tài liệu cho tiện ích khác' },
];

const PropertyFilesUpload: React.FC<PropertyFilesUploadProps> = ({
  onChange,
  value = [],
  initialFiles = [],
  propertyId,
  customCategories,
}) => {
  const categories = customCategories || PROPERTY_FILE_CATEGORIES;

  const [filesByCategory, setFilesByCategory] = useState<Record<string, string[]>>({});
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [previewVisible, setPreviewVisible] = useState<boolean>(false);
  const [previewFileId, setPreviewFileId] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>('COMMON');

  const prevInitialFilesRef = useRef<API.PropertyFilesDTO[]>([]);
  const prevValueRef = useRef<API.PropertyFilesDTO[]>([]);

  useEffect(() => {
    console.log('PropertyFilesUpload props:', { 
      initialFilesLength: initialFiles.length, 
      valueLength: value.length, 
      propertyId, 
      isInitialized,
    });
  }, [initialFiles.length, value.length, propertyId, isInitialized]);

  useEffect(() => {
    if (initialFiles.length === 0 || 
        areArraysEqual(initialFiles, prevInitialFilesRef.current)) {
      return;
    }
    
    prevInitialFilesRef.current = [...initialFiles];
    
    console.log('Initializing from initialFiles:', initialFiles);
    
    const initialFilesByCategory: Record<string, string[]> = {};
    
    initialFiles.forEach((item) => {
      if (item.category && Array.isArray(item.fileIds)) {
        initialFilesByCategory[item.category] = [...item.fileIds];
      }
    });
    
    categories.forEach((category) => {
      if (!initialFilesByCategory[category.key]) {
        initialFilesByCategory[category.key] = [];
      }
    });
    
    setFilesByCategory(initialFilesByCategory);
    setIsInitialized(true);
    
    if (onChange) {
      onChange(initialFiles);
    }
  }, [initialFiles, categories, onChange]);

  useEffect(() => {
    if (isInitialized && initialFiles.length > 0) {
      return;
    }
    if (areArraysEqual(value, prevValueRef.current)) {
      return;
    }

    prevValueRef.current = [...value];
    
    if (value.length > 0) {
      console.log('Initializing from value:', value);
      
      const filesFromValue: Record<string, string[]> = {};

      value.forEach((item) => {
        if (item.category && Array.isArray(item.fileIds)) {
          filesFromValue[item.category] = [...item.fileIds];
        }
      });

      categories.forEach((category) => {
        if (!filesFromValue[category.key]) {
          filesFromValue[category.key] = [];
        }
      });

      setFilesByCategory(filesFromValue);
      setIsInitialized(true);
    }
  }, [value, categories, isInitialized, initialFiles.length]);

  // Helper functions to avoid infinite loops
  const areArraysEqual = (arr1: any[], arr2: any[]): boolean => {
    if (arr1.length !== arr2.length) return false;
    return JSON.stringify(arr1) === JSON.stringify(arr2);
  }

  const handleCategoryFilesChange = (category: string, fileIds: string[]) => {
    const updatedFiles = {
      ...filesByCategory,
      [category]: fileIds,
    };

    setFilesByCategory(updatedFiles);

    // Convert to expected PropertyFilesDTO format and call onChange
    if (onChange) {
      const formattedValue: API.PropertyFilesDTO[] = Object.keys(updatedFiles)
        .filter(categoryKey => Array.isArray(updatedFiles[categoryKey]) && updatedFiles[categoryKey].length > 0)
        .map((categoryKey) => ({
          propertyId: propertyId,
          category: categoryKey,
          fileIds: updatedFiles[categoryKey],
        }));

      onChange(formattedValue);
    }
  };

  // Get current value for a category
  const getCategoryValue = (category: string): string[] => {
    return filesByCategory[category] || [];
  };

  return (
    <Card>
      <Title level={4}>Hình ảnh và tài liệu theo khu vực</Title>
      <Text type="secondary">
        Tải lên hình ảnh và tài liệu cho từng khu vực của bất động sản. 
      </Text>

      <Divider />

      <Tabs activeKey={activeTab} onChange={setActiveTab} defaultActiveKey="COMMON">
        {categories.map((category) => (
          <TabPane tab={category.label} key={category.key}>
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Alert
                  message={`${category.label} - ${category.description}`}
                  type="info"
                  showIcon
                  style={{ marginBottom: 16 }}
                />
              </Col>

              {/* Upload Section */}
              <Col span={24}>
                <Card>
                  <FileUpload
                    multiple={true}
                    acceptedFileExtensions={['.png', '.jpg', '.jpeg', '.pdf', '.doc', '.docx']}
                    maxFileSize={10 * 1024 * 1024} // 5MB limit
                    value={getCategoryValue(category.key)}
                    onChange={(fileIds) =>
                      handleCategoryFilesChange(category.key, fileIds as string[])
                    }
                    uploadType="dragger"
                  />
                </Card>
              </Col>
            </Row>
          </TabPane>
        ))}
      </Tabs>

      {/* Preview Modal */}
      <Modal
        open={previewVisible}
        title="Preview"
        footer={null}
        onCancel={() => setPreviewVisible(false)}
        width="80%"
        style={{ top: 20 }}
      >
        <div style={{ display: 'flex', justifyContent: 'center', minHeight: '400px' }}>
          <FileRenderer
            fileId={previewFileId}
            width="100%"
            height="auto"
            style={{ maxHeight: '80vh' }}
          />
        </div>
      </Modal>
    </Card>
  );
};

export default PropertyFilesUpload;