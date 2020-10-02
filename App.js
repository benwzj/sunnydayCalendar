import 'react-native-gesture-handler'
import React, {useEffect} from 'react'
import { createStore, combineReducers, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import ReduxThunk from 'redux-thunk'

import TodoStore from './data/TodoStore'
import AppNavigator from './AppNavigator'
import { calendarsReducer } from './store/reducers/calender';
import { tasksReducer } from './store/reducers/tasks';

const rootReducers = combineReducers ({
  calendars: calendarsReducer,
  tasks: tasksReducer
})
const store = createStore (rootReducers, applyMiddleware(ReduxThunk))

function App() {

  return (
    <Provider store = {store}>
      <TodoStore >
        <AppNavigator />
      </TodoStore>
    </Provider>
  );
}

export default App