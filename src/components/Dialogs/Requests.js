import React from 'react';
import flowRight from 'lodash/flowRight';
import withDialog from 'lib/hocs/dialog';
import { riskDetailsFragment } from 'pages/ManageRisk';
import RiskItem from 'components/Risk/Item';
import Preview from 'components/Request/Preview';
import Context from 'components/Risk/Context';
import useQuery from 'apollo/query';
import gql from 'graphql-tag';

const requestQuery = gql`
  query {
    request {
      id
      user {
        first_name
        last_name
      }
      type
      risk {
        ...RiskDetails
      }
    }
  }
  ${riskDetailsFragment}
`;

const titleMapping = {
  EDIT_RISK: 'Edit Request',
  DELETE_RISK: 'Delete Request',
  DONE_TREATMENT: 'Treatment Request',
};

function Requests() {
  const requestResponse = useQuery(requestQuery);
  console.log('requestResponse: ', requestResponse);
  const { data: { request: requests = [] } } = requestResponse;
  return (
    <Context.Provider value={{}}>
      <div className="riskList_risk_content">
        {requests.map(e => (
          <div>
            <h2>{titleMapping[e.type]}</h2>
            <RiskItem
              key={e.id}
              previewProps={{ request: e }}
              detailsProps={{ risk: e.risk, showTableActions: false }}
              previewRenderer={Preview}
              className="riskList_risk_content_item"
            />
          </div>
        ))}
      </div>
    </Context.Provider>
  );
}

const Dialog = flowRight(
  withDialog(),
)(Requests);

Dialog.defaultProps = {
  dialogActionsRenderer: () => null,
};

export default Dialog;
