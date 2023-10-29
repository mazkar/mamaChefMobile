import { View, Text, StyleSheet, Image } from "react-native";
import React, { useState } from "react";
import {
  AppBar,
  ColorBgContainer,
  GeneralButton,
  GeneralTextInput,
  RootContainer,
} from "../../component";
import { useDispatch, useSelector } from "react-redux";
import { resetReducer } from "../../store/models/auth/actions";
import { COLORS, FONTS } from "../../assets/theme";
import { ms } from "react-native-size-matters";
import { ScrollView } from "react-native-gesture-handler";
import { Button, Menu, Divider, Avatar, Card } from "react-native-paper";
import { baseUrl } from "../../utils/apiURL";

export default function Profile({ navigation }) {
  const dispatch = useDispatch();
  const [username, setUsername] = useState("Azka");
  const user = useSelector((state) => state.auth.userData);

  const handleLogut = () => {
    dispatch(resetReducer());
    navigation.reset({
      index: 0,
      routes: [{ name: "Login" }],
    });
  };

  return (
    <ColorBgContainer style={{ paddingHorizontal: 24, paddingVertical: 72 }}>
      <RootContainer isTransparent>
        <AppBar />
        <View style={styles.mainContainer}>
          <View style={{ flexDirection: "row", marginBottom: 22 }}>
            <Image
              source={require("../../assets/images/profile.png")}
              style={{ width: 18, height: 24 }}
            />
            <View>
              {/* <Button onPress={() => console.log(user)}>Test</Button> */}
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "600",
                  marginLeft: 12,
                  marginBottom: 2,
                }}
              >
                Profile
              </Text>
              <View
                style={{
                  backgroundColor: "black",
                  borderBottomColor: COLORS.PRIMARY_MEDIUM,
                  borderBottomWidth: 4,
                  width: 24,
                  marginLeft: 12,
                }}
              />
            </View>
          </View>
          <Card
            style={{
              backgroundColor: "#ffff",
              paddingHorizontal: 26,
              paddingVertical: 32,
            }}
          >
            <View
              style={{
                justifyContent: "flex-start",
                // alignItems: "center",
                flexDirection: "row",
                marginBottom: 12,
                marginTop: 12,
              }}
            >
              <Avatar.Text size={32} label="MV" color={COLORS.WHITE} />
              <View style={{ marginLeft: ms(12) }}>
                <Text style={{ fontWeight: "600" }}>{user?.fullname}</Text>
                <Text style={{ fontWeight: "300" }}>Mover</Text>
              </View>
            </View>
            <Divider bold />
            <View
              style={{
                justifyContent: "space-between",
                // alignItems: "center",
                flexDirection: "row",
                marginBottom: 12,
                marginTop: 12,
              }}
            >
              <Text style={{ color: COLORS.PRIMARY_DARK, fontWeight: "600" }}>
                USER LOGIN
              </Text>
              <Text>{user?.userLogin}</Text>
            </View>
            <Divider bold />
            <View
              style={{
                justifyContent: "space-between",
                // alignItems: "center",
                flexDirection: "row",
                marginBottom: 12,
                marginTop: 12,
              }}
            >
              <Text style={{ color: COLORS.PRIMARY_DARK, fontWeight: "600" }}>
                Email
              </Text>
              <Text>{user?.email}</Text>
            </View>
            <Divider bold />
            <View
              style={{
                justifyContent: "space-between",
                // alignItems: "center",
                flexDirection: "row",
                marginBottom: 12,
                marginTop: 12,
              }}
            >
              <Text style={{ color: COLORS.PRIMARY_DARK, fontWeight: "600" }}>
                PHONE NUMBER
              </Text>
              <Text>{user?.phoneNo}</Text>
            </View>
            <Divider bold />
            <View
              style={{
                justifyContent: "space-between",
                // alignItems: "center",
                flexDirection: "row",
                marginBottom: 12,
                marginTop: 12,
              }}
            >
              <Text style={{ color: COLORS.PRIMARY_DARK, fontWeight: "600" }}>
                USER TITLE
              </Text>
              <Text>Mover</Text>
            </View>
            <Divider bold />
            <View
              style={{
                justifyContent: "space-between",
                // alignItems: "center",
                flexDirection: "row",
                marginBottom: 12,
                marginTop: 12,
              }}
            >
              <Text style={{ color: COLORS.PRIMARY_DARK, fontWeight: "600" }}>
                EMPLOYEE ID
              </Text>
              <Text>{user?.userID}</Text>
            </View>
          </Card>
          <View style={{ marginTop: ms(18) }}>
            <Text style={{ color: "#D2D2D2" }}>APP VERSION 1.0.0</Text>
            <GeneralButton
              style={{ backgroundColor: "#F87272", marginTop: ms(18) }}
              mode="contained"
              onPress={() => handleLogut()}
            >
              SIGN OUT
            </GeneralButton>
          </View>
        </View>
      </RootContainer>
    </ColorBgContainer>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingBottom: 72,
    marginTop: ms(32),
  },
  profileSection: {
    paddingVertical: 22,
    paddingHorizontal: 18,
    flex: 1,
    justifyContent: "center",
    // backgroundColor: 'red',
    alignItems: "center",
  },
  profileName: {
    fontSize: FONTS.v20,
    fontWeight: "500",
    // fontFamily: 'barlow',
    color: COLORS.BLACK,
  },
  notif: {
    // paddingVertical: 4,
    paddingHorizontal: 18,
    marginTop: ms(16),
    paddingVertical: 12,
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    // backgroundColor: 'red',
    // alignItems: 'flex-end',
  },
  helloContainer: {
    // paddingVertical: 4,
    paddingHorizontal: 18,
    // marginTop: ms(16),
    paddingVertical: 12,
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: 'red',
    // alignItems: 'flex-end',
  },
  overviewContainer: {
    // paddingVertical: 4,
    paddingHorizontal: 18,
    marginTop: ms(16),
    paddingVertical: 12,
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    // backgroundColor: 'red',
    // alignItems: 'flex-end',
  },
  overviewText: {
    fontSize: FONTS.v15,
    fontWeight: "400",
    // fontFamily: 'barlow',
    color: COLORS.GRAY_HARD,
  },
  textTitle: {
    fontWeight: "500",
  },
});
