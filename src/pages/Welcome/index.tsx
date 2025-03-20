import { Layout } from 'antd';
import { Content, Footer } from 'antd/es/layout/layout';
import Banner from './banner';
import AppHeader from './header';
import Section1 from './section1';
import Section2 from './section2';
import { PageContainer } from '@ant-design/pro-components';
import { useEffect } from 'react';
import { getAllProperties } from '@/services/apis/propertyController';

const Welcome = () => {
  useEffect(() => {
    const body: any = {}

    getAllProperties(body).then(res => {
      console.log('res have not base url', res);
    })

    // getAllProperties(body, { baseURL: 'http://localhost:8888/' }).then(res => {
    //   console.log('res have base url', res);
    // })
  }, []);

  return (
    <Layout>
      <AppHeader />
      <Content>
        <Banner />
        <Section1 />
        <Section2 />
      </Content>
    </Layout>
  );
};

export default Welcome;
