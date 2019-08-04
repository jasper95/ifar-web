import React from 'react';
import flowRight from 'lodash/flowRight';
import capitalize from 'lodash/capitalize';
import withDialog from 'lib/hocs/dialog';
import useQuery from 'apollo/query';
import gql from 'graphql-tag';

const notificationQuery = gql`
  subscription($role: String) {
    notification(where: {role: {_eq: $role}}) {
      id
      body
      created_date
    }
  }
`;
function Notifications(props) {
  // const { notifications } = props
  const notifications = [];
  return (
    <div>
      {notifications.map(e => (
        <NotificationItem key={e.id} data={e} />
      ))}
    </div>
  );
}

function NotificationItem(props) {
  const { data } = props;
  const {
    user, action, record, record_entity: recordEntity,
  } = data;
  return (
    <div>
      {`${user.first_name} ${user.last_name} (${user.role}) ${action} on ${capitalize(recordEntity)} ${record.name}`}
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
