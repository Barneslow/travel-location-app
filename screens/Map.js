import { useCallback, useLayoutEffect, useState } from "react";
import { Alert, StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";
import IconButton from "../components/ui/IconButton";

const Map = ({ navigation, route }) => {
  const initialLocation = route.params && {
    lat: route.params.initialLat,
    lng: route.params.initialLng,
  };

  const [selectedLocation, setSelectedLocation] = useState(initialLocation);

  const initialRegion = {
    latitude: initialLocation ? initialLocation.lat : 37.78825,
    longitude: initialLocation ? initialLocation.lng : -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  function selectLocationHandler(event) {
    const lat = event.nativeEvent.coordinate.latitude;
    const lng = event.nativeEvent.coordinate.longitude;

    setSelectedLocation({ lat: lat, lng: lng });
  }

  const savedPickedLocationHandler = useCallback(() => {
    if (initialLocation) return;
    if (!selectedLocation) {
      Alert.alert("No Location Picked", "Select a location on the map!");
      return;
    }

    navigation.navigate("AddPlace", {
      pickedLat: selectedLocation.lat,
      pickedLng: selectedLocation.lng,
    });
  }, [navigation, selectedLocation]);

  useLayoutEffect(() => {
    if (initialLocation) return;

    navigation.setOptions({
      headerRight: ({ tintColor }) => (
        <IconButton
          icon="save"
          size={24}
          color={tintColor}
          onPress={savedPickedLocationHandler}
        />
      ),
    });
  }, [savedPickedLocationHandler, navigation, initialLocation]);

  return (
    <MapView
      style={styles.map}
      initialRegion={initialRegion}
      onPress={selectLocationHandler}
    >
      {selectedLocation && (
        <Marker
          title="Picked Location"
          coordinate={{
            latitude: selectedLocation.lat,
            longitude: selectedLocation.lng,
          }}
        />
      )}
    </MapView>
  );
};

export default Map;

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
});
