import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import ExpoCalendar from './screens/ExpoCalendarSC'

export default function App() {
  return (
    <View style={styles.container}>
      <Text>Day hello to sunnyday-calendar!</Text>
      <ExpoCalendar />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
