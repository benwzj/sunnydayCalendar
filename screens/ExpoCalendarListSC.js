import React, { useEffect, useCallback } from 'react'
import { View, Text, Button, Platform, StyleSheet, TouchableHighlight,
        SafeAreaView } from 'react-native'
import * as ExpoCalendar from 'expo-calendar'
import { useSelector, useDispatch } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';

import CFlatlist, { SwipeableRow } from '../components/CFlatlist'
import { setupCalendars, deleteCalendar, addCalendar } from '../store/actions/calendars'

const CalendarListSC = (props) => {
  const dispatch = useDispatch ()
  const calendars = useSelector ( state => state.calendars.array )
  const { navigation } = props

  console.log ('CalendarListSC -----------')

  //const [calendarData, setCalendarData] = useState (null)
  useEffect ( () => {
    ( async () => {
      const { status: calePerm } = await ExpoCalendar.requestCalendarPermissionsAsync();
      const { status: remiPerm } = await ExpoCalendar.requestRemindersPermissionsAsync()
      if (calePerm === 'granted') {
        console.log('requestCalendarPermissionsAsync is granted!');
      }
      if (remiPerm === 'granted') {
        console.log('requestRemindersPermissionsAsync is granted!');
      }
    } )();
    console.log('useEffect --')
    dispatch ( setupCalendars() )
  }, []);

  React.useLayoutEffect (() => {
    navigation.setOptions({
      headerRight: () => (
        <Button 
          onPress = {() => dispatch ( addCalendar() )} 
          title = "Add" 
        />
      ),
    })
  }, [navigation])

  // useFocusEffect (
  //   useCallback ( () => {
  //     ( async () =>{
  //       console.log('useFocusEffect --')
  //       await dispatch ( setupCalendars() )
  //     })()
  //   }, [dispatch] )
  // );

  const detailHandler = (calendarId, calendarTitle) =>{
    navigation.navigate ('ExpoCalendarDetailSC', {
      calendarId: calendarId,
      calendarTitle: calendarTitle
    })
  }
  const Item = ({ item, onPress, style, separators }) => (
    <TouchableHighlight
      id = {item.id}
      onPress = {onPress}
      // onShowUnderlay = {separators.highlight}
      // onHideUnderlay = {separators.unhighlight}
      style = { style }
    >
      <View style = {styles.itemTitle}>
        <View style={[styles.itemIcon, {backgroundColor: item.color}]} />
        <Text style = {styles.itemTitleText}>{ item.title }</Text>
        <Text style = {styles.itemType}>
          {item.type} {'❭'}
        </Text>
      </View>
    </TouchableHighlight>
  )

  const renderItem = ({ item, index, separators }) => {
    return (
      <SwipeableRow 
        butTitle1 = {'Delete'} 
        onButPress1 = { () => dispatch ( deleteCalendar (item.id) )}
        butTitle2 = {'Modify'} 
        onButPress2 = {() => alert(`Modify ${item.title.toString()}`)}
      >
        <Item
          item = {item}
          onPress = {() => detailHandler (item.id, item.title)}
          separators = {separators}
          index = {index}
          style = {{backgroundColor: item.color }}
        />
      </SwipeableRow>
    )
  }

  return (
    <SafeAreaView
      style={styles.container}
    >
      <View style = {styles.button}>  
      </View>
      <CFlatlist
        data = {calendars}
        renderItem = {renderItem}
        keyExtractor = {(item) => item.id}
        style = {styles.list}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%'
  },
  button: {
    color: 'red',
    backgroundColor: 'lightblue',
  },
  list: {
    backgroundColor: '#EFEFF4',
    //width: '100%'
  },
  itemTitle: {
    flex: 1,
    height: 60,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
  },  
  itemTitleText: {
    fontWeight: 'bold',
    backgroundColor: 'transparent',
  },
  itemIcon: {
    width: 38,
    height: 38,
    borderRadius: 25,
    //backgroundColor: '#73d4e3',
    margin: 6,
  },
  itemType: {
    backgroundColor: 'transparent',
    position: 'absolute',
    right: 20,
    top: 20,
    color: '#999',
    fontWeight: 'bold',
  },
});

export default CalendarListSC
