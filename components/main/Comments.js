import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Button,
  TextInput,
  StyleSheet,
  TouchableHighlight,
} from "react-native";
import firebase from "firebase";
require("firebase/firestore");

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { fetchUsersData } from "../../redux/actions";

function Comments(props) {
  const [comments, setComments] = useState([]);
  const [postId, setPostId] = useState("");
  const [text, setText] = useState("");

  useEffect(() => {
    function matchUserToComment(comments) {
      for (let i = 0; i < comments.length; i++) {
        if (comments[i].hasOwnProperty("user")) {
          continue;
        }
        const user = props.users.find((x) => x.uid === comments[i].creator);
        if (user == undefined) {
          props.fetchUsersData(comments[i].creator, false);
        } else {
          comments[i].user = user;
        }
      }
      setComments(comments);
    }

    if (props.route.params.postId !== postId) {
      firebase
        .firestore()
        .collection("posts")
        .doc(props.route.params.uid)
        .collection("userposts")
        .doc(props.route.params.postId)
        .collection("comments")
        .get()
        .then((snapshot) => {
          let comments = snapshot.docs.map((comment) => {
            const data = comment.data();
            const id = comment.id;
            return { id, ...data };
          });
          matchUserToComment(comments);
        });
      setPostId(props.route.params.postId);
    } else {
      matchUserToComment(comments);
    }
  }, [props.route.params.postId, props.users]);

  const onCommentSend = () => {
    firebase
      .firestore()
      .collection("posts")
      .doc(props.route.params.uid)
      .collection("userposts")
      .doc(props.route.params.postId)
      .collection("comments")
      .add({
        creator: firebase.auth().currentUser.uid,
        text,
      })
      .then(() => {
        setText("");
      });
  };

  return (
    <View>
      <View>
        <TextInput
          style={styles.text}
          placeholder="Comment..."
          value={text}
          onChangeText={(text) => {
            setText(text);
          }}
        />
        <TouchableHighlight style={styles.button}>
          <Button
            title="Send"
            onPress={() => {
              onCommentSend();
            }}
          />
        </TouchableHighlight>
      </View>
      <FlatList
        style={styles.listContainer}
        numColumns={1}
        horizontal={false}
        data={comments}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            {item.user !== undefined ? (
              <Text style={styles.username}>{item.user.name}</Text>
            ) : null}
            <Text style={styles.comment}>{item.text}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 20,
    fontWeight: "bold",
    borderBottomWidth: 1,
    borderBottomColor: "black",
    padding: 5,
  },
  button: {
    // marginTop: 10,
    padding: 10,
  },
  listContainer: {
    padding: 15,
  },
  listItem: {
    height: 50,
    borderBottomColor: "black",
    borderBottomWidth: 1,
  },
  username: {
    fontSize: 12,
    // fontWeight: "bold",
    marginLeft: 5,
  },
  comment: {
    fontSize: 20,
    fontWeight: "bold",
  },
});

const mapStateToProps = (store) => ({
  users: store.usersState.users,
});
const mapDispatchProps = (dispatch) =>
  bindActionCreators({ fetchUsersData }, dispatch);
export default connect(mapStateToProps, mapDispatchProps)(Comments);
