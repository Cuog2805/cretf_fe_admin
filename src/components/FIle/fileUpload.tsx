import React, { useState, useEffect, useRef } from 'react';
import { Upload, Button, message, Modal, Spin, List, Card, Image, Tooltip, Typography } from 'antd';
import {
  UploadOutlined,
  InboxOutlined,
  DeleteOutlined,
  EyeOutlined,
  FilePdfOutlined,
  FileExcelOutlined,
  FileWordOutlined,
  FileOutlined,
  PlayCircleOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import type { UploadFile, UploadProps, UploadChangeParam } from 'antd/es/upload/interface';
import type { RcFile } from 'antd/es/upload';
import {
  uploadFile,
  uploadFileMulti,
  getFileInfo,
  getFileUrl,
  deleteFile,
} from '@/services/apis/fileController';

const { Dragger } = Upload;
const { Text } = Typography;

interface FileWithUrl extends API.FilesDTO {
  url?: string;
}

interface FileUploadProps {
  multiple?: boolean;
  maxCount?: number;
  acceptedFileExtensions?: string[];
  maxFileSize?: number;
  onChange?: (fileIds: string[] | string) => void;
  value?: string[] | string | any;
  uploadType?: string;
  buttonText?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  multiple = true,
  maxCount,
  acceptedFileExtensions = ['.png', '.jpg', '.jpeg', '.pdf', '.doc', '.docx', '.xls', '.xlsx'],
  maxFileSize = 10 * 1024 * 1024, // Default 10MB
  onChange,
  value = multiple ? [] : '',
  uploadType,
  buttonText,
}) => {
  const [fileList, setFileList] = useState<FileWithUrl[]>([]);
  const [previewVisible, setPreviewVisible] = useState<boolean>(false);
  const [previewFile, setPreviewFile] = useState<FileWithUrl | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const uploadRef = useRef<any>(null);
  
  const valueToArray = (val: string | string[] | any): string[] => {
    if (val === null || val === undefined) return [];
    if (Array.isArray(val)) return val;
    if (typeof val === 'string' && val) return [val];
    return [];
  };
  
  const prevValueRef = useRef<string[]>(valueToArray(value));

  const areArraysEqual = (array1: any[], array2: any[]) => {
    if (array1.length !== array2.length) return false;
    return array1.every((val, index) => val === array2[index]);
  };


  useEffect(() => {
    // Chuyển đổi value thành mảng để xử lý trong component
    const currentValueArray = valueToArray(value);
    
    // Chỉ chạy effect nếu value thực sự thay đổi
    if (!areArraysEqual(prevValueRef.current, currentValueArray)) {
      prevValueRef.current = currentValueArray;

      const fetchFiles = async () => {
        setLoading(true);
        try {
          if (currentValueArray.length > 0) {
            // Fetch file details for each fileId
            const filesWithUrls = await Promise.all(
              currentValueArray.map(async (fileId) => {
                // Kiểm tra fileId hợp lệ
                if (!fileId) return null;
                
                try {
                  // Get file info and URL
                  const fileInfo = await getFileInfo({ fileId });
                  const urlResponse = await getFileUrl({ fileId });
                  return { ...fileInfo, url: urlResponse.url };
                } catch (error) {
                  console.error(`Error fetching file info for ${fileId}:`, error);
                  return null;
                }
              }),
            );
            setFileList(filesWithUrls.filter(Boolean) as FileWithUrl[]);
          } else {
            setFileList([]);
          }
        } catch (error) {
          console.error('Error fetching files:', error);
          message.error('Không thể tải thông tin file');
        } finally {
          setLoading(false);
        }
      };

      fetchFiles();
    }
  }, [value]);

  const validateFile = (file: RcFile) => {
    if (maxFileSize && file.size > maxFileSize) {
      message.error(
        `${file.name} quá lớn! Giới hạn kích thước là ${maxFileSize / (1024 * 1024)}MB.`,
      );
      return false;
    }

    // Kiểm tra extension
    else if (acceptedFileExtensions && acceptedFileExtensions.length > 0) {
      if (!checkFileExtension(file.name)) {
        message.error(`${file.name} không phải là loại file được chấp nhận!`);
        return false;
      }
    }

    return true;
  };

  // Hàm kiểm tra file extension
  const checkFileExtension = (fileName: string): boolean => {
    if (!acceptedFileExtensions || acceptedFileExtensions.length === 0) {
      return true; // Không có giới hạn extension
    }

    const fileExt = '.' + fileName.split('.').pop()?.toLowerCase();
    return acceptedFileExtensions.includes(fileExt);
  };

  const handleMultiUpload = async (files: RcFile[]) => {
    // Validate all files first
    const validFiles = files.filter(validateFile);

    if (validFiles.length === 0) {
      return false;
    }

    if (validFiles.length !== files.length) {
      message.warning('Một số file đã bị bỏ qua do không đạt yêu cầu.');
    }

    setLoading(true);
    try {
      const response = await uploadFileMulti({}, validFiles);

      // Get existing file IDs to avoid potential duplication
      const existingFileIds = fileList.map((file) => file.fileId);

      // Filter out any files that might be duplicates
      const newFiles = response.filter(
        (file) => file.fileId && !existingFileIds.includes(file.fileId),
      );

      if (newFiles.length === 0) {
        setLoading(false);
        return true;
      }

      const filesWithUrls = await Promise.all(
        newFiles.map(async (file) => {
          try {
            const urlResponse = await getFileUrl({ fileId: file.fileId || '' });
            return { ...file, url: urlResponse.url };
          } catch (error) {
            console.error(`Lỗi khi lấy URL cho file ${file.fileId}:`, error);
            return file;
          }
        }),
      );

      // Update state with new files (replace if multiple=false)
      let updatedFileList: FileWithUrl[];
      if (multiple) {
        updatedFileList = [...fileList, ...filesWithUrls];
      } else {
        // Nếu multiple=false, chỉ giữ file mới nhất
        updatedFileList = filesWithUrls.slice(-1);
      }
      setFileList(updatedFileList);

      // Gọi onChange với định dạng phù hợp
      if (onChange) {
        const fileIds: string[] = updatedFileList
          .map((file) => file?.fileId)
          .filter((fileId): fileId is string => Boolean(fileId));
        
        // Nếu multiple=false, trả về string; ngược lại trả về mảng
        if (!multiple) {
          onChange(fileIds[0] || '');
        } else {
          onChange(fileIds);
        }
      }

      message.success(`${validFiles.length} file đã được tải lên thành công`);
      return true;
    } catch (error) {
      console.error('Lỗi tải lên hàng loạt:', error);
      message.error('Tải lên file thất bại');
      return false;
    } finally {
      setLoading(false);
      // Reset fileList của Upload component
      if (uploadRef.current) {
        uploadRef.current.fileList = [];
      }
    }
  };

  const handleRemove = async (file: FileWithUrl) => {
    try {
      await deleteFile({ fileId: file.fileId || '' });
      const updatedFileList = fileList.filter((item) => item.fileId !== file.fileId);
      setFileList(updatedFileList);

      // Gọi onChange với định dạng phù hợp
      if (onChange) {
        const fileIds: string[] = updatedFileList
          .map((file) => file?.fileId)
          .filter((fileId): fileId is string => Boolean(fileId));
        
        // Nếu multiple=false, trả về string; ngược lại trả về mảng
        if (!multiple) {
          onChange(fileIds[0] || '');
        } else {
          onChange(fileIds);
        }
      }

      message.success(`${file.name} đã được xóa thành công`);
    } catch (error) {
      console.error('Lỗi xóa:', error);
      message.error(`Không thể xóa ${file.name}`);
    }
  };

  const handlePreview = (file: FileWithUrl) => {
    setPreviewFile(file);
    setPreviewVisible(true);
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) {
      return null;
    } else if (fileType.includes('pdf')) {
      return <FilePdfOutlined />;
    } else if (fileType.includes('excel') || fileType.includes('spreadsheet')) {
      return <FileExcelOutlined />;
    } else if (fileType.includes('word') || fileType.includes('document')) {
      return <FileWordOutlined />;
    } else if (fileType.includes('video')) {
      return <PlayCircleOutlined />;
    } else {
      return <FileOutlined />;
    }
  };

  // Key fix for the issue - using beforeUpload to handle files
  const beforeUpload = (file: RcFile, fileList: RcFile[]) => {
    // If multiple uploads are allowed, process all files when the last one is detected
    if (!multiple) {
      handleMultiUpload([file]);
    } else if (fileList.length > 0 && file === fileList[fileList.length - 1]) {
      handleMultiUpload(fileList);
    }

    // Return false to prevent default upload behavior
    return false;
  };

  const uploadProps: UploadProps = {
    name: 'file',
    multiple: multiple,
    maxCount: maxCount,
    showUploadList: false,
    beforeUpload: beforeUpload,
    accept: acceptedFileExtensions.join(','),
    fileList: [], // Ensure fileList is always empty to prevent duplicate uploads
  };

  const renderUploadComponent = () => {
    switch (uploadType) {
      case 'button':
        return (
          <Upload {...uploadProps} ref={uploadRef}>
            <Button icon={<UploadOutlined />}>{buttonText}</Button>
          </Upload>
        );
      case 'avatar':
        return (
          <Upload
            {...uploadProps}
            ref={uploadRef}
            listType="picture-circle"
            className="avatar-uploader"
          >
            {fileList.length === 0 && (
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
              </div>
            )}
          </Upload>
        );
      case 'dragger':
      default:
        return (
          <Dragger {...uploadProps} ref={uploadRef}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">Nhấp hoặc kéo file vào đây để tải lên</p>
            <p className="ant-upload-hint">
              Hỗ trợ tải lên {multiple ? 'nhiều file' : 'một file'}.
            </p>
          </Dragger>
        );
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        {renderUploadComponent()}
      </div>

      <Spin spinning={loading} tip="Đang xử lý...">
        <List
          grid={{ gutter: [16, 16], xs: 1, sm: 1, md: 1, lg: 1, xl: 1, xxl: 4 }}
          dataSource={fileList}
          renderItem={(file) => (
            <List.Item>
              <Card
                style={{ margin: 10 }}
                hoverable
                cover={
                  file.type?.startsWith('image/') && file.url ? (
                    <div
                      style={{
                        height: 140,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        overflow: 'hidden',
                      }}
                    >
                      <img
                        alt={file.name}
                        src={file.url}
                        style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
                      />
                    </div>
                  ) : (
                    <div
                      style={{
                        height: 140,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        fontSize: 48,
                      }}
                    >
                      {getFileIcon(file.type || '')}
                    </div>
                  )
                }
                actions={[
                  <Tooltip title="Xem trước">
                    <Button
                      icon={<EyeOutlined />}
                      type="text"
                      onClick={() => handlePreview(file)}
                    />
                  </Tooltip>,
                  <Tooltip title="Xóa">
                    <Button
                      icon={<DeleteOutlined />}
                      type="text"
                      danger
                      onClick={() => handleRemove(file)}
                    />
                  </Tooltip>,
                ]}
              >
                <Card.Meta
                  title={
                    <Tooltip title={file.name}>
                      <Text ellipsis style={{ width: '100%' }}>
                        {file.name}
                      </Text>
                    </Tooltip>
                  }
                  description={file.type?.split('/')[1]?.toUpperCase() || 'Unknown'}
                />
              </Card>
            </List.Item>
          )}
        />
      </Spin>

      <Modal
        open={previewVisible}
        title={previewFile?.name}
        footer={null}
        onCancel={() => setPreviewVisible(false)}
        width={800}
      >
        {previewFile?.type?.startsWith('image/') ? (
          <Image
            alt={previewFile?.name}
            src={previewFile?.url}
            style={{ width: '100%' }}
            preview={false}
          />
        ) : previewFile?.type?.includes('video') ? (
          <div style={{ textAlign: 'center' }}>
            <video controls style={{ width: '100%', maxHeight: '500px' }}>
              <source src={previewFile?.url} type={previewFile?.type} />
              Trình duyệt của bạn không hỗ trợ video.
            </video>
          </div>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: 64 }}>{getFileIcon(previewFile?.type || '')}</p>
            <p>
              <a href={previewFile?.url} target="_blank" rel="noopener noreferrer">
                <Button type="primary">Tải xuống {previewFile?.name}</Button>
              </a>
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default FileUpload;
