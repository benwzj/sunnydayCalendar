import React, {useEffect} from 'react'
import { View, StyleSheet, Button } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { useDispatch } from 'react-redux'

import {askCalendarPermission} from './store/actions/calendars'
import ExpoCalendarListSC from './screens/ExpoCalendarListSC'
import ExpoCalendarDetailSC from './screens/ExpoCalendarDetailSC'
import RNCAgendaSC from './screens/RNCAgendaSC'
import RNCExpandableSC from './screens/RNCExpandableSC'
import TaskHomeSC from './screens/TaskHomeSC'
import TaskCreateSC from './screens/TaskCreateSC'
import TaskDetailSC from './screens/TaskDetailSC'
import TaskAlarmSC from './screens/TaskAlarmSC'
import TaskRepeatSC from './screens/TaskRepeatSC'
import TaskRepeatIntervalSC from './screens/TaskRepeatIntervalSC'
import TaskRepeatUntilSC from './screens/TaskRepeatUntilSC'
import TaskRepeatOnDaysSC from './screens/TaskRepeatOnDaysSC'
import TaskLocationSC from './screens/TaskLocationSC'
import MapSC from './screens/MapSC'

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
        options = {({navigation})=>({
          title: 'Agenda',
          headerRight: () => (
            <Button
              onPress = {() => navigation.navigate('RNCExpandableSC')}
              title= "Expandable"
            />
          )
        })}
      />
      <Stack.Screen 
        name = 'RNCExpandableSC'
        component = {RNCExpandableSC}
        options = {{ title: 'Expandable' }}
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
        initialParams = {{ 
          alarmTime: {time: -15, text:'15 minutes before'},
          repeatRule: {repeat: '', test: 'NONE'},
          locationAddress: {selected: false, location:{lat:0, lng:0}, address:''} 
        }}
      />
      <Stack.Screen 
        name = 'TaskDetailSC'
        component = {TaskDetailSC}
        options = {{title: 'Task Detail' }}
      />
      <Stack.Screen 
        name = 'TaskAlarmSC'
        component = {TaskAlarmSC}
        options = {{title: 'Task Alarm' }}
        //initialParams = {{ alarmTime: {time: -15, text:'15 minutes before'} }}
      />
      <Stack.Screen 
        name = 'TaskRepeatSC'
        component = {TaskRepeatSC}
        options = {{title: 'Task Repeat' }}
        initialParams = {{ 
          currentInterval: {mode: 'daily', current: 1},
          repeatRule: {repeat: '', text:'None'},
          repeatUntilDate: null,
          onDaysRule: {mode: 'weekly', days:[]}
        }}
      />
      <Stack.Screen 
        name = 'TaskRepeatIntervalSC'
        component = {TaskRepeatIntervalSC}
        options = {{title: 'Task Repeat Interval' }}
      />
      <Stack.Screen 
        name = 'TaskRepeatUntilSC'
        component = {TaskRepeatUntilSC}
        options = {{title: 'Task Repeat Until' }}
        initialParams = {{ 
          repeatUntilDate: null
        }}
      /><Stack.Screen 
        name = 'TaskRepeatOnDaysSC'
        component = {TaskRepeatOnDaysSC}
        options = {{title: 'Task Repeat On Days' }}
        initialParams = {{ 
          mode: 'weekly', days: ['Sunday']
        }}
      />
      <Stack.Screen 
        name = 'TaskLocationSC'
        component = {TaskLocationSC}
        options = {{title: 'Task Location' }}
        initialParams = {{ pickedLocation: undefined}}
      />
      <Stack.Screen 
        name = 'MapSC'
        component = {MapSC}
        options = {{title: 'Map View' }}
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
