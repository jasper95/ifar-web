import React from 'react';
import { Switch, Route } from 'react-router';
import loadable from '@loadable/component';

const Login = loadable(() => import('pages/Login'));
const Signup = loadable(() => import('pages/Signup'));
const Home = loadable(() => import('pages/Home'));
const ForgotPassword = loadable(() => import('pages/ForgotPassword'));
const ManageRisk = loadable(() => import('pages/ManageRisk'));

export default [
  {
    key: 'home',
    component: Home,
    path: '/',
    exact: true,
  },
  {
    key: 'login',
    component: Login,
    path: '/login',
    exact: true,
  },
  {
    key: 'signup',
    component: Signup,
    path: '/signup',
    exact: true,
  },
  {
    key: 'forgotpw',
    component: ForgotPassword,
    path: '/forgot-password',
    exact: true,
  },
  {
    key: 'manage-risk',
    component: ManageRisk,
    path: '/risk-management',
    exact: true,
  },
  {
    key: 'not-found',
    path: '*',
    component: () => (<div>Not Found</div>),
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
          render={props => (route.render ? (
            route.render({ ...props, ...extraProps, route })
          ) : (
            <route.component {...props} {...extraProps} route={route} />
          ))
          }
        />
      ))}
    </Switch>
  ) : null;
}
