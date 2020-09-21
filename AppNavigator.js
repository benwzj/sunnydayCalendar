import React from 'react'
import { View, StyleSheet, Button } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

import ExpoCalendarListSC from './screens/ExpoCalendarListSC'
import ExpoCalendarDetailSC from './screens/ExpoCalendarDetailSC'
import RNCHomeSC from './screens/RNCHomeSC'

const Stack = createStackNavigator();
const ExpoCalendarNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name = 'ExpoCalendarListSC'
        component = {ExpoCalendarListSC}
        title = 'Calendars List'
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
        name = 'RNCHomeSC'
        component = {RNCHomeSC}
        title = 'RNCHomeSC'
      />
    </Stack.Navigator>
  )
}

const Tab = createBottomTabNavigator();

const AppNavigator = () => {

  return (
    <NavigationContainer>
      <Tab.Navigator>
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
