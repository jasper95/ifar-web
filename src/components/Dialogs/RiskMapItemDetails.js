import React from 'react';
import Preview from 'components/Risk/Preview';
import RiskDetails from 'components/Risk/Details';
import Comments from 'components/Comments';
import flowRight from 'lodash/flowRight';
import withDialog from 'lib/hocs/dialog';
import Context from 'components/Risk/Context';

function RiskMapItemDetails(props) {
  const { className, risk } = props;
  return (
    <div>
      <Context.Provider value={{}}>
        <div className="riskList_risk_content_item">
          <Preview
            className={`${className}_preview`}
            risk={risk}
            readOnly
          />
          <RiskDetails
            className={`${className}_details`}
            showTableActions={false}
            risk={risk}
            readOnly
          />
        </div>
      </Context.Provider>
      <hr />
      <Comments risk={risk} />
    </div>
  );
}
const Dialog = flowRight(
  withDialog(),
)(RiskMapItemDetails);

Dialog.defaultProps = {
  dialogActionsRenderer: () => null,
};

export default Dialog;
