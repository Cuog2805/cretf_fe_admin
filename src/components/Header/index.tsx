import { Input, Menu, Dropdown, Avatar, Button, Space, Typography, Row, Col, Form } from 'antd';
import {
  SearchOutlined,
  UserOutlined,
  DownOutlined,
  MenuOutlined,
  EnvironmentOutlined,
} from '@ant-design/icons';
import { useState, useEffect } from 'react';
import useCategoryShareds from '@/selectors/useCategoryShareds';
import {
  findIdAndNodeChildrenIds,
  findNodeById,
  flatToTree,
  flatToTreeCustom,
} from '@/components/tree/treeUtil';
import { buildRoutesFromDB } from '@/utils/routeUtil';
import { useNavigate } from '@umijs/max';
import CustomTreeSelect from '@/components/tree/treeSelectCustom';
import useLocations from '@/selectors/useLocation';

const { Title } = Typography;
const { SubMenu } = Menu;

const Navbar = () => {
  const navigate = useNavigate();
  const { dmAdminMenu } = useCategoryShareds();
  const { locationTree } = useLocations();
  const [form] = Form.useForm();

  const [isMobile, setIsMobile] = useState(false);
  const [menuItems, setMenuItems] = useState<any[]>([]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (dmAdminMenu && dmAdminMenu.length > 0) {
      const categorySharedsTree = flatToTree(dmAdminMenu, 'code', 'codeParent', null);
      setMenuItems(categorySharedsTree);
    }
  }, [dmAdminMenu]);

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      navigate(`/buy/houses-for-sale/${values.locationId ?? ''}`);
    });
  };

  const handleClick = ({ key }: any) => {
    // Tìm item theo key
    const selected = findItemByKey(menuItems, key);
    if (selected?.path) {
      navigate(selected.path);
    }
  };

  // Hàm hỗ trợ tìm item hoặc subitem theo key
  const findItemByKey = (items: any, key: any) => {
    for (const item of items) {
      if (item.categorySharedId === key || item.code === key) return item;
      if (item.children) {
        const found = item.children.find(
          (child: any) => child.categorySharedId === key || child.code === key,
        );
        if (found) return found;
      }
    }
    return null;
  };

  return (
    <Row gutter={24} align="middle" style={{ padding: '10px' }}>
      {/* Logo và Search Bar */}
      <Col span={isMobile ? 4 : 4} style={{ alignContent: 'center' }}>
        <Title
          level={3}
          style={{
            color: 'red',
            textAlign: 'center',
            margin: 0,
            whiteSpace: 'nowrap',
            cursor: 'pointer',
          }}
          onClick={() => navigate('/admin')}
        >
          {isMobile ? 'C' : 'CRANE'}
        </Title>
      </Col>

      {/* Menu chính */}
      <Col span={isMobile ? 16 : 20}>
        {isMobile ? (
          <Dropdown
            menu={{
              onClick: handleClick,
              items: menuItems.map((item) => ({
                key: item.categorySharedId || item.code,
                label: item.name,
                children: item.children
                  ? item.children.map((subItem: any) => ({
                      key: subItem.categorySharedId || subItem.code,
                      label: subItem.name,
                    }))
                  : undefined,
              })),
            }}
            trigger={['click']}
          >
            <Button type="text">
              <MenuOutlined />
            </Button>
          </Dropdown>
        ) : (
          <Menu
            mode="horizontal"
            style={{ border: 'none', background: 'transparent' }}
            onClick={handleClick}
          >
            {menuItems.map((item) =>
              item.children ? (
                <SubMenu
                  key={item.code}
                  title={
                    <span
                      onClick={() => handleClick({ key: item.code })}
                      style={{ cursor: 'pointer' }}
                    >
                      {item.name}
                    </span>
                  }
                >
                  {item.children.map((subItem: any) => (
                    <Menu.Item key={subItem.code}>{subItem.name}</Menu.Item>
                  ))}
                </SubMenu>
              ) : (
                <Menu.Item key={item.code}>{item.name}</Menu.Item>
              ),
            )}
          </Menu>
        )}
      </Col>
    </Row>
  );
};

export default Navbar;
