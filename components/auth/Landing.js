import React from "react";
import {
  Image,
  SafeAreaView,
  Text,
  TouchableHighlight,
  View,
} from "react-native";
import GlobalStyles from "../../GlobalStyles";
import { Button } from "@rneui/themed";
import img from "../../assets/trans.png";

export default function Landing({ navigation }) {
  return (
    <SafeAreaView style={GlobalStyles.droidSafeArea}>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          padding: 40,
          marginTop: -100,
        }}
      >
        <View>
          <Image
            source={img}
            style={{ height: 300, width: "auto", resizeMode: "contain" }}
          />
        </View>
        <Button
          title="Login"
          onPress={() => {
            navigation.navigate("Login");
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
        <TouchableHighlight style={{ marginTop: 20, marginBottom: 20 }}>
          <Button
            title="Register"
            onPress={() => {
              navigation.navigate("Register");
            }}
            color="#ed5b2d"
            type="outline"
            buttonStyle={{
              borderColor: "#ed5b2d",
            }}
            titleStyle={{
              color: "#ed5b2d",
            }}
            radius={20}
          />
        </TouchableHighlight>
      </View>
    </SafeAreaView>
  );
}
