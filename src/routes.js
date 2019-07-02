import loadable from '@loadable/component';

const Login = loadable(() => import('pages/Login'));
const Signup = loadable(() => import('pages/Signup'));
const Home = loadable(() => import('pages/Home'));
const ForgotPassword = loadable(() => import('pages/ForgotPassword'));

export default [
  {
    key: 'app-home',
    component: Home,
    path: '/',
    exact: true,
  },
  {
    key: 'app-login',
    component: Login,
    path: '/login',
    exact: true,
  },
  {
    key: 'app-signup',
    component: Signup,
    path: '/signup',
    exact: true,
  },
  {
    key: 'app-forgotpw',
    component: ForgotPassword,
    path: '/forgot-password',
    exact: true,
  },
];
