import React, { useState } from 'react';
import flowRight from 'lodash/flowRight';
import withDialog from 'lib/hocs/dialog';
import RiskItem from 'components/Risk/Item';
import Preview from 'components/Request/Preview';
import useQuery from 'apollo/query';
import gql from 'graphql-tag';
import { RiskItemSkeleton } from 'components/Skeletons';
import Pagination from 'rc-pagination';
import { useSelector } from 'react-redux';

const requestQuery = gql`
  subscription getRequests($user_id: jsonb, $user_business_units: [uuid!], $offset:Int , $limit: Int =10) {
    request(where: {business_unit_id: { _in: $user_business_units }}, order_by: { created_date: desc }, offset: $offset, limit: $limit){
      id
      user {
        first_name
        last_name
      }
      user_id
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
        target_likelihood
        target_rating
        residual_likelihood
        residual_rating
        inherent_likelihood
        inherent_rating
      },
      risk_details
      treatment_details
    }
  }
`;

const titleMapping = {
  EDIT_INHERENT_RISK: 'Edit Request',
  DELETE_RISK: 'Delete Request',
  DONE_TREATMENT_RISK: 'Treatment Request',
};

function Requests(props) {
  const { requestNotifCountVars, requestCount, riskType } = props;
  const [currentPage, setCurrentPage] = useState(1);
  const requestResponse = useQuery(
    requestQuery,
    { ws: true, variables: { ...requestNotifCountVars, offset: (currentPage - 1) * 10 } },
  );
  const { data: { request: requests = [] }, loading: listIsLoading } = requestResponse;
  const user = useSelector(state => state.auth);
  return (
    <div className="riskList_risk_content">
      <Pagination
        onChange={newPage => setCurrentPage(newPage)}
        current={currentPage}
        pageSize={10}
        total={requestCount}
        hideOnSinglePage
      />
      {listIsLoading && (
        <RiskItemSkeleton
          fillPrimary="#E6EDF0"
          fillSecondary="#E0E4E6"
        />
      )}
      {requests.length === 0 && !listIsLoading && (
        <span className="riskList_risk_content_empty">No Records Found</span>
      )}
      {requests.map(e => (
        <div>
          <h2>{titleMapping[e.type]}</h2>
          <RiskItem
            key={e.id}
            previewProps={{
              riskType,
              request: e,
              risk: e.type === 'EDIT_INHERENT_RISK' ? e.risk_details : e.risk,
              readOnly: user.role === 'USER' && ['VIEW_COMMENT', 'RISK_CHAMPION'].includes(user.srmp_role),
            }}
            detailsProps={{ risk: e.type === 'EDIT_INHERENT_RISK' ? e.risk_details : e.risk, readOnly: true, isRequest: true }}
            previewRenderer={Preview}
            detailsRenderer={e.type === 'DONE_TREATMENT_RISK' ? () => null : undefined}
            className="riskList_risk_content_item"
          />
        </div>
      ))}
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
