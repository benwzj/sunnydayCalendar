import React, {useState, useEffect} from 'react'
import {
  View, 
  ScrollView, 
  Text, 
  StyleSheet, 
  TouchableOpacity
} from 'react-native'
import { AntDesign } from '@expo/vector-icons'
import { HeaderBackButton } from '@react-navigation/stack'

// onDaysRule = {mode: 'weekly', days: [{name:'Monday', ticked: false}]}

const TaskRepeatOnDaysSC = (props) =>{
  const {navigation, route} = props
  const {onDaysRule} = route.params
  const weekDays = [
    'Sunday', 'Monday','Tuesday', 'Wednesday','Thurday', 'Friday', 'Saturday'
  ]
  
  const monthDays = [
    '1', '2', '3', '4', '5', '6', '7', '8', '9', '10',
    '11', '12', '13', '14', '15', '16', '17', '18', '19', '20',
    '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31'
  ]

  const [days, setDays] = useState ( onDaysRule.mode === 'weekly'? 
    weekDays.map(item=>({name:item, ticked: onDaysRule.days.some(i=>i===item)}))
    : monthDays.map(item=>({name:item, ticked: onDaysRule.days.some(i=>i===item)}))
  )
  useEffect (()=>{
    navigation.setOptions ({ 
      headerLeft: (props) => (
        <HeaderBackButton
          {...props}
          onPress={() => {
            const reducer = (acc, cur) =>{
              if ( cur.ticked ){
                acc.push (cur.name)
              }
              return acc
            }
            const tickedDays = days.reduce (reducer, [])
            navigation.navigate (
              'TaskRepeatSC', 
              {onDaysRule: {days: tickedDays}}
            )
          }}
        />
      ), 
    })
  },[navigation, days])

  const itemView = (index, item) =>{
    return (
      <TouchableOpacity style={styles.item}
        key = {index}
        onPress = {() => {setDays((currDays) => {
          let countOfTicked = 0
          let tickedName = ''
          for ( let day of currDays ){
            if ( day.ticked ){
              countOfTicked ++
              tickedName = day.name
            }
          }
          return currDays.map ((day)=> {
            if (day.name === item.name ){
              if (countOfTicked === 1 && tickedName === day.name){
                return day
              }
              day.ticked = !day.ticked
            }
            return day
          }
        )})}}
      >
        <Text style={{fontSize:14}}>{item.name}</Text>
        {item.ticked && 
          <AntDesign name="check" size={24} color="blue" />}
      </TouchableOpacity>
    )
  }
  const displayAlarmItems = () =>{
    return days.map (
      (item, index) => itemView(index,item)
    )  
  }
  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={{paddingTop: 40}}>
          {displayAlarmItems()}
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

export default TaskRepeatOnDaysSC