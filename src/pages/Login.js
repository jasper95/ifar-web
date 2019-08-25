import React from 'react';
import Button from 'react-md/lib/Buttons/Button';
import cn from 'classnames';
import TextField from 'react-md/lib/TextFields/TextField';
import Link from 'react-router-dom/Link';
import useForm from 'lib/hooks/useForm';
import cookie from 'js-cookie';
import { getValidationResult, fieldIsRequired, fieldIsInvalid } from 'lib/tools';
import * as yup from 'yup';
import useMutation from 'apollo/mutation';
import AuthLayout from 'components/Layout/Auth';
import { useDispatch } from 'react-redux';
import 'sass/pages/login.scss';

const initialFields = {
  password: '',
  email: '',
  isShowPassword: false,
};

function LoginPage() {
  const [formState, formHandlers] = useForm({
    initialFields, validator, onValid,
  });
  const [loginState, onLogin] = useMutation({ url: '/login', onSuccess });
  const dispatch = useDispatch();
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
            Login
          </h1>

          <p className="authContainer_contentHeader_msg">
            Welcome back , Please login
            {' '}
            <br />
            to your account
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
        <TextField
          className="iField"
          id="email"
          label="Email"
          type="email"
          variant="outlined"
          onChange={onElementChange}
          errorText={errors.email}
          error={!!errors.email}
          value={fields.email || ''}
        />
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
            className={cn('iBttn iBttn-primary', { processing: loginState.loading })}
            onClick={onValidate}
            children="Login"
            flat
          />
          <Link
            to="/forgot-password"
            className="authContainer_form_action_forget"
          >
              Forgot Password?
          </Link>
        </div>
      </form>
    </AuthLayout>
  );

  function onValid(data) {
    onLogin({
      data,
    });
  }

  function onSuccess({ token }) {
    dispatch({ type: 'SET_STATE', payload: { token } });
    cookie.set('token', token, { expires: 360000 });
  }
}
export default LoginPage;

function validator(data) {
  const schema = yup.object().shape({
    email: yup.string().email(fieldIsInvalid).required(fieldIsRequired),
    password: yup.string().required(fieldIsRequired),
  });
  return getValidationResult(data, schema);
}
