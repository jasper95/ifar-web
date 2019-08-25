import React, { useState } from 'react';
import TextField from 'react-md/lib/TextFields/TextField';
import withRouter from 'react-router-dom/withRouter';
import Link from 'react-router-dom/Link';
import FontIcon from 'react-md/lib/FontIcons/FontIcon';
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

function ResetPassword(props) {
  const { match: { path } } = props;
  const type = path.replace('/', '');
  const [requestSuccess, setRequestSuccess] = useState(false);
  const {
    linkName, pageTitle, requestUrl, successMessage,
  } = {
    'reset-password': {
      linkName: 'Reset password link',
      pageTitle: 'Activate Account',
      requestUrl: '/reset-password',
      successMessage: 'Password successfully updated',
    },
    activate: {
      linkName: 'Activation link',
      pageTitle: 'Activate Account',
      requestUrl: '/verify-account',
      successMessage: 'Account successfully verified',
    },
  }[type];
  const [verifyTokenState] = useVerifyToken({ name: linkName, type, onSuccess: onVerifySuccess });
  const [resetState, onReset] = useMutation({
    url: requestUrl,
    method: 'put',
    // message: requestMessage,
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
          {pageTitle}
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
        <>
          {requestSuccess ? (
            <div>
              <div>
                {successMessage}
              </div>
              <div>
                <Link to="/login">
                  <Button
                    iconEl={<FontIcon children="arrow_back" />}
                    children="Go Back"
                  />
                </Link>
              </div>
            </div>
          ) : (
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
                  children="Submit"
                  flat
                />
              </div>
            </form>
          )}
        </>
      )}
    </AuthLayout>
  );

  function onValid(data) {
    onReset({
      data,
    });
  }
  function onResetSuccess() {
    setRequestSuccess(true);
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

export default withRouter(ResetPassword);
