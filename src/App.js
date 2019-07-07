import React from 'react';
import PropTypes from 'prop-types';
import { StaticRouter } from 'react-router-dom';
import { Router } from 'react-router';
import { ApolloProvider } from 'react-apollo-hooks';
import { hot } from 'react-hot-loader/root';
import ApolloAuth from 'apollo/auth';
import history from 'lib/history';
import flow from 'lodash/flow';
import { Provider as ReduxProvider } from 'react-redux';
import 'sass/common.scss';
import routes, { renderRoutes } from './routes';

const Root = ({
  context, location, apolloClient, store,
}) => (
  <ApolloProvider client={apolloClient}>
    <ReduxProvider store={store}>
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
    </ReduxProvider>
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
  store: PropTypes.object.isRequired,
};

export { Root as App };

export default flow(
  hot,
)(Root);
