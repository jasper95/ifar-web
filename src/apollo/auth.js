
import React, {
  useContext, useMemo, useEffect, useRef,
} from 'react';
import { useSelector } from 'react-redux';
import { useQuery } from 'react-apollo-hooks';
import { Redirect } from 'react-router';
import jwt from 'jsonwebtoken';
import gql from 'graphql-tag';
import AuthContext from 'apollo/AuthContext';
import history from 'lib/history';
import { generateQueryById } from './query';

const sessionQuery = generateQueryById({
  node: 'user_session',
  keys: [
    'id',
    `system_user {
      id
      first_name
      last_name
      avatar
      address_description
      address
      contact_number
      email
      resume
      nationality
      birth_date
      slug
      company {
        id
        name
        slug
      }
      notifications_aggregate(where: {status: {_eq: "unread"}}) {
        aggregate {
          count
        }
      }
    }`,
  ],
});

const tokenQuery = gql`
  {
    token @client
  }
`;

function getSessionId(token) {
  try {
    const { id } = jwt.verify(token, process.env.AUTH_SECRET);
    return id;
  } catch {
    return null;
  }
}

export default function AppWithAuth(props) {
  const { children } = props;
  const token = useSelector(state => state.token);
  const sessionId = useMemo(() => getSessionId(token), [token]);
  const authResponse = useQuery(sessionQuery, { skip: !sessionId, variables: { id: sessionId } });
  const { data: authData = {}, loading, error } = authResponse;
  const { user_session_by_pk: session = {} } = authData;
  const { system_user: auth = null } = session;
  return (
    <AuthContext.Provider value={{
      loading,
      error,
      data: auth,
    }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const withAuth = (params = { }) => (WrappedComponent) => {
  const { requireAuth = true } = params;
  function Auth(props) {
    const isMounted = useRef(false);
    const { data: auth, loading, error } = useContext(AuthContext);
    useEffect(() => {
      isMounted.current = true;
    }, []);
    if (!isMounted.current && loading && requireAuth !== 'optional') {
      return (<span>Loading...</span>);
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
  return Auth;
};
