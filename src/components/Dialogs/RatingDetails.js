import React from 'react';
import withDialog from 'lib/hocs/dialog';
import flowRight from 'lodash/flowRight';
import { impactDrivers } from 'components/RiskMap/Categories';
import {
  basisOptions,
  reputionOptions,
  frequencyOptions,
  probabilityOptions,
  managementActionOptions,
  financialOptions,
  operationalOptions,
  legalComplianceOptions,
  healthSafetySecurityOptions,
} from 'lib/constants/riskManagement/evaluationOptions';

function RatingDetails(props) {
  const { risk, stage } = props;
  let { reason = {}, impact_details: impact = {} } = risk;
  ({ [stage]: reason = {} } = reason);
  ({ [stage]: impact = {} } = impact);
  return (
    <div className="RatingDetails">
      {impactDrivers.map(({ label, impact: key }) => (
        <div className="RatingDetails_item">
          <h3 className="RatingDetails_item_header">{label}</h3>
          <div className="row">
            <div className="col col-md-2 RatingDetails_item_rating">
              <span className="label">Rating</span>
              <span className="value">{ impact[key] ? impact[key] : '0' }</span>
            </div>
            <div className="col col-md-10 RatingDetails_item_reason">
              <div className="row">
                <span className="label">Reason:</span>
                <span className="value">Test</span>
              </div>
              <div className="row">
                <span className="label">Description:</span>
                <span className="value">{getDescription(key, impact[key])}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  function getDescription(key, rating) {
    const arr = {
      financial: financialOptions[risk.business_unit_id],
      operational: operationalOptions,
      legal_compliance: legalComplianceOptions,
      management_action: managementActionOptions,
      health_safety_security: healthSafetySecurityOptions,
    }[key] || [];
    const item = arr.find(e => e.value === rating);
    return item ? item.label : '';
    // return arr[]
  }
}

const Dialog = flowRight(
  withDialog(),
)(RatingDetails);

Dialog.defaultProps = {
  dialogActionsRenderer: () => null,
};

export default Dialog;
