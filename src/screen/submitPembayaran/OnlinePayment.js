import React from "react";
import { WebView } from "react-native-webview";
import { AppBar, RootContainer } from "../../component";
import { View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

const OnlinePayment = ({ route }) => {
  const urlToOpen = "http://dev.mamachefs.com/login";

  return (
    <View style={{ flex: 1 }}>
      <WebView source={{ uri: route.params.url }} />
    </View>
  );
};

export default OnlinePayment;
