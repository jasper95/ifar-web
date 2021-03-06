import React from 'react';
import { Switch, Route } from 'react-router';
import loadable from '@loadable/component';
import PageLayout from 'components/Layout/Page';
import NotFound from 'pages/NotFound';

const Login = loadable(() => import('pages/Login'));
const Home = loadable(() => import('pages/Home'));
const ForgotPassword = loadable(() => import('pages/ForgotPassword'));
const ResetPassword = loadable(() => import('pages/ResetPassword'));
const ManageRisk = loadable(() => import('pages/ManageRisk'));
const User = loadable(() => import('pages/User'));


export default [
  {
    key: 'home',
    component: Home,
    path: '/',
    exact: true,
    pageProps: {
      requireAuth: 'optional',
    },
  },
  {
    key: 'resetpw',
    component: ResetPassword,
    path: '/activate',
    exact: true,
    pageProps: {
      hasFooter: false,
      hasNavigation: false,
      requireAuth: 'optional',
    },
  },
  {
    key: 'login',
    component: Login,
    path: '/login',
    exact: true,
    pageProps: {
      hasNavigation: false,
      hasFooter: false,
      requireAuth: false,
      pageTitle: 'Login',
      pageDescription: 'Login to RAMONS',
    },
  },
  {
    key: 'forgotpw',
    component: ForgotPassword,
    path: '/forgot-password',
    exact: true,
    pageProps: {
      hasFooter: false,
      hasNavigation: false,
      requireAuth: false,
    },
  },
  {
    key: 'resetpw',
    component: ResetPassword,
    path: '/reset-password',
    exact: true,
    pageProps: {
      hasFooter: false,
      hasNavigation: false,
      requireAuth: 'optional',
    },
  },
  {
    key: 'manage-risk',
    component: ManageRisk,
    path: '/srmp',
    exact: true,
    pageProps: {
      requireAuth: true,
      pageTitle: 'Manage Risk',
    },
  },
  {
    key: 'manage-risk1',
    component: ManageRisk,
    path: '/ormp',
    exact: true,
    pageProps: {
      pageId: 'manage-risk',
      requireAuth: true,
      pageTitle: 'Manage Risk',
    },
  },
  {
    key: 'manage-risk2',
    component: ManageRisk,
    path: '/prmp',
    exact: true,
    pageProps: {
      pageId: 'manage-risk',
      requireAuth: true,
      pageTitle: 'Manage Risk',
    },
  },
  {
    key: 'manage-user',
    component: User,
    path: '/users',
    exact: true,
    pageProps: {
      requireAuth: true,
      pageTitle: 'Manage Users',
      requiredRoles: ['ADMIN'],
    },
  },
  {
    key: 'not-found',
    path: '*',
    component: () => (<NotFound />),
    exact: true,
  },
];


export function renderRoutes(routes, extraProps = {}, switchProps = {}) {
  return routes ? (
    <Switch {...switchProps}>
      {routes.map((route, i) => (
        <Route
          key={route.key || i}
          path={route.path}
          exact={route.exact}
          strict={route.strict}
          render={(props) => {
            const { pageProps = { }, key } = route;
            const {
              title, hasNavigation,
              hasFooter, requireAuth,
              pageId, pageDescription, requiredRoles,
            } = pageProps;
            return (
              <PageLayout
                key={key}
                pageId={pageId || key}
                title={title}
                hasNavigation={hasNavigation}
                hasFooter={hasFooter}
                requireAuth={requireAuth}
                pageDescription={pageDescription}
                requiredRoles={requiredRoles}
                {...props}
              >
                <route.component {...props} {...extraProps} route={route} />
              </PageLayout>
            );
          }}
        />
      ))}
    </Switch>
  ) : null;
}
