import React, {useEffect} from 'react'
import { View, StyleSheet, Button } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { useDispatch } from 'react-redux'

import ExpoCalendarListSC from './screens/ExpoCalendarListSC'
import ExpoCalendarDetailSC from './screens/ExpoCalendarDetailSC'
import RNCAgendaSC from './screens/RNCAgendaSC'
import TaskHomeSC from './screens/TaskHomeSC'
import TaskCreateSC from './screens/TaskCreateSC'
import {askCalendarPermission} from './store/actions/calendars'

const Stack = createStackNavigator();
const ExpoCalendarNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name = 'ExpoCalendarListSC'
        component = {ExpoCalendarListSC}
        options = {{title: 'Calendars List'}}
      />
      <Stack.Screen 
        name = 'ExpoCalendarDetailSC'
        component = {ExpoCalendarDetailSC}
        options = {({ route }) => ({ 
          title: route.params.calendarTitle,
        })}
      />
    </Stack.Navigator>
  )
}

const RNCalendarNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name = 'RNCAgendaSC'
        component = {RNCAgendaSC}
        options = {{ title: 'Agenda' }}
      />
    </Stack.Navigator>
  )
}

const TasksNavigator = () =>{
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name = 'TaskHomeSC'
        component = {TaskHomeSC}
        options = {{ title: 'Task Home' }}
      />
      <Stack.Screen 
        name = 'TaskCreateSC'
        component = {TaskCreateSC}
        options = {{title: 'Create Task' }}
      />
    </Stack.Navigator>
  )
}

const Tab = createBottomTabNavigator();

const AppNavigator = () => {
  const dispatch = useDispatch ()
  useEffect ( () => {
    dispatch (askCalendarPermission())
  }, []);
  
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="TasksNavigator" component={TasksNavigator} />
        <Tab.Screen name="ExpoCalendar" component={ExpoCalendarNavigator} />
        <Tab.Screen name="RNCalendar" component={RNCalendarNavigator} />
      </Tab.Navigator>
    </NavigationContainer>
  )
}

const styles = StyleSheet.create({
  list: {
    backgroundColor: '#EFEFF4',
  },
  separator: {
    height: 1,
    backgroundColor: '#DBDBE0',
  },
  titleText: {
    backgroundColor: 'transparent',
  },
  title: {
    flex: 1,
    height: 60,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
})

export default AppNavigator
