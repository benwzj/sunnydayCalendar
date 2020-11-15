import React, { useState, useEffect } from 'react';
import {
  Button,
  StyleSheet,
  Platform
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';

const MapSC = props => {
  const { navigation, route } = props;
  const { initialLocation, readonly } = route.params;
  //console.log (initialLocation, readonly);
  const [selectedLocation, setSelectedLocation] = useState (initialLocation);

  const mapRegion = {
    latitude: initialLocation ? initialLocation.lat : -37.815340,
    longitude: initialLocation ? initialLocation.lng : 144.963230,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421
  };

  const selectLocationHandler = event => {
    if ( !readonly ) {  
      setSelectedLocation({
        lat: event.nativeEvent.coordinate.latitude,
        lng: event.nativeEvent.coordinate.longitude
      });
    }
  };

  useEffect (() => {
    if ( !readonly ){ 
      const savePickedLocationHandler = () => {
        if (!selectedLocation) {
          // could show an alert!
          return;
        }
        navigation.navigate (
          'TaskLocationSC', 
          {locationAddress: {selected: true, location: selectedLocation, address: '' }}
        );
      };
      navigation.setOptions({
        headerRight: () => (
          <Button 
            onPress = {savePickedLocationHandler} 
            title = "Save" />
        ),
      });
    }
  }, [readonly, selectedLocation, navigation]);

  let markerCoordinates;
  if (selectedLocation) {
    markerCoordinates = {
      latitude: selectedLocation.lat,
      longitude: selectedLocation.lng
    };
  }

  return (
    <MapView
      style = {styles.map}
      region = {mapRegion}
      onPress = {selectLocationHandler}
    >
      {markerCoordinates && (
        <Marker title="Picked Location" coordinate={markerCoordinates} />
      )}
    </MapView>
  );
};

const styles = StyleSheet.create({
  map: {
    flex: 1
  },
  headerButton: {
    marginHorizontal: 20
  },
  headerButtonText: {
    fontSize: 16,
    color: Platform.OS === 'android' ? 'white' : 'orange'
  }
});

export default MapSC;
