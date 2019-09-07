import React, { useState } from 'react';
import useQuery from 'apollo/query';
import Pagination from 'rc-pagination';
import flowRight from 'lodash/flowRight';
import withDialog from 'lib/hocs/dialog';
import gql from 'graphql-tag';
import cn from 'classnames';
import { format as formatTime } from 'timeago.js';
import 'sass/components/notification/index.scss';

const notificationQuery = gql`
  subscription getNotifications($user_id: jsonb, $user_business_units: [uuid!], $offset:Int , $limit: Int =10) {
    notification(
      where: {receivers: {_contains: $user_id }, business_unit_id: { _in: $user_business_units }},
      order_by: { created_date: desc },
      offset: $offset, limit: $limit
    ) {
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
  const { requestNotifCountVars, notifCount } = props;
  const [currentPage, setCurrentPage] = useState(1);
  const notificationReponse = useQuery(notificationQuery,
    { ws: true, variables: { ...requestNotifCountVars, offset: (currentPage - 1) * 10 } });
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
      <Pagination
        onChange={newPage => setCurrentPage(newPage)}
        current={currentPage}
        pageSize={10}
        total={notifCount}
        hideOnSinglePage
      />
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
          <img src="/static/img/default-avatar.png" />
        </div>
        <div className={`role role-${user.role.toLowerCase()}`}>
          {user.role}
        </div>
      </div>
      <div className="notification_item_info">
        <p className="notif">
          <span className="emphasize">
            {`${user.first_name} ${user.last_name}`}
          </span>
          {`${actionDescription} on Risk Record:`}
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
