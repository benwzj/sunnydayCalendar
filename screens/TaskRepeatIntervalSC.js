import React from 'react'
import {View, 
  ScrollView, 
  Text, 
  StyleSheet, 
  TouchableOpacity} 
from 'react-native'
import { AntDesign } from '@expo/vector-icons';

//currentInterval = {mode: 'daily', value: 1, list: [...]}

const TaskRepeatIntervalSC = (props) =>{
  const {navigation, route} = props
  const {currentInterval} = route.params
  const itemView = (index, item) =>{
    return (
      <TouchableOpacity style={styles.item}
        key={index}
        onPress={() => {navigation.navigate(
          'TaskRepeatSC', 
          {currentInterval: {mode: currentInterval.mode, value: index+1}}
        )}}
      >
        <Text style={{fontSize:14}}>{item}</Text>
        {index === currentInterval.value-1 && 
          <AntDesign name="check" size={24} color="blue" />}
      </TouchableOpacity>
    )
  }
  const displayAlarmItems = () =>{
    return currentInterval.list.map (
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

export default TaskRepeatIntervalSC