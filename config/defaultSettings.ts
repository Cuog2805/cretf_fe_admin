import type { ProLayoutProps } from '@ant-design/pro-components';

/**
 * @name
 */
const Settings: ProLayoutProps & {
  pwa?: boolean;
  logo?: string;
} = {
  navTheme: 'light',
  colorPrimary: '#1D50E7',
  layout: 'mix',
  contentWidth: 'Fluid',
  fixedHeader: false,
  fixSiderbar: true,
  colorWeak: false,
  title: 'CRANE',
  pwa: true,
  logo: undefined,
  iconfontUrl: '',
  splitMenus: true,
  draggable: true,
  token: {},
  locale: undefined,
};

export default Settings;
