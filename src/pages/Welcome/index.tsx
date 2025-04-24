import { Layout } from 'antd';
import { Content, Footer } from 'antd/es/layout/layout';
import Banner from './banner';
import Section1 from './section1';
import Section2 from './section2';
import { PageContainer } from '@ant-design/pro-components';
import { useEffect } from 'react';
import { getAllProperties } from '@/services/apis/propertyController';
import {
  createCategoryShared,
  createMultiCategoryShared,
  getAllCategoryShared,
} from '@/services/apis/categorySharedController';
import { UNPAGED } from '@/core/constant';

const Welcome = () => {
  return (
    <Layout>
      <Content>
        <Banner />
        <Section1 />
        <Section2 />
      </Content>
    </Layout>
  );
};

export default Welcome;
