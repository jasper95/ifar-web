import React, { useState, useRef } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import Button from 'react-md/lib/Buttons/Button';
import TextField from 'react-md/lib/TextFields/TextField';
import Link from 'react-router-dom/Link';
import cn from 'classnames';
import AuthLayout from 'components/Layout/Auth';
import useForm from 'lib/hooks/useForm';
import { getValidationResult, fieldIsRequired, fieldIsInvalid } from 'lib/tools';
import * as yup from 'yup';
import FontIcon from 'react-md/lib/FontIcons/FontIcon';
import { useNodeMutation } from 'apollo/mutation';
import 'sass/pages/login.scss';


const initialFields = {
  email: '',
};

function ForgotPassword() {
  const captchaRef = useRef(null);
  const [resetState, onReset] = useNodeMutation({
    url: '/forgot-password',
    message: 'Reset Password Link successfully sent to email',
    callback: onResetSuccess,
  });
  const [formState, formHandlers] = useForm({ initialFields, validator, onValid });
  const [captcha, setCaptcha] = useState(null);
  const [captchaErr, setCaptchaErr] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const {
    onChange,
    onValidate,
  } = formHandlers;
  const { fields, errors } = formState;
  return (
    <AuthLayout
      header={(
        <>
          <h1 className="authContainer_contentHeader_title">
              Forgot Password
          </h1>
          <p className="authContainer_contentHeader_msg">
            {showSuccess ? 'Please check your email to proceed.' : 'Please Enter the email you used to register.' }
          </p>
        </>
      )}
    >
      {!showSuccess && (
      <>
        <div>
          <Link to="/login">
            <Button
              iconEl={<FontIcon children="arrow_back" />}
              children="Go Back"
            />
          </Link>
        </div>
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
            id="email"
            label="Email"
            type="email"
            variant="outlined"
            onChange={value => onChange('email', value)}
            errorText={errors.email}
            error={!!errors.email}
            value={fields.email || ''}
          />
          <div>
            <ReCAPTCHA
              ref={captchaRef}
              size="normal"
              onChange={(value) => {
                setCaptcha(value);
                setCaptchaErr('');
              }}
              sitekey={process.env.CAPTCHA_KEY}
            />
            {captchaErr && (
            <span>{captchaErr}</span>
            )}
          </div>
          <div className="authContainer_form_action">
            <Button
              className={cn('iBttn iBttn-primary', { processing: resetState.loading })}
              onClick={onValidate}
              children="Send Reset Password Email"
              flat
            />
          </div>
        </form>
      </>
      )}
    </AuthLayout>
  );

  function onValid(data) {
    if (!captcha) {
      setCaptchaErr('Please check the captcha');
    }
    onReset({
      data,
    });
  }

  function onResetSuccess() {
    setShowSuccess(true);
  }
}

function validator(data) {
  const schema = yup.object({
    email: yup.string().email(fieldIsInvalid).required(fieldIsRequired),
  });
  return getValidationResult(data, schema);
}

export default ForgotPassword;
