import {
  View,
  Text,
  // ScrollView,
  // RefreshControl,
  StyleSheet,
  SafeAreaView,
  Input,
  Platform,
  Dimensions,
  ImageBackground,
  Image,
} from "react-native";
import FlashMessage from "react-native-flash-message";
import React, { useState, useEffect, useRef } from "react";
import {
  HelperText,
  TextInput,
  Divider,
  Modal,
  Card,
} from "react-native-paper";
import useNavigation from "@react-navigation/core";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";

import { COLORS, FONTS } from "../../assets/theme";
import Icon from "react-native-vector-icons/FontAwesome5";

import constants from "../../assets/constants";
import { URL } from "../../utils/apiURL";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import {
  GeneralButton,
  GeneralTextInput,
  TextInputPassword,
  PopUpLoader,
} from "./../../component/index";

import { useDispatch, useSelector } from "react-redux";
import { setToken, setUser } from "../../store/models/auth/actions";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { baseUrl } from "../../utils/apiURL";
import axios from "axios";

import { moderateScale, ms } from "react-native-size-matters";
import Feather from "react-native-vector-icons/Feather";
import API from "../../utils/apiService";
import jwtDecode from "jwt-decode";
import { Ionicons, FontAwesome } from "@expo/vector-icons";

const LoginPage = ({ navigation }) => {
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(true);
  const [dataContent, setDataContent] = useState([]);
  const [modalErroVis, setModalErrorVis] = useState(false);
  const hideModalError = () => {
    setModalErrorVis(false);

    // getTaskDetail(route.params.assignmentId);
  };

  const [refreshing, setRefreshing] = useState(false);

  // FORM
  const [password, setPassword] = useState("");
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const token = useSelector((state) => state.auth);
  const [dataTok, setDataTok] = useState("");
  const [messageError, setMessageError] = useState("");
  const [dataConverToken, setDataConvertToken] = useState(null);
  const [deviceId, setDeviceId] = useState("");

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  async function updateDeviceId(userId) {
    // setIsLoadingGet(true);
    const body = {
      deviceId: deviceId,
      userId: userId,
      lmby: userId,
    };
    try {
      console.log(body);
      let res = await axios({
        url: `${baseUrl.URL}api/MobileNotification/InsertDeviceId`,
        method: "POST",
        timeout: 8000,
        data: body,
        headers: {
          "Content-Type": "application/json",
          // Authorization: `Bearer ${token}`,
        },
      });
      console.log(res.data, "<==res");
      if (res.data.code == "200") {
        console.log(res.data.data, "<=== res berhasil update device id");
        setIsLoading(false);

        // test for status you want, etc
        // setLoadingUpload(false);
        // getTaskDetail(route.params.assignmentId);
        console.log(res, "Success");

        // setDataItem(res.data);
        // setDataInfo(res.data);
      } else {
        setIsLoading(false);
      }
      // Don't forget to return something
      return res.data;
    } catch (err) {
      console.error(err, "error update device Id");

      setIsLoading(false);
    }
  }

  const converToken = (token) => {
    try {
      const decodedToken = jwtDecode(token);
      console.log(decodedToken, "decode token");
      // You can access the payload data from the decoded token
      // For example, if your payload contains a 'userId' field
      dispatch(setUser(decodedToken));
      updateDeviceId(parseInt(decodedToken?.UserId));
      // const userId = decodedToken.userId;
      // console.log("User ID:", userId);
    } catch (error) {
      console.error("Error decoding JWT:", error);
    }
  };

  const getDeviceIdfromStorage = async () => {
    try {
      // Load the value from AsyncStorage
      const value = await AsyncStorage.getItem("deviceId");
      if (value !== null) {
        // Set the loaded value to the state
        console.log(value, "devieId from storage");
        setDeviceId(value);
      }
    } catch (error) {
      console.error("Error loading value from AsyncStorage:", error);
    }
  };
  async function handleLogin() {
    // setLoadingUpload(true);
    setIsLoading(true);
    const body = {
      userName: email,
      password: password,
    };
    console.log(`${baseUrl.URL}api/Auth/Login`);
    console.log(body);
    try {
      // console.log(body);
      let res = await axios({
        url: `${baseUrl.URL}api/Auth/Login`,
        method: "POST",
        timeout: 8000,
        data: body,
        headers: {
          "Content-Type": "application/json",
          // Authorization: `Bearer ${token}`,
        },
      });
      console.log(res, "Success");
      if (res.status == 200) {
        dispatch(setToken(res.data.data));
        setDataTok(res.data.data);
        setUser(converToken(res.data.data));
        setTimeout(() => {
          setIsLoading(false);
          navigation.push("Main");
        }, 1000);
        // test for status you want, etc
        // setLoadingUpload(false);
        // getTaskDetail(route.params.assignmentId);
        console.log(res, "Success");

        // setDataItem(res.data);
        // setDataInfo(res.data);
      }
      // Don't forget to return something
      return res.data;
    } catch (err) {
      console.error(err, "error");
      setIsLoading(false);
      setMessageError(err.message);
      setModalErrorVis(true);
    }
  }

  async function getContentDashboard(userId) {
    // setIsLoadingGet(true);
    try {
      let res = await axios({
        url: `${baseUrl.URL}api/ContentManagementMaster/getcontentbypage/Contact`,
        method: "get",
        timeout: 8000,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.status == 200) {
        // test for status you want, etc
        console.log(res.data, "content");
        setDataContent(res.data.data);
        // setIsLoadingGet(false);
        // console.log(res.data, "transit");
      }
      // Don't forget to return something
      return res.data;
    } catch (err) {
      console.error(err);
      // setIsLoadingGet(false);
    }
  }

  useEffect(() => {
    getContentDashboard();
  }, []);

  useEffect(() => {
    getDeviceIdfromStorage();
  }, []);

  return (
    <>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* <StatusBar backgroundColor="#0E9C4A" translucent={true} /> */}

        <View style={styles.mainContainer}>
          <View style={[styles.container, { flexDirection: "column" }]}>
            <View style={{ marginTop: moderateScale(64) }}>
              <Text
                style={{
                  color: COLORS.PRIMARY_DARK,
                  alignSelf: "center",
                  fontSize: moderateScale(18),
                  color: COLORS.GRAY_HARD,
                }}
              >
                LOGIN
              </Text>
              {/* <Image
        style={styles.logo}
        source={require("../../Assets/Images/Login.png")}
      /> */}
            </View>
            <View style={{ marginTop: moderateScale(32), marginTop: ms(64) }}>
              <GeneralTextInput
                placeholder="Email"
                mode="outlined"
                value={email}
                title="Email"
                // hasErrors={authFailed}
                messageError="Wrong Username/Password"
                onChangeText={(e) => setEmail(e)}
                style={styles.inputUserName}
              />
              <View style={{ marginTop: ms(18), marginBottom: ms(64) }}>
                <GeneralTextInput
                  placeholder="Kata Sandi"
                  mode="outlined"
                  title="Kata Sandi"
                  value={password}
                  // hasErrors={authFailed}
                  secureTextEntry={showPassword}
                  // messageError="Wrong Username/Password"
                  // icoPress={() => {
                  //   setHidePassword(!hidePassword);
                  //   return false;
                  // }}
                  right={
                    <TextInput.Icon
                      icon={showPassword ? "eye" : "eye-off"}
                      color={COLORS.PRIMARY_DARK}
                      onPress={togglePassword}
                    />
                  }
                  onChangeText={(e) => setPassword(e)}
                  style={styles.inputUserName}
                />
              </View>

              <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.textBtn}>Sign In</Text>
              </TouchableOpacity>

              {/* <TouchableOpacity
      style={styles.button}
      onPress={() => console.log(token.user?.UserId)}
    >
      <Text style={styles.textBtn}>Sign In</Text>
    </TouchableOpacity> */}
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 10,
                }}
              >
                <View
                  style={{ flex: 1, height: 1, backgroundColor: "lightgray" }}
                />
                <View style={styles.txtRegister}>
                  <TouchableOpacity
                    onPress={() => navigation.navigate("Register")}
                  >
                    <Text
                      style={[styles.textWhite, { color: COLORS.PRIMARY_DARK }]}
                    >
                      Daftar
                    </Text>
                  </TouchableOpacity>
                </View>

                <View
                  style={{ flex: 1, height: 1, backgroundColor: "lightgray" }}
                />
              </View>

              {/* <TouchableOpacity onPress={() => navigation.navigate("PilihPaket")}>
      <Text
        style={[styles.textWhite, { color: COLORS.PRIMARY_MEDIUM }]}
      >
        Submit Pembayaran
      </Text>
    </TouchableOpacity> */}
            </View>

            <View
              style={{
                flex: 1,
              }}
            >
              <TouchableOpacity
                onPress={() => navigation.navigate("SubmitPembayaran2")}
              >
                <Text
                  style={{
                    fontWeight: "500",
                    fontSize: 14,
                    marginTop: ms(8),
                    color: COLORS.PRIMARY_DARK,
                  }}
                >
                  Submit Pembayaran
                </Text>
              </TouchableOpacity>

              <Text
                style={{
                  fontWeight: "500",
                  fontSize: 12,
                  marginTop: ms(8),
                  color: "gray",
                }}
              >
                HUBUNGI KAMI
              </Text>
              <View
                style={{ flex: 1, flexDirection: "row", marginTop: ms(12) }}
              >
                <View style={{ marginRight: ms(4) }}>
                  <Image
                    source={require("../../assets/images/ig.png")}
                    style={{
                      height: ms(20),
                      width: ms(20),
                      marginBottom: ms(8),
                    }}
                  />
                  <Image
                    source={require("../../assets/images/gm.png")}
                    style={{
                      height: ms(16),
                      width: ms(16),
                      marginBottom: ms(8),
                    }}
                  />
                </View>
                <View>
                  <Text style={{ marginBottom: ms(8), fontSize: 12 }}>
                    {`: ${
                      dataContent?.filter(
                        (e) => e.titleContent == "Instagram"
                      )[0]?.content
                    }`}
                  </Text>
                  <Text style={{ marginBottom: ms(8), fontSize: 12 }}>
                    {`: ${
                      dataContent?.filter((e) => e.titleContent == "Gmail")[0]
                        ?.content
                    }`}
                  </Text>
                </View>
              </View>
              <Text>&copy; 2023 MamaChef</Text>
            </View>
          </View>

          {isLoading ? (
            <PopUpLoader visible={true} />
          ) : (
            <PopUpLoader visible={false} />
          )}
        </View>
      </ScrollView>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalErroVis}
        onRequestClose={hideModalError}
      >
        {/* <View style={styles.centeredView}> */}
        <View style={styles.containermodalView}>
          <View style={styles.imgSubmit}>
            <FontAwesome
              name="close"
              size={24}
              style={{ fontSize: 72, color: COLORS.RED_BG }}
            />
          </View>
          <Text style={styles.modalText}>{messageError}</Text>
          <GeneralButton
            style={styles.gettingButton}
            mode="contained"
            onPress={hideModalError}
          >
            Close
          </GeneralButton>
        </View>
        {/* </View> */}
      </Modal>
    </>
  );
};

