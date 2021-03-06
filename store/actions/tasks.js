/* eslint-disable no-console */
import { Platform } from 'react-native';
import * as ExpoCalendar from 'expo-calendar';
import AsyncStorage from '@react-native-community/async-storage';

export const SETUP_TASKS = 'SETUP_TASKS';
export const ADD_TASK = 'ADD_TASK';
export const DELETE_TASK = 'DELETE_TASK';
export const UPDATE_TASK = 'UPDATE_TASKS';
export const SUNNYDAY_TASKS = 'SUNNYDAY_TASKS';

async function createCalendar() {
  const calendars = await ExpoCalendar.getCalendarsAsync();
  const defaultCalendars = calendars.filter((each) => each.source.name === 'Default'
    || each.source.name === 'iCloud');
  const iosSource = defaultCalendars[0].source;

  const defaultCalendarSource = Platform.OS === 'ios'
    ? iosSource
    : { isLocalAccount: true, name: 'Sunnyday Calendar' };

  const newCalendarId = await ExpoCalendar.createCalendarAsync({
    title: 'Sunnyday Calendar',
    color: 'blue',
    entityType: ExpoCalendar.EntityTypes.EVENT,
    sourceId: defaultCalendarSource.id,
    source: defaultCalendarSource,
    name: 'internalCalendarName',
    ownerAccount: 'personal',
    accessLevel: ExpoCalendar.CalendarAccessLevel.OWNER,
  });
  return newCalendarId;
}

export const setupTasks = () => async (dispatch) => {
  try {
    const tasksString = await AsyncStorage.getItem(SUNNYDAY_TASKS);
    if (tasksString) {
      dispatch({ type: SETUP_TASKS, payload: JSON.parse(tasksString) });
    } else {
      const calPermResponse = await ExpoCalendar.getCalendarPermissionsAsync();
      const remPermResponse = await ExpoCalendar.getRemindersPermissionsAsync();
      const calendarId = await createCalendar();
      const tasks = {
        permission: {
          statusCale: calPermResponse.status,
          statusRemi: remPermResponse.status,
        },
        calendarTitle: 'Sunnyday Calendar',
        calendarId,
        taskList: [],
      };
      await AsyncStorage.setItem(SUNNYDAY_TASKS, JSON.stringify(tasks));
      dispatch({ type: SETUP_TASKS, payload: tasks });
    }
  } catch (err) {
    console.log('something wrong at setupTasks Action', err);
    throw err;
  }
};

const getRecurrentRule = (repeatRule) => {
  const rule = { frequency: repeatRule.repeat };
  const weekDays = [
    'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thurday', 'Friday', 'Saturday',
  ];
  if (repeatRule.repeat === 'daily') {
    rule.interval = repeatRule.interval;
    if (repeatRule.until) {
      rule.endDate = new Date(repeatRule.until);// new Date('2020-11-20') // create UTC datetime
    }
  } else if (repeatRule.repeat === 'weekly') {
    rule.interval = repeatRule.interval;
    rule.daysOfTheWeek = repeatRule.onDays.map(
      (day) => ({
        dayOfTheWeek: weekDays.findIndex((d) => d === day) + 1,
      }),
    );
    if (repeatRule.until) {
      rule.endDate = new Date(repeatRule.until);
    }
  } else if (repeatRule.repeat === 'monthly') {
    rule.interval = repeatRule.interval;
    rule.daysOfTheMonth = repeatRule.onDays.map((day) => parseInt(day, 10));
    if (repeatRule.until) {
      rule.endDate = new Date(repeatRule.until);
    }
  } else if (repeatRule.repeat === 'yearly') {
    rule.interval = repeatRule.interval;
    if (repeatRule.until) {
      rule.endDate = new Date(repeatRule.until);
    }
  }
  // recurrenRule works in expo for weekly. But looks not working for monthly
  console.log('recurrentRule: ', rule);
  return rule;
};

export const addTask = (task) => async (dispatch) => {
  try {
    const taskId = await ExpoCalendar.createEventAsync(
      task.calendarId,
      {
        title: task.title,
        startDate: task.startDateTime,
        endDate: task.endDateTime,
        alarms: task.alarmTime.time > 0 ? [] : [{ relativeOffset: task.alarmTime.time }],
        allDay: task.allDay,
        notes: task.notes,
        timeZone: task.timeZone,
        location: task.locationAddress.address,
        recurrenceRule: getRecurrentRule(task.repeatRule),
      },
    );
    // console.log('ExpoCalendar.Frequency:',ExpoCalendar.Frequency)
    const tasksString = await AsyncStorage.getItem(SUNNYDAY_TASKS);
    const tasks = JSON.parse(tasksString);
    tasks.taskList.push({ ...task, ID: taskId });
    await AsyncStorage.setItem(SUNNYDAY_TASKS, JSON.stringify(tasks));

    dispatch({ type: ADD_TASK, payload: { ...task, ID: taskId } });
  } catch (err) {
    console.log('addTask err:', err);
    throw err;
  }
};

export const updateTask = (task) => async (dispatch) => {
  try {
    await ExpoCalendar.updateEventAsync(
      task.ID,
      {
        title: task.title,
        startDate: task.startDateTime,
        endDate: task.endDateTime,
        // alarms: {relativeOffset: 2},
        notes: task.notes,
        timeZone: task.timeZone,
      },
    );

    const tasksString = await AsyncStorage.getItem(SUNNYDAY_TASKS);
    const tasks = JSON.parse(tasksString);
    const selectedTask = tasks.taskList.find(
      (item) => item.ID === task.ID,
    );
    if (selectedTask) {
      Object.assign(selectedTask, task);
      await AsyncStorage.setItem(SUNNYDAY_TASKS, JSON.stringify(
        tasks,
      ));
    } else {
      // can't find the task
      console.log('cant find dateTask object according to date, this is a structure problem, need to redesign the data structure.');
    }
    dispatch({ type: UPDATE_TASK, payload: task });
  } catch (err) {
    console.log('updateTask err:', err);
    throw err;
  }
};

export const deleteTask = (task) => async (dispatch) => {
  try {
    await ExpoCalendar.deleteEventAsync(task.ID);
    const tasksString = await AsyncStorage.getItem(SUNNYDAY_TASKS);
    const tasks = JSON.parse(tasksString);
    const updatedTaskList = tasks.taskList.filter((item) => item.ID !== task.ID);
    tasks.taskList = updatedTaskList;
    await AsyncStorage.setItem(SUNNYDAY_TASKS, JSON.stringify(tasks));

    dispatch({ type: DELETE_TASK, payload: task });
  } catch (err) {
    console.log('deleteTask err:', err);
    throw err;
  }
};
