import React from 'react';
import flowRight from 'lodash/flowRight';
import withDialog from 'lib/hocs/dialog';
import RiskItem from 'components/Risk/Item';
import Preview from 'components/Request/Preview';
import useQuery from 'apollo/query';
import gql from 'graphql-tag';
import { useSelector } from 'react-redux';

const requestQuery = gql`
  subscription getRequests($user_id: jsonb, $user_business_units: [uuid!]) {
    request(where: {business_unit_id: { _in: $user_business_units }}, order_by: { created_date: desc }){
      id
      user {
        first_name
        last_name
      }
      type
      risk {
        causes
        business_unit_id
        classification_id
        current_treatments
        definition
        future_treatments
        id
        impacts
        name
        stakeholders
        basis
        target_rating
        residual_rating
        inherent_rating
      },
      risk_details
      treatment_details
    }
  }
`;

const titleMapping = {
  EDIT_RISK: 'Edit Request',
  DELETE_RISK: 'Delete Request',
  DONE_TREATMENT_RISK: 'Treatment Request',
};

function Requests(props) {
  const { requestNotifCountVars } = props;
  const requestResponse = useQuery(requestQuery, { ws: true, variables: requestNotifCountVars });
  const { data: { request: requests = [] }, loading: listIsLoading } = requestResponse;
  const user = useSelector(state => state.auth);
  return (
    <div>
      {listIsLoading ? (
        <span>Loading...</span>
      ) : (
        <div className="riskList_risk_content">
          {requests.length === 0 && !listIsLoading && (
            <span>No Records Found</span>
          )}
          {requests.map(e => (
            <div>
              <h2>{titleMapping[e.type]}</h2>
              <RiskItem
                key={e.id}
                previewProps={{
                  request: e,
                  risk: e.type === 'EDIT_RISK' ? e.risk_details : e.risk,
                  readOnly: user.role === 'USER' && ['VIEW_COMMENT', 'RISK_CHAMPION'].includes(user.srmp_role),
                }}
                detailsProps={{ risk: e.type === 'EDIT_RISK' ? e.risk_details : e.risk, readOnly: true }}
                previewRenderer={Preview}
                detailsRenderer={e.type === 'DONE_TREATMENT_RISK' ? () => null : undefined}
                className="riskList_risk_content_item"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const Dialog = flowRight(
  withDialog(),
)(Requests);

Dialog.defaultProps = {
  dialogActionsRenderer: () => null,
};

export default Dialog;
