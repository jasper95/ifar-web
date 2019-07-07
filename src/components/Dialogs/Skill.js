import React from 'react';
import flowRight from 'lodash/flowRight';
import Slider from 'react-rangeslider';
import 'react-rangeslider/lib/index.css';
import TextField from 'react-md/lib/TextFields/TextField';
import withDialog from 'lib/hocs/dialog';
import { getValidationResult } from 'lib/tools';
import yup from 'yup';

function SkillDialog(props) {
  const { formState, formHandlers } = props;
  const { fields, errors } = formState;
  const { onElementChange, onChange } = formHandlers;
  return (
    <>
      <TextField
        className="iField"
        id="name"
        label="Skill Heading"
        onChange={onElementChange}
        error={!!errors.name}
        errorText={errors.name}
        value={fields.name}
      />
      <Slider
        min={0}
        max={10}
        value={fields.level}
        onChange={value => onChange('level', value)}
      />
    </>
  );
}

function validator(data) {
  const schema = yup.object().keys({
    name: yup.string().required().error(() => 'Skill Heading is required'),
    level: yup.number().required().error(() => 'Level is required'),
  });
  return getValidationResult(data, schema);
}

const Dialog = flowRight(
  withDialog(),
)(SkillDialog);

Dialog.defaultProps = {
  validator,
};

export default Dialog;
