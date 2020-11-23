import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Button,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from 'react-native';

// eslint-disable-next-line import/no-extraneous-dependencies
import * as ExpoLocation from 'expo-location';
// eslint-disable-next-line import/no-extraneous-dependencies
import * as ExpoPermissions from 'expo-permissions';

import MapPreview from '../components/MapPreview';
import ENV from '../env';

//
// depending on props.route.params.locationAddress
// locationAddress = {selected: false, location: {lat:0, lng:0}, address:''}

const TaskLocationSC = ({ navigation, route }) => {
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState();
  const [selectedAddress, setSelectedAddress] = useState('');
  // const locationFromMap = props.route.params.pickedLocation;
  const { locationAddress } = route.params;
  // console.log('props.route.params.locationAddress: ', locationAddress);
  useEffect(() => {
    const updateLocationAddress = async () => {
      if (locationAddress) {
        if (locationAddress.selected) {
          setSelectedLocation(locationAddress.location);
          const address = await getAddressFromLocation(locationAddress.location);
          setSelectedAddress(address);
        }
      }
    };
    updateLocationAddress();
  }, [locationAddress]);

  const verifyPermissions = async () => {
    const result = await ExpoPermissions.askAsync(ExpoPermissions.LOCATION);
    if (result.status !== 'granted') {
      Alert.alert(
        'Insufficient permissions!',
        'You need to grant location permissions to use this app.',
        [{ text: 'Okay' }],
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
        timeout: 5000,
      });
      setSelectedLocation({
        lat: location.coords.latitude,
        lng: location.coords.longitude,
      });
    } catch (err) {
      Alert.alert(
        'Could not fetch location!',
        'Please try again later or pick a location on the map.',
        [{ text: 'Okay' }],
      );
    }
    setIsFetchingLocation(false);
  };

  const switchToMapScreen = () => {
    navigation.navigate(
      'MapSC',
      { initialLocation: undefined, readonly: false },
    );
  };

  const getAddressFromLocation = async (location) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${
          location.lat
        },${location.lng}&key=${ENV.googleApiKey}`,
      );

      if (!response.ok) {
        const errorResData = await response.json();
        throw new Error(errorResData.error.message);
      }

      const resData = await response.json();
      if (!resData.results) {
        throw new Error(resData.error.message);
      }
      return resData.results[0].formatted_address;
    } catch (e) {
      // console.log(e);
      return '';
    }
  };

  const savePlaceHandler = () => {
    // dispatch ( placeAdd (titleValue, selectedImage, selectedLocation) );
    // const address = await getAddressFromLocation (selectedLocation)
    navigation.navigate('TaskCreateSC', {
      locationAddress: {
        address: selectedAddress,
        selected: true,
        location: selectedLocation,
      },
    });
  };

  return (
    <ScrollView>
      <View style={styles.form}>
        <View style={styles.LocationPicker}>
          <Text>{selectedAddress}</Text>
          <MapPreview
            style={styles.mapPreview}
            location={selectedLocation}
            onPress={switchToMapScreen}
          >
            {isFetchingLocation ? (
              <ActivityIndicator size="large" color="orange" />
            ) : (
              <Text>No location chosen yet!</Text>
            )}
          </MapPreview>
          <View style={styles.locationPickerActions}>
            <Button
              title="Get Current Location"
              color="orange"
              onPress={getCurrentLocationHandler}
            />
            <Button
              title="Pick on Map"
              color="orange"
              onPress={switchToMapScreen}
            />
          </View>
        </View>
        <Button
          title="Select Place"
          color="blue"
          onPress={savePlaceHandler}
        />
      </View>
    </ScrollView>
  );
};

const MAP_BORDER_COLOR = '#ccc';
const styles = StyleSheet.create({
  form: {
    margin: 30,
  },
  locationPickerActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  mapPreview: {
    borderColor: MAP_BORDER_COLOR,
    borderWidth: 1,
    height: 350,
    marginBottom: 10,
    width: '100%',
  },
});

export default TaskLocationSC;
