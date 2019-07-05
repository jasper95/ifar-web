import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloLink } from 'apollo-link';
import { RestLink } from 'apollo-link-rest';
import { setContext } from 'apollo-link-context';
import ApolloClient from 'apollo-client';
import { onError } from 'apollo-link-error';
import fetch from 'node-fetch';
import jwt from 'jsonwebtoken';
import { setData } from 'apollo/mutation';

let apolloClient = null;
const isBrowser = typeof window === 'object';

if (!isBrowser) {
  global.fetch = fetch;
  global.Headers = fetch.Headers;
}

function create(initialState, { getToken, fetchOptions }) {
  const errorLink = onError((err) => {
    const { graphQLErrors, networkError, operation } = err;
    const { cache } = operation.getContext();
    if (graphQLErrors) {
      graphQLErrors.forEach(({ message, path }) => console.log(`[GraphQL error]: Message: ${message}, Path: ${path}`));
    }

    if (networkError) {
      console.log(`[Network error ${operation.operationName}]: ${networkError.message}`);
      if (networkError.statusCode === 400) {
        const { message } = networkError.result;
        setData({
          toast: {
            message,
            type: 'error',
          },
          dialogProcessing: false,
        })(cache);
      }
    }
  });
  const restAuthLink = setContext((_, { headers }) => {
    const token = getToken();
    const basicAuth = Buffer.from(`${process.env.API_USERNAME}:${process.env.API_PASSWORD}`).toString('base64');
    return {
      headers: {
        ...headers,
        Authorization: token ? `Bearer ${token}` : `Basic ${basicAuth}`,
      },
    };
  });
  const httpAuthLink = setContext((_, { headers }) => {
    const token = getToken() || jwt.sign({
      hasura_claims: {
        'x-hasura-default-role': 'anonymous',
        'x-hasura-allowed-roles': ['anonymous'],
      },
    },
    process.env.AUTH_SECRET);
    return {
      headers: {
        ...headers,
        Authorization: `Bearer ${token}`,
      },
    };
  });
  const restLink = new RestLink({
    uri: 'https://jobhunt-api.herokuapp.com',
    credentials: 'same-origin',
    customFetch: fetch,
  });
  const httpLink = new HttpLink({
    uri: 'http://jobhunt-graphql.herokuapp.com/v1/graphql',
    credentials: 'same-origin',
    fetchOptions,
  });
  const cache = new InMemoryCache();
  cache.writeData({
    data: initialState,
  });
  return new ApolloClient({
    connectToDevTools: isBrowser,
    ssrMode: !isBrowser,
    cache,
    link: ApolloLink.from([
      errorLink,
      restAuthLink,
      restLink,
      httpAuthLink,
      httpLink,
    ]),
    resolvers: {

    },
  });
}

export default function initApollo(initialState, options) {
  if (!isBrowser) {
    return create(initialState, options);
  }

  if (!apolloClient) {
    apolloClient = create(initialState, options);
  }

  return apolloClient;
}
