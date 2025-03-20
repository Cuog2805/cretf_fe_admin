import { Layout } from 'antd';
import { Content, Footer } from 'antd/es/layout/layout';
import { PageContainer } from '@ant-design/pro-components';
import LayoutHeader from './header';
import { useEffect } from 'react';
import { getAllProperties } from '@/services/apis/propertyController';

const UserLayout = () => {
  return (
    <Layout>
        <LayoutHeader></LayoutHeader>
        <Content></Content>
    </Layout>
  );
};

export default UserLayout;
