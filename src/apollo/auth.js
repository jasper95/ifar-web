
import React, {
  useContext, useEffect, useRef,
} from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import useQuery from 'apollo/query';
import { Redirect } from 'react-router';
import AuthContext from 'apollo/AuthContext';
import { NavSkeleton } from 'components/Skeletons';
import cookie from 'js-cookie'
import gql from 'graphql-tag';

const sessionQuery = gql`
  query {
    user_session {
      id
      user {
        id
        first_name
        last_name
        avatar
        email
        role
        srmp_role
        srmp_business_units
      }
    }
  }
`;

function AppWithAuth(props) {
  const { children } = props;
  const dispatch = useDispatch();
  const token = useSelector(state => state.token);
  const authResponse = useQuery(
    sessionQuery, { skip: !token, onCompleted },
  );
  const {
    data: authData = {}, loading, error, refetch,
  } = authResponse;
  const { user_session: userSession = [] } = authData;
  const [session = {}] = userSession;
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
    const { requireAuth, requiredRoles } = props;
    const { loading, error, data: auth } = useContext(AuthContext);
    useEffect(() => {
      isMounted.current = true;
    }, []);
    if (!isMounted.current && loading && requireAuth !== 'optional') {
      return (<NavSkeleton />);
    }
    if ((!auth || error) && requireAuth === true) {
      return (<Redirect to="/login" />);
    }
    if(requiredRoles.length && auth && !requiredRoles.includes(auth.role)) {
      return (<Redirect to="/" />);
    }
    if (auth && requireAuth === false) {
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
