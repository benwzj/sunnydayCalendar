import React from 'react';
import {
  View, TextInput, Text, TouchableOpacity,
} from 'react-native';

import CModal from './CModal';

const TaskDetail = () => (
  <CModal isModalVisible={isModalVisible}>
    <DateTimePicker
      isVisible={isDateTimePickerVisible}
      onConfirm={this._handleDatePicked}
      onCancel={this._hideDateTimePicker}
      mode="time"
    />
    <View style={styles.taskContainer}>
      <TextInput
        style={styles.title}
        onChangeText={(text) => {
          const prevSelectedTask = { ...selectedTask };
          prevSelectedTask.title = text;
          this.setState({
            selectedTask: prevSelectedTask,
          });
        }}
        value={selectedTask.title}
        placeholder="What is in your mind?"
      />
      <Text
        style={{
          fontSize: 14,
          color: '#BDC6D8',
          marginVertical: 10,
        }}
      >
        Suggestion
      </Text>
      <View style={{ flexDirection: 'row' }}>
        <View style={styles.readBook}>
          <Text style={{ textAlign: 'center', fontSize: 14 }}>
            Read book
          </Text>
        </View>
        <View style={styles.design}>
          <Text style={{ textAlign: 'center', fontSize: 14 }}>
            Design
          </Text>
        </View>
        <View style={styles.learn}>
          <Text style={{ textAlign: 'center', fontSize: 14 }}>
            Learn
          </Text>
        </View>
      </View>
      <View style={styles.notesContent} />
      <View>
        <Text
          style={{
            color: '#9CAAC4',
            fontSize: 16,
            fontWeight: '600',
          }}
        >
          Notes
        </Text>
        <TextInput
          style={{
            height: 25,
            fontSize: 19,
            marginTop: 3,
          }}
          onChangeText={(text) => {
            const prevSelectedTask = { ...selectedTask };
            prevSelectedTask.notes = text;
            this.setState({
              selectedTask: prevSelectedTask,
            });
          }}
          value={selectedTask.notes}
          placeholder="Enter notes about the task."
        />
      </View>
      <View style={styles.sepeerator} />
      <View>
        <Text
          style={{
            color: '#9CAAC4',
            fontSize: 16,
            fontWeight: '600',
          }}
        >
          Times
        </Text>
        <TouchableOpacity
          onPress={() => this._showDateTimePicker()}
          style={{
            height: 25,
            marginTop: 3,
          }}
        >
          <Text style={{ fontSize: 19 }}>
            {moment(selectedTask.alarm.time).format('h:mm A')}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.sepeerator} />
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <View>
          <Text
            style={{
              color: '#9CAAC4',
              fontSize: 16,
              fontWeight: '600',
            }}
          >
            Alarm
          </Text>
          <View
            style={{
              height: 25,
              marginTop: 3,
            }}
          >
            <Text style={{ fontSize: 19 }}>
              {moment(selectedTask.alarm.time).format('h:mm A')}
            </Text>
          </View>
        </View>
        <Switch
          value={selectedTask.alarm.isOn}
          onValueChange={this.handleAlarmSet}
        />
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <TouchableOpacity
          onPress={async () => {
            this._handleModalVisible();
            if (selectedTask.alarm.isOn) {
              await this._updateAlarm();
            } else {
              await this._deleteAlarm();
            }
            await value.updateSelectedTask({
              date: currentDate,
              todo: selectedTask,
            });
            this._updateCurrentTask(currentDate);
          }}
          style={styles.updateButton}
        >
          <Text
            style={{
              fontSize: 18,
              textAlign: 'center',
              color: '#fff',
            }}
          >
            UPDATE
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={async () => {
            this._handleModalVisible();
            this._deleteAlarm();
            await value.deleteSelectedTask({
              date: currentDate,
              todo: selectedTask,
            });
            this._updateCurrentTask(currentDate);
          }}
          style={styles.deleteButton}
        >
          <Text
            style={{
              fontSize: 18,
              textAlign: 'center',
              color: '#fff',
            }}
          >
            DELETE
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  </CModal>
);

export default TaskDetail;
