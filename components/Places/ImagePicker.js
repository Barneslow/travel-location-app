import { useState } from "react";

import { Alert, Button, Image, StyleSheet, Text, View } from "react-native";
import {
  launchCameraAsync,
  useCameraPermissions,
  PermissionStatus,
} from "expo-image-picker";
import { Colors } from "../../constants/GlobalColors";
import OutlinedButton from "../ui/OutlinedButton";

const ImagePicker = ({ onTakeImage }) => {
  const [image, setImage] = useState("");
  const [cameraPermissonInformation, requestPermisson] = useCameraPermissions();

  async function verifyPermission() {
    if (cameraPermissonInformation.status === PermissionStatus.UNDETERMINED) {
      const permissionResponse = await requestPermisson();

      return permissionResponse.granted;
    }

    if (cameraPermissonInformation.status === PermissionStatus.DENIED) {
      Alert.alert(
        "Insufficient Permissions!",
        "You need to grand camera permissions to use this app"
      );

      return false;
    }

    return true;
  }

  async function takeImageHandler() {
    const hasPermission = await verifyPermission();

    if (!hasPermission) return;

    const response = await launchCameraAsync({
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.5,
    });

    setImage(response.uri);
    onTakeImage(response.uri);
  }

  let imagePreview = <Text>No Image Taken</Text>;

  if (image) {
    imagePreview = <Image style={styles.image} source={{ uri: image }} />;
  }

  return (
    <View>
      <View style={styles.imagePreview}>{imagePreview}</View>
      <OutlinedButton icon="camera" onPress={takeImageHandler}>
        Take Image
      </OutlinedButton>
    </View>
  );
};

export default ImagePicker;

const styles = StyleSheet.create({
  imagePreview: {
    width: "100%",
    height: 200,
    marginVertical: 8,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.primary100,
    borderRadius: 4,
    overflow: "hidden",
  },

  image: {
    width: "100%",
    height: "100%",
  },
});
