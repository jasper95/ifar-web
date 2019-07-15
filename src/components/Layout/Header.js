import React, { useContext } from 'react';
import Link from 'react-router-dom/Link';
import Button from 'react-md/lib/Buttons/Button';
import ImageLoader from 'react-image';
import DropdownMenu from 'react-md/lib/Menus/DropdownMenu';
import FontIcon from 'react-md/lib/FontIcons/FontIcon';
import Avatar from 'react-md/lib/Avatars/Avatar';
import ListItem from 'react-md/lib/Lists/ListItem';
import Subheader from 'react-md/lib/Subheaders/Subheader';
import Divider from 'react-md/lib/Dividers/Divider';
import Badge from 'react-md/lib/Badges/Badge';
import { format as formatTime } from 'timeago.js';
import gql from 'graphql-tag';
import { useManualQuery } from 'apollo/query';
import { useDispatch } from 'react-redux';
import AuthContext from 'apollo/AuthContext';
import useMutation from 'apollo/mutation';

import cookie from 'js-cookie';
import withRouter from 'react-router-dom/withRouter';

import 'sass/components/nav/index.scss';

const NOTIFICATION_QUERY = gql`
  query userNotification($user_id: uuid){
    notification(where: {user_id: {_eq: $user_id }}) {
      body
      created_date
      id
      status
    }
  }
`;


function Header(props) {
  const {
    avatarLink = '',
  } = props;
  const dispatch = useDispatch();
  const { data: user, loading: authIsLoading } = useContext(AuthContext);
  const [, onLogout] = useMutation({ url: '/logout', onSuccess: onLogoutSucess });
  const [notifStates, notifHandlers] = useManualQuery(
    NOTIFICATION_QUERY,
    {
      variables: {
        user_id: user && user.id,
      },
    },
    { notification: [] },
  );
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
        <div className="nav_menu">
          <ul className="nav_menu_list">
            <li className="nav_menu_list_item active">
              <Link to="/">Home</Link>
            </li>
            <li className="nav_menu_list_item">
              <Link to="/">Dashboards</Link>
            </li>
            <li className="nav_menu_list_item">
              <Link to="/">Discussion board</Link>
            </li>
            <li className="nav_menu_list_item">
              <Link to="/">Audit observations</Link>
            </li>
            <li className="nav_menu_list_item">
              <Link to="/">Management Actions</Link>
            </li>
            <li className="nav_menu_list_item">
              <Link to="/">Risk Management</Link>
            </li>
          </ul>
        </div>
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
        <Link to="/login" className="iBttn iBttn-primary nav_profile_login">>
          Login
        </Link>
      );
    }
    const profileLink = user.company ? `/companies/${user.company.slug}` : `/users/${user.slug}`;
    const displayName = [
      user.first_name,
      user.last_name,
      user.company && user.company.name,
    ].filter(Boolean).join(' ');
    return (
      <>
        <div className="nav_profile_avatar">
          <ImageLoader
            key={avatarLink}
            src={[avatarLink, '/static/img/default-avatar.png']}
          />
        </div>
        <div className="nav_profile_content">
          <p
            className="name"
          >
            <Link to={profileLink}>
              {displayName}

            </Link>
          </p>
          <p
            className="logout"
            onClick={handleClickLogout}
          >
            Logout
          </p>
        </div>
        <DropdownMenu
          id="notif"
          menuItems={renderNotifications()}
          onVisibilityChange={(visible) => {
            if (visible) {
              notifHandlers.onQuery();
            }
          }}
          anchor={{
            x: DropdownMenu.HorizontalAnchors.INNER_LEFT,
            y: DropdownMenu.VerticalAnchors.BOTTOM,
          }}
        >
          <Badge
            badgeContent={Number(user.notifications_aggregate.aggregate.count)}
            invisibleOnZero
            secondary
            badgeId="notifications-2"
          >
            <Button
              icon
              children="notifications"
              className="nav_profile_notification"
            />
          </Badge>
        </DropdownMenu>
      </>
    );
  }

  function renderNotifications() {
    const { notification: notifications = [] } = notifStates.data;
    const unreadNotifications = notifications.filter(e => e.status === 'unread');
    const readNotifications = notifications.filter(e => e.status !== 'unread');
    return [
      unreadNotifications.length && <Subheader primaryText="Unread Notifications" key="new-header" />,
      ...unreadNotifications.map(itemMapper),
      readNotifications.length && unreadNotifications.length && <Divider inset key="divider" />,
      readNotifications.length && <Subheader primaryText="Read Notifications" key="old-header" />,
      ...readNotifications.map(itemMapper),
    ].filter(Boolean);
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


function itemMapper(item) {
  const { id, body: { icon, type, message }, created_date: createdDate } = item;
  return (
    <ListItem
      key={id}
      leftAvatar={(
        <Avatar
          suffix={type === 'success' ? 'green' : 'yellow'}
          icon={<FontIcon>{icon}</FontIcon>}
        />
      )}
      primaryText={message}
      secondaryText={formatTime(createdDate)}
    />
  );
}

export default withRouter(Header);
