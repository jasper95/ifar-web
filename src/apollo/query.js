import { useState } from 'react';
import { useApolloClient } from 'react-apollo-hooks';
import gql from 'graphql-tag';
import { useAppData } from './appData';

export { useAppData };
function generateQueryByFilter({
  node, keys, variables, filters,
}) {
  return gql`
    query getNodeByFilter(${variables}){
      ${node}(${filters}) {
        ${keys.join(', ')}
      }
    }
  `;
}

export function generateQueryById({ node, keys = ['id', 'name'] }) {
  const filters = 'id: $id';
  const variables = '$id: uuid!';
  return generateQueryByFilter({
    node: `${node}_by_pk`, variables, filters, keys,
  });
}

export function useManualQuery(query, options = {}, initialData = {}) {
  const client = useApolloClient();
  const [data, setData] = useState(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  async function onQuery(queryOptions = {}) {
    setIsLoading(true);
    const result = await client
      .query({
        query,
        ...options,
        ...queryOptions,
      })
      .then((response) => {
        setData(response.data);
        return response.data;
      })
      .catch((err) => {
        setError(err);
        return { error: err };
      });
    setIsLoading(false);
    return result;
  }
  return [{ data, isLoading, error }, { onQuery }];
}
