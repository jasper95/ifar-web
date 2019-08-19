import React from 'react';
import useQuery from 'apollo/query';
import flowRight from 'lodash/flowRight';
import withDialog from 'lib/hocs/dialog';
import gql from 'graphql-tag';
import cn from 'classnames';
import { format as formatTime } from 'timeago.js';
import 'sass/components/notification/index.scss';

const notificationQuery = gql`
  query getNotifications($user_id: jsonb, $business_unit_id: uuid) {
    notification(where: {receivers: {_contains: $user_id }, business_unit_id: { _eq: $business_unit_id }}) {
      id
      details
      created_date
      user {
        id
        first_name
        last_name
        role
      }
      risk {
        id
        name
      }
    }
  }
`;
function Notifications(props) {
  const { requestNotifCountVars } = props;
  const notificationReponse = useQuery(
    notificationQuery, { ws: true, variables: requestNotifCountVars },
  );
  const {
    data: { notification: notifications = [] },
    loading: listIsLoading,
  } = notificationReponse;

  const isEmpty = notifications.length === 0 && !listIsLoading;

  return (
    <div className={cn('notification', {
      'notification-isEmpty': isEmpty,
    })}
    >
      {listIsLoading ? (
        <span className="notification_loading">
          Loading...
        </span>
      ) : (
        <div>
          {isEmpty && (
            <span className="notification_msg_empty">
              No Records Found
            </span>
          )}
          {notifications.map(e => (
            <NotificationItem key={e.id} data={e} />
          ))}
        </div>
      )}
    </div>
  );
}

function NotificationItem(props) {
  const { data } = props;

  const {
    user, risk, details: { action }, created_date: createdDate,
  } = data;

  const actionDescription = {
    tag: 'tagged you',
    comment: 'commented',
  }[action];


  return (
    <div className="notification_item">
      <div className="notification_item_avatar">
        <div className="avatar">
          <img src="https://i.pravatar.cc/300" />
        </div>
        <div className={`role role-${user.role.toLowerCase()}`}>
          {user.role}
        </div>
      </div>
      <div className="notification_item_info">
        <p className="notif">
          <span className="emphasize">
            {user.first_name}
            {' '}
            {user.last_name}
          </span>
          {actionDescription}
          {' '}
on Risk Record:
          <span className="emphasize">
            {risk.name}
          </span>
        </p>
        <div className="time">
          {formatTime(createdDate)}
        </div>
      </div>
    </div>
  );
}

const Dialog = flowRight(
  withDialog(),
)(Notifications);

Dialog.defaultProps = {
  dialogActionsRenderer: () => null,
};

export default Dialog;
