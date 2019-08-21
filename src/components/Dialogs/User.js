import React from 'react';
import flowRight from 'lodash/flowRight';
import TextField from 'react-md/lib/TextFields/TextField';
import SelectAutocomplete from 'components/SelectAutocomplete';
import withDialog from 'lib/hocs/dialog';

const USER_ROLES = [
  {
    value: 'ADMINISTRATOR',
    label: 'Administrator',
  },
  {
    value: 'RISK_CHAMPION',
    label: 'Risk Champion',
  },
  {
    value: 'TEAM_LEADER',
    label: 'Team Leader',
  },
  {
    value: 'VIEW_COMMENT',
    label: 'View And Comment',
  },
];

function UserDialog(props) {
  const { formState, formHandlers } = props;
  const { fields, errors } = formState;
  const { onElementChange } = formHandlers;
  const businessUnits = [];
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
        label="First Name"
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
        id="role"
        required
        placeholder="-Select-"
        label="User Role"
        onChange={onElementChange}
        options={USER_ROLES}
        value={fields.role || []}
        error={errors.role}
        isMulti
      />
    </>
  );
}

const Dialog = flowRight(
  withDialog(),
)(UserDialog);

Dialog.defaultProps = {
  validator,
};

function validator() {

}

export default Dialog;
