import React, { useState } from "react";
import { FlatList, Image, ScrollView, StyleSheet, View } from "react-native";
import firebase from "firebase";
require("firebase/firestore");
import { SearchBar } from "@rneui/themed";
import { Text, ListItem, Avatar } from "@rneui/themed";

export default function Search(props) {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  const fetchUsers = (search) => {
    firebase
      .firestore()
      .collection("users")
      .where("name", ">=", search)
      .get()
      .then((snapshot) => {
        let users = snapshot.docs.map((user) => {
          const data = user.data();
          const id = user.id;
          return { id, ...data };
        });
        setUsers(users);
      });
  };
  return (
    <View>
      <SearchBar
        placeholder="Search Here..."
        onChangeText={(search) => {
          setSearch(search);
          return fetchUsers(search);
        }}
        platform="ios"
        value={search}
        maxLength={50}
      />
      <View style={styles.listContainer}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {users.map((user, index) => {
            const picUri = user?.downloadURL;
            return (
              <ListItem
                key={index}
                bottomDivider={true}
                containerStyle={{ marginBottom: 5, borderRadius: 10 }}
                onPress={() => {
                  props.navigation.navigate("Profile", { uid: user.id });
                }}
              >
                <ListItem.Content>
                  <View style={styles.cardStyle}>
                    {user.downloadURL ? (
                      <Avatar
                        source={{ uri: user.downloadURL }}
                        avatarStyle={styles.avatarStyle}
                      />
                    ) : (
                      <Avatar
                        title={user.name[0]}
                        rounded
                        containerStyle={{ backgroundColor: "#ed5b2d" }}
                        avatarStyle={styles.avatarStyle}
                      />
                    )}
                    <View style={styles.text}>
                      <ListItem.Title>
                        <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                          {user.name}
                        </Text>
                      </ListItem.Title>
                    </View>
                  </View>
                </ListItem.Content>
              </ListItem>
            );
          })}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  listContainer: {
    padding: 15,
    marginBottom: 120,
  },
  text: {
    fontSize: 20,
    marginLeft: 20,
  },
  cardStyle: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarStyle: {
    borderRadius: 20,
  },
});
