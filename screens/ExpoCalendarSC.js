import React, { useEffect, useState } from 'react';
import { View, Text, Button, Platform, StyleSheet,
  SafeAreaView } from 'react-native';
import * as Calendar from 'expo-calendar';

import CFlatlist, {Item} from '../components/CFlatlist'

const ExpoCalendar = () => {
  //const [selectedId, setSelectedId] = useState(null);
  const [calendarData, setCalendarData] = useState (null)
  useEffect(() => {
    (async () => {
      const { status: calePerm } = await Calendar.requestCalendarPermissionsAsync();
      const { status: remiPerm } = await Calendar.requestRemindersPermissionsAsync()
      if (calePerm === 'granted') {
        console.log('requestCalendarPermissionsAsync is granted!');
      }
      if (remiPerm === 'granted') {
        console.log('requestRemindersPermissionsAsync is granted!');
      }
    })();
  }, []);

  async function getDefaultCalendarSource() {
    const calendars = await Calendar.getCalendarsAsync();
    const defaultCalendars = calendars.filter(each => each.source.name === 'Default');
    return defaultCalendars[0].source;
  }
  
  async function createCalendar() {
    const defaultCalendarSource =
      Platform.OS === 'ios'
        ? await getDefaultCalendarSource()
        : { isLocalAccount: true, name: 'Expo Calendar' };
    await Calendar.createCalendarAsync({
      title: `Calendar title(${Math.random().toString().substring(2)})`,
      color: 'blue',
      entityType: Calendar.EntityTypes.EVENT,
      sourceId: defaultCalendarSource.id,
      source: defaultCalendarSource,
      name: 'internalCalendarName',
      ownerAccount: 'personal',
      accessLevel: Calendar.CalendarAccessLevel.OWNER,
    });
    getCalendars ()
  }

  const getCalendars = async () => {
    const calendars = await Calendar.getCalendarsAsync ();
    setCalendarData ( calendars )
    // console.log('Here are all your calendars:');
    // console.log( calendars );
  }
  const deleteCalendar = async (id) => {
    await Calendar.deleteCalendarAsync (id)
    getCalendars ()
  }

  const renderItem = ({ item, index, separators }) => {
    return (
      <Item
        item = {item}
        onPress = {() => deleteCalendar(item.id)}
        separators = {separators}
        index = {index}
      />
    );
  };
  return (
    <SafeAreaView
      style={styles.container}
    >
      <View style = {styles.button}>
        <Button title="Get Calendars" onPress={getCalendars} />
        <Button 
          title = "Create a new calendar" 
          onPress = {createCalendar} 
          color = 'red'
        />
      </View>
      <CFlatlist
        data = {calendarData}
        renderItem = {renderItem}
        keyExtractor = {(item) => item.id}
        //extraData = {selectedId}
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

});

export default ExpoCalendar