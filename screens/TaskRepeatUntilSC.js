import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  TouchableOpacity,
}
  from 'react-native';
import { HeaderBackButton } from '@react-navigation/stack';
// eslint-disable-next-line import/no-extraneous-dependencies
import { AntDesign } from '@expo/vector-icons';
import moment from 'moment';
import { Calendar } from 'react-native-calendars';

// repeatUntilDate is '2020-11-18'

const TaskRepeatUntilSC = (props) => {
  const { navigation, route } = props;
  const { repeatUntilDate, selectedDate } = route.params;
  const [untilDate, setUntilDate] = useState(repeatUntilDate);
  useEffect(() => {
    navigation.setOptions({
      headerLeft: (ps) => (
        <HeaderBackButton
          {...ps}
          onPress={() => {
            navigation.navigate(
              'TaskRepeatSC',
              { repeatUntilDate: untilDate },
            );
          }}
        />
      ),
    });
  }, [navigation, untilDate]);

  const displayUntilItems = (
    <>
      <TouchableOpacity
        style={styles.item}
        onPress={() => { setUntilDate(null); }}
      >
        <Text style={styles.textSize}>Forever</Text>
        {untilDate === null && <AntDesign name="check" size={24} color="blue" />}
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.item}
        onPress={() => { setUntilDate(moment(new Date()).format('YYYY-MM-DD')); }}
      >
        <Text style={styles.textSize}>Specific date</Text>
        {untilDate != null && <AntDesign name="check" size={24} color="blue" />}
      </TouchableOpacity>
    </>
  );
  const displayDateSelection = (
    untilDate != null ? (
      <View style={styles.rowMargin}>
        <Calendar
          current={selectedDate}
          minDate={selectedDate}
          onDayPress={(day) => { setUntilDate(day.dateString); }}
          markedDates={{
            [untilDate]: { selected: true, selectedColor: 'purple' },
          }}
        />
      </View>
    ) : (
      null
    )
  );
  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.topPadding}>
          {displayUntilItems}
          {displayDateSelection}
        </View>
      </ScrollView>
    </View>
  );
};

const ROW_BACKGROUND_COLOR = 'white';
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    alignItems: 'center',
    backgroundColor: ROW_BACKGROUND_COLOR,
    flexDirection: 'row',
    height: 34,
    justifyContent: 'space-between',
    marginVertical: 1,
    paddingHorizontal: 20,
    width: '100%',
  },
  rowMargin: {
    marginTop: 25,
  },
  textSize: {
    fontSize: 14,
  },
  topPadding: {
    paddingTop: 40,
  },
});

export default TaskRepeatUntilSC;
