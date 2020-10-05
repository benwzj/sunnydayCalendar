import React, { useState } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  TextInput,
  Keyboard,
  Switch,
  StyleSheet
} from 'react-native';
import { CalendarList } from 'react-native-calendars';
import moment from 'moment';
import * as Localization from 'expo-localization';
import DateTimePicker from 'react-native-modal-datetime-picker';
import {useDispatch, useSelector} from 'react-redux'
import CButton from '../components/CButton'
import { addTask}  from '../store/actions/tasks'

const { width: vw } = Dimensions.get('window');
// moment().format('YYYY/MM/DD')

const TaskCreateSC =(props) => {
  const dispatch = useDispatch ()
  const { navigation, route } = props
  const tasks = useSelector (state => state.tasks)
  const [taskStartDate, setTaskStartDate] = useState (
    new Date(route.params.currentDate).toISOString()
  )
  // const [keyboardHeight, setKeyboardHeight] = useState (0)
  // const [visibleHeight, setVisibleHeight] = useState (Dimensions.get('window').height)
  const [isAlarmSet, setIsAlermSet] = useState (false)
  const [taskText, setTaskText] = useState ('')
  const [notesText, setNotesText] = useState ('')
  const [isDateTimePickerVisible, setIsDateTimePickerVisible] = useState (false)
  const [selectedDay, setSelectedDay] = useState({
    [`${moment(route.params.currentDate).format(
      'YYYY')}-${moment(route.params.currentDate).format(
      'MM')}-${moment(route.params.currentDate).format(
      'DD' )}`]: {
      selected: true,
      selectedColor: '#2E66E7',
    },
  })

  // useEffect(() => {
  //   Keyboard.addListener("keyboardDidShow", _keyboardDidShow);
  //   Keyboard.addListener("keyboardDidHide", _keyboardDidHide);

  //   // cleanup function
  //   return () => {
  //     Keyboard.removeListener("keyboardDidShow", _keyboardDidShow);
  //     Keyboard.removeListener("keyboardDidHide", _keyboardDidHide);
  //   };
  // }, [])

  // const _keyboardDidShow = e => {
  //   setKeyboardHeight( e.endCoordinates.height )
  //   setVisibleHeight (
  //     Dimensions.get('window').height - e.endCoordinates.height - 30)
  // };

  // const _keyboardDidHide = () => {
  //   setVisibleHeight ( Dimensions.get('window').height )
  // };

  const createTask = () =>{
    const task = {
      calendarId: tasks.calendarId,
      title: taskText,
      notes: notesText,
      startDate: taskStartDate,//alarmTime,//moment(alarmTime).add(0, 'm').toDate(),
      endDate: taskStartDate,//moment(alarmTime).add(2, 'm').toDate(),
      alarmOn: isAlarmSet,
      timeZone: Localization.timezone,
      color: `rgb(${Math.floor(
        Math.random() * Math.floor(256)
      )},${Math.floor(Math.random() * Math.floor(256))},${Math.floor(
        Math.random() * Math.floor(256)
      )})`,
    }
    dispatch ( addTask(task) )
    navigation.navigate ('TaskHomeSC');
  }

  const handleDatePicked = date => {
    const updatedTime = new Date (date)
    const hour = updatedTime.getUTCHours()
    const minute = updatedTime.getUTCMinutes()
    setTaskStartDate (startDate=>{
      console.log('_handleDatePicked...startDate: ', startDate)
      const updatedStartDate = new Date (startDate)
      updatedStartDate.setUTCHours (hour)
      updatedStartDate.setUTCMinutes (minute)
      return updatedStartDate.toISOString()
    })
    setIsDateTimePickerVisible(false)
  };

  return (
    <>
      <DateTimePicker
        isVisible={isDateTimePickerVisible}
        onConfirm={handleDatePicked}
        onCancel={()=>setIsDateTimePickerVisible(false)}
        mode="time"
      />
      <View style={styles.container}>
        <View
          style={{
            //height: visibleHeight,
          }}
        >
          <ScrollView
            contentContainerStyle={{
              paddingBottom: 50,
            }}
          >
            <View style={styles.calenderContainer}>
              <CalendarList
                style={{
                  width: 350,
                  height: 350,
                }}
                current={taskStartDate}
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
                    setTaskStartDate (day.dateString)
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
                  onPress={() => setIsDateTimePickerVisible(true)}
                  style={{
                    height: 25,
                    marginTop: 3,
                  }}
                >
                  <Text style={{ fontSize: 19 }}>
                    {moment(taskStartDate).format('h:mm A')}
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
                      {moment(taskStartDate).format('h:mm A')}
                    </Text>
                  </View>
                </View>
                <Switch
                  value={isAlarmSet}
                  onValueChange={()=>setIsAlermSet(previousState => !previousState)}
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
              onPress={ createTask }
              title='Confirm to create'
            />
          </ScrollView>
        </View>
      </View>
    </>
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
    //paddingTop: Constants.statusBarHeight,
    backgroundColor: '#eaeef7',
  },
});

export default TaskCreateSC 