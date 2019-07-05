import gql from 'graphql-tag';
import { useApolloClient, useQuery } from 'react-apollo-hooks';
import pick from 'lodash/pick';
import initialState from './initialState';

export const QUERY = Object.keys(initialState)
  .reduce((acc, el) => {
    acc[`GET_${el.toUpperCase()}`] = gql`
      query {
        ${el} @client
      }
    `;
    return acc;
  }, {});

const q = gql`
  {
    toast @client
    auth @client
    dialog @client
  }
`;

export function useAppData() {
  const { data: appData = {} } = useQuery(q);
  const client = useApolloClient();
  return [appData, setAppData];
  function setAppData(data) {
    setData(data)(client);
  }
}

export function setData(data) {
  data = pick(data, Object.keys(initialState));
  return apolloClient => apolloClient.writeQuery({
    data,
    query: gql`
        {
          ${Object.keys(data).map(e => `${e} @client`).join('\n')}
        }
      `,
  });
}
