import 'react-native-gesture-handler';
import React from 'react'
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import ReduxThunk from 'redux-thunk';
import TodoStore from './data/TodoStore'

import AppNavigator from './AppNavigator'
import { calendarsReducer } from './store/reducers/calender';

const rootReducers = combineReducers ({
  calendars: calendarsReducer
})
const store = createStore (rootReducers, applyMiddleware(ReduxThunk))

export default function App() {
  return (
    <Provider store = {store}>
      <TodoStore >
      <AppNavigator />
      </TodoStore>
    </Provider>
  );
}
