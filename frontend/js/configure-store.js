import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';
import { createStore, applyMiddleware, compose } from 'redux';
import rootReducer from './root-reducer';
import { transformActor } from './middlewares/transform-actor';
import { routerMiddleware } from 'react-router-redux';
import DevTools from './components/dev-tools';
import { browserHistory } from 'react-router';


const loggerMiddleware = createLogger();

const middlewares = applyMiddleware(
  thunkMiddleware,
  loggerMiddleware,
  routerMiddleware(browserHistory),
  transformActor
);

if (process.env.NODE_ENV === 'production') {

  module.exports = function configureStore() {
    return createStore(
      rootReducer,
      compose(middlewares)
    );
  };
  
} else {

  module.exports = function configureStore() {
    return createStore(
      rootReducer,
      compose(middlewares, DevTools.instrument())
    );
  };
}
