import React from 'react';
import PropTypes from 'prop-types';
import { renderRoutes } from 'react-router-config';
import { BrowserRouter } from 'react-router-dom';
import { hot } from 'react-hot-loader/root';
import flow from 'lodash/flow';
import initApollo from 'apollo/initApollo';
import { parseCookies } from 'utils/tools';
import initialApolloState from 'apollo/initialState';
import { ApolloProvider } from 'react-apollo-hooks';
import routes from './routes';
import 'scss/base.scss';

const { __APOLLO_STATE__: apolloState = initialApolloState } = window;

const apolloClient = initApollo(apolloState, { getToken: () => parseCookies().token });

const Root = ({ session, registerUserSession }) => (
  <ApolloProvider client={apolloClient}>
    <BrowserRouter>
      {renderRoutes(routes, { session, registerUserSession })}
    </BrowserRouter>
  </ApolloProvider>
);

Root.defaultProps = {
  session: null,
};

Root.propTypes = {
  session: PropTypes.object,
  registerUserSession: PropTypes.func.isRequired,
};

export default flow(
  // withAuthentication,
  hot,
)(Root);
