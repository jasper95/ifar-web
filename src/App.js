import React from 'react';
import PropTypes from 'prop-types';
import { renderRoutes } from 'react-router-config';
import { BrowserRouter, StaticRouter } from 'react-router-dom';
import { ApolloProvider } from 'react-apollo-hooks';
import { hot } from 'react-hot-loader/root';
import flow from 'lodash/flow';
import routes from './routes';
import 'scss/base.scss';

const Root = ({ context, location, apolloClient }) => (
  <ApolloProvider client={apolloClient}>
    {typeof window !== 'object' ? (
      <StaticRouter context={context} location={location}>
        {renderRoutes(routes)}
      </StaticRouter>
    ) : (
      <BrowserRouter>
        {renderRoutes(routes)}
      </BrowserRouter>
    )}
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
