import React from 'react';
import PropTypes from 'prop-types';
import { renderRoutes } from 'react-router-config';
import { StaticRouter } from 'react-router-dom';
import { Router } from 'react-router';
import { ApolloProvider } from 'react-apollo-hooks';
import { hot } from 'react-hot-loader/root';
import ApolloAuth from 'apollo/auth';
import history from 'lib/history';
import flow from 'lodash/flow';
import 'sass/common.scss';
import routes from './routes';

const Root = ({ context, location, apolloClient }) => (
  <ApolloProvider client={apolloClient}>
    <ApolloAuth>
      {typeof window !== 'object' ? (
        <StaticRouter context={context} location={location}>
          {renderRoutes(routes)}
        </StaticRouter>
      ) : (
        <Router history={history}>
          {renderRoutes(routes)}
        </Router>
      )}
    </ApolloAuth>
  </ApolloProvider>
);

Root.defaultProps = {
  context: {},
  location: '',
  apolloClient: {},
};

Root.propTypes = {
  context: PropTypes.object,
  location: PropTypes.string,
  apolloClient: PropTypes.object,
};

export { Root as App };

export default flow(
  hot,
)(Root);
