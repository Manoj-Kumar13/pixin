import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, Text, View, Button, Image } from "react-native";
import { Camera } from "expo-camera";
import { Dimensions } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Icon } from "@rneui/themed";

export default function Add({ navigation }) {
  const [hasGalleryPermission, setHasGalleryPermission] = useState(null);
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [camera, setCamera] = useState(null);
  const [image, setImage] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.front);

  const dimensions = useRef(Dimensions.get("window"));
  const screenWidth = dimensions.current.width;
  const height = Math.round((screenWidth * 4) / 3);

  useEffect(() => {
    (async () => {
      const cameraStatus = await Camera.requestPermissionsAsync();
      setHasCameraPermission(cameraStatus.status === "granted");

      const galleryStatus =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      setHasGalleryPermission(galleryStatus.status === "granted");
    })();
  }, []);

  const takePicture = async () => {
    if (camera) {
      const data = await camera.takePictureAsync({
        quality: 0.65,
      });
      setImage(data.uri);
    }
  };

  if (image) {
    navigation.navigate("Save", { image });
  }

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.65,
    });
    console.log(result);

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  if (hasCameraPermission === null || hasGalleryPermission === null) {
    return <View />;
  }
  if (hasCameraPermission === false || hasGalleryPermission === false) {
    return <Text>No access to camera and Gallery</Text>;
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.cameraContainer}>
        <Camera
          ref={(ref) => setCamera(ref)}
          style={{
            flex: 1,
            // aspectRatio: 1,
            height: height,
          }}
          type={type}
          ratio={"4:3"}
        />
      </View>
      <View style={styles.controlContainer}>
        <Icon
          raised
          name="picture"
          type="fontisto"
          color="#f50"
          size={30}
          onPress={() => pickImage()}
        />
        <Icon
          raised
          name="circle"
          type="entypo"
          color="#f50"
          size={50}
          onPress={() => takePicture()}
        />
        <Icon
          raised
          name="flip-camera-android"
          type="materialicons"
          color="#f50"
          size={30}
          onPress={() => {
            setType(
              type === Camera.Constants.Type.back
                ? Camera.Constants.Type.front
                : Camera.Constants.Type.back
            );
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cameraContainer: {
    flex: 1,
    flexDirection: "row",
    // borderWidth: 2,
    // borderColor: "blue",
  },
  fixedRatio: {
    flex: 1,
    aspectRatio: 1,
  },
  controlContainer: {
    // borderWidth: 2,
    borderColor: "red",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    flex: 0.35,
  },
});
