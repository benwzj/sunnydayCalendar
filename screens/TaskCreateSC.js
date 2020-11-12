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
  StyleSheet,
  Alert,
  Platform,
  LayoutAnimation
} from 'react-native';
import moment from 'moment';
import * as Localization from 'expo-localization';
import DateTimePicker from 'react-native-modal-datetime-picker';
import {useDispatch, useSelector} from 'react-redux'
import { Ionicons, AntDesign } from '@expo/vector-icons';

import CButton from '../components/CButton'
import ItemChevron from '../components/ItemChevron'
import { addTask, setupTasks}  from '../store/actions/tasks'

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const TaskCreateSC =(props) => {
  const dispatch = useDispatch ()
  const { navigation, route } = props
  const {alertTime} = route.params
  const calendarId = useSelector (state => state.tasks.calendarId)
  const [taskStartDateTime, setTaskStartDateTime] = useState (
    new Date(route.params.selectedDate).setHours (12,0,0)
  )
  const [taskEndDateTime, setTaskEndDateTime] = useState (
    new Date(route.params.selectedDate).setHours (13,0,0)
  )
  const [timeForStartOrEnd, setTimeForStartOrEnd] = useState('start')
  const [allDay, setAllDay] = useState (true)
  const [title, setTitle] = useState ('')
  const [notesText, setNotesText] = useState ('')
  const [isDateTimePickerVisible, setIsDateTimePickerVisible] = useState (false)
  // const [selectedDay, setSelectedDay] = useState({
  //   [`${moment(route.params.selectedDate).format(
  //     'YYYY')}-${moment(route.params.selectedDate).format(
  //     'MM')}-${moment(route.params.selectedDate).format(
  //     'DD' )}`]: {
  //     selected: true,
  //     selectedColor: '#2E66E7',
  //   },
  // })

  const [taskColor, setTaskColor] = useState(`rgb(${Math.floor(
    Math.random() * Math.floor(256)
  )},${Math.floor(Math.random() * Math.floor(256))},${Math.floor(
    Math.random() * Math.floor(256)
  )})`)
  
  const createTask = () =>{
    if (calendarId === ''){
      dispatch ( setupTasks())
      return
    }

    const task = {
      calendarId: calendarId,
      title: title,
      notes: notesText,
      startDateTime: taskStartDateTime,
      endDateTime: taskEndDateTime,
      alarmRelativeOffset: alertTime.time,
      allDay: allDay,
      timeZone: Localization.timezone,
      color: taskColor,
    }
    //console.log( 'createTask () ', task)
    dispatch ( addTask(task) )
    navigation.navigate ('TaskHomeSC');
  }

  const handleTimePicked = date => {
    if ( timeForStartOrEnd === 'start'){
      setTaskStartDateTime (
        date.toISOString()
      )
    }else if ( timeForStartOrEnd === 'end'){
      if ( date.toISOString() < taskStartDateTime){
        setTaskEndDateTime (taskStartDateTime)
      }else {
        setTaskEndDateTime( date.toISOString() )
      }
    }
    setIsDateTimePickerVisible(false)
  };

  const allDayHandler = () =>{
    LayoutAnimation.configureNext (LayoutAnimation.Presets.easeInEaseOut);
    setAllDay (previousState => !previousState)
  }

  const inputTitle = (
    <View 
      style={{flexDirection: 'row',
      alignItems: 'center'}}
    >
      <View style={[styles.taskIcon, {backgroundColor: taskColor}]} />
      <TextInput
        style={styles.eventItemInput}
        onChangeText={text => setTitle(text)}
        value={title}
        placeholder="What is on your mind"
      />
    </View>
  )
  const inputAllday = (
    <View 
      style = {{
        flexDirection: 'row',
        alignItems: 'center',
      }}
    >
      <AntDesign 
        name="clockcircleo" 
        size={24} 
        color={taskColor} 
        style = {{padding: 8}} 
      />
      <Text style={{fontSize: 20}}>All day</Text>
      <Switch
        style = {{position: "absolute",right: 10}}
        value={allDay}
        onValueChange={allDayHandler}
      />
    </View>
  )

  const displayHowFarFromToday = () =>{
    return 'this Friday'
  }
  const displayHowLong = () =>{
    return 'One Day'
  }
  const inputAllDayPanel = (
    <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        height: 60
      }}
    >
      <View style={{
          justifyContent: 'center',
          width: '50%',
          height: '100%'
        }}
      >
        <Text>Start</Text>
        <Text>{moment(taskStartDateTime).format('ddd, D MMM')}</Text>
        <Text>{displayHowFarFromToday()}</Text>
      </View>
      <View style={{
          justifyContent: 'center',
          width: '50%',
          height: '100%'
        }}
      >
        <Text>End</Text>
        <Text>{moment(taskEndDateTime).format('ddd, D MMM')}</Text>
        <Text>{displayHowLong()}</Text>
      </View> 
    </View>
  )
  const inputStartEndPanel = (
    <View 
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        height: 50
      }}
    >
      <TouchableOpacity
        onPress={() => {
          setTimeForStartOrEnd ('start')
          setIsDateTimePickerVisible(true)
        }}
        style={{
          justifyContent: 'center',
          height: '100%',
          width: '50%',
        }}
      >
        <Text>Start</Text>
        <Text>
          {moment(taskStartDateTime).format('M/D h:mmA')}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          setTimeForStartOrEnd ('end')
          setIsDateTimePickerVisible(true)
        }}
        style={{
          justifyContent: 'center',
          height: '100%',
          width: '50%',
        }}
      >
        <Text>End</Text>
        <Text>
          {moment(taskEndDateTime).format('M/D h:mmA')}
        </Text>
      </TouchableOpacity>
    </View>
  )
  const inputDateTime = () =>{
    if ( allDay === false ){
      return inputStartEndPanel
    }else{
      return inputAllDayPanel
    }
  }
  const inputAlert = (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
      }}
    >
      <AntDesign 
        name="bells" 
        size={24} 
        color={taskColor} 
        style = {{padding: 8}} 
      />
      <Text style={{fontSize: 20}}>Alert</Text>
      <ItemChevron 
        text = {alertTime.text}
        onPress = {() => navigation.navigate (
          'TaskAlertSC', 
          {alertTime}
        )}
      />
    </View>
  )

  const inputLocation = (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
      }}
    >
      <AntDesign 
        name="enviromento" 
        size={24} 
        color={taskColor} 
        style = {{padding: 8}}
      />
      <Text style={{fontSize: 20}}>Location</Text>
      <ItemChevron 
        text = ''
        onPress = {() => navigation.navigate (
          'TaskLocationSC'
        )}
      />
    </View>
  )
  const inputPeople = (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
      }}
    >
      <AntDesign 
        name="meh" 
        size={24} 
        color = {taskColor} 
        style = {{padding: 8}}
      />
      <Text style={{fontSize: 20}}>People</Text>
      <ItemChevron 
        onPress = {()=>Alert.alert('looking for People')}
      />
    </View>
  )
  const inputRepeat = (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
      }}
    >
      <AntDesign 
        name="sync" 
        size={24} 
        color = {taskColor} 
        style = {{padding: 8}}
      />
      <Text style={{fontSize: 20}}>Repeat</Text>
      <ItemChevron 
        text = 'None'
        onPress = {()=>Alert.alert('looking for repeat')}
      />
    </View>
  )

  const inputNote = (
    <View 
      style={{flexDirection: 'row',
      alignItems: 'center'}}
    >
      <AntDesign
        name = 'menuunfold'
        size = {24} 
        style = {{padding: 8}}
        color = {taskColor}
      />
      <TextInput
        style={styles.eventItemInput}
        onChangeText={text =>setNotesText( text )}
        value={notesText}
        placeholder="Enter notes about the task."
      />
    </View>
  )
  const inputCreateTask = (
    <CButton 
      style={{
        backgroundColor:
          title === ''
            ? 'rgba(46, 102, 231,0.5)'
            : '#2E66E7',
      }}
      onPress={ createTask }
      title='Confirm to create'
    />
  )
  const inputDateTimePicker = (
    <DateTimePicker
      isVisible={isDateTimePickerVisible}
      onConfirm={handleTimePicked}
      onCancel={()=>setIsDateTimePickerVisible(false)}
      mode="datetime"
      date={new Date(taskStartDateTime)}
    />
  )
  return (
    <>
      {inputDateTimePicker}
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={{
            paddingTop: 10
          }}
        >
            <View style={styles.taskContainer}>
              {inputTitle}
              <View style={styles.seperator} />
              {inputAllday}
              <View style={styles.seperator} />
              {inputDateTime()}
              <View style={styles.seperator} />
              {inputAlert}
              <View style={styles.seperator} />
              {inputLocation}
              <View style={styles.seperator} />
              {inputPeople}
              <View style={styles.seperator} />
              {inputRepeat}
              <View style={styles.seperator} />
              {inputNote}
              {inputCreateTask}
            </View>
        </ScrollView>
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
  taskIcon: {
    width: 28,
    height: 28,
    borderRadius: 25,
    //backgroundColor: '#73d4e3',
    margin: 6,
  },
  eventItemInput: {
    height: 25,
    justifyContent: 'center',
    paddingLeft: 8,
    fontSize: 19,
  },
  taskContainer: {
    height: 700,
    width: 400,
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
    padding: 12,
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