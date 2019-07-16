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
          plan: '',
          treatment: '',
          business_unit: '',
          kpi: '',
          start_date: '',
          end_date: '',
        }}
        fieldLabels={[{ label: 'Risk Treatment Strategy' }, { label: 'Future Plan' }, { label: 'Budget/Resource' }, { label: 'Business Unit' }, { label: 'KPI' }, { label: 'Start Date' }, { label: 'End Date' }]}
        onChange={onElementChange}
        errors={errors}
      />
      <RiskEvaluation
        type="target"
        onChange={onElementChange}
        likelihood={fields.likelihood}
        impact={fields.impact}
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
        plan: yup.string().required(fieldIsRequired),
        treatment: yup.string().required(fieldIsRequired),
        business_unit: yup.string().required(fieldIsRequired),
        kpi: yup.string().required(fieldIsRequired),
        start_date: yup.date(fieldIsInvalid).required(fieldIsRequired),
        end_date: yup.date(fieldIsInvalid).required(fieldIsRequired),
      }),
    ),
    impact,
  });
  return getValidationResult(data, schema);
}

export default Dialog;
