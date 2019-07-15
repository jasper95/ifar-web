import React from 'react';
import Button from 'react-md/lib/Buttons/Button';
import cn from 'classnames';
import TextField from 'react-md/lib/TextFields/TextField';
import Link from 'react-router-dom/Link';
import useForm from 'lib/hooks/useForm';
import cookie from 'js-cookie';
import { getValidationResult } from 'lib/tools';
import Page from 'components/Layout/Page';
import * as yup from 'yup';
import useMutation from 'apollo/mutation';
import { withAuth } from 'apollo/auth';
import flowRight from 'lodash/flowRight';
import { useDispatch } from 'react-redux';
import 'sass/pages/login.scss';

const initialFields = {
  password: '',
  email: '',
  isShowPassword: false,
};

function LoginPage() {
  const [formState, formHandlers] = useForm({ initialFields, validator, onValid });
  const [loginState, onLogin] = useMutation({ url: '/login' });
  const dispatch = useDispatch();
  const {
    onElementChange,
    onValidate,
  } = formHandlers;
  const { fields, errors } = formState;
  return (
    <Page
      pageId="login"
      hasNavigation={false}
      hasFooter={false}
      pageTitle="Login"
      pageDescription="Login to Internlik. Search and apply for internship jobs"
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

            <h1 className="authContainer_contentHeader_title">
              Login
            </h1>

            <p className="authContainer_contentHeader_msg">
              Welcome back , Please login
              {' '}
              <br />
              to your account
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
            {/* { verified && (
              <div className="authContainer_form_msg
                authContainer_form_msg-success"
              >
                <p>Account successfully verified</p>
              </div>
            )} */}
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
              <Link to="/signup">
                <Button
                  className="iBttn iBttn-second-prio"
                  children="Sign Up"
                  flat
                />
              </Link>
              <div className="row">
                <p>
                  <Link to="/forgot-password">
                    Forgot Password?
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

  function onValid(data) {
    onLogin({
      data,
      onSuccess: setToken,
    });
  }

  function setToken({ token }) {
    dispatch({ type: 'SET_STATE', payload: { token } });
    cookie.set('token', token, { expires: 360000 });
  }
}
export default flowRight(
  withAuth({ requireAuth: false }),
)(LoginPage);

function validator(data) {
  const schema = yup.object().shape({
    email: yup.string().email('Invalid Email').required('Email is required'),
    password: yup.string().required('Password is required'),
  });
  return getValidationResult(data, schema);
}
