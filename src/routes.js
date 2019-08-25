import React from 'react';
import { Switch, Route } from 'react-router';
import loadable from '@loadable/component';
import PageLayout from 'components/Layout/Page';
import NotFound from 'pages/NotFound';

const Login = loadable(() => import('pages/Login'));
// const Verify = loadable(() => import('pages/Verify'));
// const Signup = loadable(() => import('pages/Signup'));
const Home = loadable(() => import('pages/Home'));
const ForgotPassword = loadable(() => import('pages/ForgotPassword'));
const ResetPassword = loadable(() => import('pages/ResetPassword'));
const ManageRisk = loadable(() => import('pages/ManageRisk'));
const RiskMap = loadable(() => import('pages/RiskMap'));
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
    path: '/risk-management',
    exact: true,
    pageProps: {
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
    },
  },
  {
    key: 'risk-map',
    component: RiskMap,
    path: '/risk-map',
    exact: true,
    pageProps: {
      requireAuth: true,
      pageTitle: 'Risk Map',
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
              pageId, pageDescription,
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
