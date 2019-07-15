import React from 'react';
import { hydrate, render } from 'react-dom';
import initApollo from 'apollo/initApollo';
import { parseCookies } from 'lib/tools';
import { loadableReady } from '@loadable/component';
import WebFontLoader from 'webfontloader';
import configureStore from 'lib/configureStore';
import Root from './App';

WebFontLoader.load({
  google: {
    families: ['Roboto:300,400,500,700'],
  },
  custom: {
    families: [
      'Proxima Nova Condensed: n3, i3, n4, i4, n6, i6',
      'Proxima Nova: n4, i4, n6, i6, n7, i7, n8, n9',
    ],
    urls: ['/static/css/material-icons.min.css', '/static/css/proxima.min.css'],
  },
});

const isProduction = process.env.NODE_ENV === 'production';

if (isProduction && 'serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js').then((registration) => {
    console.log('SW registered: ', registration);
  }).catch((registrationError) => {
    console.log('SW registration failed: ', registrationError);
  });
}


const { __APOLLO_STATE__: apolloState = {} } = window;

const apolloClient = initApollo(apolloState, { getToken: () => parseCookies().token });

const store = configureStore({ getToken: () => parseCookies().token || '' });
const renderFn = isProduction ? hydrate : render;
const preLoadFn = isProduction ? loadableReady : cb => cb();

preLoadFn(() => renderFn(
  <Root store={store} apolloClient={apolloClient} />, document.getElementById('root'),
));
