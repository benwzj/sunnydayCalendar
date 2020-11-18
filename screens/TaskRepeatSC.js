import React, {useEffect, useState} from 'react'
import {
  View, 
  ScrollView, 
  Text, 
  StyleSheet, 
  TouchableOpacity 
} from 'react-native'
import { AntDesign } from '@expo/vector-icons';
import { HeaderBackButton } from '@react-navigation/stack'
import moment from 'moment'
import ItemChevron from '../components/ItemChevron'


const dailyInterval = [
  '1 day', '2 days', '3 days', '4 days', '5 days', '6 days', '7 days', '8 days', '9 days', '10 days'
]
const weeklyInterval = [
  '1 week', '2 weeks', '3 weeks', '4 weeks', '5 weeks', '6 weeks', '7 weeks', '8 weeks', '9 weeks', '10 weeks'
]
const monthlyInterval = [
  '1 month', '2 months', '3 months', '4 months', '5 months', '6 months', '7 months', '8 months', '9 months', '10 months'
]
const yearlyInterval = [
  '1 year', '2 years', '3 years', '4 years', '5 years', '6 years', '7 years', '8 years', '9 years', '10 years'
]

const TaskRepeatSC = (props) =>{
  const {navigation, route} = props
  const {
    selectedDate,
    repeatRule, 
    currentInterval, 
    repeatUntilDate, 
    onDaysRule
  } = route.params
  const [currentRepeatRule, setCurrentRepeatRule] = useState ({...repeatRule})
  const repeatData = [
    {repeat: '', text: 'None'},
    {repeat: 'daily', text:'Daily', interval: 1, until: null},
    {repeat: 'weekly', text:'Weekly', interval: 1, onDays: [moment(selectedDate).format('dddd')], until: null},
    {repeat: 'monthly', text:'Monthly', interval: 1, onDays: [moment(selectedDate).format('D')], until: null},
    {repeat: 'yearly', text:'Yearly', interval: 1, until: null},
  ]
  //console.log( 'repeatRule: ', repeatRule)
  //console.log( 'currentRepeatRule: ', currentRepeatRule)
  useEffect (()=>{
    navigation.setOptions ({ 
      headerLeft: (props) => (
        <HeaderBackButton
          {...props}
          onPress={() => {navigation.navigate (
              'TaskCreateSC', 
              {repeatRule: {...currentRepeatRule}}
            )
          }}
        />
      ), 
    })
  },[navigation, currentRepeatRule])

  useEffect (()=>{
    //console.log( 'useEffect currentInterval:',currentInterval)
    setCurrentRepeatRule (currentRule=>({...currentRule, interval:currentInterval.value}))
  },[currentInterval])

  useEffect (()=>{
    //console.log( 'useEffect repeatUntilDate:',repeatUntilDate)
    setCurrentRepeatRule (currentRule=>({...currentRule, until:repeatUntilDate}))
  },[repeatUntilDate])

  useEffect (()=>{
    //console.log( 'useEffect onDaysRule:',onDaysRule)
    setCurrentRepeatRule (currentRule=>({...currentRule, onDays:onDaysRule.days}))
  },[onDaysRule])

  const itemPressHandler = (item) =>{
    //navigation.navigate('TaskCreateSC', {repeatRule: item})
    //displaySubItems (item)
    setCurrentRepeatRule ({...item})
  }
  const itemView = (index, item) =>{
    return (
      <TouchableOpacity style={styles.item}
        key={index}
        onPress={()=>itemPressHandler(item)}
      >
        <Text style={{fontSize:14}}>{item.text}</Text>
        {item.repeat === currentRepeatRule.repeat && <AntDesign name="check" size={24} color="blue" />}
      </TouchableOpacity>
    )
  }
  const untilInput = (date) =>{
    return (
      <TouchableOpacity style={styles.item}
        onPress={()=>{navigation.navigate(
          'TaskRepeatUntilSC', 
          {
            repeatUntilDate: currentRepeatRule.until,
            selectedDate
          }
        )}}
      >
        <Text style={{fontSize:14}}>Until</Text>
        <ItemChevron text={date? moment(date).format('ddd, D MMM'): 'Forever'} />
      </TouchableOpacity>
    )
  }
  const textOndaysWeekly = (onDays) =>{
    return onDays.reduce (function (acc, cur){
      const head = acc.length>0? acc+',' : acc
      const tickedDays = head + cur.slice(0,3)
      return tickedDays
    },'')
  }
  const textOndaysMonthly = (onDays) =>{
    return onDays.reduce (function (acc, cur){
      const head = acc.length>0? acc+',' : acc
      const tickedDays = head + cur
      return tickedDays
    },'')
  }
  const displaySubItems = () =>{
    const item = currentRepeatRule
    
    if ( item.repeat === 'daily'){
      return (
        <>
          <TouchableOpacity style={styles.item}
            onPress={()=>{navigation.navigate(
              'TaskRepeatIntervalSC', 
              {currentInterval: {value:item.interval, list:dailyInterval}})
            }}
          >
            <Text style={{fontSize:14}}>Interval</Text>
            <ItemChevron text={dailyInterval[item.interval-1]} />
          </TouchableOpacity>
          
          {untilInput(item.until)}
        </>
      )
    }else if ( item.repeat === 'weekly'){
      return (
        <>
          <TouchableOpacity style={styles.item}
            onPress={()=>{navigation.navigate(
              'TaskRepeatIntervalSC', 
              {currentInterval: {value:item.interval, list:weeklyInterval}})
            }}
          >
            <Text style={{fontSize:14}}>Interval</Text>
            <ItemChevron text={weeklyInterval[item.interval-1]} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.item}
            onPress={()=>{navigation.navigate(
              'TaskRepeatOnDaysSC', 
              {onDaysRule: {mode:'weekly', days: item.onDays}})
            }}
          >
            <Text style={{fontSize:14}}>On days</Text>
            <ItemChevron text={textOndaysWeekly(item.onDays)} />
          </TouchableOpacity>
          {untilInput(item.until)}
        </>
      )
    }else if ( item.repeat === 'monthly'){
      return (
        <>
          <TouchableOpacity style={styles.item}
            onPress={()=>{navigation.navigate(
              'TaskRepeatIntervalSC', 
              {currentInterval: {value:item.interval, list:monthlyInterval}})
            }}
          >
            <Text style={{fontSize:14}}>Interval</Text>
            <ItemChevron text={monthlyInterval[item.interval-1]} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.item}
            onPress={()=>{navigation.navigate(
              'TaskRepeatOnDaysSC', 
              {onDaysRule: {mode:'monthly', days: item.onDays}})
            }}
          >
            <Text style={{fontSize:14}}>On days</Text>
            <ItemChevron text={textOndaysMonthly(item.onDays)} />
          </TouchableOpacity>
          {untilInput(item.until)}
        </>
      )
    }else if ( item.repeat === 'yearly'){
      return (
        <>
          <TouchableOpacity style={styles.item}
            onPress={()=>{navigation.navigate(
              'TaskRepeatIntervalSC', 
              {currentInterval: {value:item.interval, list:yearlyInterval}})
            }}
          >
            <Text style={{fontSize:14}}>Interval</Text>
            <ItemChevron text={yearlyInterval[item.interval-1]} />
          </TouchableOpacity>
          {untilInput(item.until)}
        </>
      )
    }
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={{paddingTop: 40}}>
          {repeatData.map ((item, index) => itemView(index,item))}
        </View>
        <View style={{paddingTop: 40}}>
          {displaySubItems()}
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

export default TaskRepeatSC