import React from 'react';
import flowRight from 'lodash/flowRight';
import TextField from 'react-md/lib/TextFields/TextField';
import SelectAutocomplete from 'components/SelectAutocomplete';
import withDialog from 'lib/hocs/dialog';
import businessUnits from 'lib/constants/riskManagement/businessUnits';
import * as yup from 'yup';
import { getValidationResult, fieldIsRequired, fieldIsInvalid } from 'lib/tools';
import { USER_ROLES, MANAGEMENT_ROLES } from 'pages/User';

function UserDialog(props) {
  const { formState, formHandlers } = props;
  const { fields, errors } = formState;
  const { onElementChange } = formHandlers;
  return (
    <>
      <TextField
        id="first_name"
        required
        label="First Name"
        onChange={onElementChange}
        error={!!errors.first_name}
        errorText={errors.first_name}
        value={fields.first_name || ''}
        className="iField"
      />
      <TextField
        id="last_name"
        required
        label="Last Name"
        onChange={onElementChange}
        error={!!errors.last_name}
        errorText={errors.last_name}
        value={fields.last_name || ''}
        className="iField"
      />
      <TextField
        id="email"
        required
        label="Email"
        type="email"
        onChange={onElementChange}
        error={!!errors.email}
        errorText={errors.email}
        value={fields.email || ''}
        className="iField"
      />
      <SelectAutocomplete
        id="role"
        required
        placeholder="-Select-"
        label="User Role"
        onChange={onElementChange}
        options={USER_ROLES}
        value={fields.role || []}
        error={errors.role}
      />
      {fields.role === 'USER' && (
        <>
          <SelectAutocomplete
            id="srmp_business_units"
            required
            placeholder="-Select-"
            label="SRMP Program"
            onChange={onElementChange}
            options={businessUnits.map(e => ({ value: e.id, label: e.name }))}
            value={fields.srmp_business_units || []}
            error={errors.srmp_business_units}
            isMulti
          />
          <SelectAutocomplete
            id="srmp_role"
            required
            placeholder="-Select-"
            label="SRMP Role"
            onChange={onElementChange}
            options={MANAGEMENT_ROLES}
            value={fields.srmp_role || []}
            error={errors.srmp_role}
          />
          <SelectAutocomplete
            id="ormp_business_units"
            required
            placeholder="-Select-"
            label="ORMP Program"
            onChange={onElementChange}
            options={businessUnits.map(e => ({ value: e.id, label: e.name }))}
            value={fields.ormp_business_units || []}
            error={errors.ormp_business_units}
            isMulti
          />
          <SelectAutocomplete
            id="ormp_role"
            required
            placeholder="-Select-"
            label="ORMP Role"
            onChange={onElementChange}
            options={MANAGEMENT_ROLES}
            value={fields.ormp_role || []}
            error={errors.ormp_role}
          />
        </>
      )}
    </>
  );
}

const Dialog = flowRight(
  withDialog(),
)(UserDialog);

Dialog.defaultProps = {
  validator,
};

function validator(data) {
  const schema = yup.object({
    first_name: yup.string().required(fieldIsRequired),
    last_name: yup.string().required(fieldIsRequired),
    email: yup.string().email(fieldIsInvalid).required(fieldIsRequired),
    role: yup.string().required(fieldIsRequired),
    srmp_business_units: yup.array().of(yup.string()),
  });
  return getValidationResult(data, schema);
}

export default Dialog;
