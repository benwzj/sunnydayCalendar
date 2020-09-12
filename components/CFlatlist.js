import React from 'react';
import { View, FlatList, TouchableHighlight, 
  Text, StyleSheet } from 'react-native';

export const Item = ({ item, onPress, style, separators }) => (
  <TouchableHighlight
    id = {item.name}
    onPress = {onPress}
    onShowUnderlay = {separators.highlight}
    onHideUnderlay = {separators.unhighlight}
    style = {[styles.item, style]}
  >
    <View style = {styles.title}>
      <Text style = {styles.titleText}>{ item.title }</Text>
    </View>
  </TouchableHighlight>
)

const ItemSeparator = () => (
  <View style = {styles.separator} />
)

const CFlatlist = props => {
  const {data, renderItem, keyExtractor, style } = props
  return  (
    <View style = {styles.container}>
      <FlatList
        data = {data}
        renderItem = {renderItem}
        ItemSeparatorComponent = {ItemSeparator}
        keyExtractor = {keyExtractor}
        //extraData = {selectedId}
        style = { style }
      />
    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  separator: {
    height: 1,
    backgroundColor: '#DBDBE0',
  },
  titleText: {
    backgroundColor: 'transparent',
  },
  title: {
    flex: 1,
    height: 60,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  list: {
    //backgroundColor: '#EFEFF4',
    //width: '100%'
  },
});

export default CFlatlist;