import { Layout } from 'antd';
import { Content, Footer } from 'antd/es/layout/layout';
import Banner from './component/banner';
import Section1 from './component/section1';
import Section2 from './component/section2';


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
