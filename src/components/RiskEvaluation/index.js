import React from 'react';
import PropTypes from 'prop-types';
import capitalize from 'lodash/capitalize';
import SelectionControlGroup from 'react-md/lib/SelectionControls/SelectionControlGroup';
import { businessUnits } from 'pages/ManageRisk/RiskList';
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

const descriptionMapping = {
  inherent: (
    <span>
      {'(Evaluate the risk '}
      <span>without</span>
      {' considering Treatments and Controls. Raw Level of the risk. Worst case scenarios.)'}
    </span>
  ),
  residual: (
    <span>
      Evaluate the risk considering only the
      {' '}
      <span>existing</span>
      {' '}
      risk treatments and controls. Net Level of Risk. Current State of exposure.
    </span>
  ),
  target: (
    <span>
      {'(Evaluate the risk considering the '}
      <span>existing and future</span>
      {' risk treatments and controls. Ideal level of risk.)'}
    </span>
  ),
};
function RiskEvaluation(props) {
  const {
    type,
    likelihood,
    impact,
    onChange,
  } = props;
  return (
    <div>
      <h2>
        {capitalize(type)}
        {' '}
        Risk Evaluation
      </h2>
      {descriptionMapping[type]}
      <SelectionControlGroup
        id="likelihood.basis"
        controls={basisOptions}
        value={likelihood.basis}
        onChange={newVal => onChange({ ...likelihood, basis: newVal }, 'likelihood')}
        label="Rate Likelihood by: Frequency or probability *"
        type="radio"
      />
      <SelectionControlGroup
        id="likelihood.rating"
        label="Likelihood *"
        controls={likelihood.basis === 'Frequency' ? frequencyOptions : probabilityOptions}
        type="radio"
        onChange={newVal => onChange({ ...likelihood, rating: newVal }, 'likelihood')}
        value={likelihood.rating}
      />
      <h2>Impact</h2>
      <SelectionControlGroup
        id="impact.management_action"
        label="Management Action *"
        controls={managementActionOptions}
        value={impact.management_action}
        onChange={newVal => onChange({ ...impact, management_action: newVal }, 'impact')}
        type="radio"
      />
      {type === 'inherent' && (
        <SelectionControlGroup
          label="Affected"
          id="impact.affected"
          controls={businessUnits.map(e => ({ label: e.name, value: e.id }))}
          value={impact.affected}
        />
      )}
      <SelectionControlGroup
        id="impact.reputation"
        label="Reputation *"
        required
        controls={reputionOptions}
        value={impact.reputation}
        onChange={newVal => onChange({ ...impact, reputation: newVal }, 'impact')}
        type="radio"
      />
      <SelectionControlGroup
        label="Financial *"
        id="impact.financial"
        controls={financialOptions}
        value={impact.financial}
        onChange={newVal => onChange({ ...impact, financial: newVal }, 'impact')}
        type="radio"
      />
      <SelectionControlGroup
        label="Health, Safety & Security *"
        id="impact.health_safety_security"
        value={impact.health_safety_security}
        controls={healthSafetySecurityOptions}
        onChange={newVal => onChange({ ...impact, health_safety_security: newVal }, 'impact')}
        type="radio"
      />
      <SelectionControlGroup
        label="Operational *"
        id="impact.operational"
        controls={operationalOptions}
        value={impact.operational}
        onChange={newVal => onChange({ ...impact, operational: newVal }, 'impact')}
        type="radio"
      />
      <SelectionControlGroup
        label="Legal and Compliance *"
        required
        id="impact.legal_compliance"
        controls={legalComplianceOptions}
        value={impact.legal_compliance}
        onChange={newVal => onChange({ ...impact, legal_compliance: newVal }, 'impact')}
        type="radio"
      />
    </div>
  );
}

RiskEvaluation.defaultProps = {
  likelihood: {
    basis: 'Frequency',
    rating: '1',
  },
  impact: {
    reputation: '1',
    financial: '1',
    legal_compliance: '1',
    operational: '1',
    health_safety_security: '1',
    management_action: '1',
    affected: '',
  },
  onChange: () => {},
};

RiskEvaluation.propTypes = {
  type: PropTypes.oneOf(['inherent', 'residual', 'target']).isRequired,
  likelihood: PropTypes.shape({
    basis: PropTypes.string,
    rating: PropTypes.string,
  }),
  impact: PropTypes.shape({
    basis: PropTypes.string,
    legal_compliance: PropTypes.string,
    operational: PropTypes.string,
    financial: PropTypes.string,
    reputation: PropTypes.string,
    health_safety_security: PropTypes.string,
    management_action: PropTypes.string,
    affected: PropTypes.string,
  }),
  onChange: PropTypes.func,
};

export default RiskEvaluation;
