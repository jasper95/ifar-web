
import React, { createContext, useContext, useMemo } from 'react';
import { useQuery } from 'react-apollo-hooks';
import { Redirect } from 'react-router';
import jwt from 'jsonwebtoken';
import gql from 'graphql-tag';
import { generateQueryById } from './query';

const sessionQuery = generateQueryById({
  node: 'user_session_by_pk',
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
      company {
        id
        name
        slug
      }
      notifications_aggregate(where: {status: {_eq: "unread"}}, order_by: {created_date: desc}) {
        aggregate {
          count
        }
      }
    }`,
  ],
});

export const AuthContext = createContext();

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
  const { data: { token = '' } } = useQuery(tokenQuery);
  const sessionId = useMemo(() => getSessionId(token), [token]);
  const authResponse = useQuery(sessionQuery, { skip: !sessionId, variables: { id: sessionId } });
  console.log('AppWithAuth render');
  return (
    <AuthContext.Provider value={authResponse}>
      {children}
    </AuthContext.Provider>
  );
}

export const withAuth = (params = { }) => (WrappedComponent) => {
  const { requireAuth = true } = params;
  function Auth(props) {
    console.log('render', requireAuth);

    const authResponse = useContext(AuthContext);
    const { data: authData = {}, loading, error } = authResponse;
    const { user_session_by_pk: session = {} } = authData;
    const { system_user: auth = null } = session;
    if (loading && requireAuth !== 'optional') {
      return (<span>Loading...</span>);
    }
    if ((!auth || error) && requireAuth === true) {
      return (<Redirect to="/login" />);
    } if (auth && requireAuth === false) {
      return (<Redirect to="/" />);
    }
    console.log('lahos');
    return (
      <WrappedComponent {...props} />
    );
  }
  return Auth;
};
