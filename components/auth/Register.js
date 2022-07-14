import React, { Component } from "react";
import { View, StyleSheet, Image } from "react-native";
import firebase from "firebase";
import { SafeAreaView } from "react-native";
import GlobalStyles from "../../GlobalStyles";
import { Button, Input } from "@rneui/themed";
import img from "../../assets/trans.png";
import { Alert } from "react-native";

export class Register extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
      name: "",
      secureTextEntry: true,
      iconName: "eye",
    };
    this.onSignUp = this.onSignUp.bind(this);
  }

  onSignUp() {
    const { email, password, name } = this.state;
    const regx = /\S+@\S+\.\S+/.test(email);
    if (!regx) {
      Alert.alert(
        "Invalid email provided",
        "Please make sure email is correct"
      );
      return;
    }
    if (password.trim().length >= 6 && name.trim().length >= 4) {
      firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then((result) => {
          firebase
            .firestore()
            .collection("users")
            .doc(firebase.auth().currentUser.uid)
            .set({
              name,
              email,
            })
            .catch((error) => {
              Alert.alert(
                "Unable to Register",
                "Please check information provided or try again later"
              );
            });
        });
    } else {
      Alert.alert(
        "Invalid Information provided",
        "Name and Password should be more than 4 and 6 characters"
      );
    }
  }

  onIconPress = () => {
    let iconName = this.state.secureTextEntry ? "eye-with-line" : "eye";

    this.setState({
      secureTextEntry: !this.state.secureTextEntry,
      iconName: iconName,
    });
  };

  render() {
    return (
      // <SafeAreaView style={GlobalStyles.droidSafeArea}>
      <View style={styles.container}>
        <Image
          source={img}
          style={{ height: 300, width: "auto", resizeMode: "contain" }}
        />
        <Input
          style={styles.textInput}
          placeholder="Ex: John Doe"
          label="Name"
          leftIcon={{ type: "fontisto", name: "person" }}
          onChangeText={(name) => this.setState({ name })}
          maxLength={16}
        />
        <Input
          style={styles.textInput}
          placeholder="example@mail.com"
          label="Email"
          leftIcon={{ name: "mail" }}
          textContentType="emailAddress"
          onChangeText={(email) => this.setState({ email })}
        />
        <Input
          style={styles.textInput}
          placeholder="********"
          label="Password"
          leftIcon={{ name: "lock" }}
          secureTextEntry={this.state.secureTextEntry}
          rightIcon={{
            name: this.state.iconName,
            type: "entypo",
            onPress: this.onIconPress,
          }}
          onChangeText={(password) => this.setState({ password })}
          maxLength={30}
        />
        <Button
          onPress={() => {
            this.onSignUp();
          }}
          title="SignUp"
          color="#ed5b2d"
          iconRight={true}
          icon={{
            type: "antdesign",
            name: "login",
            color: "white",
          }}
          radius={20}
          raised={true}
        />
      </View>
      // </SafeAreaView>
    );
  }
}
export default Register;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    marginTop: -50,
  },
  textInput: {
    height: 40,
    padding: 10,
  },
  button: {
    marginBottom: 50,
  },
});
