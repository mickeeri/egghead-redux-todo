import { createStore, applyMiddleware } from 'redux';
import promise from 'redux-promise';
import createLogger from 'redux-logger';
import todoApp from './reducers';

const configureStore = () => {
  // Adding middlewares.
  const middlewares = [promise];
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
