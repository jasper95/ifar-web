import { useMemo } from 'react';
import gql from 'graphql-tag';
import { useApolloClient, useQuery } from 'react-apollo-hooks';

function subcribeToAppData(selector) {
  if (selector.length === 0) {
    return gql`
      query {
        NoResponse
      }
    `;
  }
  return gql`
  {
    ${selector.map(e => `${e} @client`).join('\n')}
  }
`;
}

export function useAppData(selector = []) {
  const { data: appData = {} } = useQuery(
    useMemo(() => subcribeToAppData(selector), [selector]), { skip: selector.length === 0 },
  );
  const apolloClient = useApolloClient();
  return [{ appData, apolloClient }, setAppData];
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
