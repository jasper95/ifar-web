import useMutation, { useCreateNode } from 'apollo/mutation';
import { useSelector } from 'react-redux';

export default function useRiskMutation(riskType) {
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
    const isNotRestrictedAction = ['COPY', 'EDIT_RESIDUAL', 'EDIT_TARGET'].includes(action);
    const isTL = user[`${riskType}_role`] === 'TEAM_LEADER';
    if ((user.role === 'ADMIN' || isNotRestrictedAction) || (isTL && action !== 'DELETE')) {
      onMutateRisk({
        data,
        method,
        message,
      });
      return;
    }
    onCreateRequest({
      data: {
        type: `${action}_RISK`,
        risk_id: data.id,
        business_unit_id: data.business_unit_id,
        risk_details: data,
        ...action === 'DONE_TREATMENT' && { treatment_details: treatment },
      },
    });
  }
  return [{}, onMutate];
}
