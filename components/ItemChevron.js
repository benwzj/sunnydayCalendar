import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
// eslint-disable-next-line import/no-extraneous-dependencies
// import { Ionicons } from '@expo/vector-icons';

const ItemChevron = (props) => {
  const { text } = props;
  return (
    <View
      style={styles.container}
    >
      <Text style={styles.text}>
        {text}
        {' '}
        ❭
      </Text>
      {/* <Ionicons name="ios-arrow-forward" size={16} color="grey" /> */}
    </View>
  );
};
ItemChevron.propTypes = {
  text: PropTypes.string,
};
ItemChevron.defaultProps = {
  text: '',
};

const TEXT_COLOR = '#999';
const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'absolute',
    right: 10,
  },
  text: {
    color: TEXT_COLOR,
    fontSize: 16,
    fontWeight: 'bold',
    paddingHorizontal: 12,
  },
});

export default ItemChevron;
