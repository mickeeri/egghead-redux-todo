import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';
import todoApp from './reducers';

const configureStore = () => {
  // Adding middlewares.
  const middlewares = [thunk];
  if (process.env.NODE_ENV !== 'production') {
    // Override dispatch for logging.
    middlewares.push(createLogger());
  }

  return createStore(
    todoApp,
    applyMiddleware(...middlewares)
  );
};

export default configureStore;
