/* eslint-disable no-restricted-syntax */
/* eslint-disable react-native/no-color-literals */
import React, { useState, useEffect } from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  Text,
  Button,
  Alert,
  StyleSheet,
} from 'react-native';
import moment from 'moment';
import { useSelector, useDispatch } from 'react-redux';
import {
  ExpandableCalendar, AgendaList, CalendarProvider,
} from 'react-native-calendars';
import _ from 'lodash';
import iconPlus from '../assets/plus.png';
import iconLeftArrow from '../assets/previous.png';
import iconRightArrow from '../assets/next.png';

import { setupTasks } from '../store/actions/tasks';

const TaskHomeSC = (props) => {
  // const [currentDate, setCurrentDate] = useState (new Date().toISOString())
  const [selectedDate, setSelectedDate] = useState(
    moment().format('YYYY-MM-DD'),
  );
  const dateTaskList = useSelector((state) => {
    const sections = [];
    for (const item of state.tasks.taskList) {
      const title = moment(item.startDateTime).format('YYYY-MM-DD');
      if (sections.lenght === 0) {
        sections.push({ title, data: [item] });
      } else {
        let foundSameDate = false;
        for (const section of sections) {
          if (section.title === title) {
            section.data.push(item);
            foundSameDate = true;
            break;
          }
        }
        if (!foundSameDate) {
          sections.push({ title, data: [item] });
        }
      }
    }
    // console.log( 'sections: ---', sections )
    return sections.sort(((a, b) => {
      if (a.title < b.title) {
        return -1;
      }
      if (a.title > b.title) {
        return 1;
      }
      return 0;
    }));
  });
  const calendarId = useSelector((state) => state.tasks.calendarId);
  const { navigation } = props;
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      await dispatch(setupTasks());
    })();
  }, []);

  const getMarkedDates = () => {
    const marked = {};
    dateTaskList.forEach((item) => {
      // NOTE: only mark dates with data
      if (item.data && item.data.length > 0 && !_.isEmpty(item.data[0])) {
        marked[item.title] = { marked: true };
      } else {
        marked[item.title] = { disabled: true };
      }
    });
    return marked;
  };

  const renderItem = ({ item }) => {
    if (_.isEmpty(item)) {
      return (
        <View style={styles.emptyItem}>
          <Text style={styles.emptyItemText}>No Events Planned</Text>
        </View>
      );
    }

    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('TaskDetailSC', { taskId: item.ID })}
        style={styles.item}
      >
        <View>
          <Text style={styles.itemHourText}>{moment(item.startDateTime).format('hA')}</Text>
          <Text style={styles.itemDurationText}>{moment(item.endDateTime).format('hA')}</Text>
        </View>
        <Text style={styles.itemTitleText}>{item.title}</Text>
        <View style={styles.itemButtonContainer}>
          <Button color="grey" title="Info >" onPress={() => Alert.alert(item.notes)} />
        </View>
      </TouchableOpacity>
    );
  };
  const onDateChanged = (date) => {
    // console.log('onDateChanged: ', date, updateSource);
    setSelectedDate(date);
  };

  // const onMonthChange = (month, updateSource) => {
  //   //console.log('onMonthChange: ', month, updateSource);
  // };

  const inputAddTask = (
    <TouchableOpacity
      onPress={() => {
        if (calendarId === '') {
          dispatch(setupTasks());
        }
        navigation.navigate('TaskCreateSC', {
          selectedDate,
        });
      }}
      style={styles.createTask}
    >
      <Image
        source={iconPlus}
        style={styles.iconAddTask}
      />
    </TouchableOpacity>
  );

  const inputCalendar = (
    <CalendarProvider
      date={new Date().toISOString().split('T')[0]}
      disabledOpacity={0.6}
      onDateChanged={onDateChanged}
      // onMonthChange={onMonthChange}
    >
      <ExpandableCalendar
        // disableAllTouchEventsForDisabledDays
        firstDay={1}
        markedDates={getMarkedDates()}
        leftArrowImageSource={iconLeftArrow}
        rightArrowImageSource={iconRightArrow}
      />
      <AgendaList
        sections={dateTaskList}
        // extraData={this.state}
        renderItem={renderItem}
        // sectionStyle={styles.section}
      />
    </CalendarProvider>
  );
  return (
    <>
      <View
        style={styles.container}
      >
        {inputCalendar}
        {inputAddTask}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  createTask: {
    alignItems: 'center',
    backgroundColor: '#2E66E7',
    borderRadius: 30,
    bottom: 40,
    elevation: 5,
    height: 60,
    justifyContent: 'center',
    position: 'absolute',
    right: 17,
    shadowColor: '#2E66E7',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.5,
    shadowRadius: 30,
    width: 60,
    zIndex: 999,
  },
  emptyItem: {
    borderBottomColor: 'lightgrey',
    borderBottomWidth: 1,
    height: 52,
    justifyContent: 'center',
    paddingLeft: 20,
  },
  emptyItemText: {
    color: 'lightgrey',
    fontSize: 14,
  },
  iconAddTask: {
    height: 30,
    width: 30,
  },
  item: {
    backgroundColor: 'white',
    borderBottomColor: 'lightgrey',
    borderBottomWidth: 1,
    flexDirection: 'row',
    padding: 20,
  },
  itemButtonContainer: {
    alignItems: 'flex-end',
    flex: 1,
  },
  itemDurationText: {
    color: 'grey',
    fontSize: 12,
    marginLeft: 4,
    marginTop: 4,
  },
  itemHourText: {
    color: 'black',
  },
  itemTitleText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 16,
  },
});

export default TaskHomeSC;
