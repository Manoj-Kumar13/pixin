import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  Button,
  TouchableHighlight,
} from "react-native";
import firebase from "firebase";
require("firebase/firestore");
import { connect } from "react-redux";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

function Feed(props) {
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(null);
  const [following, setFollowing] = useState(false);

  useEffect(() => {
    if (
      props.userFollowingLoaded == props.following.length &&
      props.following.length !== 0
    ) {
      props.feed.sort(function (x, y) {
        return x.creation - y.creation;
      });

      setPosts(props.feed);
    }
  }, [props.userFollowingLoaded, props.feed]);

  const onLikePress = (userId, postId) => {
    firebase
      .firestore()
      .collection("posts")
      .doc(userId)
      .collection("userposts")
      .doc(postId)
      .collection("likes")
      .doc(firebase.auth().currentUser.uid)
      .set({});
  };

  const onDislikePress = (userId, postId) => {
    firebase
      .firestore()
      .collection("posts")
      .doc(userId)
      .collection("userposts")
      .doc(postId)
      .collection("likes")
      .doc(firebase.auth().currentUser.uid)
      .delete();
  };

  return (
    <View style={styles.container}>
      {posts.length <= 0 ? (
        <View style={styles.feedTextContainer}>
          <Text style={styles.feedText}>
            Follow People to be shown in the Feed
          </Text>
        </View>
      ) : (
        <View style={styles.galleryContainer}>
          <FlatList
            numColumns={1}
            horizontal={false}
            data={posts}
            renderItem={({ item }) => (
              <View style={styles.imageContainer}>
                <View style={styles.username}>
                  <View style={styles.feedProfileContainer}>
                    {item.user.downloadURL ? (
                      <Image
                        style={styles.feedProfileImage}
                        source={{ uri: item.user.downloadURL }}
                      />
                    ) : (
                      <MaterialCommunityIcons
                        name="account-circle"
                        size={25}
                        style={{ marginRight: 5 }}
                      />
                    )}
                  </View>
                  <Text style={styles.text}>{item.user.name}</Text>
                </View>
                <View style={styles.post}>
                  <Image
                    style={styles.image}
                    source={{ uri: item.downloadURL }}
                  />
                </View>
                {item.currentUserLike ? (
                  <Button
                    title="Dislike"
                    onPress={() => onDislikePress(item.user.uid, item.id)}
                  />
                ) : (
                  <TouchableHighlight style={styles.likeButton}>
                    <Button
                      title="Like"
                      onPress={() => onLikePress(item.user.uid, item.id)}
                    />
                  </TouchableHighlight>
                )}
                <Text
                  style={{
                    fontSize: 15,
                    padding: 5,
                  }}
                  onPress={() => {
                    props.navigation.navigate("Comments", {
                      postId: item.id,
                      uid: item.user.uid,
                    });
                  }}
                >
                  View Comments...
                </Text>
              </View>
            )}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // marginTop: 40,
  },
  infoContainer: {
    margin: 20,
  },
  image: {
    flex: 1,
    aspectRatio: 1 / 1,
  },
  imageContainer: {
    flex: 1 / 3,
  },
  username: {
    flexDirection: "row",
    padding: 7,
    // justifyContent: "center",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "black",
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
  },
  feedTextContainer: {
    flex: 1,
    justifyContent: "center",
  },
  feedText: {
    fontSize: 35,
    textAlign: "center",
    fontWeight: "bold",
  },
  likeButton: {
    padding: 10,
  },
  feedProfileImage: {
    flex: 1,
    aspectRatio: 1 / 1,
    borderRadius: 50,
  },
  feedProfileContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginRight: 5,
  },
});

const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
  following: store.userState.following,
  feed: store.usersState.feed,
  userFollowingLoaded: store.usersState.userFollowingLoaded,
});

export default connect(mapStateToProps, null)(Feed);
