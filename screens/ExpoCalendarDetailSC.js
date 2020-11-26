import React from 'react';
import {
  View, Text, ScrollView, StyleSheet,
} from 'react-native';

import { useSelector } from 'react-redux';

const CalendarDetailSC = ({ navigation, route }) => {
  const calendars = useSelector((state) => state.calendars.array);
  const { calendarId } = route.params;
  const selectedCalendar = calendars.find((calendar) => calendar.id === calendarId);

  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={styles.description}>{`title: ${selectedCalendar.title}`}</Text>
        <Text style={styles.description}>{`entitiyType: ${selectedCalendar.entityType}`}</Text>
        <Text style={styles.description}>{`color: ${selectedCalendar.color}`}</Text>
        <Text style={styles.description}>{`type: ${selectedCalendar.type}`}</Text>
        <Text style={styles.description}>{`allowModi: ${selectedCalendar.allowsModifications}`}</Text>
        <Text style={styles.description}>{`id: ${selectedCalendar.id}`}</Text>
        <Text style={styles.description}>{`source id: ${selectedCalendar.source.id}`}</Text>
        <Text style={styles.description}>{`source name: ${selectedCalendar.source.name}`}</Text>
        <Text style={styles.description}>{`source type: ${selectedCalendar.source.type}`}</Text>
        <Text style={styles.description}>{`allowedAvailabilities: ${selectedCalendar.allowedAvailabilities}`}</Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  description: {
    color: '#888',
    fontSize: 20,
    marginVertical: 20,
    textAlign: 'center',
  },
});

export default CalendarDetailSC;
