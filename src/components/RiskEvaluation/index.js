import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import capitalize from 'lodash/capitalize';
import TextField from 'react-md/lib/TextFields/TextField';
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
  prmpOptions,
} from 'lib/constants/riskManagement/evaluationOptions';
import { useSelector } from 'react-redux';
import Header from './Header';

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
    reason,
    riskType,
  } = props;
  const user = useSelector(state => state.auth);
  const previousStage = {
    residual: 'inherent',
    target: 'residual',
  }[type];
  const stagePrevRating = previousRating && previousRating[type];
  const prevStageRating = previousRating && previousStage && previousRating[previousStage];
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
      </div>
      <SelectionControlGroup
        className="iField iField-selectionGrp"
        id="likelihood.basis"
        name="likelihood.basis"
        controls={basisOptions}
        value={basis}
        onChange={newVal => onChange(newVal, 'basis')}
        label={(
          <>
            <legend>Basis *</legend>
            {previousRating && (
              <em>{`Previous Basis: ${previousRating.basis}`}</em>
            )}
            {prevStageRating && (
              <em>{`${capitalize(previousStage)} Basis: ${basis}`}</em>
            )}
          </>
        )}
        type="radio"
        disabled={type !== 'inherent'}
      />
      <SelectionControlGroup
        className="iField iField-selectionGrp"
        id="likelihood.rating"
        name="likelihood.rating"
        label={(
          <>
            <legend>Rating *</legend>
            {stagePrevRating && (
              <em>{`Previous Rating: ${stagePrevRating.likelihood};`}</em>
            )}
            {prevStageRating && (
              <em>{`${capitalize(previousStage)} Rating: ${prevStageRating.likelihood}`}</em>
            )}
          </>
        )}
        controls={basis === 'Frequency' ? frequencyOptions : probabilityOptions}
        type="radio"
        onChange={newVal => onChange(Number(newVal), `${type}_likelihood`)}
        value={likelihood}
      />
      <TextField
        className="iField"
        label="Reason"
        onChange={val => onChangeReason(val, 'rating')}
        value={reason.rating}
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
            {currentEvaluation && (
              <em>{`Previous Rating: ${currentEvaluation.management_action}`}</em>
            )}
            {prevStageEvaluation && (
              <em>
                {`${capitalize(previousStage)} Rating: ${prevStageEvaluation.management_action}`}
              </em>
            )}
          </>
        )}
        controls={managementActionOptions}
        value={impact.management_action}
        onChange={newVal => onChangeImpact({ ...impact, management_action: Number(newVal) })}
        type="radio"
      />
      <TextField
        className="iField"
        label="Reason"
        onChange={val => onChangeReason(val, 'management_action')}
        value={reason.management_action}
      />
      {type === 'inherent' && user.role === 'ADMIN' && (
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
            {currentEvaluation && (
              <em>
                {`Previous Rating: ${currentEvaluation.reputation}`}
              </em>
            )}
            {prevStageEvaluation && (
              <em>
                {`${capitalize(previousStage)} Rating: ${prevStageEvaluation.reputation}`}
              </em>
            )}
          </>
        )}
        required
        controls={reputionOptions}
        value={impact.reputation}
        onChange={newVal => onChangeImpact({ ...impact, reputation: Number(newVal) })}
        type="radio"
      />
      <TextField
        className="iField"
        label="Reason"
        onChange={val => onChangeReason(val, 'reputation')}
        value={reason.reputation}
      />
      <SelectionControlGroup
        className="iField iField-selectionGrp"
        label={(
          <>
            <legend>Financial *</legend>
            {currentEvaluation && (
              <em>
                {`Previous Rating: ${currentEvaluation.financial}`}
              </em>
            )}
            {prevStageEvaluation && (
              <em>
                {`${capitalize(previousStage)} Rating: ${prevStageEvaluation.financial}`}
              </em>
            )}
          </>
        )}
        id="impact.financial"
        name="impact.financial"
        controls={riskType === 'prmp' ? prmpOptions.financial : financialOptions[businessUnit] || []}
        value={impact.financial}
        onChange={newVal => onChangeImpact({ ...impact, financial: Number(newVal) })}
        type="radio"
      />
      <TextField
        className="iField"
        label="Reason"
        onChange={val => onChangeReason(val, 'financial')}
        value={reason.financial}
      />
      <SelectionControlGroup
        className="iField iField-selectionGrp"
        label={(
          <>
            <legend>Health, Safety & Security *</legend>
            {currentEvaluation && (
              <em>
                {`Previous Rating: ${currentEvaluation.health_safety_security}`}
              </em>
            )}
            {prevStageEvaluation && (
              <em>
                {`${capitalize(previousStage)} Rating: ${prevStageEvaluation.health_safety_security}`}
              </em>
            )}
          </>
        )}
        id="impact.health_safety_security"
        name="impact.health_safety_security"
        value={impact.health_safety_security}
        controls={riskType === 'prmp' ? prmpOptions.hse : healthSafetySecurityOptions}
        onChange={newVal => onChangeImpact({ ...impact, health_safety_security: Number(newVal) })}
        type="radio"
      />
      <TextField
        className="iField"
        label="Reason"
        onChange={val => onChangeReason(val, 'health_safety_security')}
        value={reason.health_safety_security}
      />
      <SelectionControlGroup
        className="iField iField-selectionGrp"
        label={(
          <>
            <legend>Operational *</legend>
            {currentEvaluation && (
              <em>
                {`Previous Rating: ${currentEvaluation.operational}`}
              </em>
            )}
            {prevStageEvaluation && (
              <em>
                {`${capitalize(previousStage)} Rating: ${prevStageEvaluation.operational}`}
              </em>
            )}
          </>
        )}
        id="impact.operational"
        name="impact.operational"
        controls={riskType === 'prmp' ? prmpOptions.operational : operationalOptions}
        value={impact.operational}
        onChange={newVal => onChangeImpact({ ...impact, operational: Number(newVal) })}
        type="radio"
      />
      <TextField
        className="iField"
        label="Reason"
        onChange={val => onChangeReason(val, 'operational')}
        value={reason.operational}
      />
      <SelectionControlGroup
        className="iField iField-selectionGrp"
        label={(
          <>
            <legend>Legal and Compliance *</legend>
            {currentEvaluation && (
              <em>
                {`Previous Rating: ${currentEvaluation.legal_compliance}`}
              </em>
            )}
            {prevStageEvaluation && (
              <em>
                {`${capitalize(previousStage)} Rating: ${prevStageEvaluation.legal_compliance}`}
              </em>
            )}
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
      <TextField
        className="iField"
        label="Reason"
        onChange={val => onChangeReason(val, 'legal_compliance')}
        value={reason.legal_compliance}
      />
    </div>
  );

  function onChangeReason(newVal, key) {
    props.onChangeReason({
      ...reason,
      [key]: newVal,
    });
  }
}

RiskEvaluation.defaultProps = {
  onChange: () => {},
  onChangeImpact: () => {},
  impact: null,
  currentEvaluation: null,
  prevStageEvaluation: null,
  previousRating: null,
  reason: {},
};

RiskEvaluation.propTypes = {
  onChangeReason: PropTypes.func.isRequired,
  reason: PropTypes.object,
  businessUnit: PropTypes.string.isRequired,
  likelihood: PropTypes.number.isRequired,
  basis: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['inherent', 'residual', 'target']).isRequired,
  impact: PropTypes.object,
  onChange: PropTypes.func,
  onChangeImpact: PropTypes.func,
  previousRating: PropTypes.shape({
    basis: PropTypes.string,
  }),
  currentEvaluation: PropTypes.shape({
    operational: PropTypes.number,
    legal_compliance: PropTypes.number,
    health_safety_security: PropTypes.number,
    financial: PropTypes.number,
    management_action: PropTypes.number,
  }),
  prevStageEvaluation: PropTypes.shape({
    operational: PropTypes.number,
    legal_compliance: PropTypes.number,
    health_safety_security: PropTypes.number,
    financial: PropTypes.number,
    management_action: PropTypes.number,
  }),
};

export default RiskEvaluation;