export default LoginPage;

const styles = StyleSheet.create({
  // CONTAINER
  scroll: {
    // flex: 1,
    backgroundColor: "white",
    // flexGrow: 1,
    height: "100%",
  },
  // image: {
  //   flex: 1,
  //   justifyContent: "center",
  //   paddingHorizontal: moderateScale(24),
  //   backgroundColor: "rgba(0, 0, 0, 0.1)",
  // },
  container: {
    flex: 1,
    justifyContent: "flex-start",
    padding: 10,
  },
  welcomeText: {
    color: COLORS.WHITE,
    fontStyle: "Poppins",
    fontSize: moderateScale(20),
    marginRight: moderateScale(8),
    paddingBottom: moderateScale(10),
    fontWeight: "bold",
  },
  mainContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: moderateScale(22),
    // paddingHorizontal: moderateScale(10),
  },
  input: {
    borderWidth: 1,
    borderColor: "#ececec",
    fontSize: moderateScale(15),
    paddingLeft: 10,

    backgroundColor: "#FFFFFF",
    marginTop: moderateScale(8),
    marginBottom: moderateScale(10),
  },
  logo: {
    width: moderateScale(181),
    height: moderateScale(144),
    alignSelf: "center",
    borderRadius: moderateScale(0),
  },
  text: {
    paddingBottom: moderateScale(5),
    paddingTop: moderateScale(2),

    marginBottom: moderateScale(5),
    marginTop: moderateScale(2),
    color: COLORS.PRIMARY_DARK,
    fontSize: moderateScale(15),
    fontWeight: "bold",
  },
  please: {
    fontSize: moderateScale(15),
    fontFamily: "SemiBold",

    textAlign: "justify",
    marginTop: moderateScale(10),
    marginLeft: 30,
  },
  textBtn: {
    color: "#FFFFFF",
    fontSize: moderateScale(15),
    fontWeight: "bold",
  },
  textGreen: {
    color: "#000000",
    fontSize: moderateScale(16),
  },
  button: {
    borderRadius: moderateScale(10),
    width: widthPercentageToDP(95),
    height: heightPercentageToDP(7),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.PRIMARY_DARK,
    alignSelf: "center",
    marginBottom: moderateScale(5),
    marginTop: moderateScale(10),
  },
  btnGoogle: {
    borderRadius: moderateScale(10),
    borderColor: COLORS.PRIMARY_MEDIUM,
    width: widthPercentageToDP(95),
    height: heightPercentageToDP(7),
    borderWidth: moderateScale(2),
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    alignSelf: "center",
    backgroundColor: "#FFFFFF",
  },

  txtRegister: {
    flexDirection: "row",

    marginTop: moderateScale(10),
    marginBottom: moderateScale(12),
  },
  txtRegister2: {
    // flexDirection: "row",
    alignSelf: "flex-end",
    justifyContent: "flex-end",
    marginTop: moderateScale(40),
    marginBottom: moderateScale(12),
  },
  textWhite: {
    fontSize: moderateScale(15),
    marginRight: moderateScale(8),
    fontWeight: "600",
  },
  inputEmail: {
    paddingHorizontal: moderateScale(12),
    borderWidth: moderateScale(0.2),

    marginBottom: moderateScale(16),

    borderRadius: moderateScale(2),
  },
  borderLess: {
    borderColor: "transparent",
    marginBottom: moderateScale(-24),
    borderWidth: moderateScale(0.2),
  },
  inputUserName: { backgroundColor: COLORS.WHITE },
  inputUserPassword: { backgroundColor: COLORS.WHITE },
  containermodalView: {
    flexDirection: "column",
    alignSelf: "center",
    position: "absolute",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 28,
    backgroundColor: COLORS.WHITE,
    borderRadius: 10,
  },
  modalText: {
    paddingTop: 20,
    marginBottom: 28,
    textAlign: "center",
    alignSelf: "center",
    fontSize: 17,
    letterSpacing: 1,
    lineHeight: 24,
    width: constants.SCREEN_WIDTH * 0.7,
    fontWeight: "600",
  },
  imgSubmit: {
    alignItems: "center",
    justifyContent: "center",
  },
});

