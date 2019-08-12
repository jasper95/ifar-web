import React from 'react';
import SelectAutocomplete from 'components/SelectAutocomplete';
import withDialog from 'lib/hocs/dialog';
import flowRight from 'lodash/flowRight';
import { getValidationResult, fieldIsRequired, fieldIsInvalid } from 'lib/tools';
import businessUnits from 'lib/constants/riskManagement/businessUnits';
import * as yup from 'yup';

function CopyRisk(props) {
  const { formState, formHandlers } = props;
  const { fields, errors } = formState;
  const { onElementChange } = formHandlers;
  return (
    <div className="InherentRisk_form risk_forms">
      <SelectAutocomplete
        id="business_unit_id"
        required
        placeholder="-Select-"
        label="Business Unit"
        onChange={onElementChange}
        options={businessUnits.map(e => ({ value: e.id, label: e.name }))}
        value={fields.business_unit_id}
        error={errors.business_unit_id}
      />
    </div>
  );
}

const Dialog = flowRight(
  withDialog(),
)(CopyRisk);

Dialog.defaultProps = {
  validator,
};

function validator(data) {
  const schema = yup.object({
    business_unit_id: yup.string().required(fieldIsRequired),
  });
  return getValidationResult(data, schema);
}

export default Dialog;
