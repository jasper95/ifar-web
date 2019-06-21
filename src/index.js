import React from 'react';
import ReactDOM from 'react-dom';
import initApollo from 'apollo/initApollo';
import initialApolloState from 'apollo/initialState';
import { parseCookies } from 'utils/tools';
import Root from './App';

if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js').then((registration) => {
    console.log('SW registered: ', registration);
  }).catch((registrationError) => {
    console.log('SW registration failed: ', registrationError);
  });
}

const { __APOLLO_STATE__: apolloState = initialApolloState } = window;

const apolloClient = initApollo(apolloState, { getToken: () => parseCookies().token });

ReactDOM.hydrate(
  <Root apolloClient={apolloClient} />, document.getElementById('root'),
);
