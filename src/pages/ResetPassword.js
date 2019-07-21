import React from 'react';
import TextField from 'react-md/lib/TextFields/TextField';
import AuthLayout from 'components/Layout/Auth';
import Button from 'react-md/lib/Buttons/Button';
import cn from 'classnames';
import useForm from 'lib/hooks/useForm';
import * as yup from 'yup';
import useVerifyToken from 'lib/hooks/useVerifyToken';
import useMutation from 'apollo/mutation';
import { getValidationResult, fieldIsRequired } from 'lib/tools';
import 'sass/pages/login.scss';


const initialFields = {
  email: '',
};

function ResetPassword() {
  const [verifyTokenState] = useVerifyToken({ name: 'Reset password link', type: 'reset-password', onSuccess: onVerifySuccess });
  const [resetState, onReset] = useMutation({
    url: '/reset-password',
    method: 'put',
    message: 'Password successfully updated',
    onSuccess: onResetSuccess,
  });
  const [formState, formHandlers] = useForm({ initialFields, validator, onValid });
  const {
    onChange,
    onValidate,
    onElementChange,
  } = formHandlers;
  const { fields, errors } = formState;
  return (
    <AuthLayout
      header={(
        <h1 className="authContainer_contentHeader_title">
          Reset Password
        </h1>
      )}
    >
      {(verifyTokenState === 'pending') && (
        <div>
          Loading ...
        </div>
      )}
      {verifyTokenState === 'invalid' && (
        <div>
          Something went wrong
        </div>
      )}
      {verifyTokenState === 'valid' && (
        <form
          className="authContainer_form"
          noValidate
          autoComplete="off"
          onSubmit={(e) => {
            e.preventDefault();
            onValidate();
          }}
        >
          <input type="Submit" hidden />
          <TextField
            className="iField"
            id="password"
            type="password"
            label="Password"
            value={fields.password || ''}
            error={!!errors.password}
            errorText={errors.password}
            onChange={onElementChange}
          />
          <div className="authContainer_form_action">
            <Button
              className={cn('iBttn iBttn-primary', { processing: resetState.loading })}
              onClick={onValidate}
              children="Reset Password"
              flat
            />
          </div>
        </form>
      )}
    </AuthLayout>
  );

  function onValid(data) {
    onReset({
      data,
    });
  }
  function onResetSuccess() {

  }
  function onVerifySuccess(token) {
    onChange('token', token);
  }
}

function validator(data) {
  const schema = yup.object({
    password: yup.string().required(fieldIsRequired),
  });
  return getValidationResult(data, schema);
}

export default ResetPassword;
