import React from 'react';
import TextField from 'react-md/lib/TextFields/TextField';
import SelectAutocomplete from 'components/SelectAutocomplete';
import MultFields from 'components/MultiFields';
import withDialog from 'lib/hocs/dialog';
import flowRight from 'lodash/flowRight';
import RiskEvaluation from 'components/RiskEvaluation';
import { getValidationResult, fieldIsRequired, fieldIsInvalid } from 'lib/tools';
import classifications from 'lib/constants/riskManagement/classifications';
import * as yup from 'yup';

function InherentRisk(props) {
  const { formState, formHandlers } = props;
  const { fields, errors } = formState;
  console.log('fields: ', fields);
  // console.log('errors: ', errors);
  // console.log('fields: ', fields);
  const { onElementChange, onChange } = formHandlers;
  return (
    <div className="InherentRisk_form risk_forms">
      <TextField
        id="name"
        required
        label="Name"
        onChange={onElementChange}
        error={!!errors.name}
        errorText={errors.name}
        value={fields.name || ''}
        className="iField"
      />
      <TextField
        id="definition"
        rows={2}
        label="Definition"
        onChange={onElementChange}
        value={fields.definition}
        error={!!errors.definition}
        errorText={errors.definition}
        value={fields.definition || ''}
        className="iField"
      />
      <SelectAutocomplete
        id="classification_id"
        required
        placeholder="-Select-"
        label="Classification"
        onChange={onElementChange}
        options={classifications.map(e => ({ value: e.id, label: e.name }))}
        value={fields.classification_id}
        error={errors.classification_id}
        className="iField iField-rs"
      />
      <MultFields
        id="causes"
        fieldsRenderer={SingleTextField}
        value={fields.causes || []}
        label="Cause"
        required
        defaultItem={{
          name: '',
        }}
        fieldLabels={[{ label: 'Cause' }]}
        onChange={onElementChange}
        errors={errors}
        className="iFieldMultiversion"
      />
      <MultFields
        id="impacts"
        fieldsRenderer={SingleTextField}
        value={fields.impacts || []}
        label="Impact"
        required
        defaultItem={{
          name: '',
        }}
        fieldLabels={[{ label: 'Impact' }]}
        onChange={onElementChange}
        errors={errors}
      />
      <MultFields
        id="stakeholders"
        fieldsRenderer={SingleTextField}
        label="Affected Stakeholders"
        defaultItem={{
          name: '',
        }}
        required
        onChange={onElementChange}
        value={fields.stakeholders || []}
        fieldLabels={[{ label: 'Stakeholder' }]}
        errors={errors}
      />
      <RiskEvaluation
        type="inherent"
        onChange={onElementChange}
        basis={fields.basis}
        likelihood={fields.inherent_likelihood}
        impact={fields.impact_details.inherent}
        onChangeImpact={inherent => onElementChange({ ...fields.impact_details, inherent }, 'impact_details')}
      />
    </div>
  );
}

function SingleTextField(prop) {
  const {
    value, id, onChange, errors = {}, index,
  } = prop;
  return (
    <TextField
      className="iField"
      value={value.name}
      error={!!errors[`${id}[${index}].name`]}
      errorText={errors[`${id}[${index}].name`]}
      onChange={newVal => onChange({ ...value, name: newVal }, id)}
    />
  );
}

const Dialog = flowRight(
  withDialog(),
)(InherentRisk);

Dialog.defaultProps = {
  validator,
};

export const impact = yup.object({
  legal_compliance: yup.number().required(fieldIsRequired),
  operational: yup.number().required(fieldIsRequired),
  financial: yup.number().required(fieldIsRequired),
  reputation: yup.number().required(fieldIsRequired),
  health_safety_security: yup.number().required(fieldIsRequired),
  management_action: yup.number().required(fieldIsRequired),
});

export const likelihood = yup.object({
  basis: yup.string().oneOf(['Frequency', 'Probability'], fieldIsInvalid),
  rating: yup.number().required(fieldIsRequired),
});

function validator(data) {
  const schema = yup.object({
    name: yup.string().required(fieldIsRequired),
    definition: yup.string().required(fieldIsRequired),
    classification_id: yup.string().required(fieldIsRequired),
    stakeholders: yup.array().of(
      yup.object({
        name: yup.string().label('Stakeholder').required(fieldIsRequired),
      }),
    ),
    causes: yup.array().of(
      yup.object({
        name: yup.string().label('Cause').required(fieldIsRequired),
      }),
    ),
    impacts: yup.array().of(
      yup.object({
        name: yup.string().label('Impact').required(fieldIsRequired),
      }),
    ),
    impact_details: yup.object({
      inherent: impact,
    }),
  });
  return getValidationResult(data, schema);
}

export default Dialog;
