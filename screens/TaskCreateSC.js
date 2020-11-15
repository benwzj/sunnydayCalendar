import React, { useState } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  TextInput,
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
import { AntDesign } from '@expo/vector-icons'

import MapPreview from '../components/MapPreview'
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
  const {alarmTime,repeatRule, locationAddress, selectedDate} = route.params
  const calendarId = useSelector (state => state.tasks.calendarId)
  const [taskStartDateTime, setTaskStartDateTime] = useState (
    new Date(selectedDate).setHours (12,0,0)
  )
  const [taskEndDateTime, setTaskEndDateTime] = useState (
    new Date(selectedDate).setHours (13,0,0)
  )
  const [timeForStartOrEnd, setTimeForStartOrEnd] = useState('start')

  const [allDay, setAllDay] = useState (true)
  const [title, setTitle] = useState ('')
  const [notesText, setNotesText] = useState ('')
  const [dateTimePicker, setDateTimePicker] = useState ({visible: false, mode: 'datetime'})

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
      endDateTime: taskEndDateTime > taskStartDateTime ? taskEndDateTime: taskStartDateTime,
      alarmTime: alarmTime,
      allDay: allDay,
      locationAddress: locationAddress,
      timeZone: Localization.timezone,
      color: taskColor,
      repeatRule: repeatRule,
    }
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
    setDateTimePicker({visible:false, mode: 'datetime'})
  };

  const allDayHandler = () =>{
    LayoutAnimation.configureNext (LayoutAnimation.Presets.easeInEaseOut);
    setAllDay (previousState => !previousState)
  }

  const inputTitle = (
    <View 
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 25, 
        backgroundColor: 'white',
        paddingVertical: 15,
        paddingHorizontal: 20
      }}
    >
      <View style={[styles.taskIcon, {backgroundColor: taskColor}]} />
      <TextInput
        style={{fontSize:18, paddingLeft: 15}}
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
        marginTop: 25, 
        backgroundColor: 'white',
        paddingVertical: 15,
        paddingHorizontal: 20
      }}
    >
      <AntDesign 
        name="clockcircleo" 
        size={20} 
        color={taskColor} 
      />
      <Text style={{fontSize: 20, paddingLeft: 15}}>All day</Text>
      <Switch
        style = {{position: "absolute",right: 10}}
        value={allDay}
        onValueChange={allDayHandler}
      />
    </View>
  )

  const displayHowFarFromToday = () =>{
    // calculate the string to describe How far from now
    return 'this Friday'
  }
  const displayHowLong = () =>{
    // calculate string for how long
    return 'One Day'
  }
  const inputAllDayPanel = (
    <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        height: 60,
        backgroundColor: 'white',
        paddingVertical: 15,
        paddingLeft: 55
      }}
    >
      <TouchableOpacity style={{
          justifyContent: 'center',
          width: '50%',
          height: '100%'
        }}
        onPress={() => {
          setTimeForStartOrEnd ('start')
          setDateTimePicker({visible:true, mode:'date'})
        }}
      >
        <Text>Start</Text>
        <Text>{moment(taskStartDateTime).format('ddd, D MMM')}</Text>
        <Text>{displayHowFarFromToday()}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={{
          justifyContent: 'center',
          width: '50%',
          height: '100%'
        }}
        onPress={() => {
          setTimeForStartOrEnd ('end')
          setDateTimePicker({visible:true, mode:'date'})
        }}
      >
        <Text>End</Text>
        <Text>{moment(taskEndDateTime).format('ddd, D MMM')}</Text>
        <Text>{displayHowLong()}</Text>
      </TouchableOpacity> 
    </View>
  )
  const inputNotAllDayPanel = (
    <View 
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        height: 50,
        backgroundColor: 'white',
        paddingVertical: 15,
        paddingLeft: 55
      }}
    >
      <TouchableOpacity
        onPress={() => {
          setTimeForStartOrEnd ('start')
          setDateTimePicker({visible:true, mode:'datetime'})
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
          setDateTimePicker({visible:true, mode:'datetime'})
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
      return inputNotAllDayPanel
    }else{
      return inputAllDayPanel
    }
  }
  const inputAlarm = (
    <TouchableOpacity
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 20,
        marginTop: 20,
        backgroundColor: 'white'
      }}
      onPress = {() => navigation.navigate (
        'TaskAlarmSC', 
        {alarmTime}
      )}
    >
      <AntDesign 
        name="bells" 
        size={20} 
        color={taskColor} 
      />
      <Text style={{fontSize: 18, paddingLeft: 20}}>Alarm</Text>
      <ItemChevron 
        text = {alarmTime.text}
        
      />
    </TouchableOpacity>
  )

  const inputLocation = (
    <TouchableOpacity style={{
        marginTop: 20,
      }}
      onPress = {() => {
        navigation.navigate (
          'TaskLocationSC', {locationAddress: locationAddress}
        )
      }}
    >
      {locationAddress.selected ? 
        <MapPreview
          style = {styles.mapPreview}
          location = {locationAddress.location}
        />
        : null}
      <View
        style = {{
          flexDirection: 'row',
          paddingVertical: 14,
          paddingHorizontal: 20,
          alignItems: 'center',
          backgroundColor: 'white'
        }}
      >
        <AntDesign 
          name="enviromento" 
          size={20} 
          color={taskColor} 
        />
        <Text style={{fontSize: 18, paddingLeft: 20}}>
        {locationAddress.selected ? locationAddress.address:'Location'}
        </Text>
        <ItemChevron text = '' />
        
      </View>
    </TouchableOpacity>
  )
  const inputPeople = (
    <TouchableOpacity
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 20,
        marginTop: 20,
        backgroundColor: 'white'
      }}
      onPress = {()=>Alert.alert('looking for People')}
    >
      <AntDesign 
        name="meh" 
        size={20} 
        color = {taskColor} 
      />
      <Text style={{fontSize: 18, paddingLeft: 20}}>People</Text>
      <ItemChevron 
        
      />
    </TouchableOpacity>
  )
  const inputRepeat = (
    <TouchableOpacity
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 20,
        marginTop: 20,
        backgroundColor: 'white'
      }}
      onPress = {() => navigation.navigate (
        'TaskRepeatSC', 
        {repeatRule}
      )}
      
    >
      <AntDesign 
        name="sync" 
        size={20} 
        color = {taskColor} 
      />
      <Text style={{fontSize: 18, paddingLeft: 20}}>Repeat</Text>
      <ItemChevron 
        text = {repeatRule.text}
      />
    </TouchableOpacity>
  )

  const inputNote = (
    <View 
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 20,
        marginTop: 20,
        backgroundColor: 'white'
      }}
    >
      <AntDesign
        name = 'menuunfold'
        size = {20} 
        color = {taskColor}
      />
      <TextInput
        style={{fontSize: 18, paddingLeft: 20}}
        onChangeText={text =>setNotesText( text )}
        value={notesText}
        placeholder="Enter notes about the task."
      />
    </View>
  )
  const inputCreateTask = (
    <View 
      style={{backgroundColor: 'white', 
        //marginTop: 25, 
        paddingVertical: 12,
        marginVertical: 25
      }}
    >
      <TouchableOpacity 
        style={{
          alignItems:'center', 
          justifyContent: 'center'
        }}
        onPress={createTask}
      >
        <Text style={{color: 'blue', fontSize:18}}>Create</Text>
      </TouchableOpacity>
    </View>
  )
  const inputDateTimePicker = (
    <DateTimePicker
      isVisible={dateTimePicker.visible}
      onConfirm={handleTimePicked}
      onCancel={()=>setDateTimePicker({visible:false, mode: 'datetime'})}
      mode={dateTimePicker.mode}
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
    width: 20,
    height: 20,
    borderRadius: 25,
  },
  eventItemInput: {
    height: 25,
    justifyContent: 'center',
    paddingLeft: 8,
    fontSize: 19,
  },
  taskContainer: {

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
  mapPreview: {
    width: '100%',
    height: 100,
  },
});

export default TaskCreateSC 