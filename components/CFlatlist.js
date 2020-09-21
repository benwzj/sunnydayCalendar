import React from 'react';
import { View, FlatList, TouchableHighlight, 
        Text, StyleSheet, I18nManager, Animated, } from 'react-native';
import { RectButton } from 'react-native-gesture-handler'
import Swipeable from 'react-native-gesture-handler/Swipeable'

export const ItemExample1 = ({ item, onPress, style, separators }) => (
  <TouchableHighlight
    id = {item.id}
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

export const ItemExample2 = ({ item }) => (
  <RectButton style={styles.rectButton} onPress={onPress}>
    <Text style={styles.fromText}>{item.title}</Text>
    <Text numberOfLines={2} style={styles.messageText}>
      {item.id}
    </Text>
    <Text style={styles.dateText}>
      {item.type} {'❭'}
    </Text>
  </RectButton>
)

export const SwipeableRow = (props) => {
  let _swipeableRow = null
  const { children, butTitle1, onButPress1, butTitle2, onButPress2 } = props
  const renderRightAction = (text, onPress, color, x, progress) => {
    const trans = progress.interpolate({
      inputRange: [0, 1],
      outputRange: [x, 0],
    })
    const pressHandler = () => {
      close()
      onPress && onPress()
    }
    return (
      <Animated.View style={{ flex: 1, transform: [{ translateX: trans }] }}>
        <RectButton
          style = {[styles.rightAction, { backgroundColor: color }]}
          onPress = {pressHandler}
        >
          <Text style = {styles.actionText}>{text}</Text>
        </RectButton>
      </Animated.View>
    );
  };
  const renderRightActions = progress => (
    <View 
      style = {{ width: 145, 
        flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row' 
      }}
    >
      { butTitle1 && renderRightAction (
        butTitle1, 
        onButPress1,
        '#ffab00', 
        128, 
        progress
      )}
      { butTitle2 && renderRightAction (
        butTitle2, 
        onButPress2,
        '#dd2c00', 
        64, 
        progress
      )}
    </View>
  );
  const updateRef = ref => {
    _swipeableRow = ref
  }

  const close = () => {
    _swipeableRow && _swipeableRow.close()
  }
  return (
    <Swipeable
      ref = {updateRef}
      friction = {2}
      leftThreshold = {30}
      rightThreshold = {40}
      renderRightActions = {renderRightActions}
    >
      {children}
    </Swipeable>
  );
}

const ItemSeparator = () => (
  <View style = {styles.separator} />
)

const CFlatlist = props => {
  const { data, renderItem, keyExtractor, style } = props
  return  (
    <View style = {styles.container}>
      <FlatList
        data = {data}
        renderItem = {renderItem}
        ItemSeparatorComponent = {ItemSeparator}
        keyExtractor = {keyExtractor}
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
  actionText: {
    color: 'white',
    fontSize: 16,
    backgroundColor: 'transparent',
    padding: 10,
  },
  rightAction: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  rectButton: {
    flex: 1,
    height: 80,
    paddingVertical: 10,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    flexDirection: 'column',
    backgroundColor: 'white',
  },
  separator: {
    backgroundColor: 'rgb(200, 199, 204)',
    height: StyleSheet.hairlineWidth,
  },
  fromText: {
    fontWeight: 'bold',
    backgroundColor: 'transparent',
  },
  messageText: {
    color: '#999',
    backgroundColor: 'transparent',
  },
  dateText: {
    backgroundColor: 'transparent',
    position: 'absolute',
    right: 20,
    top: 10,
    color: '#999',
    fontWeight: 'bold',
  },
});

export default CFlatlist;