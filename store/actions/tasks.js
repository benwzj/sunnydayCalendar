import * as ExpoCalendar from 'expo-calendar'
import AsyncStorage from '@react-native-community/async-storage'

export const SETUP_TASKS = 'SETUP_TASKS'
export const ADD_TASK = 'ADD_TASK'
export const DELETE_TASK = 'DELETE_TASK'
export const UPDATE_TASK = 'UPDATE_TASKS'
export const SUNNYDAY_TASKS = 'SUNNYDAY_TASKS'

async function createCalendar() {
  const calendars = await ExpoCalendar.getCalendarsAsync()
  const defaultCalendars = calendars.filter(each => 
    each.source.name === 'Default' ||
    each.source.name === 'iCloud'
  )
  const iosSource = defaultCalendars[0].source
  
  const defaultCalendarSource =
    Platform.OS === 'ios'
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
  return newCalendarId
}

export const setupTasks = () => {
  return async (dispatch) => {
    try {
      const tasksString = await AsyncStorage.getItem (SUNNYDAY_TASKS);
      if (tasksString !== null) {
        dispatch ({ type: SETUP_TASKS, payload: JSON.parse(tasksString) })
      }else {
        const calPermResponse = await ExpoCalendar.getCalendarPermissionsAsync()
        const remPermResponse = await ExpoCalendar.getRemindersPermissionsAsync()
        const calendarId = await createCalendar ()
        const tasks = {
          permission: {
            statusCale: calPermResponse.status,
            statusRemi: remPermResponse.status
          },
          calendarTitle: 'Sunnyday Calendar',
          calendarId: calendarId,
          taskList: []
        }
        await AsyncStorage.setItem (SUNNYDAY_TASKS, JSON.stringify (tasks))
        dispatch ({ type: SETUP_TASKS, payload: tasks })
      }
    } catch (err) {
      throw err;
    }
  }
}

export const addTask = (task) => {
  return async ( dispatch ) => {
    try {
      console.log( 'addTask,task to be add:  ', task)
      const taskId = await ExpoCalendar.createEventAsync(
        task.calendarId,
        {
          title: task.title,
          startDate: task.startDate,
          endDate: task.endDate,
          //alarms: {relativeOffset: 2},
          notes: task.notes,
          timeZone: task.timeZone
        }
      )

      const date = new Date(task.startDate).toISOString().split('T')[0]
      const tasksString = await AsyncStorage.getItem(SUNNYDAY_TASKS);
      const tasks = JSON.parse (tasksString)
      console.log( 'addTask,old tasks from Storage: ', tasks)
      const selectedDateTasks = tasks.taskList.find (
        item => item.date === date
      )
      if ( selectedDateTasks ){
        selectedDateTasks.dateTaskList.push ({...task, ID:taskId})
      }else {
        const newDateTask = {
          date: date,
          dateTaskList: [{...task, ID:taskId}]
        }
        tasks.taskList.push (newDateTask)
      }
      console.log( 'addTask, new tasks to storage: ', tasks)
      await AsyncStorage.setItem ( SUNNYDAY_TASKS, JSON.stringify(tasks) );

      dispatch ({ type: ADD_TASK, payload: {...task, ID:taskId} })
    }catch (err) {
      console.log('addTask err:',err)
      throw err
    }
  }
}

export const updateTask = (task) => {
  return async ( dispatch ) => {
    try {
      await ExpoCalendar.updateEventAsync (
        task.ID,
        {
          title: task.title,
          startDate: task.startDate,
          endDate: task.endDate,
          //alarms: {relativeOffset: 2},
          notes: task.notes,
          timeZone: task.timeZone
        }
      )
      
      const date = new Date(task.startDate).toISOString().split('T')[0]
      const tasksString = await AsyncStorage.getItem (SUNNYDAY_TASKS);
      const tasks = JSON.parse (tasksString)
      const selectedDateTask = tasks.taskList.find (
        item => item.date === date
      )
      if ( selectedDateTask ){
        const selectedTask = selectedDateTask.dateTaskList.find (
          item => item.ID === task.ID
        )
        Object.assign ( selectedTask, task )
        await AsyncStorage.setItem ( SUNNYDAY_TASKS, JSON.stringify(
          tasks
        ));
      }else {
        // can't find the task
        console.log( 'cant find dateTask object according to date, this is a structure problem, need to redesign the data structure.' )
      }
      dispatch ({ type: UPDATE_TASK, payload: task })
    }catch (err) {
      console.log('updateTask err:',err)
      throw err
    }
  }
}

export const deleteTask = ( task ) => {
  return async (dispatch) => {
    try {
      const date = new Date(task.startDate).toISOString().split('T')[0]
      await ExpoCalendar.deleteEventAsync (task.ID);

      const tasksString = await AsyncStorage.getItem (SUNNYDAY_TASKS);
      const tasks = JSON.parse (tasksString)
      const selectedDateTask = tasks.taskList.find (item => item.date===date)
      if ( selectedDateTask ){
        const updatedDateTaskList = selectedDateTask.dateTaskList.filter (
          item => item.ID != task.ID 
        )
        if ( updatedDateTaskList && updatedDateTaskList.length > 0 ){
          selectedDateTask.dateTaskList = updatedDateTaskList
          await AsyncStorage.setItem ( SUNNYDAY_TASKS, JSON.stringify(tasks) )
        }else {
          await AsyncStorage.setItem ( SUNNYDAY_TASKS, JSON.stringify({
            ...tasks,
            taskList: [
              ...tasks.taskList.filter (item => item.date != date)
            ]
          }))
        }
      }else{
        console.log( 'cant find dateTask object according to date, this is a structure problem, need to redesign the data structure.' )
      }

      dispatch ({ type: DELETE_TASK, payload: task })
    } catch (err) {
      console.log('deleteTask err:',err)
      throw err;
    }
  }
}