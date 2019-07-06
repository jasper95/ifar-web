import { useContext, useEffect } from 'react';
import gql from 'graphql-tag';
import { useApolloClient, useQuery } from 'react-apollo-hooks';
import initialState from './initialState';
import { AuthContext } from './auth';

export const QUERY = Object.keys(initialState)
  .reduce((acc, el) => {
    acc[`GET_${el.toUpperCase()}`] = gql`
      query {
        ${el} @client
      }
    `;
    return acc;
  }, {});

const localStateKeys = Object.keys(initialState);

const q = gql`
  {
    ${localStateKeys.map(e => `${e} @client`).join('\n')}
  }
`;

export function useAppData() {
  const authResponse = useContext(AuthContext);
  const { data: authData = {} } = authResponse;
  const { user_session_by_pk: session = {} } = authData;
  const { system_user: auth = null } = session;
  const { data: appData = {} } = useQuery(q);
  const apolloClient = useApolloClient();
  // useEffect(() => {
  //   authResponse.refetch();
  // }, [appData.token]);
  return [{ appData: { ...appData, auth }, apolloClient }, setAppData];
  function setAppData(data) {
    setData(data)(apolloClient);
  }
}

export function setData(data) {
  return apolloClient => apolloClient.writeQuery({
    data,
    query: gql`
        {
          ${Object.keys(data).map(e => `${e} @client`).join('\n')}
        }
      `,
  });
}
