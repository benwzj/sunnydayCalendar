import React from 'react'
import {
  View, 
  ScrollView, 
  Text, 
  StyleSheet, 
  TouchableOpacity 
} from 'react-native'
import { AntDesign } from '@expo/vector-icons';

const repeatData = [
  {repeat: '', text:'None'},
  {repeat: 'daily', text:'Daily'},
  {repeat: 'weekly', text:'Weekly'},
  {repeat: 'monthly', text:'Monthly'},
  {repeat: 'yearly', text:'Yearly'},
]
const dailyInterval = [
  '1 day', '2 days', '3 days', '4 days', '5 days', '6 days', '7 days', '8 days', '9 days', '10 days'
]

const TaskRepeatSC = (props) =>{
  const {navigation, route} = props
  const {repeatRule} = route.params
  const itemView = (index, item) =>{
    return (
      <TouchableOpacity style={styles.item}
        key={index}
        onPress={()=>{navigation.navigate('TaskCreateSC', {repeatRule: item})}}
      >
        <Text style={{fontSize:14}}>{item.text}</Text>
        {item.repeat === repeatRule.repeat && <AntDesign name="check" size={24} color="blue" />}
      </TouchableOpacity>
    )
  }
  const displayRepeatItems = () =>{
    return repeatData.map (
      (item, index) => itemView(index,item)
    )  
  }
  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={{paddingTop: 40}}>
          {displayRepeatItems()}
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