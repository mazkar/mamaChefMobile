import { View, Dimensions, Image, Platform } from "react-native";
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import LoginPage from "../screen/login";
import Dashboard from "../screen/Dashboard";
import Profile from "../screen/Profile";

import { COLORS } from "../assets/theme";
import { ms } from "react-native-size-matters";
import { useSelector } from "react-redux";
import Register from "../screen/Register";
import KelolaMenu from "../screen/kelolaMenu";
import TambahMenu from "../screen/kelolaMenu/tambahMenu";
import submitPembayaran from "../screen/submitPembayaran";
import PilihPaketPeriod from "../screen/submitPembayaran/PilihPaketPeriod";
import KelolaMember from "../screen/Member/KelolaMember";
import TambahMember from "../screen/Member/TambahMember";
import TambahMenuMain from "../screen/kelolaMenu/TambahMenuMain";
import tipsAndTrick from "../screen/tipsTrick";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

export default function Route() {
  const token = useSelector((state) => state.auth.token);
  return (
    <Stack.Navigator
      initialRouteName={token == null ? "Login" : "Main"}
      screenOptions={{ headerShown: false }}
    >
      {/* <Stack.Screen name="Splash" component={LoginPage} headerMode="screen" /> */}
      {/* <Stack.Screen name="Login" component={LoginPage} headerMode="screen" />
      <Stack.Screen
        name="Dashboard"
        component={Dashboard}
        headerMode="screen"
      /> */}
      <Stack.Screen
        name="Main"
        options={{ headerShown: false }}
        component={BottomNav}
        // headerMode="screen"
      />
      <Tab.Screen
        name="Login"
        component={LoginPage}
        // options={{headerShown: false}}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Register"
        component={Register}
        // options={{headerShown: false}}
        options={{ headerShown: false }}
      />

      <Tab.Screen
        name="TambahMenu"
        component={TambahMenuMain}
        // options={{headerShown: false}}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="SubmitPembayaran"
        component={submitPembayaran}
        // options={{headerShown: false}}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="PilihPaket"
        component={PilihPaketPeriod}
        // options={{headerShown: false}}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="TambahMembers"
        component={TambahMember}
        // options={{headerShown: false}}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Tips"
        component={tipsAndTrick}
        // options={{headerShown: false}}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

export function BottomNav() {
  const Height = Dimensions.get("window").height;

  return (
    <Tab.Navigator
      // tabBarOptions={{

      //   tabBarActiveBackgroundColor: 'red',
      //   style: {
      //     position: 'absolute',
      //     marginHorizontal: 20,
      //     bottom: 21,
      //     height: 60,
      //     elevation: 0,
      //     borderRadius: 40,
      //     backgroundColor: '#000',
      //   },
      // }}
      // tabBarOptions={{ showLabel: false }}
      screenOptions={({ route }) => ({
        // showLabel: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          // borderTopLeftRadius: 24,
          // borderTopRightRadius: 24,
          // borderRadius: 14,
          // marginBottom: 12,
          // marginLeft: 18,
          // marginRight: 18,
        },
        tabBarIcon: ({ focused, size }) => {
          let iconName;

          if (route.name === "Dashboard") {
            iconName = focused
              ? require("../assets/images/homeActive.png")
              : require("../assets/images/home.png");
          } else if (route.name === "KelolaMenu") {
            iconName = focused
              ? require("../assets/images/message.png")
              : require("../assets/images/message0.png");
          } else if (route.name === "KelolaMenu") {
            iconName = focused
              ? require("../assets/images/employeeActive.png")
              : require("../assets/images/employee.png");
          } else if (route.name === "Member") {
            iconName = focused
              ? require("../assets/images/userActive.png")
              : require("../assets/images/user.png");
          }

          // You can return any component that you like here!
          return (
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",

                width: 60,
                height: 30,
                borderRadius: 10,
                top:
                  Platform.OS === "ios" ? iphoneIconsPositionCenter(Height) : 0,
              }}
            >
              <Image
                source={iconName}
                resizeMode="contain"
                style={{ width: ms(26), height: ms(36) }}
              />
            </View>
          );
        },
      })}
    >
      <Tab.Screen
        name="Dashboard"
        component={Dashboard}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Member"
        component={KelolaMember}
        options={{ headerShown: false }}
      />
      {/* <Tab.Screen
        name="Task2"
        component={TaskManagementAdmin}
        options={{ headerShown: false }}
      /> */}
      {/* <Tab.Screen
        name="Employee"
        component={Profile}
        // options={{headerShown: false}}
        options={{ headerShown: false }}
      /> */}

      <Tab.Screen
        name="KelolaMenu"
        component={KelolaMenu}
        // options={{headerShown: false}}
        options={{ headerShown: false }}
      />
      {/* <Tab.Screen
        name="Dashboard"
        component={Dashboard}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Task"
        component={TaskManagement}
        options={{ headerShown: false }}
      />
     
      <Tab.Screen
        name="Profile2"
        component={Profile}
        // options={{headerShown: false}}
        options={{ headerShown: false }}
      /> */}
    </Tab.Navigator>
  );
}
