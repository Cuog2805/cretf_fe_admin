import type { ProLayoutProps } from '@ant-design/pro-components';

/**
 * @name
 */
const Settings: ProLayoutProps & {
  pwa?: boolean;
  logo?: string;
} = {
  hasSiderMenu: false,
  //menuRender: false,
  navTheme: 'light',
  colorPrimary: '#ff4d4f',
  layout: 'top',
  contentWidth: 'Fluid',
  fixedHeader: true,
  fixSiderbar: true,
  colorWeak: true,
  title: 'CRANE',
  pwa: true,
  logo: undefined,
  iconfontUrl: '',
  splitMenus: true,
  draggable: true,
  token: {},
  locale: undefined,
  headerTitleRender: false,
  footerRender: false,
  // collapsed: undefined,
  // collapsedButtonRender: undefined,
};

export default Settings;
