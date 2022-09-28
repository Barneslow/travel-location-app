import { useEffect, useState } from "react";
import { Alert, Image, StyleSheet, Text, View } from "react-native";
import { Colors } from "../../constants/GlobalColors";
import {
  getCurrentPositionAsync,
  useForegroundPermissions,
  PermissionStatus,
} from "expo-location";
import OutlinedButton from "../ui/OutlinedButton";
import { getAddress, getMapPreview } from "../../util/locations";
import {
  useNavigation,
  useRoute,
  useIsFocused,
} from "@react-navigation/native";

function LocationPicker({ onLocationPicker }) {
  const navigation = useNavigation();
  const route = useRoute();
  const isFocused = useIsFocused();

  const [pickedLocation, setPickedLocation] = useState();
  const [locationPermissionInfo, requestPermisson] = useForegroundPermissions();

  useEffect(() => {
    if (isFocused && route.params) {
      const mapPickedLocation = {
        lat: route.params.pickedLat,
        lng: route.params.pickedLng,
      };
      setPickedLocation(mapPickedLocation);
    }
  }, [route, isFocused]);

  useEffect(() => {
    async function handleLocation() {
      if (pickedLocation) {
        const address = await getAddress(
          pickedLocation.lat,
          pickedLocation.lng
        );
        onLocationPicker({ ...pickedLocation, address: address });
      }
    }

    handleLocation();
  }, [pickedLocation, onLocationPicker]);

  async function verifyPermission() {
    if (locationPermissionInfo.status === PermissionStatus.UNDETERMINED) {
      const permissionResponse = await requestPermisson();

      return permissionResponse.granted;
    }

    if (locationPermissionInfo.status === PermissionStatus.DENIED) {
      Alert.alert(
        "Insufficient Permissions!",
        "You need to grant location permissions to use this app"
      );

      return false;
    }

    return true;
  }

  async function findLocationHandler() {
    const hasPermission = await verifyPermission();

    if (!hasPermission) return;

    const location = await getCurrentPositionAsync({});

    setPickedLocation({
      lat: location.coords.latitude,
      lng: location.coords.longitude,
    });
  }

  function pickOnMapHandler() {
    navigation.navigate("Map");
  }

  let locationPreview = <Text>No Location Picked Yet</Text>;

  if (pickedLocation) {
    locationPreview = (
      <Image
        style={styles.image}
        source={{
          uri: getMapPreview(pickedLocation.lat, pickedLocation.lng),
        }}
      />
    );
  }

  return (
    <View>
      <View style={styles.mapPreview}>{locationPreview}</View>
      <View style={styles.actions}>
        <OutlinedButton icon="location" onPress={findLocationHandler}>
          Locate User
        </OutlinedButton>
        <OutlinedButton icon="map" onPress={pickOnMapHandler}>
          Pick on Map
        </OutlinedButton>
      </View>
    </View>
  );
}

export default LocationPicker;

const styles = StyleSheet.create({
  mapPreview: {
    width: "100%",
    height: 200,
    marginVertical: 8,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.primary100,
    borderRadius: 4,
    overflow: "hidden",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },

  image: {
    width: "100%",
    height: "100%",
    borderRadius: 4,
  },
});
