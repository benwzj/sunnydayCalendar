import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

import ENV from '../env';

const MapPreview = ({ location, style, children }) => {
  let imagePreviewUrl;

  if (location) {
    imagePreviewUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${
      location.lat
    },${
      location.lng
    }&zoom=14&size=400x200&maptype=roadmap&markers=color:red%7Clabel:A%7C${
      location.lat
    },${location.lng}&key=${ENV.googleApiKey}`;
  }

  return (
    <View
      style={{ ...styles.mapPreview, ...style }}
    >
      {location ? (
        <Image style={styles.mapImage} source={{ uri: imagePreviewUrl }} />
      ) : (
        children
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  mapImage: {
    height: '100%',
    width: '100%',
  },
  mapPreview: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default MapPreview;
