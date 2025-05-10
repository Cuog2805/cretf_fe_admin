import React, { useState, useEffect } from 'react';
import { Spin, message, Empty } from 'antd';
import { FileImageOutlined, PlaySquareOutlined } from '@ant-design/icons';
import { getFileInfo, getFileUrl } from '@/services/apis/fileController';

interface FileRendererProps {
  fileId: string;
  width?: string | number;
  height?: string | number;
  className?: string;
  style?: React.CSSProperties;
  fallbackText?: string;
  showPlaceholderIcon?: boolean;
}

interface FileData {
  url?: string;
  type?: string;
  name?: string;
}

const FileRenderer: React.FC<FileRendererProps> = ({
  fileId,
  width = '100%',
  height = 'auto',
  className,
  style,
  fallbackText = 'Unsupported file type',
  showPlaceholderIcon = true,
}) => {
  const [fileData, setFileData] = useState<FileData>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFileData = async () => {
      if (!fileId) {
        setError('No file ID provided');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // Get file info
        const fileInfo = await getFileInfo({ fileId });
        
        if (!fileInfo || !fileInfo.fileId) {
          throw new Error('File not found');
        }
        
        // Get file URL
        const urlResponse = await getFileUrl({ fileId });
        
        setFileData({
          url: urlResponse.url,
          type: fileInfo.type,
          name: fileInfo.name
        });
      } catch (err) {
        console.error('Error fetching file:', err);
        setError('Failed to load file');
        message.error('Failed to load file');
      } finally {
        setLoading(false);
      }
    };

    fetchFileData();
  }, [fileId]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width, height, minHeight: '80px' }}>
        <Spin />
      </div>
    );
  }

  if (error || !fileData.url) {
    return (
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description={error || 'File not available'}
        style={{ width, height }}
      />
    );
  }

  const fileType = fileData.type || '';
  
  // Render image
  if (fileType.startsWith('image/')) {
    return (
      <img
        src={fileData.url}
        alt={fileData.name || 'Image'}
        width={width}
        height={height}
        className={className}
        style={{ objectFit: 'contain', ...style }}
        onError={() => {
          setError('Failed to load image');
          message.error('Failed to load image');
        }}
      />
    );
  }
  
  // Render video
  if (fileType.startsWith('video/')) {
    return (
      <video
        src={fileData.url}
        controls
        width={width}
        height={height}
        className={className}
        style={style}
        title={fileData.name}
        onError={() => {
          setError('Failed to load video');
          message.error('Failed to load video');
        }}
      />
    );
  }
  
  // For other file types
  if (showPlaceholderIcon) {
    const IconComponent = fileType.includes('image') ? FileImageOutlined : PlaySquareOutlined;
    
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        width, 
        height,
        padding: '20px',
        color: '#8c8c8c',
        background: '#f5f5f5',
        borderRadius: '8px',
        ...style
      }} className={className}>
        <IconComponent style={{ fontSize: '32px', marginBottom: '8px' }} />
        <div>{fallbackText}</div>
      </div>
    );
  }
  
  return null;
};

export default FileRenderer;