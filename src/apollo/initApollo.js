import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloLink } from 'apollo-link';
import { setContext } from 'apollo-link-context';
import ApolloClient from 'apollo-client';
import { onError } from 'apollo-link-error';
import jwt from 'jsonwebtoken';
import fetch from 'isomorphic-unfetch';

let apolloClient = null;
const isBrowser = typeof window === 'object';

function create(initialState = {}, { getToken, fetchOptions }) {
  const errorLink = onError((err) => {
    const { graphQLErrors, networkError, operation } = err;
    if (graphQLErrors) {
      graphQLErrors.forEach(({ message, path }) => console.log(`[GraphQL error]: Message: ${message}, Path: ${path}`));
    }

    if (networkError) {
      console.log(`[Network error ${operation.operationName}]: ${networkError.message}`);
    }
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
  const httpLink = new HttpLink({
    uri: 'https://jobhunt-graphql.herokuapp.com/v1/graphql',
    credentials: 'same-origin',
    fetch,
    fetchOptions,
  });
  return new ApolloClient({
    connectToDevTools: isBrowser,
    ssrMode: !isBrowser,
    cache: new InMemoryCache().restore(initialState),
    link: ApolloLink.from([
      errorLink,
      httpAuthLink,
      httpLink,
    ]),
    resolvers: {},
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
