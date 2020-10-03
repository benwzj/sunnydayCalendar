import React, { useState, useEffect } from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  Text,
  Dimensions,
  TextInput,
  Switch,
  StyleSheet,
  Alert,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import moment from 'moment';
import * as ExpoCalendar from 'expo-calendar';
import * as Localization from 'expo-localization';
import Constants from 'expo-constants';
import CalendarStrip from 'react-native-calendar-strip';
import DateTimePicker from 'react-native-modal-datetime-picker';
import {useSelector, useDispatch} from 'react-redux'

import { Context } from '../data/Context';
import CModal from '../components/CModal'
import TaskBrief from '../components/TaskBrief'
import CButton from '../components/CButton'
import {
  setupTasks, 
  addTask,
  updateTask, 
  deleteTask
} from '../store/actions/tasks'

const TaskHomeSC = (props) =>{
  const [currentDate, setCurrentDate] = useState (`${moment().format('YYYY')}-${moment().format(
    'MM')}-${moment().format('DD')}`) 
  const dateTaskList = useSelector (state => {
    const dateTask = state.tasks.taskList.find ( task => task.date === currentDate)
    if ( dateTask ) {
      return dateTask.dateTaskList 
    }else {
      return []
    }
  })
  const [todoList, setTodoList] = useState ([])
  const [selectedTask, setSelectedTask] = useState (null)
   
  const [markedDate, setMarkedDate] = useState ([])

  const [isModalVisible, setIsModalVisible] = useState (false)
  const [isDateTimePickerVisible, setIsDateTimePickerVisible] = useState(false)
  const { navigation } = props
  const dispatch = useDispatch ()

  useEffect(()=> {
    //_handleDeletePreviousDayTask()
    (async () =>{
      await dispatch (setupTasks()) 
    })()
    //updateTaskListForDate (currentDate)
  },[])

  const _handleDeletePreviousDayTask = async () => {
    try {
      const value = await AsyncStorage.getItem('TODO');

      if (value !== null) {
        const todoList = JSON.parse(value);
        const todayDate = `${moment().format('YYYY')}-${moment().format(
          'MM'
        )}-${moment().format('DD')}`;
        const checkDate = moment(todayDate);
        await todoList.filter(item => {
          const currDate = moment(item.date);
          const checkedDate = checkDate.diff(currDate, 'days');
          if (checkedDate > 0) {
            item.todoList.forEach(async listValue => {
              try {
                await ExpoCalendar.deleteEventAsync(
                  listValue.alarm.createdEventID.toString()
                );
              } catch (error) {
                console.log(error);
              }
            });
            return false;
          }
          return true;
        });

        // await AsyncStorage.setItem('TODO', JSON.stringify(updatedList));
        _updateCurrentTask(currentDate);
      }
    } catch (error) {
      // Error retrieving data
    }
  };

  const _handleModalVisible = () => {
    setIsModalVisible (state=>!state);
  };

  // const updateTaskListForDate = (date) =>{
  //   const dateTask = tasks.taskList.find( task => task.date === date)
  //   if ( dateTask ) {
  //     setTodoList ( dateTask.dateTaskList )
  //   }else {
  //     setTodoList ([])
  //   }
  // }

  const _updateCurrentTask = async currentDate => {
    try {
      const value = await AsyncStorage.getItem('TODO');
      if (value !== null) {
        const todoList = JSON.parse(value);
        const markDot = todoList.map(item => item.markedDot);
        const todoLists = todoList.filter(item => {
          if (currentDate === item.date) {
            return true;
          }
          return false;
        });
        if (todoLists.length !== 0) {
            setMarkedDate ( markDot )
            setTodoList ( todoLists[0].todoList )

        } else {
          setMarkedDate ( markDot )
          setTodoList ( [] )
        }
      }
    } catch (error) {
      // Error retrieving data
    }
  };

  const _showDateTimePicker = () => setIsDateTimePickerVisible (true)

  const _hideDateTimePicker = () => setIsDateTimePickerVisible (false)

  const _handleDatePicked = date => {
    const prevSelectedTask = { ...selectedTask };
    const hour = moment(date).hour();
    const minute = moment(date).minute();
    const newModifiedDay = moment(prevSelectedTask.startDate)
      .hour(hour)
      .minute(minute);
    
    prevSelectedTask.startDate = newModifiedDay;
    console.log ( '_handleDatePicked', prevSelectedTask )
    setSelectedTask ( prevSelectedTask )
    
    setIsDateTimePickerVisible (false)
  };

  const _handleAlarmSet = () => {
    const prevSelectedTask = { ...selectedTask };
    prevSelectedTask.alarmOn = !prevSelectedTask.alarmOn;
    setSelectedTask ( prevSelectedTask )
  };

  const _updateAlarm = async () => {
    const event = {
      title: selectedTask.title,
      notes: selectedTask.notes,
      startDate: moment(selectedTask.alarm.time)
        .add(0, 'm')
        .toDate(),
      endDate: moment(selectedTask.alarm.time)
        .add(5, 'm')
        .toDate(),
      timeZone: Localization.timezone,
    };

    if (selectedTask.alarm.createdEventID === '') {
      try {
        const calendarId = await _createNewCalendar();
        const createEventAsyncRes = await ExpoCalendar.createEventAsync(
          calendarId.toString(),
          event
        );
        const updateTask = { ...selectedTask };
        updateTask.alarm.createdEventID = createEventAsyncRes;
        setSelectedTask ( updateTask )
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        await ExpoCalendar.updateEventAsync(
          selectedTask.alarm.createdEventID.toString(),
          event
        );
      } catch (error) {
        console.log(error);
      }
    }
  };

  const _deleteAlarm = async () => {
    console.log(selectedTask.alarm);

    try {
      await ExpoCalendar.deleteEventAsync(selectedTask.alarm.createdEventID);

      const updateTask = { ...selectedTask };
      updateTask.alarm.createdEventID = '';
      setSelectedTask ( updateTask )
    } catch (error) {
      console.log(error);
    }
  };

  const _getEvent = async () => {
    if (selectedTask.alarm.createdEventID) {
      try {
        await ExpoCalendar.getEventAsync(
          selectedTask.alarm.createdEventID.toString()
        );
      } catch (error) {
        console.log(error);
      }
    }
  };

  const _createNewCalendar = async () => {
    const calendars = await ExpoCalendar.getCalendarsAsync();
    const newCalendar = {
      title: 'test',
      entityType: ExpoCalendar.EntityTypes.EVENT,
      color: '#2196F3',
      sourceId:
        Platform.OS === 'ios'
          ? calendars.find(cal => cal.source && cal.source.name === 'Default')
              .source.id
          : undefined,
      source:
        Platform.OS === 'android'
          ? {
              name: calendars.find(
                cal => cal.accessLevel === ExpoCalendar.CalendarAccessLevel.OWNER
              ).source.name,
              isLocalAccount: true,
            }
          : undefined,
      name: 'test',
      accessLevel: ExpoCalendar.CalendarAccessLevel.OWNER,
      ownerAccount:
        Platform.OS === 'android'
          ? calendars.find(
              cal => cal.accessLevel === ExpoCalendar.CalendarAccessLevel.OWNER
            ).ownerAccount
          : undefined,
    };

    let calendarId = null;

    try {
      calendarId = await ExpoCalendar.createCalendarAsync(newCalendar);
    } catch (e) {
      Alert.alert(e.message);
    }

    return calendarId;
  };

  return (
    <Context.Consumer>
      {todoStore => (
        <>
          {selectedTask !== null && (
            <CModal isModalVisible={isModalVisible}>
              <DateTimePicker
                isVisible={isDateTimePickerVisible}
                onConfirm={_handleDatePicked}
                onCancel={() => setIsDateTimePickerVisible (false)}
                mode="time"
              />
              <View style={styles.taskContainer}>
                <TextInput
                  style={styles.title}
                  onChangeText={text => {
                    const prevSelectedTask = { ...selectedTask };
                    prevSelectedTask.title = text;
                    setSelectedTask ( prevSelectedTask )
                  }}
                  value={selectedTask.title}
                  placeholder="What is in your mind!?"
                />
                <Text
                  style={{
                    fontSize: 14,
                    color: '#BDC6D8',
                    marginVertical: 10,
                  }}
                >
                  Suggestion
                </Text>
                <View style={{ flexDirection: 'row' }}>
                  <View style={styles.readBook}>
                    <Text style={{ textAlign: 'center', fontSize: 14 }}>
                      Read book
                    </Text>
                  </View>
                  <View style={styles.design}>
                    <Text style={{ textAlign: 'center', fontSize: 14 }}>
                      Design
                    </Text>
                  </View>
                  <View style={styles.learn}>
                    <Text style={{ textAlign: 'center', fontSize: 14 }}>
                      Learn
                    </Text>
                  </View>
                </View>
                <View style={styles.notesContent} />
                <View>
                  <Text
                    style={{
                      color: '#9CAAC4',
                      fontSize: 16,
                      fontWeight: '600',
                    }}
                  >
                    Notes
                  </Text>
                  <TextInput
                    style={{
                      height: 25,
                      fontSize: 19,
                      marginTop: 3,
                    }}
                    onChangeText={text => {
                      const prevSelectedTask = { ...selectedTask };
                      prevSelectedTask.notes = text;
                      setSelectedTask ( prevSelectedTask )
                    }}
                    value={selectedTask.notes}
                    placeholder="Enter notes about the task."
                  />
                </View>
                <View style={styles.sepeerator} />
                <View>
                  <Text
                    style={{
                      color: '#9CAAC4',
                      fontSize: 16,
                      fontWeight: '600',
                    }}
                  >
                    Times
                  </Text>
                  <TouchableOpacity
                    onPress={() => setIsDateTimePickerVisible (true)}
                    style={{
                      height: 25,
                      marginTop: 3,
                    }}
                  >
                    <Text style={{ fontSize: 19 }}>
                      {moment(selectedTask.startTime).format('h:mm A')}
                    </Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.sepeerator} />
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <View>
                    <Text
                      style={{
                        color: '#9CAAC4',
                        fontSize: 16,
                        fontWeight: '600',
                      }}
                    >
                      Alarm
                    </Text>
                    <View
                      style={{
                        height: 25,
                        marginTop: 3,
                      }}
                    >
                      <Text style={{ fontSize: 19 }}>
                        {/* {moment(selectedTask.alarm.time).format('h:mm A')} */}
                        {moment(selectedTask.startTime).format('h:mm A')}
                      </Text>
                    </View>
                  </View>
                  <Switch
                    value={selectedTask.alarmOn}
                    onValueChange={_handleAlarmSet}
                  />
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <CButton 
                    onPress = {async () => {
                      //console.log('update button: ', selectedTask )
                      setIsModalVisible (state=>!state)
                      dispatch (updateTask (selectedTask))
                    }}
                    title = "UPDATE"
                    style = {{backgroundColor: '#2E66E7'}}
                  />
                  <CButton 
                    onPress = {async () => {
                      setIsModalVisible (state=>!state);
                      dispatch ( deleteTask (selectedTask))
                      //_deleteAlarm();
                      // await todoStore.deleteSelectedTask({
                      //   date: currentDate,
                      //   todo: selectedTask,
                      // });
                      // _updateCurrentTask(currentDate);
                    }}
                    title = "DELETE"
                    style = {{backgroundColor: '#ff6347'}}
                  />
                </View>
              </View>
            </CModal>
          )}
          <View
            style={{
              flex: 1,
              paddingTop: Constants.statusBarHeight,
            }}
          >
            <CalendarStrip
              // ref={ref => {
              //   calenderRef = ref;
              // }}
              calendarAnimation={{ type: 'sequence', duration: 30 }}
              daySelectionAnimation={{
                type: 'background',
                duration: 200,
                highlightColor: '#ffffff',
              }}
              style={{
                height: 150,
                paddingTop: 20,
                paddingBottom: 20,
              }}
              calendarHeaderStyle={{ color: '#000000' }}
              dateNumberStyle={{ color: '#000000', paddingTop: 10 }}
              dateNameStyle={{ color: '#BBBBBB' }}
              highlightDateNumberStyle={{
                color: '#fff',
                backgroundColor: '#2E66E7',
                marginTop: 10,
                height: 35,
                width: 35,
                textAlign: 'center',
                borderRadius: 17.5,
                overflow: 'hidden',
                paddingTop: 6,
                fontWeight: '400',
                justifyContent: 'center',
                alignItems: 'center',
              }}
              highlightDateNameStyle={{ color: '#2E66E7' }}
              disabledDateNameStyle={{ color: 'grey' }}
              disabledDateNumberStyle={{ color: 'grey', paddingTop: 10 }}
              datesWhitelist={[
                {
                  start: moment(),
                  end: moment().add(365, 'days'), 
                },
              ]}
              iconLeft={require('../assets/left-arrow.png')}
              iconRight={require('../assets/right-arrow.png')}
              iconContainer={{ flex: 0.1 }}
              markedDates={markedDate}
              onDateSelected={date => {
                const selectedDate = `${moment(date).format('YYYY')}-${moment(
                  date
                ).format('MM')}-${moment(date).format('DD')}`;
                //_updateCurrentTask(selectedDate);
                //updateTaskListForDate (selectedDate)
                setCurrentDate ( selectedDate )
              }}
            />
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('TaskCreateSC', {
                  updateCurrentTask: _updateCurrentTask,
                  currentDate,
                  createNewCalendar: _createNewCalendar,
                })
              }
              style={styles.CreateTask}
            >
              <Image
                source={require('../assets/plus.png')}
                style={{height: 30, width: 30}}
              />
            </TouchableOpacity>
            <View
              style={{
                width: '100%',
                height: Dimensions.get('window').height - 170,
              }}
            >
              <ScrollView
                contentContainerStyle={{
                  paddingBottom: 20,
                }}
              >
                {//todoList.map(item => (
                  dateTaskList.map(item=>(
                  <TaskBrief 
                    onTaskPress = {() => { 
                        setSelectedTask (item)
                        setIsModalVisible (true)
                        //_getEvent(item);
                    }}
                    item = {item}
                    key = {item.ID}
                  />
                ))}
              </ScrollView>
            </View>
          </View>
        </>
      )}
    </Context.Consumer>
  );
}


