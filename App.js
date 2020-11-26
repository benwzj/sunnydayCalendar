import 'react-native-gesture-handler';
import React from 'react';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import ReduxThunk from 'redux-thunk';

import AppNavigator from './AppNavigator';
import { calendarsReducer } from './store/reducers/calender';
import { tasksReducer } from './store/reducers/tasks';

const rootReducers = combineReducers({
  calendars: calendarsReducer,
  tasks: tasksReducer,
});
const store = createStore(rootReducers, applyMiddleware(ReduxThunk));

function App() {
  return (
    <Provider store={store}>
      <AppNavigator />
    </Provider>
  );
}

export default App;
