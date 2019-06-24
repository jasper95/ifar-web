import React from 'react';
import { hydrate, render } from 'react-dom';
import initApollo from 'apollo/initApollo';
import initialApolloState from 'apollo/initialState';
import { parseCookies } from 'lib/tools';
import { loadableReady } from '@loadable/component';

import Root from './App';

const isProduction = process.env.NODE_ENV === 'production';

if (isProduction && 'serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js').then((registration) => {
    console.log('SW registered: ', registration);
  }).catch((registrationError) => {
    console.log('SW registration failed: ', registrationError);
  });
}


const { __APOLLO_STATE__: apolloState = initialApolloState } = window;

const apolloClient = initApollo(apolloState, { getToken: () => parseCookies().token });

const renderFn = isProduction ? hydrate : render;
const preLoadFn = isProduction ? loadableReady : cb => cb();

preLoadFn(() => renderFn(
  <Root apolloClient={apolloClient} />, document.getElementById('root'),
));
