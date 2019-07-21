import React from 'react';
import flowRight from 'lodash/flowRight';
import withDialog from 'lib/hocs/dialog';
import RiskItem from 'components/Risk/Item';
import Preview from 'components/Request/Preview';
import Context from 'components/Risk/Context';
import { riskListQuery } from 'components/Risk/List';
import useQuery from 'apollo/query';

function Requests(props) {
  const response = useQuery(riskListQuery, { variables: { id: '871637c4-5510-4500-8e78-984fce5001ff' } });
  const { data: { risk: requests = [] } } = response;
  return (
    <Context.Provider value={{}}>
      <div className="riskList_risk_content">
        {requests.map(e => (
          <div>
            <h2>Delete Request</h2>
            <RiskItem
              key={e.id}
              previewProps={{ request: { risk: e } }}
              detailsProps={{ risk: e }}
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
