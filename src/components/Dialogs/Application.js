import React from 'react';
import flowRight from 'lodash/flowRight';
import TextField from 'react-md/lib/TextFields/TextField';
import withDialog from 'lib/hocs/dialog';
import { getValidationResult } from 'lib/tools';
import joi from 'joi';
import { DialogActions as ConfirmActions } from './Confirm';

function ApplicationDialog(props) {
  const { formState, formHandlers } = props;
  const { fields, errors } = formState;
  const { onElementChange } = formHandlers;
  return (
    <TextField
      className="iField"
      id="pitch"
      label="Pitch"
      onChange={onElementChange}
      error={!!errors.pitch}
      errorText={errors.pitch}
      value={fields.pitch}
    />
  );
}

function validator(data) {
  const schema = joi.object().keys({
    pitch: joi.string().required().error(() => 'Pitch is required'),
  });
  return getValidationResult(data, schema);
}

const Dialog = flowRight(
  withDialog(),
)(ApplicationDialog);

Dialog.defaultProps = {
  validator,
  dialogActionsRenderer: ConfirmActions,
};

export default Dialog;
