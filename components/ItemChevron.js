import React from 'react'
import { TouchableOpacity, Text, StyleSheet } from 'react-native'
import PropTypes from 'prop-types';
import { Ionicons } from '@expo/vector-icons'

const ItemChevron = (props) =>{
  const {text, onPress} = props
  return (
    <TouchableOpacity 
      style = {styles.container}
      onPress = {onPress}
    >
      {(text || text==='') && <Text style={styles.text}>{text}</Text>}
      <Ionicons name="ios-arrow-forward" size={24} color="grey" />
    </TouchableOpacity>
  )
}
ItemChevron.propTypes = {
  text: PropTypes.string,
  onPress: PropTypes.func,
};

const styles = StyleSheet.create ({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: "absolute",
    right: 10
  },
  text: {
    paddingHorizontal: 4, 
    color:'grey', 
    fontSize: 20
  }
})

export default ItemChevron

