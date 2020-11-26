import React from 'react';
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  TouchableOpacity,
}
  from 'react-native';
// eslint-disable-next-line import/no-extraneous-dependencies
import { AntDesign } from '@expo/vector-icons';

// currentInterval = {mode: 'daily', value: 1, list: [...]}

const TaskRepeatIntervalSC = (props) => {
  const { navigation, route } = props;
  const { currentInterval } = route.params;
  const itemView = (index, item) => (
    <TouchableOpacity
      style={styles.item}
      key={index}
      onPress={() => {
        navigation.navigate(
          'TaskRepeatSC',
          { currentInterval: { mode: currentInterval.mode, value: index + 1 } },
        );
      }}
    >
      <Text style={styles.textSize}>{item}</Text>
      {index === currentInterval.value - 1
          && <AntDesign name="check" size={24} color="blue" />}
    </TouchableOpacity>
  );
  const displayAlarmItems = () => currentInterval.list.map(
    (item, index) => itemView(index, item),
  );
  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.topPadding}>
          {displayAlarmItems()}
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
  textSize: {
    fontSize: 14,
  },
  topPadding: {
    paddingTop: 40,
  },
});

export default TaskRepeatIntervalSC;
