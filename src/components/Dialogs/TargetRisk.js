import React from 'react';
import MultFields from 'components/MultiFields';
import withDialog from 'lib/hocs/dialog';
import flowRight from 'lodash/flowRight';
import TargetRiskFields from 'components/RiskEvaluation/TargetRisk';
import RiskEvaluation from 'components/RiskEvaluation';
import { getValidationResult, fieldIsRequired, fieldIsInvalid } from 'lib/tools';
import * as yup from 'yup';
import { impact } from './InherentRisk';

function InherentRisk(props) {
  const { formState, formHandlers } = props;
  const { fields, errors } = formState;
  const { onElementChange } = formHandlers;
  return (
    <>
      <MultFields
        id="future_treatments"
        fieldsRenderer={TargetRiskFields}
        value={fields.future_treatments || []}
        label="Impact"
        required
        defaultItem={{
          treatment: '',
          strategy: '',
          business_unit: '',
          kpi: '',
          start_date: '',
          end_date: '',
        }}
        fieldLabels={[{ label: 'Risk Treatment Strategy' }, { label: 'Future treatment' }, { label: 'Budget/Resource' }, { label: 'Business Unit' }, { label: 'KPI' }, { label: 'Start Date' }, { label: 'End Date' }]}
        onChange={onElementChange}
        errors={errors}
      />
      <RiskEvaluation
        type="target"
        onChange={onElementChange}
        reason={fields.reason.target}
        currentEvaluation={fields.current_stage_impact_details}
        prevStageEvaluation={fields.impact_details && fields.impact_details.inherent}
        previousRating={fields.previous_details}
        businessUnit={fields.business_unit_id}
        basis={fields.basis}
        likelihood={fields.target_likelihood}
        impact={fields.impact_details.target}
        onChangeReason={target => onElementChange({ ...fields.reason, target }, 'reason')}
        onChangeImpact={target => onElementChange({ ...fields.impact_details, target }, 'impact_details')}
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
    future_treatments: yup.array().of(
      yup.object({
        treatment: yup.string().required(fieldIsRequired),
        strategy: yup.string().required(fieldIsRequired),
        budget: yup.string().required(fieldIsRequired),
        business_unit: yup.string().required(fieldIsRequired),
        kpi: yup.string().required(fieldIsRequired),
        start_date: yup.date(fieldIsInvalid).required(fieldIsRequired),
        end_date: yup.date(fieldIsInvalid).required(fieldIsRequired),
      }),
    ),
    impact_details: yup.object({
      target: impact,
    }),
  });
  return getValidationResult(data, schema);
}

export default Dialog;
