import React, { Component } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  TouchableHighlight,
  Image,
  Alert,
} from "react-native";
import firebase from "firebase";
import { SafeAreaView } from "react-native";
import GlobalStyles from "../../GlobalStyles";
import { Button, Input } from "@rneui/themed";
import img from "../../assets/trans.png";

export class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
      secureTextEntry: true,
      iconName: "eye",
    };
    this.onLogin = this.onLogin.bind(this);
  }

  onLogin() {
    const { email, password } = this.state;
    const regx = /\S+@\S+\.\S+/.test(email);
    if (!regx) {
      Alert.alert(
        "Invalid email provided",
        "Please make sure email is correct"
      );
      return;
    }
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .catch((error) => {
        Alert.alert(
          "Unable to Login",
          "Please check information provided or try again later"
        );
      });
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
      <SafeAreaView style={GlobalStyles.droidSafeArea}>
        <View style={styles.container}>
          <Image
            source={img}
            style={{ height: 300, width: "auto", resizeMode: "contain" }}
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
            title="Login"
            onPress={() => {
              this.onLogin();
            }}
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
      </SafeAreaView>
    );
  }
}
export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    marginTop: -150,
  },
  textInput: {
    height: 40,
    padding: 10,
  },
  button: {
    marginBottom: 10,
  },
});
