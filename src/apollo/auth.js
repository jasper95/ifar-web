
import React, {
  useContext, useMemo, useEffect, useRef,
} from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import useQuery from 'apollo/query';
import { Redirect } from 'react-router';
import jwt from 'jsonwebtoken';
import AuthContext from 'apollo/AuthContext';
import { generateQueryById } from './query';
import { NavSkeleton } from 'components/Skeletons';

const sessionQuery = generateQueryById({
  node: 'user_session',
  keys: [
    'id',
    `user {
      id
      first_name
      last_name
      avatar
      email
      role
      srmp_role
      srmp_business_units
    }`,
  ],
});


function getSessionId(token) {
  try {
    const { id } = jwt.verify(token, process.env.AUTH_SECRET);
    return id;
  } catch {
    return null;
  }
}

function AppWithAuth(props) {
  const { children } = props;
  const dispatch = useDispatch();
  const token = useSelector(state => state.token);
  const sessionId = useMemo(() => getSessionId(token), [token]);
  const authResponse = useQuery(
    sessionQuery, { skip: !sessionId, variables: { id: sessionId }, onCompleted },
  );
  const {
    data: authData = {}, loading, error, refetch,
  } = authResponse;
  const { user_session_by_pk: session = {} } = authData;
  const { user: auth = null } = session;
  return (
    <AuthContext.Provider value={{
      loading,
      error,
      data: auth,
      refetch,
    }}
    >
      {children}
    </AuthContext.Provider>
  );

  function onCompleted() {
    dispatch({ type: 'SET_STATE', payload: { auth } });
  }
}

AppWithAuth.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};

export default AppWithAuth;

export const withAuth = (WrappedComponent) => {
  function Auth(props) {
    const isMounted = useRef(false);
    const { requireAuth } = props;
    const { loading, error, data: auth } = useContext(AuthContext);
    useEffect(() => {
      isMounted.current = true;
    }, []);
    if (!isMounted.current && loading && requireAuth !== 'optional') {
      return (<NavSkeleton />);
    }
    if ((!auth || error) && requireAuth === true) {
      return (<Redirect to="/login" />);
    } if (auth && requireAuth === false) {
      return (<Redirect to="/" />);
    }
    return (
      <WrappedComponent {...props} />
    );
  }

  Auth.defaultProps = {
    requireAuth: true,
  };

  Auth.propTypes = {
    requireAuth: PropTypes.oneOf([true, false, 'optional']),
  };

  return Auth;
};
