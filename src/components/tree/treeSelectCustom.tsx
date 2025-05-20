import React, { useState, useEffect } from 'react';
import { TreeSelect } from 'antd';
import type { TreeSelectProps } from 'antd';

// Định nghĩa kiểu dữ liệu cho node
interface TreeNode {
  [key: string]: any;
  children?: TreeNode[];
}

// Định nghĩa kiểu dữ liệu cho fieldNames
interface FieldNames {
  label: string;
  value: string;
  children: string;
}

// Props của CustomTreeSelect
interface CustomTreeSelectProps extends TreeSelectProps {
  treeData: TreeNode[];
  fieldNames?: FieldNames;
}

/**
 * CustomTreeSelect - Component TreeSelect tùy chỉnh hỗ trợ tìm kiếm tiếng Việt
 * 
 * @param treeData - Mảng dữ liệu cây
 * @param fieldNames - Cấu hình tên trường (mặc định: { label: 'name', value: 'id', children: 'children' })
 * @param placeholder - Placeholder cho input
 * @param allowClear - Cho phép xóa giá trị đã chọn
 * @param treeDefaultExpandAll - Mở rộng tất cả các node ban đầu
 * @param ...props - Các props khác của TreeSelect
 */
const CustomTreeSelect: React.FC<CustomTreeSelectProps> = ({
  treeData = [],
  fieldNames = { label: 'name', value: 'id', children: 'children' },
  placeholder = 'Vui lòng chọn',
  allowClear = true,
  treeDefaultExpandAll = false,
  ...props
}) => {
  // State để lưu dữ liệu đã lọc
  const [filteredData, setFilteredData] = useState<TreeNode[]>(treeData);
  
  // Cập nhật filteredData khi treeData thay đổi
  useEffect(() => {
    setFilteredData(treeData);
  }, [treeData]);

  /**
   * Hàm chuyển đổi tiếng Việt có dấu thành không dấu
   */
  const removeVietnameseAccents = (str: string): string => {
    if (!str) return '';
    str = str.toLowerCase();
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    return str;
  };

  const isNodeMatch = (label: string, searchText: string): boolean => {
    const normalizedLabel = label.toLowerCase();
    const normalizedSearchText = searchText.toLowerCase();
    
    const normalizedLabelNoAccents = removeVietnameseAccents(normalizedLabel);
    const normalizedSearchTextNoAccents = removeVietnameseAccents(normalizedSearchText);
    
    return normalizedLabel.includes(normalizedSearchText) || 
           normalizedLabelNoAccents.includes(normalizedSearchTextNoAccents);
  };

  /**
   * Hàm xử lý tìm kiếm - sửa đổi để lọc chính xác hơn
   */
  const handleSearch = (searchText: string): void => {
    if (!searchText.trim()) {
      setFilteredData(treeData);
      return;
    }

    const filterNodes = (nodes: TreeNode[]): TreeNode[] => {
      if (!nodes) return [];

      return nodes
        .map(node => {
          const label = node[fieldNames.label] || '';
          
          const exactMatchNode = isNodeMatch(label, searchText);
          
          if (exactMatchNode) {
            return { ...node };
          }
          
          if (node[fieldNames.children] && node[fieldNames.children].length > 0) {
            const filteredChildren = filterNodes(node[fieldNames.children]);
            
            if (filteredChildren.length > 0) {
              return {
                ...node,
                [fieldNames.children]: filteredChildren
              };
            }
          }
          
          return null;
        })
        .filter(Boolean) as TreeNode[]; 
    };
    
    const filtered = filterNodes(treeData);
    setFilteredData(filtered);
  };

  return (
    <TreeSelect
      treeData={filteredData}
      fieldNames={fieldNames}
      placeholder={placeholder}
      allowClear={allowClear}
      treeDefaultExpandAll={treeDefaultExpandAll}
      dropdownStyle={{ maxHeight: 400, overflow: 'auto', ...props.dropdownStyle }}
      showSearch
      onSearch={handleSearch}
      filterTreeNode={false} // Tắt cơ chế lọc mặc định
      {...props}
    />
  );
};

export default CustomTreeSelect;