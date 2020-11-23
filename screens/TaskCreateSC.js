import React, { useState, useRef } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Switch,
  StyleSheet,
  LayoutAnimation,
} from 'react-native';
import moment from 'moment';
import * as Localization from 'expo-localization';
import DateTimePicker from 'react-native-modal-datetime-picker';
import { useDispatch, useSelector } from 'react-redux';
// eslint-disable-next-line import/no-extraneous-dependencies
import { AntDesign } from '@expo/vector-icons';

import MapPreview from '../components/MapPreview';
import ItemChevron from '../components/ItemChevron';
import { addTask, setupTasks } from '../store/actions/tasks';

const TaskCreateSC = (props) => {
  const dispatch = useDispatch();
  const { navigation, route } = props;
  const {
    alarmTime, repeatRule, locationAddress, selectedDate,
  } = route.params;
  const calendarId = useSelector((state) => state.tasks.calendarId);
  const [taskStartDateTime, setTaskStartDateTime] = useState(
    new Date(selectedDate).setHours(12, 0, 0),
  );
  const [taskEndDateTime, setTaskEndDateTime] = useState(
    new Date(selectedDate).setHours(13, 0, 0),
  );
  const [timeForStartOrEnd, setTimeForStartOrEnd] = useState('start');

  const [allDay, setAllDay] = useState(true);
  const [title, setTitle] = useState('');
  const [notesText, setNotesText] = useState('');
  const [dateTimePicker, setDateTimePicker] = useState({ visible: false, mode: 'datetime' });

  const taskColor = useRef(`rgb(${Math.floor(
    Math.random() * Math.floor(256),
  )},${Math.floor(Math.random() * Math.floor(256))},${Math.floor(
    Math.random() * Math.floor(256),
  )})`);

  const taskIcon = (name) => (
    <View style={styles.taskIcon}>
      <AntDesign
        name={name}
        size={20}
        color={taskColor.current}
      />
    </View>
  );

  const createTask = () => {
    if (calendarId === '') {
      dispatch(setupTasks());
      return;
    }

    const task = {
      calendarId,
      title,
      notes: notesText,
      startDateTime: taskStartDateTime,
      endDateTime: taskEndDateTime > taskStartDateTime ? taskEndDateTime : taskStartDateTime,
      alarmTime,
      allDay,
      locationAddress,
      timeZone: Localization.timezone,
      color: taskColor.current,
      repeatRule,
    };
    dispatch(addTask(task));
    navigation.navigate('TaskHomeSC');
  };

  const handleTimePicked = (date) => {
    if (timeForStartOrEnd === 'start') {
      setTaskStartDateTime(
        date.toISOString(),
      );
    } else if (timeForStartOrEnd === 'end') {
      if (date.toISOString() < taskStartDateTime) {
        setTaskEndDateTime(taskStartDateTime);
      } else {
        setTaskEndDateTime(date.toISOString());
      }
    }
    setDateTimePicker({ visible: false, mode: 'datetime' });
  };

  const allDayHandler = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setAllDay((previousState) => !previousState);
  };

  const inputTitle = (
    <View
      style={styles.rowItem}
    >
      <View style={styles.taskIcon}>
        <View style={[styles.taskTitleIcon, { backgroundColor: taskColor.current }]} />
      </View>
      <TextInput
        style={styles.taskFontSize}
        onChangeText={(text) => setTitle(text)}
        value={title}
        placeholder="What is on your mind"
      />
    </View>
  );
  const inputAllday = (
    <View
      style={styles.rowItem}
    >
      {taskIcon('clockcircleo')}
      <Text style={styles.taskFontSize}>All day</Text>
      <Switch
        style={styles.alldaySwitch}
        value={allDay}
        onValueChange={allDayHandler}
      />
    </View>
  );

  const displayHowFarFromToday = 'this Friday';
  const displayHowLong = 'One Day';
  const inputAllDayPanel = (
    <View style={[styles.rowItem, styles.alldayPanel]}>
      <TouchableOpacity
        style={styles.daytimePanel}
        onPress={() => {
          setTimeForStartOrEnd('start');
          setDateTimePicker({ visible: true, mode: 'date' });
        }}
      >
        <Text>Start</Text>
        <Text>{moment(taskStartDateTime).format('ddd, D MMM')}</Text>
        <Text>{displayHowFarFromToday}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.daytimePanel}
        onPress={() => {
          setTimeForStartOrEnd('end');
          setDateTimePicker({ visible: true, mode: 'date' });
        }}
      >
        <Text>End</Text>
        <Text>{moment(taskEndDateTime).format('ddd, D MMM')}</Text>
        <Text>{displayHowLong}</Text>
      </TouchableOpacity>
    </View>
  );
  const inputNotAllDayPanel = (
    <View
      style={[styles.rowItem, styles.notAlldayPanel]}
    >
      <TouchableOpacity
        onPress={() => {
          setTimeForStartOrEnd('start');
          setDateTimePicker({ visible: true, mode: 'datetime' });
        }}
        style={styles.daytimePanel}
      >
        <Text>Start</Text>
        <Text>
          {moment(taskStartDateTime).format('M/D h:mmA')}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          setTimeForStartOrEnd('end');
          setDateTimePicker({ visible: true, mode: 'datetime' });
        }}
        style={styles.daytimePanel}
      >
        <Text>End</Text>
        <Text>
          {moment(taskEndDateTime).format('M/D h:mmA')}
        </Text>
      </TouchableOpacity>
    </View>
  );
  const inputDateTime = () => {
    if (allDay === false) {
      return inputNotAllDayPanel;
    }
    return inputAllDayPanel;
  };

  const inputAlarm = (
    <TouchableOpacity
      style={styles.rowItem}
      onPress={() => navigation.navigate(
        'TaskAlarmSC',
        { alarmTime },
      )}
    >
      {taskIcon('bells')}
      <Text style={styles.taskFontSize}>Alarm</Text>
      <ItemChevron
        text={alarmTime.text}
      />
    </TouchableOpacity>
  );

  const inputLocation = (
    <TouchableOpacity
      style={styles.rowMargin}
      onPress={() => {
        navigation.navigate(
          'TaskLocationSC', { locationAddress },
        );
      }}
    >
      {locationAddress.selected
        ? (
          <MapPreview
            style={styles.mapPreview}
            location={locationAddress.location}
          />
        )
        : null}
      <View
        style={[styles.rowItem, styles.noMarginTop]}
      >
        {taskIcon('enviromento')}
        <Text style={styles.taskFontSize}>
          {locationAddress.selected ? locationAddress.address : 'Location'}
        </Text>
        <ItemChevron />
      </View>
    </TouchableOpacity>
  );

  const inputRepeat = (
    <TouchableOpacity
      style={styles.rowItem}
      onPress={() => navigation.navigate(
        'TaskRepeatSC',
        {
          selectedDate: moment(taskStartDateTime).format('YYYY-MM-DD'),
          repeatRule,
          currentInterval: { mode: repeatRule.repeat, value: repeatRule.interval },
          repeatUntilDate: repeatRule.until,
          onDaysRule: { mode: repeatRule.repeat, days: repeatRule.onDays },
        },
      )}

    >
      {taskIcon('sync')}
      <Text style={styles.taskFontSize}>Repeat</Text>
      <ItemChevron
        text={repeatRule.text}
      />
    </TouchableOpacity>
  );

  const inputNote = (
    <View
      style={styles.rowItem}
    >
      {taskIcon('menuunfold')}
      <TextInput
        style={styles.taskFontSize}
        onChangeText={(text) => setNotesText(text)}
        value={notesText}
        placeholder="Enter notes about the task."
      />
    </View>
  );
  const inputCreateTask = (
    <View
      style={styles.createTaskButton}
    >
      <TouchableOpacity
        onPress={createTask}
      >
        <Text style={styles.taskFontSize}>Create</Text>
      </TouchableOpacity>
    </View>
  );
  const inputDateTimePicker = (
    <DateTimePicker
      isVisible={dateTimePicker.visible}
      onConfirm={handleTimePicked}
      onCancel={() => setDateTimePicker({ visible: false, mode: 'datetime' })}
      mode={dateTimePicker.mode}
      date={new Date(taskStartDateTime)}
    />
  );
  return (
    <>
      {inputDateTimePicker}
      <View style={styles.container}>
        <ScrollView>
          <View>
            {inputTitle}
            {inputAllday}
            {inputDateTime()}
            {inputAlarm}
            {inputLocation}
            {/* inputPeople */}
            {inputRepeat}
            {inputNote}
            {inputCreateTask}
          </View>
        </ScrollView>
      </View>
    </>
  );
};

