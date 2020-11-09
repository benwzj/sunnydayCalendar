import React, { useState, useEffect } from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  Text,
  Dimensions,
  Button,
  TextInput,
  Switch,
  Alert,
  StyleSheet,
} from 'react-native';
import moment from 'moment';
import Constants from 'expo-constants';
import CalendarStrip from 'react-native-calendar-strip';
import DateTimePicker from 'react-native-modal-datetime-picker';
import {useSelector, useDispatch} from 'react-redux'
import {ExpandableCalendar, AgendaList, CalendarProvider, WeekCalendar} from 'react-native-calendars';
import _ from 'lodash';

import { Context } from '../data/Context';
import CModal from '../components/CModal'
import TaskBrief from '../components/TaskBrief'
import CButton from '../components/CButton'
import {
  setupTasks, 
  updateTask, 
  deleteTask
} from '../store/actions/tasks'

const TaskHomeSC = (props) =>{
  //const [currentDate, setCurrentDate] = useState (new Date().toISOString()) 
  const [selectedDate, setSelectedDate] = useState (
    moment().format("YYYY-MM-DD")
  ) 
  const dateTaskList = useSelector (state => {
    const sections = []
    for ( const item of state.tasks.taskList ){
      const title = moment (item.startDateTime).format("YYYY-MM-DD")
      if ( sections.lenght === 0 ){
        sections.push ({title: title, data: [item]})
      }else {
        let foundSameDate = false
        for ( const section of sections){
          if (section.title === title){
            section.data.push (item)
            foundSameDate = true
            break
          }
        }
        if ( !foundSameDate ){
          sections.push ({title: title, data: [item]})
        }
      }
    }
    //console.log( 'sections: ---', sections )
    return sections.sort ((function(a, b) {
      if (a.title < b.title) {
        return -1;
      }
      if (a.title > b.title) {
        return 1;
      }
      return 0
    }))
  })
  const calendarId = useSelector (state => state.tasks.calendarId)
  const [selectedTask, setSelectedTask] = useState (null)
  const [isModalVisible, setIsModalVisible] = useState (false)
  const [isDateTimePickerVisible, setIsDateTimePickerVisible] = useState(false)
  const { navigation } = props
  const dispatch = useDispatch ()

  useEffect(()=> {
    (async () =>{
      await dispatch (setupTasks()) 
    })()
  },[])

  const handleTimePicked = date => {
    setSelectedTask ( selectedTask => {
      const updatedSelectedTask = {...selectedTask}
      updatedSelectedTask.startDateTime = date
      updatedSelectedTask.endDateTime = date
      //console.log( 'handleTimePicked---',updatedSelectedTask)
      return updatedSelectedTask
    })
    setIsDateTimePickerVisible (false)
  };

  const handleAlarmSet = () => {
    const prevSelectedTask = { ...selectedTask };
    prevSelectedTask.alarmOn = !prevSelectedTask.alarmOn;
    setSelectedTask ( prevSelectedTask )
  };

  const getMarkedDates = () => {
    const marked = {};
    dateTaskList.forEach(item => {
      // NOTE: only mark dates with data
      if (item.data && item.data.length > 0 && !_.isEmpty(item.data[0])) {
        marked[item.title] = {marked: true};
      } else {
        marked[item.title] = {disabled: true};
      }
    });
    return marked;
  }
  const renderEmptyItem = () =>{
    return (
      <View style={styles.emptyItem}>
        <Text style={styles.emptyItemText}>No Events Planned</Text>
      </View>
    );
  }

  const renderItem = ({item}) => {
    if (_.isEmpty(item)) {
      return renderEmptyItem();
    }

    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('TaskDetailSC',{taskId: item.ID})}
        style={styles.item}
      >
        <View>
          <Text style={styles.itemHourText}>{moment (item.startDateTime).format("hA")}</Text>
          <Text style={styles.itemDurationText}>{moment (item.endDateTime).format("hA")}</Text>
        </View>
        <Text style={styles.itemTitleText}>{item.title}</Text>
        <View style={styles.itemButtonContainer}>
          <Button color={'grey'} title={'Info >'} onPress={() => Alert.alert(item.notes)}/>
        </View>
      </TouchableOpacity>
    );
  }
  const onDateChanged = (date, updateSource) => {
    //console.log('onDateChanged: ', date, updateSource);
    setSelectedDate (date)
  }

  const onMonthChange = (month, updateSource ) => {
    console.log('onMonthChange: ', month, updateSource);
  }

  const inputAddTask = (
    <TouchableOpacity
      onPress={() =>{
        if (calendarId === ''){
          dispatch (setupTasks())
        }
        navigation.navigate('TaskCreateSC', {
          selectedDate
        })
      }}
      style={styles.CreateTask}
    >
      <Image
        source={require('../assets/plus.png')}
        style={{height: 30, width: 30}}
      />
    </TouchableOpacity>
  )

  const inputCalendar = (
    <CalendarProvider
      date={new Date().toISOString().split('T')[0]}
      disabledOpacity={0.6}
      onDateChanged={onDateChanged}
      onMonthChange={onMonthChange}
    >
      <ExpandableCalendar
        //disableAllTouchEventsForDisabledDays
        firstDay={1}
        markedDates={getMarkedDates()} 
        leftArrowImageSource={require('../assets/previous.png')}
        rightArrowImageSource={require('../assets/next.png')}
      />
      <AgendaList
        sections={dateTaskList}
        //extraData={this.state}
        renderItem={renderItem}
        // sectionStyle={styles.section}
      />
    </CalendarProvider>
  )
  return (
        <>
          {//selectedTask !== null && (
            // <CModal isModalVisible={isModalVisible}>
            //   <DateTimePicker
            //     isVisible={isDateTimePickerVisible}
            //     onConfirm={handleTimePicked}
            //     onCancel={() => setIsDateTimePickerVisible (false)}
            //     mode="time"
            //     date ={new Date(selectedTask.startDateTime)}
            //   />
            //   <View style={styles.taskContainer}>
            //     <TextInput
            //       style={styles.title}
            //       onChangeText={text => {
            //         const prevSelectedTask = { ...selectedTask };
            //         prevSelectedTask.title = text;
            //         setSelectedTask ( prevSelectedTask )
            //       }}
            //       value={selectedTask.title}
            //       placeholder="What is in your mind!?"
            //     />
            //     <Text
            //       style={{
            //         fontSize: 14,
            //         color: '#BDC6D8',
            //         marginVertical: 10,
            //       }}
            //     >
            //       Suggestion
            //     </Text>
            //     <View style={{ flexDirection: 'row' }}>
            //       <View style={styles.readBook}>
            //         <Text style={{ textAlign: 'center', fontSize: 14 }}>
            //           Read book
            //         </Text>
            //       </View>
            //       <View style={styles.design}>
            //         <Text style={{ textAlign: 'center', fontSize: 14 }}>
            //           Design
            //         </Text>
            //       </View>
            //       <View style={styles.learn}>
            //         <Text style={{ textAlign: 'center', fontSize: 14 }}>
            //           Learn
            //         </Text>
            //       </View>
            //     </View>
            //     <View style={styles.notesContent} />
            //     <View>
            //       <Text
            //         style={{
            //           color: '#9CAAC4',
            //           fontSize: 16,
            //           fontWeight: '600',
            //         }}
            //       >
            //         Notes
            //       </Text>
            //       <TextInput
            //         style={{
            //           height: 25,
            //           fontSize: 19,
            //           marginTop: 3,
            //         }}
            //         onChangeText={text => {
            //           const prevSelectedTask = { ...selectedTask };
            //           prevSelectedTask.notes = text;
            //           setSelectedTask ( prevSelectedTask )
            //         }}
            //         value={selectedTask.notes}
            //         placeholder="Enter notes about the task."
            //       />
            //     </View>
            //     <View style={styles.sepeerator} />
            //     <View>
            //       <Text
            //         style={{
            //           color: '#9CAAC4',
            //           fontSize: 16,
            //           fontWeight: '600',
            //         }}
            //       >
            //         Times
            //       </Text>
            //       <TouchableOpacity
            //         onPress={() => setIsDateTimePickerVisible (true)}
            //         style={{
            //           height: 25,
            //           marginTop: 3,
            //         }}
            //       >
            //         <Text style={{ fontSize: 19 }}>
            //           {moment(selectedTask.startDateTime).format('h:mm A')}
            //         </Text>
            //       </TouchableOpacity>
            //     </View>
            //     <View style={styles.sepeerator} />
            //     <View
            //       style={{
            //         flexDirection: 'row',
            //         justifyContent: 'space-between',
            //         alignItems: 'center',
            //       }}
            //     >
            //       <View>
            //         <Text
            //           style={{
            //             color: '#9CAAC4',
            //             fontSize: 16,
            //             fontWeight: '600',
            //           }}
            //         >
            //           Alarm
            //         </Text>
            //         <View
            //           style={{
            //             height: 25,
            //             marginTop: 3,
            //           }}
            //         >
            //           <Text style={{ fontSize: 19 }}>
            //             {moment(selectedTask.startDateTime).format('h:mm A')}
            //           </Text>
            //         </View>
            //       </View>
            //       <Switch
            //         value={selectedTask.alarmOn}
            //         onValueChange={handleAlarmSet}
            //       />
            //     </View>
            //     <View
            //       style={{
            //         flexDirection: 'row',
            //         justifyContent: 'space-between',
            //         alignItems: 'center',
            //       }}
            //     >
            //       <CButton 
            //         onPress = {async () => {
            //           setIsModalVisible (state=>!state)
            //           dispatch (updateTask (selectedTask))
            //         }}
            //         title = "UPDATE"
            //         style = {{backgroundColor: '#2E66E7'}}
            //       />
            //       <CButton 
            //         onPress = {async () => {
            //           setIsModalVisible (state=>!state);
            //           dispatch ( deleteTask (selectedTask))
            //         }}
            //         title = "DELETE"
            //         style = {{backgroundColor: '#ff6347'}}
            //       />
            //     </View>
            //   </View>
            // </CModal>
            //)
          }
          <View
            style={{flex: 1}}
          >
            {inputCalendar}
            {inputAddTask}
          </View>
        </>
  )
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
  item: {
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: 'lightgrey',
    flexDirection: 'row'
  },
  itemHourText: {
    color: 'black'
  },
  itemDurationText: {
    color: 'grey',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4
  },
  itemTitleText: {
    color: 'black',
    marginLeft: 16,
    fontWeight: 'bold',
    fontSize: 16
  },
  itemButtonContainer: {
    flex: 1,
    alignItems: 'flex-end'
  },
  emptyItem: {
    paddingLeft: 20,
    height: 52,
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'lightgrey'
  },
  emptyItemText: {
    color: 'lightgrey',
    fontSize: 14
  }
});

export default TaskHomeSC