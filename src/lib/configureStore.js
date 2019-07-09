import { applyMiddleware, createStore, compose } from 'redux';
import createReducer from 'lib/createReducer';
import initialState from '../redux/initialState';
import rootReducer from '../redux/reducer';

function configureStore({ getToken }) {
  let composeEnhancers = compose;
  if (typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) {
    composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;
  }
  const middlewares = [];
  const state = {
    ...initialState,
    token: getToken(),
  };
  const reducer = createReducer({}, rootReducer);
  const store = createStore(
    reducer,
    state,
    composeEnhancers(applyMiddleware(...middlewares)),
  );
  return store;
}

export default configureStore;
