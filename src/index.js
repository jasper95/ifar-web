import React from 'react';
import ReactDOM from 'react-dom';
import Root from './App';


// const { __APOLLO_STATE__: apolloState = initialApolloState } = window;

// const apolloClient = initApollo(apolloState, { getToken: () => parseCookies().token });

ReactDOM.render(
  <Root />, document.getElementById('root'),
);
