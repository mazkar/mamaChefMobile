import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Alert } from "react-native";
import { theme } from "./src/assets/theme";
import { useEffect } from "react";
import { Provider as PaperProvider } from "react-native-paper";
import { Provider, useDispatch } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import store, { persistor } from "./src/store/index";
import { NavigationContainer } from "@react-navigation/native";
import Route from "./src/root/Route";
import messaging from "@react-native-firebase/messaging";
import AsyncStorage from "@react-native-async-storage/async-storage";
// import "./config";

export default function App() {
  const saveToAsyncStorage = async (token) => {
    try {
      // Save the input value to AsyncStorage
      await AsyncStorage.setItem("deviceId", token);
      // console.log("Value saved successfully!");
    } catch (error) {
      console.error("Error saving value to AsyncStorage:", error);
    }
  };

  const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log("Authorization status:", authStatus);
    }
  };

  // useEffect(() => {
  //   startLocationUpdates();
  //   return () => {
  //     // Clean up or stop the location updates when the component unmounts
  //     stopLocationUpdates();
  //   };
  // }, []);

  useEffect(() => {
    if (requestUserPermission()) {
      messaging()
        .getToken()
        .then((token) => {
          console.log(token, "ini token");
          saveToAsyncStorage(token);
        });
    } else {
      console.log("failed to get token", authStatus);
    }

    // Check whether an initial notification is available
    messaging()
      .getInitialNotification()
      .then(async (remoteMessage) => {
        if (remoteMessage) {
          console.log(
            "Notification caused app to open from quit state:",
            remoteMessage.notification
          );
          setInitialRoute(remoteMessage.data.type); // e.g. "Settings"
        }
        setLoading(false);
      });

    // Assume a message-notification contains a "type" property in the data payload of the screen to open

    messaging().onNotificationOpenedApp(async (remoteMessage) => {
      console.log(
        "Notification caused app to open from background state:",
        remoteMessage.notification
      );
    });

    // Register background handler
    messaging().setBackgroundMessageHandler(async (remoteMessage) => {
      console.log("Message handled in the background!", remoteMessage);
    });

    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      Alert.alert(
        "You Have New Task!",
        JSON.stringify(remoteMessage.notification.body)
      );
    });

    return unsubscribe;
  }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <PaperProvider theme={theme}>
          {/* <FlashMessage statusBarHeight={30} /> */}
          <NavigationContainer>
            <Route />
          </NavigationContainer>
        </PaperProvider>
      </PersistGate>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
