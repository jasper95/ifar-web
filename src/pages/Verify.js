import React, { useEffect } from 'react';
import AuthLayout from 'components/Layout/Auth';
import Link from 'react-router-dom/Link';
import useMutation from 'apollo/mutation';
import Button from 'react-md/lib/Buttons/Button';
import FontIcon from 'react-md/lib/FontIcons/FontIcon';
import { useDispatch } from 'react-redux';

function Verify(props) {
  const [verifyState, onVerify] = useMutation({ url: '/verify-account', method: 'put', onSuccess });
  console.log('verifyState: ', verifyState);
  const dispatch = useDispatch();
  useEffect(() => {
    if (typeof window === 'object') {
      const token = new URLSearchParams(window.location.search).get('token');
      if (!token) {
        dispatch({ type: 'ERROR', payload: { message: 'Invalid verification link' } });
        return;
      }
      onVerify({ data: { token } });
    }
  }, []);
  return (
    <AuthLayout
      header={(
        <h1 className="authContainer_contentHeader_title">
          Verify Account
        </h1>
      )}
    >
      {verifyState.loading && (
        <div>
          Verifying your account ....
        </div>
      )}
      {verifyState.error && (
        <div>
          Something went wrong
        </div>
      )}
      {verifyState.data && verifyState.data.success && (
        <div>
          <div>
            Account successfully verified
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
      )}
    </AuthLayout>
  );

  function onSuccess() {

  }
}

export default Verify;
