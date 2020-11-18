import React, { useState, useEffect } from 'react'
import {View, 
  ScrollView, 
  Text, 
  StyleSheet, 
  TouchableOpacity} 
from 'react-native'
import { HeaderBackButton } from '@react-navigation/stack'
import { AntDesign } from '@expo/vector-icons'
import moment from 'moment'
import { Calendar } from 'react-native-calendars';

//repeatUntilDate is '2020-11-18'

const TaskRepeatUntilSC = (props) =>{
  const {navigation, route} = props
  const {repeatUntilDate, selectedDate} = route.params
  const [untilDate, setUntilDate] = useState (repeatUntilDate)
  useEffect (()=>{
    navigation.setOptions ({ 
      headerLeft: (props) => (
        <HeaderBackButton
          {...props}
          onPress={() => {
            navigation.navigate (
              'TaskRepeatSC', 
              {repeatUntilDate: untilDate}
            )
          }}
        />
      ), 
    })
  },[navigation, untilDate])

  const displayUntilItems = (
    <>
      <TouchableOpacity style={styles.item}
        onPress={()=>{setUntilDate(null)}}
      >
        <Text style={{fontSize:14}}>Forever</Text>
        {untilDate === null && <AntDesign name="check" size={24} color="blue" />}
      </TouchableOpacity>
      <TouchableOpacity style={styles.item}
        onPress={()=>{setUntilDate(moment(new Date()).format('YYYY-MM-DD'))}}
      >
        <Text style={{fontSize:14}}>Specific date</Text>
        {untilDate != null && <AntDesign name="check" size={24} color="blue" />}
      </TouchableOpacity>
    </>
  )
  const displayDateSelection = (
    untilDate != null ? (
      <View style = {{marginTop: 20}}>
        <Calendar
          current={selectedDate}
          minDate={selectedDate}
          onDayPress={(day) => {setUntilDate(day.dateString)}}
          markedDates={{
            [untilDate]: { selected: true, selectedColor: 'purple'},
          }}
        />
      </View>
    ) : (
      null
    )
  )
  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={{paddingTop: 40}}>
          {displayUntilItems}
          {displayDateSelection}
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    flexDirection: 'row', 
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 34, 
    width: "100%",
    backgroundColor: 'white',
    paddingHorizontal: 20, 
    marginVertical: 1
  }
})

export default TaskRepeatUntilSC