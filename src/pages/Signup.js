import React from 'react';
import Page from 'components/Layout/Page';
import Button from 'react-md/lib/Buttons/Button';
import TextField from 'react-md/lib/TextFields/TextField';
import Link from 'react-router-dom/Link';
import useForm from 'lib/hooks/useForm';
import { useDispatch } from 'react-redux';
import useMutation from 'apollo/mutation';
import { withAuth } from 'apollo/auth';
import {
  getValidationResult, delay, fieldIsRequired, fieldIsInvalid,
} from 'lib/tools';
import * as yup from 'yup';
import cn from 'classnames';
import 'sass/pages/signup.scss';

const initialFields = {
  first_name: '',
  last_name: '',
  password: '',
  email: '',
  isShowPassword: false,
  role: 'USER',
  company_name: '',
};

function SignupPage(props) {
  const [signupState, onSignup] = useMutation({ url: '/signup' });
  const dispatch = useDispatch();
  const [formState, formHandlers] = useForm({ initialFields, validator, onValid });
  const {
    onElementChange,
    onChange,
    onValidate,
  } = formHandlers;
  const { fields, errors } = formState;
  const isEmployer = fields.role === 'ADMIN';
  return (
    <Page
      pageId="register"
      hasNavigation={false}
      hasFooter={false}
    >
      <div className="authContainer">
        <div className="authContainer_content">

          <div className="authContainer_contentHeader">
            <Link to="/" className="authContainer_contentHeader_logo">
              <img
                src="/static/img/logo.png"
                alt=""
              />
            </Link>

            <div className="iBttnFakeTab">
              <Button
                flat
                className={cn('iBttn', { active: !isEmployer })}
                children="Candidate"
                onClick={() => onChange('role', 'USER')}
              />
              <Button
                flat
                className={cn('iBttn', { active: isEmployer })}
                children="Employer"
                onClick={() => onChange('role', 'ADMIN')}
              />
            </div>

            <h1 className="authContainer_contentHeader_title">
              { isEmployer
                ? 'Employer Sign Up'
                : 'Candidate Sign Up'
              }
            </h1>

            <p className="authContainer_contentHeader_msg">
              fill in the form to sign up
            </p>
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
            { isEmployer ? (
              <TextField
                className="iField"
                id="company_name"
                label="Company Name"
                margin="normal"
                onChange={onElementChange}
                value={fields.company_name}
                error={!!errors.company_name}
                errorText={errors.company_name}
              />
            ) : (
              <div className="row iFieldRow ">
                <TextField
                  className="iField col-md-6"
                  id="first_name"
                  label="First Name"
                  margin="normal"
                  onChange={onElementChange}
                  value={fields.first_name}
                  error={!!errors.first_name}
                  errorText={errors.first_name}
                />
                <TextField
                  className="iField col-md-6"
                  id="last_name"
                  label="Last Name"
                  margin="normal"
                  onChange={onElementChange}
                  value={fields.last_name}
                  error={!!errors.last_name}
                  errorText={errors.last_name}
                />
              </div>
            )}

            <TextField
              className="iField"
              id="email"
              label="Email"
              type="email"
              margin="normal"
              variant="outlined"
              onChange={onElementChange}
              value={fields.email}
              error={!!errors.email}
              errorText={errors.email}
            />
            <TextField
              className="iField"
              id="password"
              type={fields.isShowPassword ? 'text' : 'password'}
              label="Password"
              value={fields.password}
              error={!!errors.password}
              errorText={errors.password}
              onChange={onElementChange}
            />


            <div className="authContainer_form_action">
              <Button
                className={cn('iBttn iBttn-primary', { processing: signupState.loading })}
                onClick={onValid}
                children="Signup"
                flat
              />

              <div className="row row-center">
                <p>
                  Already have an account?
                  <Link to="/login">
                    Login Now
                  </Link>
                </p>
              </div>

            </div>
          </form>
        </div>
        <div className="authContainer_bg" />
      </div>
    </Page>
  );

  async function onValid(data) {
    await onSignup({
      data,
    });
    dispatch({ type: 'SUCCESS', payload: { message: 'Account successfully registered. Please verify your email to login' } });
    await delay(3000);
    dispatch({ type: 'HIDE_NOTIFICATION' });
  }
}

export default withAuth({ requireAuth: false })(SignupPage);

function validator(data) {
  const schema = yup.object({
    role: yup.string().oneOf(['USER', 'ADMIN']).required(),
    company_name: yup
      .string()
      .when('role', { is: 'ADMIN', then: yup.string().required(fieldIsRequired) }),
    first_name: yup
      .string()
      .when('role', { is: 'USER', then: yup.string().required(fieldIsRequired) }),
    last_name: yup
      .string()
      .when('role', { is: 'USER', then: yup.string().required(fieldIsRequired) }),
    email: yup.string().email(fieldIsInvalid).required(fieldIsRequired),
    password: yup.string().required(fieldIsRequired),
  });
  return getValidationResult(data, schema);
}
