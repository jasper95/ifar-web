import React from 'react';
import Preview from 'components/Risk/Preview';
import RiskDetails from 'components/Risk/Details';
import Comments from 'components/Comments';
import flowRight from 'lodash/flowRight';
import withDialog from 'lib/hocs/dialog';

function RiskMapItemDetails(props) {
  const { className, risk } = props;
  return (
    <div>
      <div className="riskList_risk_content_item">
        <Preview
          className={`${className}_preview`}
          risk={risk}
          readOnly
        />
        <RiskDetails
          className={`${className}_details`}
          risk={risk}
          readOnly
        />
      </div>
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
