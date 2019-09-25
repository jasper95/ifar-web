import React from 'react';
import withDialog from 'lib/hocs/dialog';
import flowRight from 'lodash/flowRight';
import { impactDrivers } from 'components/RiskMap/Categories';
// import impactDriverLegend from 'lib/constants/riskManagement/impactDriverLegend';

function RatingDetails(props) {
  const { risk, stage } = props;
  let { reason = {}, impact_details: impact = {} } = risk;
  ({ [stage]: reason = {} } = reason);
  ({ [stage]: impact = {} } = impact);
  return (
    <div>
      {impactDrivers.map(({ label, impact: key }) => (
        <div>
          <h3>{label}</h3>
          <div>
            <span>Rating:</span>
            <span>{impact[key]}</span>
          </div>
          <div>
            <span>Reason:</span>
            <span>{reason[key]}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

const Dialog = flowRight(
  withDialog(),
)(RatingDetails);

Dialog.defaultProps = {
  dialogActionsRenderer: () => null,
};

export default Dialog;
