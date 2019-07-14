import React from 'react';
import TextField from 'react-md/lib/TextFields/TextField';
import SelectAutocomplete from 'components/SelectAutocomplete';
import MultFields from 'components/MultiFields';
import withDialog from 'lib/hocs/dialog';
import flowRight from 'lodash/flowRight';
import ResidualRiskFields from 'components/RiskEvaluation/ResidualRisk';
import RiskEvaluation from 'components/RiskEvaluation';

const options = [
  'Strategic',
  'Operational',
  'Financial',
  'Legal or Compliance',
];
function InherentRisk(props) {
  const { formState, formHandlers } = props;
  const { fields, errors } = formState;
  console.log('fields: ', fields);
  const { onElementChange, onChange } = formHandlers;
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
      <RiskEvaluation type="residual" />
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
