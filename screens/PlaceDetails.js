import { useEffect, useState } from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import OutlinedButton from "../components/ui/OutlinedButton";
import { Colors } from "../constants/GlobalColors";
import { fetchPlaceDetails } from "../util/database";

const PlaceDetails = ({ route, navigation }) => {
  const [loadedPlace, setLoadedPlace] = useState();
  function showOnMapHandler() {
    navigation.navigate("Map", {
      initialLat: loadedPlace.location.lat,
      initialLng: loadedPlace.location.lng,
    });
  }

  const selectedPlaceId = route.params.placeId;

  useEffect(() => {
    async function loadPlaceDetails() {
      const place = await fetchPlaceDetails(selectedPlaceId);
      setLoadedPlace(place);

      console.log(place);
      navigation.setOptions({
        title: place.title,
      });
    }

    loadPlaceDetails();
  }, [selectedPlaceId]);

  if (!loadedPlace) {
    return (
      <View style={styles.fallback}>
        <Text>Loading Place Data...</Text>
      </View>
    );
  }

  return (
    <ScrollView>
      <Image style={styles.image} source={{ uri: loadedPlace.imageUri }} />
      <View style={styles.locationContainer}>
        <View style={styles.addressContainer}>
          <Text style={styles.address}>{loadedPlace.address}</Text>
        </View>
        <OutlinedButton icon="map" onPress={showOnMapHandler}>
          View on Map
        </OutlinedButton>
      </View>
    </ScrollView>
  );
};

export default PlaceDetails;

const styles = StyleSheet.create({
  image: {
    height: "35%",
    minHeight: 300,
    width: "100%",
  },
  locationContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  addressContainer: {
    padding: 20,
  },
  address: {
    color: Colors.primary500,
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },

  fallback: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
