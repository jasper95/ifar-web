import React, { useContext } from 'react';
import Link from 'react-router-dom/Link';
import ImageLoader from 'react-image';
import MenuButton from 'react-md/lib/Menus/MenuButton';
import FontIcon from 'react-md/lib/FontIcons/FontIcon';
import { useDispatch } from 'react-redux';
import cn from 'classnames';
import AuthContext from 'apollo/AuthContext';
import useMutation from 'apollo/mutation';

import cookie from 'js-cookie';
import withRouter from 'react-router-dom/withRouter';

import 'sass/components/nav/index.scss';

function Header(props) {
  const {
    avatarLink = '',
    match,
  } = props;
  const dispatch = useDispatch();
  const { data: user, loading: authIsLoading } = useContext(AuthContext);
  const [, onLogout] = useMutation({ url: '/logout', onSuccess: onLogoutSucess });
  const isAuthenticated = Boolean(user);
  return (
    <nav className="nav">
      <div className="nav_container">
        <Link to="/" className="nav_logo">
          <img
            src="/static/img/logo-minimal.png"
            alt=""
          />
        </Link>
        <NavItems currentPath={match.path} />
        <div className="nav_actions">

          <div className="nav_profile">
            {renderProfileNav()}
          </div>
        </div>
      </div>
    </nav>
  );

  function renderProfileNav() {
    if (authIsLoading) {
      return (<div>Loading...</div>);
    }
    if (!isAuthenticated) {
      return (
        <Link to="/login">
          <div className="iBttn iBttn-primary nav_profile_login">
            Login
          </div>
        </Link>
      );
    }
    return (
      <>
        {/* <MenuButton
          id="nav_profile_settings"
          icon
          menuItems={[
            {
              key: 1,
              primaryText: 'Item One',
            },
            {
              key: 2,
              primaryText: 'Item Two',
            },
          ]}
          className="nav_profile_settings"
          anchor={{
            x: MenuButton.HorizontalAnchors.INNER_LEFT,
            y: MenuButton.VerticalAnchors.BOTTOM,
          }}
        >
          build
        </MenuButton> */}
        <MenuButton
          id="nav_profile_avatar"
          className="nav_profile_avatar"
          menuItems={[
            {
              primaryText: 'View profile',
              leftIcon: <FontIcon>account_circle</FontIcon>,
            },
            {
              primaryText: 'Logout',
              onClick: handleClickLogout,
              leftIcon: <FontIcon>exit_to_app</FontIcon>,
            },
          ]}
          anchor={{
            x: MenuButton.HorizontalAnchors.INNER_LEFT,
            y: MenuButton.VerticalAnchors.BOTTOM,
          }}
        >
          <>
            <span className="name">
              {user.first_name}
            </span>
            <div className="avatar">
              <ImageLoader src="/static/img/default-avatar.png" />
            </div>
          </>
        </MenuButton>
      </>
    );
  }

  function handleClickLogout() {
    dispatch({
      type: 'SHOW_DIALOG',
      payload: {
        path: 'Confirm',
        props: {
          title: 'Confirm Logout',
          message: 'Do you really want to logout?',
          onValid: onLogout,
        },
      },
    });
  }

  function onLogoutSucess() {
    dispatch({ type: 'SET_STATE', payload: { token: '', dialog: null, dialogProcessing: false } });
    cookie.remove('token');
  }
}

function NavItems(props) {
  const { currentPath } = props;
  const menus = [
    {
      id: 1,
      path: '/',
      label: 'Home',
    },
    {
      id: 2,
      path: '/dashboard',
      label: 'Dashboard',
    },
    {
      id: 3,
      path: '/discussion',
      label: 'Discussion Board',
    },
    {
      id: 4,
      path: '/audit',
      label: 'Audit Observations',
    },
    {
      id: 5,
      path: '/actions',
      label: 'Manage Actions',
    },
    {
      id: 6,
      path: '/risk-management',
      label: 'Risk Management',
    },
  ];
  return (
    <div className="nav_menu">
      <ul className="nav_menu_list">
        {menus.map(e => (
          <li key={e.id} className={cn('nav_menu_list_item', { active: currentPath === e.path })}>
            <Link to={e.path}>{e.label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default withRouter(Header);
