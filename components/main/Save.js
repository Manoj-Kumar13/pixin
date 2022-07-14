import React, { useEffect } from "react";
import { useState } from "react";
import { View, Image, BackHandler } from "react-native";
import firebase from "firebase";
require("firebase/firestore");
require("firebase/firebase-storage");
import { Input, Divider, Button } from "@rneui/themed";
import { Alert } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

export default function Save(props, { navigation }) {
  const [caption, setCaption] = useState("");
  // console.log("image props", props.route.params.image);

  const uploadImage = async () => {
    const uri = props.route.params.image;
    const childPath = `post/${
      firebase.auth().currentUser.uid
    }/${Math.random().toString(36)}`;
    // console.log(childPath);

    const response = await fetch(uri);
    const blob = await response.blob();

    const task = firebase.storage().ref().child(childPath).put(blob);

    const taskProgress = (snapshot) => {
      console.log(`transferred: ${snapshot.bytesTransferred}`);
    };

    const taskCompleted = () => {
      task.snapshot.ref.getDownloadURL().then((snapshot) => {
        savePostData(snapshot);
        // console.log(snapshot);
      });
    };

    const taskError = (snapshot) => {
      // console.log(snapshot);
    };

    task.on("state_changed", taskProgress, taskError, taskCompleted);
  };

  const savePostData = (downloadURL) => {
    if (caption.trim().length > 0) {
      firebase
        .firestore()
        .collection("posts")
        .doc(firebase.auth().currentUser.uid)
        .collection("userposts")
        .add({
          downloadURL,
          caption,
          creation: firebase.firestore.FieldValue.serverTimestamp(),
        })
        .then(() => {
          props.navigation.popToTop();
        });
    } else {
      Alert.alert("Unable to upload", "Caption can't be empty");
    }
  };
  return (
    <View
      style={{
        flex: 1,
        padding: 20,
      }}
    >
      <Image source={{ uri: props.route.params.image }} style={{ flex: 0.7 }} />
      <Divider
        style={{ margin: 20, opacity: 0.5 }}
        color="#ed5b2d"
        insetType="middle"
        subHeaderStyle={{}}
        width={1}
        orientation="horizontal"
      />
      <Input
        placeholder="Write a caption..."
        maxLength={50}
        onChangeText={(caption) => setCaption(caption)}
        containerStyle={{}}
        disabledInputStyle={{ background: "#ed5b2d" }}
        inputContainerStyle={{ paddingLeft: 5 }}
        inputStyle={{}}
        label="Caption"
        labelStyle={{ color: "#ed5b2d" }}
        labelProps={{}}
        leftIcon={{
          type: "font-awesome",
          name: "heartbeat",
          color: "#ed5b2d",
        }}
        leftIconContainerStyle={{}}
        rightIconContainerStyle={{}}
      />

      <Button
        title="Save"
        onPress={() => uploadImage()}
        radius={20}
        color="#ed5b2d"
        buttonStyle={{ width: "80%", alignSelf: "center" }}
      />
    </View>
  );
}
