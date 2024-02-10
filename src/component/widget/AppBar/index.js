import React, { useEffect, useState } from "react";
import { Platform, StyleSheet, Text, View, Image } from "react-native";
import { COLORS } from "../../../assets/theme";
import { Button, Menu, Divider, Avatar, Card, Badge } from "react-native-paper";
import { TouchableOpacity } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/FontAwesome5";
import Octicons from "react-native-vector-icons/Octicons";
import FaIcons from "react-native-vector-icons/Ionicons";
import { FontAwesome5 } from "@expo/vector-icons";
import { ms } from "react-native-size-matters";
import { useSelector } from "react-redux";
import axios from "axios";
import { baseUrl } from "../../../utils/apiURL";

const AppBar = (props) => {
  const { title, onPressNav, icoRight } = props;
  const [notifVisible, setNotifVisible] = useState(false);
  const uid = useSelector((state) => state?.auth?.user?.UserId);
  const user = useSelector((state) => state?.auth?.user?.FirstName);
  const token = useSelector((state) => state.auth.token);
  const keranjangCount = useSelector(
    (state) => state?.menuReducer?.menuList?.length
  );

  // Notification

  const showNotif = () => {
    setNotifVisible(true);
  };

  const closeNotif = () => {
    setNotifVisible(false);
  };

  return props.dashboard ? (
    <View style={styles.appBarContainer}>
      <View style={{ flexDirection: "column" }}>
        <Text
          style={{
            fontSize: 16,
            color: COLORS.PRIMARY_DARK,
            fontWeight: "800",
          }}
        >
          Selamat Pagi, {user}
        </Text>
        <Text
          style={{
            fontSize: 11,
          }}
        >
          Masak Apa Hari Ini
        </Text>
        <View style={styles.logoWrapper}></View>
      </View>

      <View style={styles.notif}>
        <View>
          <Menu
            visible={notifVisible}
            onDismiss={closeNotif}
            anchor={
              <FaIcons
                onPress={showNotif}
                style={{
                  fontSize: 22,
                  color: COLORS.PRIMARY_MEDIUM,
                  marginRight: 12,
                  color: COLORS.PRIMARY_DARK,
                }}
                name={
                  notifVisible ? "notifications-sharp" : "notifications-outline"
                }
              />
            }
          >
            <>
              <Menu.Item onPress={() => {}} title="Item 1" />
              <Menu.Item onPress={() => {}} title="Item 2" />
              <Divider />
              <Menu.Item onPress={() => {}} title="Item 3" />
            </>
          </Menu>
        </View>
        {/* <View>
          <Avatar.Text size={28} label="MA" color={COLORS.WHITE} />
        </View> */}
      </View>
    </View>
  ) : (
    <View style={styles.appBarContainer}>
      <View style={styles.logoWrapper}>
        <Image source={require("../../../assets/images/iconHeader.png")} />
      </View>
      <View style={{ flexDirection: "column" }}>
        <Text
          style={{
            fontSize: 16,
            color: COLORS.PRIMARY_DARK,
            fontWeight: "800",
          }}
        >
          {props.title}
        </Text>
      </View>

      <View style={styles.notif}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <FontAwesome5
            onPress={() => props.navigation.navigate("Keranjang")}
            style={{
              fontSize: 20,
              color: COLORS.PRIMARY_MEDIUM,
              marginRight: 18,
              color: COLORS.PRIMARY_DARK,
            }}
            name="shopping-cart"
          />
          {keranjangCount > 0 && (
            <View
              style={{
                position: "absolute",
                top: -4,
                right: 10,

                backgroundColor: "red", // You can change the badge color
                borderRadius: 10, // Adjust the border radius to your liking
                paddingVertical: 2,
                paddingHorizontal: 6,
              }}
            >
              <Text style={{ color: "white", fontSize: 8 }}>
                {keranjangCount}
              </Text>
            </View>
          )}
        </View>

        <View>
          <Menu
            visible={notifVisible}
            onDismiss={closeNotif}
            anchor={
              // <FaIcons
              //   onPress={showNotif}
              //   style={{
              //     fontSize: 22,
              //     color: COLORS.PRIMARY_MEDIUM,
              //     marginRight: 12,
              //     color: COLORS.PRIMARY_DARK,
              //   }}
              //   name={
              //     notifVisible ? "notifications-sharp" : "notifications-outline"
              //   }
              // />
              <TouchableOpacity onPress={() => setNotifVisible(!notifVisible)}>
                <Avatar.Text size={32} label="A" />
              </TouchableOpacity>
            }
          >
            <>
              <Menu.Item
                onPress={() => props.navigation.navigate("Profile")}
                title="Pengaturan"
              />
              <Menu.Item onPress={() => props.handleLogut()} title="Sign Out" />

              <Divider />
            </>
          </Menu>
        </View>
      </View>
    </View>
  );
};

export default AppBar;

const styles = StyleSheet.create({
  appBarContainer: {
    backgroundColor: COLORS.WHITE,
    justifyContent: "space-between",
    flexDirection: "row",
    // flex: 1,

    alignItems: "center",
    height: 70,
    elevation: 3,
    paddingVertical: 10,
    paddingHorizontal: 2,
    borderBottomWidth: Platform.OS === "ios" ? 1 : 0,
    borderColor: Platform.OS === "ios" ? COLORS.GRAY_MEDIUM : null,
  },
  logoWrapper: {
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 12,
    marginRight: 8,
  },
  notif: {
    // paddingVertical: 4,

    // marginTop: ms(16),

    // paddingVertical: 12,
    marginRight: 12,
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    // backgroundColor: 'red',
    // alignItems: 'flex-end',
  },
  appBarText: {
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
  },
});
