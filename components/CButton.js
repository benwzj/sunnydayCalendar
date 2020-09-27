import React from 'react'
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native'

const CButton = ({onPress, title, style, textStyle}) =>{
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.container, style]}
    >
      <Text style={[styles.text, textStyle]}>
        {title}
      </Text>
    </TouchableOpacity>
  )
}
const styles = StyleSheet.create ({
  container: {
    backgroundColor: '#ff6347',
    width: 100,
    height: 38,
    alignSelf: 'center',
    marginTop: 40,
    borderRadius: 5,
    justifyContent: 'center',
  },
  text: {
    fontSize: 18,
    textAlign: 'center',
    color: '#fff',
  }
})
export default CButton