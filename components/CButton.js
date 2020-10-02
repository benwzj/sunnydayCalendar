import React from 'react'
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native'

const CButton = (props) =>{
  const {onPress, title, style, textStyle} = props
  const buttonWidth = title.length * 10 + 40
  return (
    <TouchableOpacity
      {...props}
      onPress={onPress}
      style={[styles.container,{width: buttonWidth}, style]}
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
    //width: 100,
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