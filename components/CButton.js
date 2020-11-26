import React from 'react';
import {
  Text, TouchableOpacity, StyleSheet,
} from 'react-native';

const CButton = (props) => {
  const {
    onPress, title, style, textStyle,
  } = props;
  const buttonWidth = title.length * 10 + 40;
  return (
    <TouchableOpacity
      {...props}
      onPress={onPress}
      style={[styles.container, { width: buttonWidth }, style]}
    >
      <Text style={[styles.text, textStyle]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const BACKGROUND_COLOR = '#ff6347';
const TEXT_COLOR = 'fff';
const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    backgroundColor: BACKGROUND_COLOR,
    borderRadius: 5,
    height: 38,
    justifyContent: 'center',
    marginTop: 40,
  },
  text: {
    color: TEXT_COLOR,
    fontSize: 18,
    textAlign: 'center',
  },
});
export default CButton;
