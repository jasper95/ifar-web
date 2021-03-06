import React, {
  useContext,
  useState,
} from 'react';
import Link from 'react-router-dom/Link';
import ImageLoader from 'react-image';
import Button from 'react-md/lib/Buttons/Button';
import MenuButton from 'react-md/lib/Menus/MenuButton';
import FontIcon from 'react-md/lib/FontIcons/FontIcon';
import { useDispatch } from 'react-redux';
import AuthContext from 'apollo/AuthContext';
import useMutation, { useUpdateNode } from 'apollo/mutation';
import cookie from 'js-cookie';
import withRouter from 'react-router-dom/withRouter';
import { UserSkeleton } from 'components/Skeletons';
import Navigation from 'components/Navigation';
import ReactResizeDetector from 'react-resize-detector';
import cn from 'classnames';
import 'sass/components/nav/index.scss';

function Header(props) {
  const {
    match,
    history,
  } = props;
  const dispatch = useDispatch();
  const { data: user, loading: authIsLoading } = useContext(AuthContext);
  const [, onLogout] = useMutation({ url: '/logout', onSuccess: onLogoutSucess });
  const [, onUpdateUser] = useUpdateNode({ node: 'user', message: 'Profile successfully updated' });
  const isAuthenticated = Boolean(user);

  const [showMobileNav, onShowMobileNav] = useState(false);
  const [isMobileNav, setIsMobileNav] = useState(false);
  const handleResize = (width) => {
    setIsMobileNav(width < 1025);
    onShowMobileNav(false);
  };

  return (
    <ReactResizeDetector
      handleWidth
      handleHeight
      onResize={handleResize}
    >
      {({ width, height }) => (
        <nav className={cn('nav', { 'nav-isMobile': isMobileNav })}>
          <div className="nav_container">
            <Link to="/" className="nav_logo">
              <img
                src="/static/img/logo-minimal.png"
                alt=""
              />
            </Link>
            { isMobileNav ? (
              <>
                <Button
                  icon
                  className="nav_mobile_burger"
                  children={showMobileNav ? 'close' : 'menu'}
                  onClick={() => onShowMobileNav(!showMobileNav)}
                />
                <div className={cn('nav_mobile_container',
                  { 'nav_mobile_container-show': showMobileNav })}
                >
                  <div className="nav_actions">
                    <div className="nav_profile">
                      {renderProfileNav()}
                    </div>
                  </div>
                  {user && (
                    <Navigation user={user} currentPath={match.path} />
                  )}
                </div>
              </>
            ) : (
              <>
                {user && (
                  <Navigation user={user} currentPath={match.path} />
                )}
                <div className="nav_actions">
                  <div className="nav_profile">
                    {renderProfileNav()}
                  </div>
                </div>
              </>
            )}


          </div>
        </nav>
      )}
    </ReactResizeDetector>

  );

  function renderProfileNav() {
    if (authIsLoading) {
      return (<UserSkeleton />);
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
        <MenuButton
          id="nav_profile_avatar"
          className="nav_profile_avatar"
          menuItems={[
            {
              primaryText: 'Edit profile',
              leftIcon: <FontIcon>account_circle</FontIcon>,
              onClick: editProfile,
            },
            user.role === 'ADMIN'
            && {
              primaryText: 'Manage Users',
              leftIcon: <FontIcon>supervisor_account</FontIcon>,
              onClick: () => history.push('/users'),
            },
            {
              primaryText: 'Logout',
              onClick: handleClickLogout,
              leftIcon: <FontIcon>exit_to_app</FontIcon>,
            },
          ].filter(Boolean)}
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

  function editProfile() {
    dispatch({
      type: 'SHOW_DIALOG',
      payload: {
        path: 'User',
        props: {
          title: 'Edit Profile',
          initialFields: user,
          onValid: data => onUpdateUser({ data }),
        },
      },
    });
  }

  function onLogoutSucess() {
    cookie.remove('token');
    dispatch({ type: 'SET_STATE', payload: { token: '', dialog: null, dialogProcessing: false } });
  }
}

export default withRouter(Header);
