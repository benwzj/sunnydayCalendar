import React from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
// eslint-disable-next-line import/no-extraneous-dependencies
import { AntDesign } from '@expo/vector-icons';

import MapPreview from '../components/MapPreview';
import { deleteTask } from '../store/actions/tasks';

const TaskDetailSC = (props) => {
  const dispatch = useDispatch();
  const { navigation, route } = props;
  const task = useSelector((state) => state.tasks.taskList.find(
    (t) => t.ID === route.params.taskId,
  ));
  // console.log('TaskDetailSC task: ---', task);
  if (!task) {
    return <View><Text>Found nothing about this task </Text></View>;
  }
  const removeTask = () => {
    navigation.navigate('TaskHomeSC');
    dispatch(deleteTask(task));
  };
  const taskIcon = (name) => (
    <View style={styles.taskIcon}>
      <AntDesign
        name={name}
        size={20}
        color={task.color}
      />
    </View>
  );
  const repeatText = (repeatRule) => {
    // console.log('repeatRule:', repeatRule);
    let text = '';
    if (repeatRule.repeat === 'daily') {
      text = 'Daily';
      if (repeatRule.interval === 1) {
        text += ' (Every Day)';
      } else if (repeatRule.interval > 1) {
        text += ` (Every ${repeatRule.interval} Days)`;
      }
    }
    if (repeatRule.repeat === 'weekly') {
      text = 'Weekly';
      if (repeatRule.interval === 1) {
        text += ' (Every Week)';
      } else if (repeatRule.interval > 1) {
        text += ` (Every ${repeatRule.interval} Weeks)`;
      }
      text += ` On ${repeatRule.onDays?.join()}`;
    }
    return text;
  };

  const mainInfo = () => {
    const title = (
      <View
        style={styles.rowItem}
      >
        <View style={[styles.taskTitleIcon, { backgroundColor: task.color }]} />
        <Text style={styles.titleFont}>{task.title}</Text>
      </View>
    );
    const allDayInfo = (
      <Text style={styles.textFontSize}>
        {moment(task.startDateTime).format('dddd, DD MMMM YYYY')}
        {' '}
        (all day)
      </Text>
    );
    const notAllDayInfo = (
      <>
        <Text style={styles.textFontSize}>
          {moment(task.startDateTime).format('dddd, DD MMMM YYYY')}
        </Text>
        <Text style={styles.textFontSize}>
          {moment(task.startDateTime).format('h:mm a')}
          <Text> --- </Text>
          {moment(task.endDateTime).format('h:mm a')}
        </Text>
      </>
    );
    const dateTime = (
      <View style={styles.mainInfoRow}>
        {task.allDay ? allDayInfo : notAllDayInfo}
      </View>
    );
    const repeatRule = (
      task.repeatRule.repeat !== ''
        ? (
          <View style={styles.mainInfoRow}>
            <Text style={styles.textFontSize}>{repeatText(task.repeatRule)}</Text>
          </View>
        )
        : null
    );
    const notes = (
      task.notes.length > 0 ? (
        <>
          <View style={styles.mainInfoRow}>
            <View style={styles.seperator} />
            <Text style={styles.textFontSize}>{task.notes}</Text>
          </View>
        </>
      ) : null
    );
    return (
      <View style={styles.mainInfo}>
        {title}
        {dateTime}
        {repeatRule}
        {notes}
      </View>
    );
  };

  const location = (
    task.locationAddress.selected ? (
      <View style={styles.rowMargin}>
        <MapPreview
          style={styles.mapPreview}
          location={task.locationAddress.location}
          // onPress = {switchToMapScreen}
        />
        <View
          style={styles.rowItem}
        >
          {taskIcon('enviromento')}
          <Text style={styles.textFontSize}>
            {task.locationAddress.address}
          </Text>
        </View>
      </View>
    ) : null
  );

  const alarm = (
    <View style={[styles.rowItem, styles.rowMargin]}>
      {taskIcon('bells')}
      <Text style={styles.textFontBigSize}>
        {task.alarmTime.text}
      </Text>
    </View>
  );

  const deleteButton = (
    <View
      style={styles.deleteButton}
    >
      <TouchableOpacity
        onPress={removeTask}
      >
        <Text style={styles.textFontBigSize}>Delete</Text>
      </TouchableOpacity>
    </View>
  );
  return (
    <>
      <View style={styles.container}>
        <ScrollView>
          {mainInfo()}
          {location}
          {alarm}
          {deleteButton}
        </ScrollView>
      </View>
    </>
  );
};

const BACKGROUND_COLOR = '#eaeef7';
const ROW_BACKGROUND_COLOR = 'white';
const SEPERATOR_COLOR = '#979797';

const styles = StyleSheet.create({
  container: {
    backgroundColor: BACKGROUND_COLOR,
    flex: 1,
  },
  deleteButton: {
    alignItems: 'center',
    backgroundColor: ROW_BACKGROUND_COLOR,
    justifyContent: 'center',
    marginVertical: 25,
    paddingVertical: 12,
  },
  mainInfo: {
    backgroundColor: ROW_BACKGROUND_COLOR,
    marginTop: 25,
    paddingVertical: 14,
    width: '100%',
  },
  mainInfoRow: {
    justifyContent: 'center',
    paddingLeft: 60,
  },
  mapPreview: {
    height: 100,
    width: '100%',
  },
  rowItem: {
    alignItems: 'center',
    backgroundColor: ROW_BACKGROUND_COLOR,
    flexDirection: 'row',
    paddingVertical: 12,
    width: '100%',
  },
  rowMargin: {
    marginTop: 25,
  },
  seperator: {
    alignSelf: 'center',
    backgroundColor: SEPERATOR_COLOR,
    height: 0.5,
    marginVertical: 5,
    width: '100%',
  },
  taskIcon: {
    paddingHorizontal: 15,
  },
  taskTitleIcon: {
    borderRadius: 25,
    height: 20,
    marginHorizontal: 20,
    width: 20,
  },
  textFontBigSize: {
    fontSize: 18,
  },
  textFontSize: {
    fontSize: 14,
  },
  titleFont: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default TaskDetailSC;
