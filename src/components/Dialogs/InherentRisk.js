import React from 'react';
import TextField from 'react-md/lib/TextFields/TextField';
import SelectAutocomplete from 'components/SelectAutocomplete';
import MultFields from 'components/MultiFields';
import withDialog from 'lib/hocs/dialog';
import flowRight from 'lodash/flowRight';
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
      <TextField
        id="name"
        required
        label="Name"
        onChange={onElementChange}
        // error={!!errors.name}
        // errorText={errors.name}
        value={fields.name || ''}
      />
      <TextField
        id="definition"
        rows={2}
        label="Definition"
        onChange={onElementChange}
        value={fields.definition}
      />
      <SelectAutocomplete
        id="classification"
        required
        placeholder="-Select-"
        label="Classification"
        onChange={onElementChange}
        options={options}
        value={fields.classification}
      />
      <MultFields
        id="impacts"
        fieldsRenderer={TextField}
        value={fields.impacts || []}
        label="Impact"
        required
        defaultItem={{
          name: '',
        }}
        fieldLabels={[{ label: 'Impact' }]}
        onChange={onElementChange}
      />
      <MultFields
        id="stakeholders"
        fieldsRenderer={TextField}
        value={[]}
        label="Affected Stakeholders"
        defaultItem={{
          name: '',
        }}
        required
        onChange={onElementChange}
        value={fields.stakeholders || []}
        fieldLabels={[{ label: 'Stakeholder' }]}
      />
      <RiskEvaluation type="inherint" />
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
