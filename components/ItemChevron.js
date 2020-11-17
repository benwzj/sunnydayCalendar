import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import PropTypes from 'prop-types';
import { Ionicons } from '@expo/vector-icons'

const ItemChevron = (props) =>{
  const {text} = props
  return (
    <View 
      style = {styles.container}
    >
      {(text || text==='') && <Text style={styles.text}>{text}</Text>}
      <Ionicons name="ios-arrow-forward" size={16} color="grey" />
    </View>
  )
}
ItemChevron.propTypes = {
  text: PropTypes.string,
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
    paddingHorizontal: 12, 
    color:'grey', 
    fontSize: 16
  }
})

export default ItemChevron

