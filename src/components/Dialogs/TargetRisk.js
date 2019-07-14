import React from 'react';
import MultFields from 'components/MultiFields';
import withDialog from 'lib/hocs/dialog';
import flowRight from 'lodash/flowRight';
import TargetRiskFields from 'components/RiskEvaluation/TargetRisk';
import RiskEvaluation from 'components/RiskEvaluation';

function InherentRisk(props) {
  const { formState, formHandlers } = props;
  const { fields } = formState;
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
  validator: () => ({ isValid: true }),
};
export default Dialog;
