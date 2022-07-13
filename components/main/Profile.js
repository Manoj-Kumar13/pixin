import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  TouchableHighlight,
} from "react-native";
import firebase from "firebase";
require("firebase/firestore");
import { clearData, fetchUser } from "../../redux/actions/index";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as ImagePicker from "expo-image-picker";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
require("firebase/firestore");
require("firebase/firebase-storage");
import { Button } from "@rneui/themed";

function Profile(props) {
  const [userPosts, setUserPosts] = useState([]);
  const [user, setUser] = useState(null);
  const [following, setFollowing] = useState(false);
  const [imageURL, setImageURL] = useState(null);
  const [flag, setFlag] = useState(0);

  useEffect(() => {
    const { currentUser, posts } = props;

    if (props.route.params.uid === firebase.auth().currentUser.uid) {
      setUser(currentUser);
      setUserPosts(posts);
      {
        currentUser.downloadURL
          ? setImageURL(currentUser.downloadURL)
          : setImageURL(null);
      }
    } else {
      firebase
        .firestore()
        .collection("users")
        .doc(props.route.params.uid)
        .get()
        .then((snapshot) => {
          if (snapshot.exists) {
            setUser(snapshot.data());
            {
              snapshot.data().downloadURL
                ? setImageURL(snapshot.data().downloadURL)
                : setImageURL(null);
            }
          } else {
            console.log("Does not exist");
          }
        });
      firebase
        .firestore()
        .collection("posts")
        .doc(props.route.params.uid)
        .collection("userposts")
        .orderBy("creation", "asc")
        .get()
        .then((snapshot) => {
          let posts = snapshot.docs.map((post) => {
            const data = post.data();
            const id = post.id;
            return { id, ...data };
          });
          setUserPosts(posts);
        });
    }

    if (props.following.indexOf(props.route.params.uid) > -1) {
      setFollowing(true);
    } else {
      setFollowing(false);
    }
  }, [props.route.params.uid, props.following]);

  const onFollow = () => {
    firebase
      .firestore()
      .collection("following")
      .doc(firebase.auth().currentUser.uid)
      .collection("userFollowing")
      .doc(props.route.params.uid)
      .set({});
  };

  const onUnfollow = () => {
    firebase
      .firestore()
      .collection("following")
      .doc(firebase.auth().currentUser.uid)
      .collection("userFollowing")
      .doc(props.route.params.uid)
      .delete();
  };

  const onLogout = () => {
    firebase.auth().signOut();
  };

  if (user === null) {
    return <View />;
  }

  const editProfile = () => {
    //Permission for picking image from gallery
    (async () => {
      if (Platform.OS !== "web") {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          alert("Sorry, we need camera roll permissions to make this work!");
        }
      } else {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          alert("Sorry, we need camera roll permissions to make this work!");
        }
      }
    })();
    pickImage();
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.6,
    });

    console.log("result: ", result);
    const childPath = `profilePic/${
      firebase.auth().currentUser.uid
    }/currentProfilePic`;

    const response = await fetch(result.uri);
    const blob = await response.blob();

    const task = firebase.storage().ref().child(childPath).put(blob);

    //task
    const taskProgress = (snapshot) => {
      console.log(`transferred: ${snapshot.bytesTransferred}`);
    };

    const taskCompleted = () => {
      task.snapshot.ref.getDownloadURL().then((snapshot) => {
        savePostData(snapshot);
      });
    };

    const taskError = (snapshot) => {
      console.log(snapshot);
    };

    task.on("state_changed", taskProgress, taskError, taskCompleted);
    //end
  };

  const savePostData = (downloadURL) => {
    firebase
      .firestore()
      .collection("users")
      .doc(firebase.auth().currentUser.uid)
      .update({
        downloadURL,
      });
    setImageURL(downloadURL);
  };

  if (imageURL === null) {
    setImageURL(user.downloadURL);
  }

  return (
    <View style={styles.container}>
      <View style={styles.infoContainer}>
        <View style={styles.profileInfo}>
          <View style={styles.profilePic}>
            {imageURL != null ? (
              <Image
                style={styles.profileImage}
                source={imageURL && { uri: imageURL }}
              />
            ) : (
              <MaterialCommunityIcons name="account-circle" size={80} />
            )}
          </View>
          <View style={styles.profileName}>
            <Text style={styles.username}>{user.name}</Text>
            <Text style={styles.email}>{user.email}</Text>
          </View>
        </View>

        {props.route.params.uid !== firebase.auth().currentUser.uid ? (
          <View>
            {following ? (
              <Button
                title="Following"
                color="#ed5b2d"
                onPress={() => onUnfollow()}
              />
            ) : (
              <Button
                title="Follow"
                color="#ed5b2d"
                onPress={() => onFollow()}
              />
            )}
          </View>
        ) : (
          <View>
            <TouchableHighlight style={styles.button}>
              <Button
                title="Edit Profile"
                color="#ed5b2d"
                radius={20}
                raised={true}
                onPress={() => editProfile()}
              />
            </TouchableHighlight>
            <Button
              title="LogOut"
              color="#ed5b2d"
              type="outline"
              buttonStyle={{
                borderColor: "#ed5b2d",
              }}
              titleStyle={{
                color: "#ed5b2d",
              }}
              radius={20}
              onPress={() => onLogout()}
            />
          </View>
        )}
      </View>
      <View style={styles.galleryContainer}>
        {userPosts.length > 0 ? (
          <FlatList
            numColumns={3}
            horizontal={false}
            data={userPosts}
            renderItem={({ item }) => (
              <View style={styles.imageContainer}>
                <Image
                  style={styles.image}
                  source={{ uri: item.downloadURL }}
                />
              </View>
            )}
          />
        ) : (
          <Text style={styles.noPostText}>No Post Available</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // marginTop: 40,
  },
  infoContainer: {
    margin: 10,
  },
  image: {
    flex: 1,
    aspectRatio: 1 / 1,
  },
  galleryContainer: {
    padding: 2,
  },
  imageContainer: {
    flex: 1 / 3,
    padding: 1,
  },
  username: {
    fontSize: 20,
    fontWeight: "bold",
  },
  email: {
    fontSize: 15,
    marginBottom: 10,
  },
  noPostText: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 80,
  },
  button: {
    marginBottom: 10,
  },
  profileInfo: {
    display: "flex",
    flexDirection: "row",
  },
  profilePic: {
    paddingRight: 10,
    marginBottom: 5,
  },
  profileName: {
    justifyContent: "center",
  },
  profileImage: {
    flex: 1,
    aspectRatio: 1 / 1,
    borderRadius: 50,
  },
});

const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
  posts: store.userState.posts,
  following: store.userState.following,
});

const mapDispatchProps = (dispatch) =>
  bindActionCreators({ clearData, fetchUser }, dispatch);

export default connect(mapStateToProps, mapDispatchProps)(Profile);
