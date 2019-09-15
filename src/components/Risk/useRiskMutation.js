import useMutation, { useCreateNode } from 'apollo/mutation';
import { useSelector } from 'react-redux';

export default function useRiskMutation() {
  const user = useSelector(state => state.auth);

  const [, onMutateRisk] = useMutation({ url: '/risk' });
  const [, onCreateRequest] = useCreateNode({ node: 'request' });

  function onMutate({ data, action, treatment_details: treatment }) {
    let message;
    let method;
    switch (action) {
      case 'EDIT_RESIDUAL':
      case 'EDIT_TARGET':
      case 'EDIT_INHERENT':
      case 'DONE_TREATMENT':
        message = 'Risk successfully updated';
        method = 'PUT';
        break;
      case 'DELETE':
        message = 'Risk successfully deleted';
        method = 'DELETE';
        break;
      case 'COPY':
        message = 'Risk successfully created';
        method = 'POST';
        break;
      default:
    }
    if (user.role !== 'ADMIN' && !['COPY', 'EDIT_RESIDUAL', 'EDIT_TARGET'].includes(action)) {
      onCreateRequest({
        data: {
          type: `${action}_RISK`,
          risk_id: data.id,
          business_unit_id: data.business_unit_id,
          ...action.includes('EDIT') && { risk_details: data },
          ...action === 'DONE_TREATMENT' && { treatment_details: treatment },
        },
      });
      return;
    }
    onMutateRisk({
      data,
      method,
      message,
    });
  }
  return [{}, onMutate];
}

export function userIsAdmin(user, type = 'srmp') {
  return user.role === 'ADMIN' || user[`${type}_role`] === 'TEAM_LEADER';
}
