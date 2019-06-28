import React, { useState } from 'react';
import flowRight from 'lodash/flowRight';
import TextField from 'react-md/lib/TextFields/TextField';
import withDialog from 'lib/hocs/dialog';
import { getValidationResult, validateDescription } from 'lib/tools';
import yup from 'yup';
import { EditorState, convertToRaw, convertFromRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

function AboutMe(props) {
  const { formState, formHandlers } = props;
  const { fields, errors } = formState;
  const { onElementChange, onChange } = formHandlers;
  const [editorState, setEditorState] = useState(getEditorInitialState);
  return (
    <>
      <TextField
        className="iField"
        id="name"
        label="Company Name*"
        type="name"
        margin="normal"
        variant="outlined"
        onChange={onElementChange}
        error={!!errors.name}
        errorText={errors.name}
        value={fields.name || ''}
      />
      <TextField
        className="iField"
        id="email"
        label="Email*"
        type="email"
        onChange={onElementChange}
        error={!!errors.email}
        errorText={errors.email}
        value={fields.email || ''}
      />
      <TextField
        className="iField"
        id="contact_number"
        label="Contact Number"
        onChange={onElementChange}
        error={!!errors.contact_number}
        errorText={errors.contact_number}
        value={fields.contact_number || ''}
      />
      <div className="iField iField-editor">
        <label>Description*</label>
        <Editor
          editorState={editorState}
          wrapperClassName="demo-wrapper"
          editorClassName="demo-editor"
          onEditorStateChange={(newState) => {
            setEditorState(newState);
            onChange('description', convertToRaw(newState.getCurrentContent()));
          }}
        />
        <div className="iField_errors">
          {errors.description && (
            <span className="iField_error">
              {errors.description}
            </span>
          )}
        </div>
      </div>
    </>
  );

  function getEditorInitialState() {
    return fields.description && Object.keys(fields.description).length
      ? EditorState.createWithContent(convertFromRaw(fields.description)) : EditorState.createEmpty();
  }
}

function validator(data) {
  const schema = yup.object().keys({
    name: yup.string().required().error(() => 'Firstname is required'),
    description: yup.object().keys({
      blocks: yup.array().min(1).items(
        yup.object({
          text: yup.string().required(),
        }),
      ),
    }).required().error(() => 'Description is required'),
    email: yup.string().email().required().error(() => 'Email is required'),
  });
  let { errors } = getValidationResult(data, schema);
  errors = {
    ...errors,
    ...validateDescription(data.description),
  };
  return {
    errors,
    isValid: !Object.keys(errors).length,
  };
}

const Dialog = flowRight(
  withDialog(),
)(AboutMe);

Dialog.defaultProps = {
  validator,
};
export default Dialog;
