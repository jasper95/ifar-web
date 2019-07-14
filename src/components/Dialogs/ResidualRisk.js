import React from 'react';
import MultFields from 'components/MultiFields';
import withDialog from 'lib/hocs/dialog';
import flowRight from 'lodash/flowRight';
import ResidualRiskFields from 'components/RiskEvaluation/ResidualRisk';
import RiskEvaluation from 'components/RiskEvaluation';

function InherentRisk(props) {
  const { formState, formHandlers } = props;
  const { fields } = formState;
  const { onElementChange } = formHandlers;
  return (
    <>
      <MultFields
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
      />
      <RiskEvaluation
        type="residual"
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