const styles = StyleSheet.create({
  CreateTask: {
    position: 'absolute',
    bottom: 40,
    right: 17,
    height: 60,
    width: 60,
    backgroundColor: '#2E66E7',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#2E66E7',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowRadius: 30,
    shadowOpacity: 0.5,
    elevation: 5,
    zIndex: 999,
  },
  sepeerator: {
    height: 0.5,
    width: '100%',
    backgroundColor: '#979797',
    alignSelf: 'center',
    marginVertical: 20,
  },
  notesContent: {
    height: 0.5,
    width: '100%',
    backgroundColor: '#979797',
    alignSelf: 'center',
    marginVertical: 20,
  },
  learn: {
    height: 23,
    width: 51,
    backgroundColor: '#F8D557',
    justifyContent: 'center',
    borderRadius: 5,
  },
  design: {
    height: 23,
    width: 59,
    backgroundColor: '#62CCFB',
    justifyContent: 'center',
    borderRadius: 5,
    marginRight: 7,
  },
  readBook: {
    height: 23,
    width: 83,
    backgroundColor: '#4CD565',
    justifyContent: 'center',
    borderRadius: 5,
    marginRight: 7,
  },
  title: {
    height: 25,
    borderColor: '#5DD976',
    borderLeftWidth: 1,
    paddingLeft: 8,
    fontSize: 19,
  },
  taskContainer: {
    height: 475,
    width: 327,
    alignSelf: 'center',
    borderRadius: 20,
    shadowColor: '#2E66E7',
    backgroundColor: '#ffffff',
    shadowOffset: {
      width: 3,
      height: 3,
    },
    shadowRadius: 20,
    shadowOpacity: 0.2,
    elevation: 5,
    padding: 22,
  },
});

export default TaskHomeSC