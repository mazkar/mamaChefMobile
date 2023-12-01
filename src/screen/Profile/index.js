import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
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
  // const user = useSelector((state) => state.auth.userData);
  const user = useSelector((state) => state?.auth?.user);

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
        <AppBar title="Pengaturan" />
        <View style={styles.mainContainer}>
          <View>
            <View style={{ flexDirection: "row", marginBottom: ms(8) }}>
              <Image source={require("../../assets/images/IconProfile.png")} />
              <Text
                style={{
                  marginLeft: ms(4),
                  color: COLORS.GRAY_HARD,
                  fontWeight: "600",
                }}
              >
                PROFIL
              </Text>
            </View>
            <Card
              style={{
                backgroundColor: "#ffff",
                paddingHorizontal: 16,
                paddingVertical: 16,
              }}
            >
              <View
                style={{
                  justifyContent: "space-between",
                  // alignItems: "center",
                  flexDirection: "row",
                  marginBottom: 12,
                  marginTop: 12,
                }}
              >
                <View style={{ flexDirection: "row" }}>
                  <Avatar.Text size={32} label="A" color={COLORS.WHITE} />
                  <View style={{ alignSelf: "center", marginLeft: ms(6) }}>
                    <Text>
                      {user.FirstName}
                      {""}
                      {user.LastName}
                    </Text>
                  </View>
                  <View style={{ alignSelf: "center" }}>
                    <Image
                      source={require("../../assets/images/checked.png")}
                    />
                  </View>
                </View>
                <View style={{ alignSelf: "center" }}>
                  <TouchableOpacity
                    onPress={() => navigation.navigate("UbahProfile")}
                  >
                    <Text style={{ color: COLORS.PRIMARY_DARK }}>
                      Ubah Profil
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* <View style={{ marginLeft: ms(12) }}>
                <Text style={{ fontWeight: "600" }}>{user?.fullname}</Text>
                <Text style={{ fontWeight: "300" }}>Mover</Text>
              </View> */}
              </View>
            </Card>
          </View>

          {/* Menu Favorit */}

          <View style={{ marginTop: ms(32) }}>
            <View style={{ flexDirection: "row", marginBottom: ms(8) }}>
              <Image source={require("../../assets/images/Love.png")} />
              <Text
                style={{
                  marginLeft: ms(4),
                  color: COLORS.GRAY_HARD,
                  fontWeight: "600",
                }}
              >
                FAVORIT
              </Text>
            </View>
            <Card
              style={{
                backgroundColor: "#ffff",
                paddingHorizontal: 16,
                paddingVertical: 10,
              }}
            >
              <View
                style={{
                  justifyContent: "space-between",
                  // alignItems: "center",
                  flexDirection: "row",
                  marginBottom: 12,
                  marginTop: 12,
                }}
              >
                <View style={{ flexDirection: "row" }}>
                  <View style={{ alignSelf: "center" }}>
                    <Image source={require("../../assets/images/Foods.png")} />
                  </View>
                  <View style={{ alignSelf: "center", marginLeft: ms(6) }}>
                    <Text style={{ color: COLORS.GRAY_HARD }}>
                      Menu Favorit
                    </Text>
                  </View>
                </View>
                <View style={{ alignSelf: "center" }}>
                  <TouchableOpacity>
                    <Image
                      source={require("../../assets/images/ArrowRight.png")}
                    />
                  </TouchableOpacity>
                </View>

                {/* <View style={{ marginLeft: ms(12) }}>
                <Text style={{ fontWeight: "600" }}>{user?.fullname}</Text>
                <Text style={{ fontWeight: "300" }}>Mover</Text>
              </View> */}
              </View>
            </Card>
          </View>

          {/* Keamanan */}
          <View style={{ marginTop: ms(32) }}>
            <View style={{ flexDirection: "row", marginBottom: ms(8) }}>
              <Image source={require("../../assets/images/Keamanan.png")} />
              <Text
                style={{
                  marginLeft: ms(4),
                  color: COLORS.GRAY_HARD,
                  fontWeight: "600",
                }}
              >
                KEAMANAN
              </Text>
            </View>

            <Card
              style={{
                backgroundColor: "#ffff",
                paddingHorizontal: 16,
                paddingVertical: 10,
                marginTop: ms(8),
              }}
            >
              <View
                style={{
                  justifyContent: "space-between",
                  // alignItems: "center",
                  flexDirection: "row",
                  marginBottom: 12,
                  marginTop: 12,
                }}
              >
                <View style={{ flexDirection: "row" }}>
                  <View style={{ alignSelf: "center" }}>
                    <Image
                      source={require("../../assets/images/IconPass.png")}
                    />
                  </View>
                  <View style={{ alignSelf: "center", marginLeft: ms(6) }}>
                    <Text style={{ color: COLORS.GRAY_HARD }}>
                      Ubah Kata Sandi
                    </Text>
                  </View>
                </View>
                <View style={{ alignSelf: "center" }}>
                  <TouchableOpacity>
                    <Image
                      source={require("../../assets/images/ArrowRight.png")}
                    />
                  </TouchableOpacity>
                </View>

                {/* <View style={{ marginLeft: ms(12) }}>
                <Text style={{ fontWeight: "600" }}>{user?.fullname}</Text>
                <Text style={{ fontWeight: "300" }}>Mover</Text>
              </View> */}
              </View>
            </Card>
          </View>

          {/* KONTAK */}

          <View style={{ marginTop: ms(32) }}>
            <View style={{ flexDirection: "row", marginBottom: ms(8) }}>
              <Image source={require("../../assets/images/Kontak.png")} />
              <Text
                style={{
                  marginLeft: ms(4),
                  color: COLORS.GRAY_HARD,
                  fontWeight: "600",
                }}
              >
                TENTANG KAMI
              </Text>
            </View>
            <Card
              style={{
                backgroundColor: "#ffff",
                paddingHorizontal: 16,
                paddingVertical: 10,
              }}
            >
              <View
                style={{
                  justifyContent: "space-between",
                  // alignItems: "center",
                  flexDirection: "row",
                  marginBottom: 12,
                  marginTop: 12,
                }}
              >
                <TouchableOpacity
                  onPress={() => navigation.navigate("AboutUs")}
                  style={{ flexDirection: "row" }}
                >
                  <View style={{ alignSelf: "center" }}>
                    <Image source={require("../../assets/images/Kontak.png")} />
                  </View>
                  <View style={{ alignSelf: "center", marginLeft: ms(6) }}>
                    <Text style={{ color: COLORS.GRAY_HARD }}>
                      Tentang Kami
                    </Text>
                  </View>
                </TouchableOpacity>
                <View style={{ alignSelf: "center" }}>
                  <TouchableOpacity>
                    <Image
                      source={require("../../assets/images/ArrowRight.png")}
                    />
                  </TouchableOpacity>
                </View>

                {/* <View style={{ marginLeft: ms(12) }}>
                <Text style={{ fontWeight: "600" }}>{user?.fullname}</Text>
                <Text style={{ fontWeight: "300" }}>Mover</Text>
              </View> */}
              </View>
            </Card>
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
