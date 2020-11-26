import React, { useState } from 'react';
import {
  Alert, StyleSheet, Text, View, TouchableOpacity,
} from 'react-native';
import { Agenda } from 'react-native-calendars';
import { Avatar } from 'react-native-paper';

const testIDs = {
  agenda: {
    CONTAINER: 'agenda',
    ITEM: 'item',
  },
};

const RNCAgendaSC = () => {
  const [items, setItems] = useState({
    '2012-05-22': [{ name: 'item 1 - any js object' }],
    '2012-05-23': [{ name: 'item 2 - any js object', height: 120 }],
    // '2012-05-24': [],
    '2012-05-25': [{ name: 'item 3 - any js object', size: 100 }, { name: 'any js object' }],
  });

  const loadItems = (day) => {
    // setTimeout(() => {
    //   for (let i = -15; i < 85; i++) {
    //     const time = day.timestamp + i * 24 * 60 * 60 * 1000;
    //     const strTime = timeToString(time);
    //     if (!items[strTime]) {
    //       items[strTime] = [];
    //       const numItems = Math.floor(Math.random() * 3 + 1);
    //       for (let j = 0; j < numItems; j++) {
    //         items[strTime].push({
    //           name: 'Item for ' + strTime + ' #' + j,
    //           height: Math.max(50, Math.floor(Math.random() * 150))
    //         });
    //       }
    //     }
    //   }
    //   const newItems = {};
    //   Object.keys(items).forEach(key => {newItems[key] = items[key];});
    //   setItems(newItems)
    // }, 1000);
    // console.log( day )
    // setItems ({
    //   '2012-05-22': [{name: 'item 1 - any js object'}],
    //   '2012-05-23': [{name: 'item 2 - any js object', height: 120}],
    //   //'2012-05-24': [],
    //   '2012-05-25': [{name: 'item 3 - any js object', size: 100}, {name: 'any js object'}]
    // })
  };

  const renderItem = (item) => (
    <TouchableOpacity
      testID={testIDs.agenda.ITEM}
      style={[styles.item, { height: item.height }]}
      onPress={() => Alert.alert(item.name)}
    >
      <Text>{item.name}</Text>
      <Avatar.Text size={34} label="W" />
    </TouchableOpacity>
  );

  const renderEmptyDate = () => (
    <View style={styles.emptyDate}>
      <Text>This is empty date!</Text>
    </View>
  );

  const dayClick = (day) => {
    setItems((items) => ({
      ...items,
      [day.dateString]: [{ name: `new item for ${day.dateString}` }],
    }));
    // console.log( items )
  };
  const rowHasChanged = (r1, r2) => r1.name !== r2.name;

  const timeToString = (time) => {
    const date = new Date(time);
    return date.toISOString().split('T')[0];
  };

  return (
    <Agenda
      testID={testIDs.agenda.CONTAINER}
      items={items}
      loadItemsForMonth={loadItems}
      // Callback that fires when the calendar is opened or closed
      onCalendarToggled={(calendarOpened) => { console.log('calendarOpened: ', calendarOpened); }}
      // Callback that gets called on day press
      onDayPress={dayClick}
      // Callback that gets called when day changes while scrolling agenda list
      onDayChange={(day) => { console.log('day changed', day); }}
      selected={timeToString(new Date())}
      renderItem={renderItem}
      renderEmptyDate={renderEmptyDate}
      rowHasChanged={rowHasChanged}
    />
  );
};

const styles = StyleSheet.create({
  emptyDate: {
    flex: 1,
    height: 15,
    paddingTop: 30,
  },
  item: {
    backgroundColor: 'white',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginTop: 17,
  },
});

export default RNCAgendaSC;
