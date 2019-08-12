import React from 'react';
import useQuery from 'apollo/query';
import flowRight from 'lodash/flowRight';
import withDialog from 'lib/hocs/dialog';
import gql from 'graphql-tag';

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
  return (
    <div>
      {listIsLoading ? (
        <span>Loading...</span>
      ) : (
        <div>
          {notifications.length === 0 && !listIsLoading && (
            <span>No Records Found</span>
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
    user, risk, details: { action },
  } = data;
  const actionDescription = {
    tag: 'tagged you',
    comment: 'commented',
  }[action];
  const description = `${user.first_name} ${user.last_name} (${user.role}) ${actionDescription} on Risk Record: ${risk.name}`;
  return (
    <div>
      {description}
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
