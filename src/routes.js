import React from 'react';
import { Switch, Route } from 'react-router';
import loadable from '@loadable/component';

const Login = loadable(() => import('pages/Login'));
const Signup = loadable(() => import('pages/Signup'));
const Home = loadable(() => import('pages/Home'));
// const User = loadable(() => import('pages/User'));
// const Education = loadable(() => import('pages/Education'));
// const Skill = loadable(() => import('pages/Skill'));
// const Experience = loadable(() => import('pages/Experience'));
// const UserAbout = loadable(() => import('pages/UserAbout'));
// const UserApplication = loadable(() => import('pages/UserApplication'));
// const ForgotPassword = loadable(() => import('pages/ForgotPassword'));

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
  // {
  //   key: 'forgotpw',
  //   component: ForgotPassword,
  //   path: '/forgot-password',
  //   exact: true,
  // },
  // {
  //   key: 'user',
  //   component: User,
  //   path: '/users/:slug',
  //   exact: true,
  // },
  // {
  //   key: 'education',
  //   component: Education,
  //   path: '/profile/education',
  //   exact: true,
  // },
  // {
  //   key: 'experience',
  //   component: Experience,
  //   path: '/profile/experiences',
  //   exact: true,
  // },
  // {
  //   key: 'skill',
  //   component: Skill,
  //   path: '/profile/skills',
  //   exact: true,
  // },
  // {
  //   key: 'user-application',
  //   component: UserApplication,
  //   path: '/profile/applications',
  //   exact: true,
  // },
  // {
  //   key: 'user-about',
  //   component: UserAbout,
  //   path: '/profile/about-me',
  //   exact: true,
  // },
  // {
  //   key: 'not-found',
  //   path: '*',
  //   component: () => (<div>Not Found</div>),
  //   exact: true,
  // },
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
