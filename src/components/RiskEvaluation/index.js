import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import capitalize from 'lodash/capitalize';
import SelectionControlGroup from 'react-md/lib/SelectionControls/SelectionControlGroup';
import businessUnits from 'lib/constants/riskManagement/businessUnits';
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

import 'sass/components/riskEvaluation/index.scss';

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

const defaultImpact = {
  reputation: 1,
  financial: 1,
  legal_compliance: 1,
  operational: 1,
  health_safety_security: 1,
  management_action: 1,
};

const Header = props => (
  <div className="riskEvaluation_header">
    { props.title && (
    <h2 className="riskEvaluation_header_title">
      {props.title}
    </h2>
    )}
    { props.desc && (
    <p className="riskEvaluation_header_desc">
      {props.desc}
    </p>
    )}
  </div>
);

function RiskEvaluation(props) {
  const {
    type,
    impact,
    onChange,
    onChangeImpact,
    basis,
    likelihood,
    businessUnit,
    previousRating,
    currentEvaluation,
    prevStageEvaluation,
  } = props;
  console.log('currentEvaluation: ', currentEvaluation);
  const previousStage = {
    residual: 'inherent',
    target: 'residual',
  }[type];
  const stagePrevRating = previousRating && previousRating[type];
  console.log('stagePrevRating: ', stagePrevRating);
  const prevStageRating = previousRating && previousStage && previousRating[previousStage];
  console.log('prevStageRating: ', prevStageRating);
  useEffect(() => {
    if (!impact) {
      onChangeImpact(defaultImpact);
    }
  }, []);
  if (!impact) {
    return null;
  }
  return (
    <div className="riskEvaluation">
      <Header
        title={(
          <>
            <span className="type">{capitalize(type)}</span>
            <span className="title"> Risk Evaluation</span>
          </>
        )}
        desc={descriptionMapping[type]}
      />
      <div className="riskEvaluation_header">
        <h3 className="riskEvaluation_header_title">Likelihood</h3>
        {previousRating && (
          <em>
            {`Previous Basis: ${previousRating.basis}; `}
            {stagePrevRating && `Rating: ${stagePrevRating.likelihood}; `}
            {prevStageRating && `${capitalize(previousStage)} Basis: ${basis}; Rating: ${prevStageRating.likelihood}; `}
          </em>
        )}
      </div>
      <SelectionControlGroup
        className="iField iField-selectionGrp"
        id="likelihood.basis"
        name="likelihood.basis"
        controls={basisOptions}
        value={basis}
        onChange={newVal => onChange(newVal, 'basis')}
        label="Basis *"
        type="radio"
        disabled={type !== 'inherent'}
      />
      <SelectionControlGroup
        className="iField iField-selectionGrp"
        id="likelihood.rating"
        name="likelihood.rating"
        label="Rating *"
        controls={basis === 'Frequency' ? frequencyOptions : probabilityOptions}
        type="radio"
        onChange={newVal => onChange(Number(newVal), `${type}_likelihood`)}
        value={likelihood}
      />
      <Header
        title="Impact"
      />
      <SelectionControlGroup
        className="iField iField-selectionGrp"
        id="impact.management_action"
        name="impact.management_action"
        label={(
          <>
            <legend>Management Action *</legend>
            <em>
              {currentEvaluation && `Previous Rating: ${currentEvaluation.management_action}; `}
              {prevStageEvaluation && `${capitalize(previousStage)} Rating: ${prevStageEvaluation.management_action}`}
            </em>
          </>
        )}
        controls={managementActionOptions}
        value={impact.management_action}
        onChange={newVal => onChangeImpact({ ...impact, management_action: Number(newVal) })}
        type="radio"
      />
      {type === 'inherent' && (
        <SelectionControlGroup
          className="iField iField-selectionGrp"
          label="Affected"
          id="impact.affected"
          name="impact.affected"
          controls={businessUnits.map(e => ({ label: e.name, value: e.id }))}
          value={businessUnit}
          type="radio"
          disabled
        />
      )}
      <SelectionControlGroup
        className="iField iField-selectionGrp"
        id="impact.reputation"
        name="impact.reputation"
        label={(
          <>
            <legend>Reputation *</legend>
            <em>
              {currentEvaluation && `Previous Rating: ${currentEvaluation.reputation}; `}
              {prevStageEvaluation && `${capitalize(previousStage)} Rating: ${prevStageEvaluation.reputation}`}
            </em>
          </>
        )}
        required
        controls={reputionOptions}
        value={impact.reputation}
        onChange={newVal => onChangeImpact({ ...impact, reputation: Number(newVal) })}
        type="radio"
      />
      <SelectionControlGroup
        className="iField iField-selectionGrp"
        label={(
          <>
            <legend>Financial *</legend>
            <em>
              {currentEvaluation && `Previous Rating: ${currentEvaluation.financial}; `}
              {prevStageEvaluation && `${capitalize(previousStage)} Rating: ${prevStageEvaluation.financial}`}
            </em>
          </>
        )}
        id="impact.financial"
        name="impact.financial"
        controls={financialOptions[businessUnit] || []}
        value={impact.financial}
        onChange={newVal => onChangeImpact({ ...impact, financial: Number(newVal) })}
        type="radio"
      />
      <SelectionControlGroup
        className="iField iField-selectionGrp"
        label={(
          <>
            <legend>Health, Safety & Security *</legend>
            <em>
              {currentEvaluation && `Previous Rating: ${currentEvaluation.health_safety_security}; `}
              {prevStageEvaluation && `${capitalize(previousStage)} Rating: ${prevStageEvaluation.health_safety_security}`}
            </em>
          </>
        )}
        id="impact.health_safety_security"
        name="impact.health_safety_security"
        value={impact.health_safety_security}
        controls={healthSafetySecurityOptions}
        onChange={newVal => onChangeImpact({ ...impact, health_safety_security: Number(newVal) })}
        type="radio"
      />
      <SelectionControlGroup
        className="iField iField-selectionGrp"
        label={(
          <>
            <legend>Operational *</legend>
            <em>
              {currentEvaluation && `Previous Rating: ${currentEvaluation.operational}; `}
              {prevStageEvaluation && `${capitalize(previousStage)} Rating: ${prevStageEvaluation.operational}`}
            </em>
          </>
        )}
        id="impact.operational"
        name="impact.operational"
        controls={operationalOptions}
        value={impact.operational}
        onChange={newVal => onChangeImpact({ ...impact, operational: Number(newVal) })}
        type="radio"
      />
      <SelectionControlGroup
        className="iField iField-selectionGrp"
        label={(
          <>
            <legend>Legal and Compliance *</legend>
            <em>
              {currentEvaluation && `Previous Rating: ${currentEvaluation.legal_compliance}; `}
              {prevStageEvaluation && `${capitalize(previousStage)} Rating: ${prevStageEvaluation.legal_compliance}`}
            </em>
          </>
        )}
        required
        id="impact.legal_compliance"
        name="impact.legal_compliance"
        controls={legalComplianceOptions}
        value={impact.legal_compliance}
        onChange={newVal => onChangeImpact({ ...impact, legal_compliance: Number(newVal) })}
        type="radio"
      />
    </div>
  );
}

RiskEvaluation.defaultProps = {
  onChange: () => {},
  impact: null,
};

RiskEvaluation.propTypes = {
  type: PropTypes.oneOf(['inherent', 'residual', 'target']).isRequired,
  impact: PropTypes.object,
  onChange: PropTypes.func,
};

export default RiskEvaluation;
