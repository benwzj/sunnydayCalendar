import React from 'react'
import { View, Text, ScrollView, StyleSheet } from 'react-native'

import { useSelector } from 'react-redux' 

const CalendarDetailSC = ({navigation, route}) => {
  const calendars = useSelector ( state => state.calendars.array )
  const { calendarId } = route.params
  const selectedCalendar = calendars.find (calendar=>calendar.id === calendarId)
  
  return (
    <View style={styles.container}>
      <ScrollView >
        <Text style={styles.description}>{'title: '+selectedCalendar.title}</Text>
        <Text style={styles.description}>{'entitiyType: '+selectedCalendar.entityType}</Text>
        <Text style={styles.description}>{'color: '+selectedCalendar.color}</Text>
        <Text style={styles.description}>{'type: '+selectedCalendar.type}</Text>
        <Text style={styles.description}>{'allowModi: '+selectedCalendar.allowsModifications}</Text>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create ({
  container: {
    flex: 1,
  },
  description: {
    fontSize: 20,
    color: '#888',
    textAlign: 'center',
    marginVertical: 20,
  }
})


export default CalendarDetailSC;