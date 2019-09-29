import React from 'react';
import flowRight from 'lodash/flowRight';
import TextField from 'react-md/lib/TextFields/TextField';
import SelectAutocomplete from 'components/SelectAutocomplete';
import withDialog from 'lib/hocs/dialog';
import businessUnits from 'lib/constants/riskManagement/businessUnits';
import * as yup from 'yup';
import { getValidationResult, fieldIsRequired, fieldIsInvalid } from 'lib/tools';
import { USER_ROLES, MANAGEMENT_ROLES } from 'pages/User';
import { useSelector } from 'react-redux';
import { subOperationQuery, projectQuery } from 'components/Risk/query';
import useQuery from 'apollo/query';

function UserDialog(props) {
  const { formState, formHandlers } = props;
  const { fields, errors } = formState;
  const { onElementChange, onChange } = formHandlers;
  const user = useSelector(state => state.auth);
  const [first] = fields.sub_operations || [];
  const subOperationResponse = useQuery(
    subOperationQuery, { ws: false, variables: { operation_id: null } },
  );
  const projectResponse = useQuery(projectQuery,
    { ws: false, variables: { sub_operation_id: first }, skip: Boolean(!first) });
  const { data: { sub_operation_project: subOperations = [] } } = subOperationResponse;
  const { data: { project_risk: projects = [] } } = projectResponse;
  const showSubOpField = fields.ormp_role
    && ['RISK_CHAMPION', 'TEAM_LEADER'].includes(fields.ormp_role);
  const showProjectField = fields.prmp_role
    && ['RISK_CHAMPION', 'TEAM_LEADER'].includes(fields.ormp_role);
  return (
    <>
      <div className="row">
        <div className="col-sm-6">
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
        </div>
        <div className="col-sm-6">
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
        </div>
        <div className="col-sm-6">
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
        </div>
        <div className="col-sm-6">
          {user.id !== fields.id && (
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
          )}
        </div>
      </div>
      {fields.role === 'USER' && fields.id !== user.id && (
        <div className="row">
          <SelectAutocomplete
            id="srmp_business_units"
            required
            placeholder="-Select-"
            label="SRMP Program"
            onChange={onElementChange}
            options={businessUnits.map(e => ({ value: e.id, label: e.name }))}
            value={fields.srmp_business_units || []}
            error={errors.srmp_business_units}
            className="col-sm-6"
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
            className="col-sm-6"
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
            className="col-sm-6"
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
            className="col-sm-6"
            error={errors.ormp_role}
          />
          <SelectAutocomplete
            id="prmp_business_units"
            required
            placeholder="-Select-"
            label="PRMP Program"
            onChange={onElementChange}
            options={businessUnits.map(e => ({ value: e.id, label: e.name }))}
            value={fields.prmp_business_units || []}
            error={errors.prmp_business_units}
            className="col-sm-6"
            isMulti
          />
          <SelectAutocomplete
            id="prmp_role"
            required
            placeholder="-Select-"
            label="PRMP Role"
            onChange={onElementChange}
            options={MANAGEMENT_ROLES}
            value={fields.prmp_role || []}
            className="col-sm-6"
            error={errors.prmp_role}
          />
          {showSubOpField && (
            <SelectAutocomplete
              id="sub_operations"
              required
              placeholder="-Select-"
              label="Operational Sub-unit"
              onChange={(val) => {
                console.log('val: ', val);
                onElementChange(val.length > 1 ? val.slice(1, 2) : val, 'sub_operations');
              }}
              options={subOperations.map(e => ({ value: e.id, label: `${e.name} (${e.operation_name})` }))}
              value={fields.sub_operations || []}
              className="col-sm-6"
              error={errors.sub_operations}
              isMulti
            />
          )}
          {showProjectField && (
            <SelectAutocomplete
              id="projects"
              required
              placeholder="-Select-"
              label="Projects"
              onChange={onElementChange}
              options={projects.map(e => ({ value: e.id, label: `${e.name} (${e.sub_operation_name})` }))}
              value={fields.projects || []}
              className="col-sm-6"
              error={errors.projects}
            />
          )}
        </div>
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
