import React from 'react';
// import PropTypes from 'prop-types';
import { renderRoutes } from 'react-router-config';
import { BrowserRouter, StaticRouter } from 'react-router-dom';
import { hot } from 'react-hot-loader/root';
import flow from 'lodash/flow';
import routes from './routes';
import 'scss/base.scss';

const Root = ({ context, location }) => (
  typeof window !== 'object' ? (
    <StaticRouter context={context} location={location}>
      {renderRoutes(routes)}
    </StaticRouter>
  ) : (
    <BrowserRouter>
      {renderRoutes(routes)}
    </BrowserRouter>
  )
);

Root.defaultProps = {
  session: null,
};

// Root.propTypes = {
//   session: PropTypes.object,
//   registerUserSession: PropTypes.func.isRequired,
// };

export { Root as App };

export default flow(
  // withAuthentication,
  hot,
)(Root);
