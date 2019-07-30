import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { WebSocketLink } from 'apollo-link-ws';
import { ApolloLink, split, concat } from 'apollo-link';
import { getMainDefinition } from 'apollo-utilities';
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
  const wsLink = new WebSocketLink({
    uri: `wss://${process.env.GRAPHQL_URL}`, // use wss for a secure endpoint
    options: {
      reconnect: true,
    },
  });
  const authMiddleware = new ApolloLink((operation, forward) => {
    const token = getToken() || jwt.sign({
      hasura_claims: {
        'x-hasura-default-role': 'anonymous',
        'x-hasura-allowed-roles': ['anonymous'],
      },
    }, process.env.AUTH_SECRET);
    operation.setContext({
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return forward(operation);
  });
  const httpLink = new HttpLink({
    uri: `https://${process.env.GRAPHQL_URL}`,
    credentials: 'same-origin',
    fetch,
    fetchOptions,
  });
  const link = split(
    // split based on operation type
    ({ query }) => {
      const { kind, operation } = getMainDefinition(query);
      return kind === 'OperationDefinition' && operation === 'subscription';
    },
    wsLink,
    httpLink,
  );
  return new ApolloClient({
    connectToDevTools: isBrowser,
    ssrMode: !isBrowser,
    cache: new InMemoryCache().restore(initialState),
    link: ApolloLink.from([
      errorLink,
      authMiddleware,
      link,
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
