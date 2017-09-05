import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { createStore, combineReducers} from 'redux'
import { Provider } from 'react-redux'
import entitiesReducer from './reducers/entitiesReducer'
import characterReducer from './reducers/characterReducer'
const reducer = combineReducers({ entities: entitiesReducer, character: characterReducer})

const store = createStore(reducer,window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())

ReactDOM.render(
 <Provider store={store}>
    <App />
 </Provider>
  , document.getElementById('root'));
registerServiceWorker();
