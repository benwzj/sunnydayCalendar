import React, { useState } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Switch,
  StyleSheet
} from 'react-native';
import moment from 'moment';
import {useDispatch, useSelector} from 'react-redux'
import CButton from '../components/CButton'
import { deleteTask }  from '../store/actions/tasks'

const TaskDetailSC =(props) => {
  const dispatch = useDispatch ()
  const { navigation, route } = props
  const task = useSelector (state => state.tasks.taskList.find (
    task => task.ID === route.params.taskId 
  ))
  //console.log ('TaskDetailSC task: ---', task)
  if ( !task ){
    return <View><Text>Found nothing about this task </Text></View>
  }
  const removeTask = () =>{
    navigation.navigate ('TaskHomeSC')
    dispatch (deleteTask (task))
  }
  return (
    <>
      <View style={styles.container}>
          <ScrollView
            contentContainerStyle={{
              paddingBottom: 50,
            }}
          >
            <View style={styles.taskContainer}>
              <TextInput
                style={styles.title}
                onChangeText={text => setTaskText(text)}
                value={task.title}
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
                  //onChangeText={text =>setNotesText( text )}
                  value={task.notes}
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
                  //onPress={() => setIsDateTimePickerVisible(true)}
                  style={{
                    height: 25,
                    marginTop: 3,
                  }}
                >
                  <Text style={{ fontSize: 19 }}>
                    {moment(task.startDateTime).format('h:mm A')}
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
                      
                      {moment(task.startDateTime).format('h:mm A')}
                    </Text>
                  </View>
                </View>
                <Switch
                  value={task.alarmOn}
                  //onValueChange={()=>setIsAlermSet(previousState => !previousState)}
                />
              </View>
            </View>
            <CButton 
              onPress={ removeTask }
              title='Delete This Task'
            />
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

export default TaskDetailSC 