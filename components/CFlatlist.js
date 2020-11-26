/* eslint-disable react-native/no-color-literals */
import React from 'react';
import {
  View, FlatList, TouchableHighlight,
  Text, StyleSheet, I18nManager, Animated,
} from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import Swipeable from 'react-native-gesture-handler/Swipeable';

export const ItemExample1 = ({
  item, onPress, style, separators,
}) => (
  <TouchableHighlight
    id={item.id}
    onPress={onPress}
    onShowUnderlay={separators.highlight}
    onHideUnderlay={separators.unhighlight}
    style={[styles.item, style]}
  >
    <View style={styles.title}>
      <Text style={styles.titleText}>{ item.title }</Text>
    </View>
  </TouchableHighlight>
);

export const ItemExample2 = ({ item, onPress }) => (
  <RectButton style={styles.rectButton} onPress={onPress}>
    <Text style={styles.fromText}>{item.title}</Text>
    <Text numberOfLines={2} style={styles.messageText}>
      {item.id}
    </Text>
    <Text style={styles.dateText}>
      {item.type}
      {' '}
      ❭
    </Text>
  </RectButton>
);

export const SwipeableRow = (props) => {
  // eslint-disable-next-line no-underscore-dangle
  let _swipeableRow = null;
  const {
    children, butTitle1, onButPress1, butTitle2, onButPress2,
  } = props;
  const renderRightAction = (text, onPress, color, x, progress) => {
    const trans = progress.interpolate({
      inputRange: [0, 1],
      outputRange: [x, 0],
    });
    const pressHandler = () => {
      close();
      if (onPress) {
        onPress();
      }
    };
    return (
      // eslint-disable-next-line react-native/no-inline-styles
      <Animated.View style={{ flex: 1, transform: [{ translateX: trans }] }}>
        <RectButton
          style={[styles.rightAction, { backgroundColor: color }]}
          onPress={pressHandler}
        >
          <Text style={styles.actionText}>{text}</Text>
        </RectButton>
      </Animated.View>
    );
  };
  const renderRightActions = (progress) => (
    <View
      // eslint-disable-next-line react-native/no-inline-styles
      style={{
        width: 145,
        flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
      }}
    >
      { butTitle1 && renderRightAction(
        butTitle1,
        onButPress1,
        '#ffab00',
        128,
        progress,
      )}
      { butTitle2 && renderRightAction(
        butTitle2,
        onButPress2,
        '#dd2c00',
        64,
        progress,
      )}
    </View>
  );
  const updateRef = (ref) => {
    _swipeableRow = ref;
  };

  const close = () => {
    // eslint-disable-next-line no-unused-expressions
    _swipeableRow && _swipeableRow.close();
  };
  return (
    <Swipeable
      ref={updateRef}
      friction={2}
      leftThreshold={30}
      rightThreshold={40}
      renderRightActions={renderRightActions}
    >
      {children}
    </Swipeable>
  );
};

const ItemSeparator = () => (
  <View style={styles.separator} />
);

const CFlatlist = (props) => {
  const {
    data, renderItem, keyExtractor, style,
  } = props;
  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        renderItem={renderItem}
        ItemSeparatorComponent={ItemSeparator}
        keyExtractor={keyExtractor}
        style={style}
      />
    </View>
  );
};

const BACKGROUND_COLOR = 'transparent';
const styles = StyleSheet.create({
  actionText: {
    backgroundColor: BACKGROUND_COLOR,
    color: 'white',
    fontSize: 16,
    padding: 10,
  },
  container: {
    flex: 1,
  },
  dateText: {
    backgroundColor: BACKGROUND_COLOR,
    color: '#999',
    fontWeight: 'bold',
    position: 'absolute',
    right: 20,
    top: 10,
  },
  fromText: {
    backgroundColor: BACKGROUND_COLOR,
    fontWeight: 'bold',
  },
  messageText: {
    backgroundColor: BACKGROUND_COLOR,
    color: '#999',
  },
  rectButton: {
    backgroundColor: 'white',
    flex: 1,
    flexDirection: 'column',
    height: 80,
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  rightAction: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  // separator: {
  //   backgroundColor: '#DBDBE0',
  //   height: 1,
  // },
  separator: {
    backgroundColor: 'rgb(200, 199, 204)',
    height: StyleSheet.hairlineWidth,
  },
  title: {
    alignItems: 'center',
    backgroundColor: '#fff',
    flex: 1,
    flexDirection: 'row',
    height: 60,
    padding: 10,
  },
  titleText: {
    backgroundColor: BACKGROUND_COLOR,
  },
});

export default CFlatlist;
