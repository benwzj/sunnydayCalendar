import React from 'react';
import {
  View,
  StyleSheet,
  Modal,
} from 'react-native';

const CModal = ({ isModalVisible, children }) => (
  <Modal
    animationType="slide"
    transparent
    visible={isModalVisible}
    onRequestClose={() => null}
  >
    <View style={styles.container}>
      <View style={styles.cardMain}>{children}</View>
    </View>
  </Modal>
);

const CARD_BACKGROUND_COLOR = '#ffffff';
const CONTAINER_BACKGROUND_COLOR = 'rgba(0,0,0,0.5)';
const styles = StyleSheet.create({
  cardMain: {
    alignSelf: 'center',
    backgroundColor: CARD_BACKGROUND_COLOR,
    borderRadius: 20,
    position: 'absolute',
    top: 100,
    width: 327,
  },
  container: {
    backgroundColor: CONTAINER_BACKGROUND_COLOR,
    flex: 1,
  },
});

export default CModal;
