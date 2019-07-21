import React from 'react';
import Button from 'react-md/lib/Buttons/Button';
import TextField from 'react-md/lib/TextFields/TextField';
import Link from 'react-router-dom/Link';
import useForm from 'lib/hooks/useForm';
import useMutation from 'apollo/mutation';
import {
  getValidationResult, fieldIsRequired, fieldIsInvalid,
} from 'lib/tools';
import * as yup from 'yup';
import cn from 'classnames';
import AuthLayout from 'components/Layout/Auth';
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

function SignupPage() {
  const [signupState, onSignup] = useMutation({
    url: '/signup',
    onSuccess,
    message: 'Account successfully registered. Please verify your email to login',
  });
  const [formState, formHandlers] = useForm({ initialFields, validator, onValid });
  const {
    onElementChange,
    onValidate,
  } = formHandlers;
  const { fields, errors } = formState;
  return (
    <AuthLayout
      header={(
        <>
          <h1 className="authContainer_contentHeader_title">
            Register an account
          </h1>
          <p className="authContainer_contentHeader_msg">
              fill in the form to sign up
          </p>
        </>
      )}
    >
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
            onClick={onValidate}
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
    </AuthLayout>
  );

  async function onValid(data) {
    onSignup({
      data,
    });
  }

  async function onSuccess() {
    formHandlers.onReset();
  }
}

export default SignupPage;

function validator(data) {
  const schema = yup.object({
    role: yup.string().oneOf(['USER', 'ADMIN']).required(),
    first_name: yup
      .string()
      .required(fieldIsRequired),
    last_name: yup
      .string()
      .required(fieldIsRequired),
    email: yup.string().email(fieldIsInvalid).required(fieldIsRequired),
    password: yup.string().required(fieldIsRequired),
  });
  return getValidationResult(data, schema);
}
