import React, { useState, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  Button,
  TextInput,
  ActivityIndicator,
  Alert,
  StyleSheet
} from 'react-native';

import * as ExpoLocation from 'expo-location';
import * as ExpoPermissions from 'expo-permissions';

import MapPreview from '../components/MapPreview';

const TaskLocationSC = props => {
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState();

  const locationFromMap = props.route.params.pickedLocation;
  useEffect(() => {
    if ( locationFromMap ) {
      setSelectedLocation ( locationFromMap );
    }
  }, [locationFromMap]);

  const verifyPermissions = async () => {
    const result = await ExpoPermissions.askAsync(ExpoPermissions.LOCATION);
    if (result.status !== 'granted') {
      Alert.alert(
        'Insufficient permissions!',
        'You need to grant location permissions to use this app.',
        [{ text: 'Okay' }]
      );
      return false;
    }
    return true;
  };

  const getCurrentLocationHandler = async () => {
    const hasPermission = await verifyPermissions();
    if (!hasPermission) {
      return;
    }

    try {
      setIsFetchingLocation(true);
      const location = await ExpoLocation.getCurrentPositionAsync({
        timeout: 5000
      });
      setSelectedLocation({
        lat: location.coords.latitude,
        lng: location.coords.longitude
      });
    } catch (err) {
      Alert.alert(
        'Could not fetch location!',
        'Please try again later or pick a location on the map.',
        [{ text: 'Okay' }]
      );
    }
    setIsFetchingLocation(false);
  };

  const switchToMapScreen = () => {
    props.navigation.navigate (
      'MapScreen',
      { initialLocation: undefined, readonly: false }
    );
  };

  const savePlaceHandler = () => {
    //dispatch ( placeAdd (titleValue, selectedImage, selectedLocation) );
    props.navigation.navigate('TaskCreateSC', {selectedLocation});
  };

  return (
    <ScrollView>
      <View style={styles.form}>
        <View style = {styles.LocationPicker}>
          <MapPreview
            style = {styles.mapPreview}
            location = {selectedLocation}
            onPress = {switchToMapScreen}
          >
            {isFetchingLocation ? (
              <ActivityIndicator size="large" color='orange' />
            ) : (
              <Text>No location chosen yet!</Text>
            )}
          </MapPreview>
          <View style={styles.locationPickerActions}>
            <Button
              title = "Get Current Location"
              color = 'orange'
              onPress = {getCurrentLocationHandler}
            />
            <Button
              title = "Pick on Map"
              color = 'orange'
              onPress = {switchToMapScreen}
            />
          </View>
        </View>
        <Button
          title = "Save Place"
          color = 'blue'
          onPress = {savePlaceHandler}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  form: {
    margin: 30
  },
  label: {
    fontSize: 18,
    marginBottom: 15
  },
  textInput: {
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    marginBottom: 15,
    paddingVertical: 4,
    paddingHorizontal: 2
  },
  locationPicker: {
    marginBottom: 15
  },
  locationPickerActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%'
  },
  mapPreview: {
    marginBottom: 10,
    width: '100%',
    height: 150,
    borderColor: '#ccc',
    borderWidth: 1
  },
});

export default TaskLocationSC;