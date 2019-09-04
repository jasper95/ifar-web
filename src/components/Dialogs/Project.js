import React from 'react';
import flowRight from 'lodash/flowRight';
import TextField from 'react-md/lib/TextFields/TextField';
import withDialog from 'lib/hocs/dialog';
import * as yup from 'yup';
import { getValidationResult, fieldIsRequired } from 'lib/tools';

function ProjectDialog(props) {
  const { formState, formHandlers } = props;
  const { fields, errors } = formState;
  const { onElementChange } = formHandlers;
  return (
    <>
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
    </>
  );
}

const Dialog = flowRight(
  withDialog(),
)(ProjectDialog);

Dialog.defaultProps = {
  validator,
};

function validator(data) {
  const schema = yup.object({
    name: yup.string().required(fieldIsRequired),
  });
  return getValidationResult(data, schema);
}

export default Dialog;
