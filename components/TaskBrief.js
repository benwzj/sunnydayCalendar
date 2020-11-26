import React from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
} from 'react-native';

const TaskBrief = (props) => {
  const { onTaskPress, item } = props;
  return (
    <TouchableOpacity
      onPress={onTaskPress}
      style={styles.taskContainer}
    >
      <View style={{ marginLeft: 13 }}>
        <View style={styles.titleContainer}>
          <View style={[styles.head, { backgroundColor: item.color }]} />
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
              {/* {`${moment(item.alarm.time).format('YYYY'
                )}/${moment(item.alarm.time).format('MM'
                )}/${moment(item.alarm.time).format('DD')}`
              } */}
              {
              new Date(item.startDateTime).toISOString().split('T')[0]
              }
            </Text>
            <Text style={styles.note}>
              {item.notes}
            </Text>
          </View>
        </View>
      </View>
      <View
        style={[styles.tail, { backgroundColor: item.color }]}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  alarmTime: {
    color: '#BBBBBB',
    fontSize: 14,
    marginRight: 5,
  },
  head: {
    borderRadius: 6,
    height: 12,
    marginRight: 8,
    width: 12,
  },
  note: {
    color: '#BBBBBB',
    fontSize: 14,
  },
  tail: {
    borderRadius: 5,
    height: 80,
    width: 5,
  },
  taskContainer: {
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    elevation: 3,
    flexDirection: 'row',
    height: 100,
    justifyContent: 'space-between',
    marginBottom: 10,
    marginTop: 10,
    shadowColor: '#2E66E7',
    shadowOffset: {
      width: 3,
      height: 3,
    },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    width: 327,
  },
  title: {
    color: '#554A4C',
    fontSize: 20,
    fontWeight: '700',
  },
  titleContainer: {
    alignItems: 'center',
    flexDirection: 'row',
  },
});

export default TaskBrief;
