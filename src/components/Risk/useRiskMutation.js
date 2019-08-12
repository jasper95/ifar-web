import { useContext } from 'react';
import useMutation, { useCreateNode } from 'apollo/mutation';
import AuthContext from 'apollo/AuthContext';

export default function useRiskMutation() {
  const { data: user } = useContext(AuthContext);

  const [, onMutateRisk] = useMutation({ url: '/risk' });
  const [, onCreateRequest] = useCreateNode({ node: 'request' });

  function onMutate({ data, action, treatment_details: treatment }) {
    let message;
    let method;
    switch (action) {
      case 'EDIT':
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
    if (user.role !== 'ADMIN' && action !== 'COPY') {
      onCreateRequest({
        data: {
          type: `${action}_RISK`,
          risk_id: data.id,
          business_unit_id: data.business_unit_id,
          ...action === 'EDIT' && { risk_details: data },
          ...action === 'DONE_TREATMENT' && { treatment_details: treatment },
        },
      });
      return;
    }
    if (action === 'DONE_TREATMENT') {
      data = {
        ...data,
        current_treatments: [
          ...data.current_treatments,
          { ...treatment, rerate: true },
        ],
        future_treatments: data.future_treatments.filter(e => e.id !== treatment.id),
      };
    }
    onMutateRisk({
      data,
      method,
      message,
    });
  }
  return [{}, onMutate];
}
