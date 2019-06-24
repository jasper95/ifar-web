import loadable from '@loadable/component';

const Login = loadable(() => import('pages/Login'));
const Signup = loadable(() => import('pages/Signup'));

export default [
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
];