const BACKGROUND_COLOR = '#eaeef7';
const ROW_BACKGROUND_COLOR = 'white';
const TASK_FONT_SIZE = 18;

const styles = StyleSheet.create({
  alldayPanel: {
    height: 60,
    marginTop: 0,
    paddingLeft: 70,
  },
  alldaySwitch: {
    position: 'absolute',
    right: 10,
  },
  container: {
    backgroundColor: BACKGROUND_COLOR,
    flex: 1,
  },
  createTaskButton: {
    alignItems: 'center',
    backgroundColor: ROW_BACKGROUND_COLOR,
    justifyContent: 'center',
    marginVertical: 25,
    paddingVertical: 12,
  },
  daytimePanel: {
    height: '100%',
    justifyContent: 'center',
    width: '50%',
  },
  mapPreview: {
    height: 100,
    width: '100%',
  },
  noMarginTop: {
    marginTop: 0,
  },
  notAlldayPanel: {
    height: 50,
    marginTop: 0,
    paddingLeft: 70,
  },
  rowItem: {
    alignItems: 'center',
    backgroundColor: ROW_BACKGROUND_COLOR,
    flexDirection: 'row',
    marginTop: 25,
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  rowMargin: {
    marginTop: 25,
  },
  taskFontSize: {
    fontSize: TASK_FONT_SIZE,
  },
  taskIcon: {
    paddingHorizontal: 15,
  },
  taskTitleIcon: {
    borderRadius: 25,
    height: 20,
    width: 20,
  },
});

export default TaskCreateSC;
