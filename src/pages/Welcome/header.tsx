import React from 'react';
import { Layout, Menu, Input, Avatar, Dropdown } from 'antd';
import { SearchOutlined, UserOutlined } from '@ant-design/icons';
import { Search } from '@ant-design/pro-components';

const { Header } = Layout;

const menuItems = [
  { key: 'buy', label: 'Buy' },
  { key: 'rent', label: 'Rent' },
  { key: 'sell', label: 'Sell' },
  { key: 'premier', label: 'Redfin Premier' },
  { key: 'mortgage', label: 'Mortgage' },
  { key: 'agents', label: 'Real Estate Agents' },
  { key: 'feed', label: 'Feed' },
];

const userMenu = (
  <Menu
    items={[
      { key: 'profile', label: 'Profile' },
      { key: 'logout', label: 'Logout' },
    ]}
  />
);

const AppHeader: React.FC = () => {
  return (
    <Header
      style={{
        display: 'flex',
        alignItems: 'center',
        background: 'white',
        padding: '0 20px',
        boxShadow: '0 2px 8px #f0f1f2',
      }}
    >
      <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#e63946', flexShrink: 0 }}>
        CRANE
      </div>
      <Input
        placeholder="City, Address, School, Agent, ZIP"
        style={{ width: 300, marginLeft: 20 }}
        prefix={<SearchOutlined />}
      />
      <Menu mode="horizontal" style={{ flex: 1, justifyContent: 'center', borderBottom: 'none' }}>
        <Menu.Item key="buy">Buy</Menu.Item>
        <Menu.Item key="rent">Rent</Menu.Item>
        <Menu.Item key="sell">Sell</Menu.Item>
        <Menu.Item key="premier">Redfin Premier</Menu.Item>
        <Menu.Item key="mortgage">Mortgage</Menu.Item>
        <Menu.Item key="agents">Real Estate Agents</Menu.Item>
        <Menu.Item key="feed">Feed</Menu.Item>
      </Menu>
      <Avatar icon={<UserOutlined />} style={{ marginLeft: 'auto' }} />
      <span style={{ marginLeft: 10 }}>Cường</span>
    </Header>
  );
};

export default AppHeader;
