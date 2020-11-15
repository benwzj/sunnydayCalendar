import React, { useState } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  StyleSheet
} from 'react-native';
import moment from 'moment';
import {useDispatch, useSelector} from 'react-redux'
import { AntDesign } from '@expo/vector-icons'

import MapPreview from '../components/MapPreview'
import { deleteTask }  from '../store/actions/tasks'

const TaskDetailSC =(props) => {
  const dispatch = useDispatch ()
  const { navigation, route } = props
  const task = useSelector (state => state.tasks.taskList.find (
    task => task.ID === route.params.taskId 
  ))
  console.log ('TaskDetailSC task: ---', task)
  if ( !task ){
    return <View><Text>Found nothing about this task </Text></View>
  }
  const removeTask = () =>{
    navigation.navigate ('TaskHomeSC')
    dispatch (deleteTask (task))
  }

  const mainInfo = () =>{
    const title = (
      <View 
        style = {{
          flexDirection: 'row', 
          alignItems: 'center',
          paddingVertical: 12,
        }}
      >
        <View style = {[styles.taskIcon, {backgroundColor: task.color}]} />
        <Text style={{fontSize:18, fontWeight:'bold'}}>{task.title}</Text>
      </View>
    )
    const allDayInfo = (
      <Text style={{fontSize:14}}>
        {moment(task.startDateTime).format('dddd, DD MMMM YYYY')} (all day)
      </Text>
    )
    const notAllDayInfo = (
      <>
        <Text style={{fontSize:14}}>
          {moment(task.startDateTime).format('dddd, DD MMMM YYYY')}
        </Text>
        <Text style={{fontSize:14}}>
          {moment(task.startDateTime).format('h:mm a')} 
          <Text> --- </Text> 
          {moment(task.endDateTime).format('h:mm a')} 
        </Text>
      </>
    )
    const dateTime = (
      <View 
        style = {{ 
          justifyContent: 'center',
          paddingLeft: 60
        }}
      >
        {task.allDay? allDayInfo: notAllDayInfo}
      </View>
    )
    const repeatRule = (
      task.repeatRule.repeat != '' ? 
        ( <View style = {{ 
            justifyContent: 'center',
            paddingLeft: 60
          }}>
            <Text style={{fontSize:14}}>Repeats {task.repeatRule.repeat}</Text>
          </View>)
        : null
    )
    const notes = (
      task.notes.length > 0 ? (
        <>
          <View style = {{ 
            justifyContent: 'center',
            paddingLeft: 60
          }}>
            <View style={styles.seperator} />
            <Text style={{fontSize:14}}>{task.notes}</Text>
          </View>
        </>
      ) : null
    )
    return (
      <View style={{
          backgroundColor: 'white',
          width: '100%',
          paddingVertical: 14,
          marginTop: 25, 
        }}
      >
        {title}
        {dateTime}
        {repeatRule}
        {notes}
      </View>
    )
  }

  const location = (
    task.locationAddress.selected? (
      <View style={{
        marginTop: 25, 
        backgroundColor: 'white',
        width: '100%',
      }}>        
        <MapPreview
          style = {styles.mapPreview}
          location = {task.locationAddress.location}
          //onPress = {switchToMapScreen}
        />
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 12,
          }}
        >
          <AntDesign 
            name="enviromento" 
            size={20} 
            color={task.color} 
            style = {{paddingHorizontal: 20}}
          />
          <Text style={{fontSize: 16}}>
            {task.locationAddress.address}
          </Text>
        </View>
      </View>
    ) : null
  )

  const alarm = (
    <View style={{
      backgroundColor: 'white',
      width: '100%',
      paddingVertical: 12,
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 25, 
    }}
    >
      <AntDesign 
        name="bells" 
        size={20} 
        color={task.color} 
        style = {{paddingHorizontal: 20}}
      />
      <Text style={{fontSize: 16}}>
        {task.alarmTime.text}
      </Text>
    </View>
  )

  const deleteButton = (
    <View 
      style={{backgroundColor: 'white', 
        marginTop: 25, 
        paddingVertical: 12
      }}
    >
      <TouchableOpacity 
        style={{
          alignItems:'center', 
          justifyContent: 'center'
        }}
        onPress={removeTask}
      >
        <Text style={{color: 'red', fontSize: 18}}>Delete</Text>
      </TouchableOpacity>
    </View>
  )
  return (
    <>
      <View style={styles.container}>
          <ScrollView
            contentContainerStyle={{
              //paddingVertical: 20,
            }}
          >
            {mainInfo()}
            {location}
            {alarm}
            {deleteButton}
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
    marginVertical: 5,
  },
  container: {
    flex: 1,
    backgroundColor: '#eaeef7'
  },
  taskIcon: {
    width: 20,
    height: 20,
    borderRadius: 25,
    marginHorizontal: 20,
  },
  mapPreview: {
    width: '100%',
    height: 100,
  },
});

export default TaskDetailSC 