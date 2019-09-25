import React from 'react';
import MultiFields from 'components/MultiFields';
import withDialog from 'lib/hocs/dialog';
import flowRight from 'lodash/flowRight';
import ResidualRiskFields from 'components/RiskEvaluation/ResidualRisk';
import RiskEvaluation from 'components/RiskEvaluation';
import { getValidationResult, fieldIsRequired } from 'lib/tools';
import * as yup from 'yup';
import { impact } from './InherentRisk';

function InherentRisk(props) {
  const { formState, formHandlers, isRerate } = props;
  const { fields, errors } = formState;
  const { onElementChange } = formHandlers;
  return (
    <>
      {!isRerate && (
        <MultiFields
          id="current_treatments"
          fieldsRenderer={ResidualRiskFields}
          value={fields.current_treatments || []}
          label="Impact"
          required
          defaultItem={{
            strategy: '',
            treatment: '',
            business_unit: '',
            kpi: '',
          }}
          fieldLabels={[{ label: 'Risk Treatment Strategy' }, { label: 'Action Treatment' }, { label: 'Business Unit' }, { label: 'KPI' }]}
          onChange={onElementChange}
          errors={errors}
        />
      )}
      <RiskEvaluation
        type="residual"
        previousRating={fields.previous_details}
        onChange={onElementChange}
        basis={fields.basis}
        reason={fields.reason.residual}
        currentEvaluation={fields.current_stage_impact_details}
        prevStageEvaluation={fields.impact_details && fields.impact_details.inherent}
        likelihood={fields.residual_likelihood}
        businessUnit={fields.business_unit_id}
        impact={fields.impact_details.residual}
        onChangeReason={residual => onElementChange({ ...fields.reason, residual }, 'reason')}
        onChangeImpact={residual => onElementChange({ ...fields.impact_details, residual }, 'impact_details')}
      />
    </>
  );
}

const Dialog = flowRight(
  withDialog(),
)(InherentRisk);

Dialog.defaultProps = {
  validator,
};

function validator(data) {
  const schema = yup.object({
    current_treatments: yup.array().of(
      yup.object({
        strategy: yup.string().required(fieldIsRequired),
        treatment: yup.string().required(fieldIsRequired),
        business_unit: yup.string().required(fieldIsRequired),
        kpi: yup.string().required(fieldIsRequired),
      }),
    ),
    impact_details: yup.object({
      residual: impact,
    }),
  });
  return getValidationResult(data, schema);
}

export default Dialog;
