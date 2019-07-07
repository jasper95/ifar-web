import { applyMiddleware, createStore, compose } from 'redux';
import rootReducer from './reducer';

function configureStore(initialState = {}) {
  let composeEnhancers = compose;
  if (typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) {
    composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;
  }
  const middlewares = [];
  const store = createStore(
    rootReducer,
    initialState,
    composeEnhancers(applyMiddleware(...middlewares)),
  );
  return store;
}

export default configureStore;
