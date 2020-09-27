import React from 'react'
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native'
import moment from 'moment'

const TaskBrief = (props) => {
  const {onTaskPress, item} = props
  return (
    <TouchableOpacity
      onPress={onTaskPress}
      style={styles.taskContainer}
    >
      <View style={{ marginLeft: 13 }}>
        <View style={styles.titleContainer}>
          <View style={[styles.head,{backgroundColor: item.color}]}/>
          <Text style={styles.title}>
            {item.title}
          </Text>
        </View>
        <View>
          <View
            style={{
              flexDirection: 'row',
              marginLeft: 20,
            }}
          >
            <Text style={styles.alarmTime}>
              {`${moment(item.alarm.time).format('YYYY'
                )}/${moment(item.alarm.time).format('MM'
                )}/${moment(item.alarm.time).format('DD')}`
              }
            </Text>
            <Text style={styles.note}>
              {item.notes}
            </Text>
          </View>
        </View>
      </View>
      <View
        style={[styles.tail,{backgroundColor: item.color}]}
      />
    </TouchableOpacity>
  ) 
}

const styles = StyleSheet.create ({
  taskContainer: {
    height: 100,
    width: 327,
    alignSelf: 'center',
    borderRadius: 10,
    shadowColor: '#2E66E7',
    backgroundColor: '#ffffff',
    marginTop: 10,
    marginBottom: 10,
    shadowOffset: {
      width: 3,
      height: 3,
    },
    shadowRadius: 5,
    shadowOpacity: 0.2,
    elevation: 3,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleContainer:{
    flexDirection: 'row',
    alignItems: 'center',
  },
  title:{
    color: '#554A4C',
    fontSize: 20,
    fontWeight: '700',
  },
  alarmTime: {
    color: '#BBBBBB',
    fontSize: 14,
    marginRight: 5,
  },
  note: {
    color: '#BBBBBB',
    fontSize: 14,
  },
  head: {
    height: 12,
    width: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  tail: {
    height: 80,
    width: 5,
    borderRadius: 5,
  }
})

export default TaskBrief
