import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Image, FlatList, Button } from "react-native";
import firebase from "firebase";
require("firebase/firestore");
import { connect } from "react-redux";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { Card } from "@rneui/themed";
import { Avatar, Divider, Icon } from "@rneui/base";

// const MyCard = ({ item }) => {
//   return (
//     <Card containerStyle={{ borderRadius: 15 }}>
//       <View style={styles.userInfoStyle}>
//         <Avatar source={{ uri: item.user.downloadURL }} rounded />
//         <Text
//           style={{
//             marginLeft: 10,
//             marginTop: "auto",
//             marginBottom: "auto",
//             fontSize: 20,
//             fontWeight: "bold",
//           }}
//         >
//           {item.user.name}
//         </Text>
//       </View>
//       <Card.Divider color="#ed5b2d" style={{ opacity: 0.5 }} />
//       <View>
//         <Image
//           source={{ uri: item.downloadURL }}
//           style={{ flex: 1, aspectRatio: 1 / 1 }}
//         />
//       </View>
//       <View
//         style={{
//           flexDirection: "row",
//           alignItems: "center",
//           padding: 5,
//           marginTop: 5,
//           backgroundColor: "#E9eaea",
//           borderRadius: 15,
//         }}
//       >
//         <Icon name="heartbeat" type="font-awesome" color="#ed5b2d" />
//         <Text style={{ fontSize: 15, padding: 10, flex: 1 }}>
//           {item.caption}
//         </Text>
//       </View>
//       <View>
//         {item.currentUserLike ? (
//           <Icon
//             name="heart"
//             type="font-awesome"
//             color="red"
//             onPress={() => onDislikePress(item.user.uid, item.id)}
//           />
//         ) : (
//           <Icon
//             name="heart"
//             type="font-awesome"
//             color="red"
//             size={30}
//             onPress={() => onLikePress(item.user.uid, item.id)}
//           />
//         )}
//       </View>
//     </Card>
//   );
// };

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
                <Card containerStyle={{ borderRadius: 15 }}>
                  <View style={styles.userInfoStyle}>
                    <Avatar source={{ uri: item.user.downloadURL }} rounded />
                    <Text
                      style={{
                        marginLeft: 10,
                        marginTop: "auto",
                        marginBottom: "auto",
                        fontSize: 20,
                        fontWeight: "bold",
                      }}
                    >
                      {item.user.name}
                    </Text>
                  </View>
                  <Card.Divider color="#ed5b2d" style={{ opacity: 0.5 }} />
                  <View>
                    <Image
                      source={{ uri: item.downloadURL }}
                      style={{ flex: 1, aspectRatio: 1 / 1 }}
                    />
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      padding: 5,
                      marginTop: 5,
                      backgroundColor: "#E9eaea",
                      borderRadius: 15,
                    }}
                  >
                    <Icon
                      name="heartbeat"
                      type="font-awesome"
                      color="#ed5b2d"
                    />
                    <Text style={{ fontSize: 15, padding: 10, flex: 1 }}>
                      {item.caption}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginTop: 5,
                    }}
                  >
                    {item.currentUserLike ? (
                      <Icon
                        name="heart"
                        type="font-awesome"
                        color="#B52020"
                        size={30}
                        onPress={() => onDislikePress(item.user.uid, item.id)}
                      />
                    ) : (
                      <Icon
                        name="heart-o"
                        type="font-awesome"
                        color="#ed5b2d"
                        size={30}
                        onPress={() => onLikePress(item.user.uid, item.id)}
                      />
                    )}
                    <Icon
                      name="comments"
                      type="fontisto"
                      size={30}
                      style={{ marginLeft: 10 }}
                      color="#ed5b2d"
                      onPress={() => {
                        props.navigation.navigate("Comments", {
                          postId: item.id,
                          uid: item.user.uid,
                        });
                      }}
                    />
                  </View>
                </Card>
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
  userInfoStyle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 5,
  },
});

const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
  following: store.userState.following,
  feed: store.usersState.feed,
  userFollowingLoaded: store.usersState.userFollowingLoaded,
});

export default connect(mapStateToProps, null)(Feed);
