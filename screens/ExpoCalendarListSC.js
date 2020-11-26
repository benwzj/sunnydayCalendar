import React, { useEffect, useCallback, useLayoutEffect } from 'react';
import {
  View,
  Text,
  Button,
  Platform,
  StyleSheet,
  TouchableHighlight,
  SafeAreaView,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';

import CFlatlist, { SwipeableRow } from '../components/CFlatlist';
import { setupCalendars, deleteCalendar, addCalendar } from '../store/actions/calendars';

const CalendarListSC = (props) => {
  const dispatch = useDispatch();
  const calendars = useSelector((state) => state.calendars.array);
  const permission = useSelector((state) => state.calendars.permission);
  const { navigation } = props;

  console.log('CalendarListSC -----------permission: ', permission);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button
          onPress={() => dispatch(addCalendar())}
          title="Add"
        />
      ),
    });
  }, [navigation]);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        await dispatch(setupCalendars());
      })();
    }, [dispatch]),
  );

  const detailHandler = (calendarId, calendarTitle) => {
    navigation.navigate('ExpoCalendarDetailSC', {
      calendarId,
      calendarTitle,
    });
  };
  const Item = ({
    item, onPress, style, separators,
  }) => (
    <TouchableHighlight
      id={item.id}
      onPress={onPress}
      // onShowUnderlay = {separators.highlight}
      // onHideUnderlay = {separators.unhighlight}
      style={style}
    >
      <View style={styles.itemTitle}>
        <View style={[styles.itemIcon, { backgroundColor: item.color }]} />
        <Text style={styles.itemTitleText}>{ item.title }</Text>
        <Text style={styles.itemType}>
          {item.type}
          {' '}
          ❭
        </Text>
      </View>
    </TouchableHighlight>
  );

  const renderItem = ({ item, index, separators }) => (
    <SwipeableRow
      butTitle1="Delete"
      onButPress1={() => dispatch(deleteCalendar(item.id))}
      butTitle2="Modify"
      onButPress2={() => alert(`Modify ${item.title.toString()}`)}
    >
      <Item
        item={item}
        onPress={() => detailHandler(item.id, item.title)}
        separators={separators}
        index={index}
        style={{ backgroundColor: item.color }}
      />
    </SwipeableRow>
  );

  return (
    <SafeAreaView
      style={styles.container}
    >
      <View style={styles.button} />
      <CFlatlist
        data={calendars}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        style={styles.list}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'lightblue',
    color: 'red',
  },
  container: {
    flex: 1,
    width: '100%',
  },
  itemIcon: {
    width: 38,
    height: 38,
    borderRadius: 25,
    // backgroundColor: '#73d4e3',
    margin: 6,
  },
  itemTitle: {
    alignItems: 'center',
    backgroundColor: '#fff',
    flex: 1,
    flexDirection: 'row',
    height: 60,
    padding: 10,
  },
  itemTitleText: {
    backgroundColor: 'transparent',
    fontWeight: 'bold',
  },
  itemType: {
    backgroundColor: 'transparent',
    color: '#999',
    fontWeight: 'bold',
    position: 'absolute',
    right: 20,
    top: 20,
  },
  list: {
    backgroundColor: '#EFEFF4',
    // width: '100%'
  },
});

export default CalendarListSC;
