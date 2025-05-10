/**
 * @name umi 的路由配置
 * @description 只支持 path,component,routes,redirect,wrappers,name,icon 的配置
 * @param path  path 只支持两种占位符配置，第一种是动态参数 :id 的形式，第二种是 * 通配符，通配符只能出现路由字符串的最后。
 * @param component 配置 location 和 path 匹配后用于渲染的 React 组件路径。可以是绝对路径，也可以是相对路径，如果是相对路径，会从 src/pages 开始找起。
 * @param routes 配置子路由，通常在需要为多个路径增加 layout 组件时使用。
 * @param redirect 配置路由跳转
 * @param wrappers 配置路由组件的包装组件，通过包装组件可以为当前的路由组件组合进更多的功能。 比如，可以用于路由级别的权限校验
 * @param name 配置路由的标题，默认读取国际化文件 menu.ts 中 menu.xxxx 的值，如配置 name 为 login，则读取 menu.ts 中 menu.login 的取值作为标题
 * @param icon 配置路由的图标，取值参考 https://ant.design/components/icon-cn， 注意去除风格后缀和大小写，如想要配置图标为 <StepBackwardOutlined /> 则取值应为 stepBackward 或 StepBackward，如想要配置图标为 <UserOutlined /> 则取值应为 user 或者 User
 * @doc https://umijs.org/docs/guides/routes
 */
export default [
  {
    path: '/auth',
    layout: false,
    routes: [
        {
          name: 'login',
          path: '/auth/login',
          component: './User/Login',
        },
        {
          name: 'register',
          path: '/auth/register',
          component: './User/Register',
        },
    ],
  },
  {
    path: '/',
    layout: true,
    //component: './layouts',
    routes: [
      {
        path: '/',
        redirect: '/welcome',
      },
      {
        name: 'welcome',
        path: '/welcome',
        component: './Welcome',
      },
      {
        name: 'landing-page',
        path: '/landing-page',
        component: './LandingPage',
      },
      {
        path: '/buy',
        redirect: '/buy/houses-for-sale',
      },
      {
        name: 'Mua nhà',
        path: '/buy/houses-for-sale',
        component: './BuyPage',
      },
      {
        name: 'Mua căn hộ',
        path: '/buy/condos-for-sale',
        component: './BuyPage',
      },
      {
        name: 'Mua đất nền',
        path: '/buy/land-for-sale',
        component: './BuyPage',
      },
      {
        name: 'Thuê nhà',
        path: '/rent/houses-for-rent',
        component: './BuyPage',
      },
      {
        name: 'Thuê căn hộ',
        path: '/rent/condos-for-rent',
        component: './BuyPage',
      },
      {
        name: 'Xem chi tiết',
        path: '/buy/houses-for-sale/detail/:propertyId',
        component: './BuyPage/Detail',
      },
      {
        name: 'Thêm mới',
        path: '/buy/houses-for-sale/create',
        component: './BuyPage/Create',
      },
      {
        name: 'rent',
        path: '/rent',
        component: './LandingPage',
      },
      {
        name: 'Cuộc hẹn',
        path: '/appointment',
        component: './Appointment',
      },
      {
        name: 'Đặt cọc',
        path: '/deposit/:propertyId',
        component: './Deposit',
      },
      {
        name: 'Hồ sơ',
        path: '/account/profile/detail',
        component: './User/Profile/Detail',
      },
      {
        name: 'Chỉnh sửa hồ sơ',
        path: '/account/profile/edit',
        component: './User/Profile/Edit',
      },
      {
        name: 'Đổi mật khẩu',
        path: '/account/profile/password',
        component: './User/Profile/Password',
      },
      {
        name: 'Bất động sản của tôi',
        path: '/account/my-property',
        component: './MyProperty',
      },
      {
        name: 'Thêm mới bất động sản',
        path: '/account/my-property/create',
        component: './MyProperty/Create',
      },
      {
        name: 'Chỉnh sửa bất động sản',
        path: '/account/my-property/edit/:propertyId',
        component: './MyProperty/Create',
      },
      {
        name: 'Cọc',
        path: '/account/profile/deposit',
        component: './User/Profile/Deposit',
      },
    ],
  },

  // {
  //   path: '/admin',
  //   name: 'admin',
  //   icon: 'crown',
  //   access: 'canAdmin',
  //   routes: [
  //     {
  //       path: '/admin',
  //       redirect: '/admin/sub-page',
  //     },
  //     {
  //       path: '/admin/sub-page',
  //       name: 'sub-page',
  //       component: './Admin',
  //     },
  //   ],
  // },
  // {
  //   name: 'list.table-list',
  //   icon: 'table',
  //   path: '/list',
  //   component: './TableList',
  // },
  // {
  //   path: '/',
  //   redirect: '/welcome',
  // },
  {
    path: '*',
    layout: false,
    component: './404',
  },
];
