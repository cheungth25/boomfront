import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import Login from './components/Login'
import 'semantic-ui-css/semantic.min.css'
import registerServiceWorker from './registerServiceWorker';
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { createStore, combineReducers} from 'redux'
import { Provider } from 'react-redux'
import entitiesReducer from './reducers/entitiesReducer'
import characterReducer from './reducers/characterReducer'
import playersReducer from './reducers/playersReducer'
const reducer = combineReducers({ entities: entitiesReducer, character: characterReducer, players: playersReducer})
const rootReducer = (state, action) => {
  if(action.type === 'EXIT') {
    state = undefined
  }
  return reducer(state, action)
}


const store = createStore(rootReducer,window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())

ReactDOM.render(
 <Provider store={store}>
   <Router>
     <div>
       <Route exact path="/" render={(props)=>(<Login route={props} />)} />
       <Route exact path="/hi" component={(props)=>(<App route={props} />)} />
     </div>
   </Router>
 </Provider>
  , document.getElementById('root'));
registerServiceWorker();


// import {Redirect} from 'react-router'
// <Redirect to="/" />
