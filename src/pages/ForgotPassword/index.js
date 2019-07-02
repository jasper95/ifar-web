import React, { useState, useRef } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import Button from 'react-md/lib/Buttons/Button';
import TextField from 'react-md/lib/TextFields/TextField';
import Link from 'react-router-dom/Link';
import useForm from 'lib/hooks/useForm';
import { getValidationResult } from 'lib/tools';
import Page from 'components/Layout/Page';
import joi from 'yup';
import FontIcon from 'react-md/lib/FontIcons/FontIcon';
import 'sass/pages/login.scss';


const initialFields = {
  email: '',
};

function ForgotPassword() {
  const captchaRef = useRef(null);
  // const { dispatch } = props;
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
    <Page
      pageId="login"
      hasNavigation={false}
      hasFooter={false}
    >

      <div className="authContainer">
        <div className="authContainer_content">
          <div className="authContainer_contentHeader">
            <Link to="/">
              <img
                src="/static/img/logo.png"
                alt=""
                className="authContainer_contentHeader_logo"
              />
            </Link>

            <h1 className="authContainer_contentHeader_title">
              Forgot Password
            </h1>

            <p className="authContainer_contentHeader_msg">
              {showSuccess ? 'Please check your email to proceed.' : 'Please Enter the email you used to register.' }
            </p>
          </div>
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
                    className="iBttn iBttn-primary"
                    onClick={onValidate}
                    children="Send Reset Password Email"
                    flat
                  />
                </div>
              </form>
            </>
          )}
        </div>
        <div className="authContainer_bg" />
      </div>
    </Page>
  );

  function onValid(data) {
    if (!captcha) {
      setCaptchaErr('Please check the captcha');
      return;
    }
    dispatch(Create({
      data,
      node: 'forgot-password',
      successMessage: 'Reset Password Link successfully sent to email',
      formType: 'default',
      callbackDelay: 2000,
      callback: () => setShowSuccess(true),
    }));
    // dispatch(Login(data))
  }
}

function validator(data) {
  const schema = joi.object().keys({
    email: joi.string().email().required().error(() => 'Invalid Email'),
  });
  return getValidationResult(data, schema);
}

export default ForgotPassword;
