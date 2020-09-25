import React from 'react'
import {
  View,
  StyleSheet,
  Modal
} from 'react-native'

const CModal = ({ isModalVisible, children }) =>{
  return (
    <Modal
      animationType="slide"
      transparent
      visible={isModalVisible}
      onRequestClose={() => null}
    >
      <View style={styles.container} >
        <View style={styles.cardMain}>{children}</View>
      </View>
    </Modal>
  );
}
const styles = StyleSheet.create({
  cardMain: {
    position: 'absolute',
    top: 100,
    width: 327,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    alignSelf: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
});

export default CModal