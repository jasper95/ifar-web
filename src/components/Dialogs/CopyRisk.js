import React from 'react';
import SelectAutocomplete from 'components/SelectAutocomplete';
import withDialog from 'lib/hocs/dialog';
import flowRight from 'lodash/flowRight';
import { getValidationResult, fieldIsRequired } from 'lib/tools';
import * as yup from 'yup';

function CopyRisk(props) {
  const {
    formState, formHandlers, projects, operations, subOperations, businessUnits,
  } = props;
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
      {fields.type !== 'srmp' && (
        <>
          <SelectAutocomplete
            id="operation_id"
            required
            placeholder="-Select-"
            label="Operational Unit"
            onChange={onElementChange}
            options={operations
              .filter(e => e.business_unit_id === fields.business_unit_id)
              .map(e => ({
                value: e.id,
                label: e.name,
              }))
            }
            value={fields.operation_id}
            error={errors.operation_id}
          />
          <SelectAutocomplete
            id="sub_operation_id"
            required
            placeholder="-Select-"
            label="Sub Operational Unit"
            onChange={onElementChange}
            options={subOperations
              .filter(e => e.operation_id === fields.operation_id)
              .map(e => ({
                value: e.id,
                label: e.name,
              }))
            }
            value={fields.sub_operation_id}
            error={errors.sub_operation_id}
          />
        </>
      )}
      {fields.type === 'prmp' && (
        <SelectAutocomplete
          id="project_id"
          required
          placeholder="-Select-"
          label="Project"
          onChange={onElementChange}
          options={projects
            .filter(e => e.sub_operation_id === fields.sub_operation_id)
            .map(e => ({
              value: e.id,
              label: e.name,
            }))
          }
          value={fields.project_id}
          error={errors.project_id}
        />
      )}
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
