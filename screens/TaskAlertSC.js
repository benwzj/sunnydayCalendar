import React from 'react'
import {View, 
  ScrollView, 
  Text, 
  StyleSheet, 
  TouchableOpacity} from 'react-native'
import { AntDesign } from '@expo/vector-icons';

const alertData = [
  {time: 1, text:'None'},
  {time: 0, text:'At time of event'},
  {time: -5, text:'5 minutes before'},
  {time: -15, text:'15 minutes before'},
  {time: -30, text:'30 minutes before'},
  {time: -60, text:'1 hour before'},
  {time: -120, text:'2 hours before'},
  {time: -60*24, text:'1 day before'},
  {time: -60*24*7, text:'1 week before'}
]

const TaskAlertSC = (props) =>{
  const {navigation, route} = props
  const {alertTime} = route.params
  const itemView = (index, item) =>{
    return (
      <TouchableOpacity style={styles.item}
        key={index}
        onPress={()=>{navigation.navigate('TaskCreateSC', {alertTime: item})}}
      >
        <Text style={{fontSize:14}}>{item.text}</Text>
        {item.time === alertTime.time && <AntDesign name="check" size={24} color="blue" />}
      </TouchableOpacity>
    )
  }
  const displayAlertItems = () =>{
    return alertData.map (
      (item, index) => itemView(index,item)
    )  
  }
  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={{paddingTop: 40}}>
          {displayAlertItems()}
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

export default TaskAlertSC