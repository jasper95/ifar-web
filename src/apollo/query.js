import { useState } from 'react';
import { useApolloClient, useQuery } from 'react-apollo-hooks';
import { useDispatch } from 'react-redux';
import gql from 'graphql-tag';

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

export default function customUseQuery(query, params) {
  const dispatch = useDispatch();
  return useQuery(query, {
    ...params,
    onError,
  });
  function onError() {
    if (typeof window !== 'object') {
      dispatch({
        type: 'ERROR',
        payload: {
          message: 'Something went wrong',
        },
      });
    }
  }
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
