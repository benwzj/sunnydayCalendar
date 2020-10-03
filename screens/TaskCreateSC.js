import React, { useEffect, useState } from 'react';
import {
  Text,
  Image,
  View,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  TextInput,
  Keyboard,
  Switch,
  StyleSheet,
  Alert
} from 'react-native';
import { CalendarList } from 'react-native-calendars';
import moment from 'moment';
import * as ExpoCalendar from 'expo-calendar';
import * as Localization from 'expo-localization';
import Constants from 'expo-constants';
import DateTimePicker from 'react-native-modal-datetime-picker';
import uuid from 'uuid';
import {useDispatch, useSelector} from 'react-redux'

import { Context } from '../data/Context';
import CButton from '../components/CButton'
import {
  setupTasks, 
  addTask,
  updateTask, 
  deleteTask
} from '../store/actions/tasks'

const { width: vw } = Dimensions.get('window');
// moment().format('YYYY/MM/DD')

const TaskCreateSC =(props) => {
  let createdEventID = ''
  const dispatch = useDispatch ()
  const tasks = useSelector (state => state.tasks)
  const [keyboardHeight, setKeyboardHeight] = useState (0)
  const [visibleHeight, setVisibleHeight] = useState (Dimensions.get('window').height)
  const [isAlarmSet, setIsAlermSet] = useState (false)
  const [taskText, setTaskText] = useState ('')
  const [notesText, setNotesText] = useState ('')
  const [alarmTime, setAlarmTime] = useState (moment().format())
  const [isDateTimePickerVisible, setIsDateTimePickerVisible] = useState (false)
  const [selectedDay, setSelectedDay] = useState({
    [`${moment().format('YYYY')}-${moment().format('MM')}-${moment().format(
      'DD'
    )}`]: {
      selected: true,
      selectedColor: '#2E66E7',
    },
  })
  const [currentDay, setCurrentDay] = useState( moment().format())
  const { navigation, route } = props

  useEffect(() => {
    Keyboard.addListener("keyboardDidShow", _keyboardDidShow);
    Keyboard.addListener("keyboardDidHide", _keyboardDidHide);

    // cleanup function
    return () => {
      Keyboard.removeListener("keyboardDidShow", _keyboardDidShow);
      Keyboard.removeListener("keyboardDidHide", _keyboardDidHide);
    };
  }, [])

  const _keyboardDidShow = e => {
    setKeyboardHeight( e.endCoordinates.height )
    setVisibleHeight (
      Dimensions.get('window').height - e.endCoordinates.height - 30)
  };

  const _keyboardDidHide = () => {
    setVisibleHeight ( Dimensions.get('window').height )
  };

  const _synchronizeCalendar = async value => {
    const { createNewCalendar } = route.params;
    const calendarId = await createNewCalendar();
    try {
      createdEventID = await _addEventsToCalendar(calendarId);

      _handleCreateEventData(value);

    } catch (e) {
      Alert.alert(e.message);
    }
  };

  const _handleAlarmSet = () => {
    setIsAlermSet(previousState => !previousState)
  };

  const createTask = () =>{
    //console.log( 'createTask -- ', tasks)
    const task = {
      calendarId: tasks.calendarId,
      title: taskText,
      notes: notesText,
      startDate: moment(alarmTime).add(0, 'm').toDate(),
      endDate: moment(alarmTime).add(2, 'm').toDate(),
      alarmOn: true,
      timeZone: Localization.timezone,
      color: `rgb(${Math.floor(
        Math.random() * Math.floor(256)
      )},${Math.floor(Math.random() * Math.floor(256))},${Math.floor(
        Math.random() * Math.floor(256)
      )})`,
    }
    //console.log( 'createTask -- ', task)
    dispatch ( addTask(task) )
    navigation.navigate ('TaskHomeSC');
  }

  const _addEventsToCalendar = async calendarId => {
    const event = {
      title: taskText,
      notes: notesText,
      startDate: moment(alarmTime)
        .add(0, 'm')
        .toDate(),
      endDate: moment(alarmTime)
        .add(5, 'm')
        .toDate(),
      timeZone: Localization.timezone,
    };

    try {
      const eventID = await ExpoCalendar.createEventAsync(
        calendarId.toString(),
        event
      );

      return eventID;
    } catch (error) {
      console.log(error);
    }
  };

  const _showDateTimePicker = () => setIsDateTimePickerVisible(true);

  const _hideDateTimePicker = () => setIsDateTimePickerVisible(false);

  const _handleCreateEventData = async value => {

    const { updateCurrentTask, currentDate } = route.params;
    const creatTodo = {
      key: uuid(),
      date: `${moment(currentDay).format('YYYY')}-${moment(currentDay).format(
        'MM'
      )}-${moment(currentDay).format('DD')}`,
      todoList: [
        {
          key: uuid(),
          title: taskText,
          notes: notesText,
          alarm: {
            time: alarmTime,
            isOn: isAlarmSet,
            createdEventID
          },
          color: `rgb(${Math.floor(
            Math.random() * Math.floor(256)
          )},${Math.floor(Math.random() * Math.floor(256))},${Math.floor(
            Math.random() * Math.floor(256)
          )})`,
        },
      ],
      markedDot: {
        date: currentDay,
        dots: [
          {
            key: uuid(),
            color: '#2E66E7',
            selectedDotColor: '#2E66E7',
          },
        ],
      },
    };
    //console.log('value: ', value, value.updateTodo)
    await value.updateTodo(creatTodo);
    await updateCurrentTask(currentDate);
    navigation.navigate('TaskHomeSC');
  };

  const _handleDatePicked = date => {

    const selectedDatePicked = currentDay;
    const hour = moment(date).hour();
    const minute = moment(date).minute();
    const newModifiedDay = moment(selectedDatePicked)
      .hour(hour)
      .minute(minute);

      setAlarmTime(newModifiedDay)


    _hideDateTimePicker();
  };
    return (
      <Context.Consumer>
        {todoStore => (
          <>
            <DateTimePicker
              isVisible={isDateTimePickerVisible}
              onConfirm={_handleDatePicked}
              onCancel={_hideDateTimePicker}
              mode="time"
            />
            <View style={styles.container}>
              <View
                style={{
                  height: visibleHeight,
                }}
              >
                <ScrollView
                  contentContainerStyle={{
                    paddingBottom: 230,
                  }}
                >
                  <View style={styles.calenderContainer}>
                    <CalendarList
                      style={{
                        width: 350,
                        height: 350,
                      }}
                      current={currentDay}
                      minDate={moment().format()}
                      horizontal
                      pastScrollRange={0}
                      pagingEnabled
                      calendarWidth={350}
                      onDayPress={day => {
                          setSelectedDay ({
                            [day.dateString]: {
                              selected: true,
                              selectedColor: '#2E66E7',
                            },
                          })
                          setCurrentDay (day.dateString)
                          setAlarmTime (day.dateString)
                      }}
                      monthFormat="yyyy MMMM"
                      hideArrows
                      markingType="simple"
                      theme={{
                        selectedDayBackgroundColor: '#2E66E7',
                        selectedDayTextColor: '#ffffff',
                        todayTextColor: '#2E66E7',
                        backgroundColor: '#eaeef7',
                        calendarBackground: '#eaeef7',
                        textDisabledColor: '#d9dbe0',
                      }}
                      markedDates={selectedDay}
                    />
                  </View>
                  <View style={styles.taskContainer}>
                    <TextInput
                      style={styles.title}
                      onChangeText={text => setTaskText(text)}
                      value={taskText}
                      placeholder="what is in your mind"
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
                      <Text style={styles.notes}>Notes</Text>
                      <TextInput
                        style={{
                          height: 25,
                          fontSize: 19,
                          marginTop: 3,
                        }}
                        onChangeText={text =>setNotesText( text )}
                        value={notesText}
                        placeholder="Enter notes about the task."
                      />
                    </View>
                    <View style={styles.seperator} />
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
                        onPress={() => _showDateTimePicker()}
                        style={{
                          height: 25,
                          marginTop: 3,
                        }}
                      >
                        <Text style={{ fontSize: 19 }}>
                          {moment(alarmTime).format('h:mm A')}
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <View style={styles.seperator} />
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
                            {moment(alarmTime).format('h:mm A')}
                          </Text>
                        </View>
                      </View>
                      <Switch
                        value={isAlarmSet}
                        onValueChange={_handleAlarmSet}
                      />
                    </View>
                  </View>
                  <CButton 
                    disabled={taskText === ''}
                    style={{
                      backgroundColor:
                        taskText === ''
                          ? 'rgba(46, 102, 231,0.5)'
                          : '#2E66E7',
                    }}
                    onPress={
                      // async () => {
                      //   if (isAlarmSet) {
                      //     await _synchronizeCalendar(todoStore);
                      //   }
                      //   if (!isAlarmSet) {
                      //     _handleCreateEventData(todoStore);
                      //   }
                      // }
                      createTask
                    }
                    title='Confirm to create'
                  />
                </ScrollView>
              </View>
            </View>
          </>
        )}
      </Context.Consumer>
    );
}


const styles = StyleSheet.create({
  seperator: {
    height: 0.5,
    width: '100%',
    backgroundColor: '#979797',
    alignSelf: 'center',
    marginVertical: 20,
  },
  notes: {
    color: '#9CAAC4',
    fontSize: 16,
    fontWeight: '600',
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
    height: 400,
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
  calenderContainer: {
    marginTop: 30,
    width: 350,
    height: 350,
    alignSelf: 'center',
  },
  newTask: {
    alignSelf: 'center',
    fontSize: 20,
    width: 120,
    height: 25,
    textAlign: 'center',
  },
  backButton: {
    flexDirection: 'row',
    marginTop: 60,
    width: '100%',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#eaeef7',
  },
});

export default TaskCreateSC 