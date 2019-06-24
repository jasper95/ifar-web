import gql from 'graphql-tag';
import { useApolloClient, useQuery } from 'react-apollo-hooks';
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

export function useAppData() {
  const { data: notification } = useQuery(QUERY.GET_TOAST, { ssr: false });
  const { data: auth } = useQuery(QUERY.GET_AUTH);
  const { data: dialog } = useQuery(QUERY.GET_DIALOG, { ssr: false });
  const { data: dialogProcessing } = useQuery(QUERY.GET_DIALOGPROCESSING, { ssr: false });
  const client = useApolloClient();
  return [{
    ...notification, ...auth, ...dialog, ...dialogProcessing,
  }, setAppData];
  function setAppData(key, val) {
    setData(key, val)(client);
  }
}

export function setData(key, value) {
  return cache => cache.writeQuery({
    data: {
      [key]: value,
    },
    query: QUERY[`GET_${key.toUpperCase()}`],
  });
}
