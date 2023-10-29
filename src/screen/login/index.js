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
import { HelperText, TextInput } from "react-native-paper";
import useNavigation from "@react-navigation/core";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";

import { COLORS, FONTS } from "../../assets/theme";
import Icon from "react-native-vector-icons/FontAwesome5";
import { Divider } from "react-native-paper";
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

import { moderateScale } from "react-native-size-matters";
import Feather from "react-native-vector-icons/Feather";
import API from "../../utils/apiService";
import jwtDecode from "jwt-decode";

const LoginPage = ({ navigation }) => {
  const dispatch = useDispatch();

  const [refreshing, setRefreshing] = useState(false);

  // FORM
  const [password, setPassword] = useState("");
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const token = useSelector((state) => state.auth);
  const [dataTok, setDataTok] = useState("");
  const [dataConverToken, setDataConvertToken] = useState(null);

  const showPassword = () => {
    setIsShowPassword(true);
  };

  const converToken = (token) => {
    try {
      const decodedToken = jwtDecode(token);
      console.log(token);
      // You can access the payload data from the decoded token
      // For example, if your payload contains a 'userId' field
      dispatch(setUser(decodedToken));
      // const userId = decodedToken.userId;
      // console.log("User ID:", userId);
    } catch (error) {
      console.error("Error decoding JWT:", error);
    }
  };

  const storeToken = (data) => {
    // Process the received locations as needed
    AsyncStorage.setItem("token", data)
      .then(() => {
        console.log("Data stored successfully");
      })
      .catch((error) => {
        console.error("Error storing data:", error);
      });
  };

  async function getItemFromAsyncStorage(key) {
    try {
      const value = await AsyncStorage.getItem(key);
      if (value !== null) {
        // Data found in AsyncStorage for the given key
        console.log("Value:", value);
        return value;
      } else {
        // No data found for the given key
        console.log("Value not found.");
        return null;
      }
    } catch (error) {
      // Error retrieving data
      console.error("Error while fetching data:", error);
      return null;
    }
  }

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
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.scroll}>
      {/* <StatusBar backgroundColor="#0E9C4A" translucent={true} /> */}

      <View style={styles.mainContainer}>
        <ImageBackground
          resizeMode="cover"
          blurRadius={13}
          style={styles.image}
          source={require("../../assets/images/bg-login.png")}
        >
          <View style={[styles.container, { flexDirection: "column" }]}>
            <Text style={[styles.welcomeText, { fontWeight: "bold" }]}>
              Welcome Back !{" "}
            </Text>
            <View>
              <Text style={{ color: COLORS.WHITE }}>
                Please enter your email and password, to know the rest of your
                diet progress{" "}
              </Text>
              {/* <Image
                style={styles.logo}
                source={require("../../Assets/Images/Login.png")}
              /> */}
            </View>
          </View>

          <View>
            <Text style={styles.text}>Email</Text>

            <GeneralTextInput
              placeholder="Email"
              mode="outlined"
              value={email}
              // hasErrors={authFailed}
              messageError="Wrong Username/Password"
              onChangeText={(e) => setEmail(e)}
              style={styles.inputUserName}
            />
            <View>
              <Text style={styles.text}>Password</Text>

              <TextInputPassword
                placeholder="Password"
                mode="outlined"
                value={password}
                // hasErrors={authFailed}
                secureTextEntry={true}
                // messageError="Wrong Username/Password"
                // icoPress={() => {
                //   setHidePassword(!hidePassword);
                //   return false;
                // }}
                onChangeText={(e) => setPassword(e)}
                style={styles.inputUserPassword}
              />
              <Text style={styles.text}>Forgot Passsword?</Text>
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
            <View style={styles.txtRegister}>
              <Text style={styles.textWhite}>Didn’t Have Account?</Text>
              <TouchableOpacity onPress={() => navigation.navigate("Register")}>
                <Text
                  style={[styles.textWhite, { color: COLORS.PRIMARY_MEDIUM }]}
                >
                  Sign Up
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>

        {isLoading ? (
          <PopUpLoader visible={true} />
        ) : (
          <PopUpLoader visible={false} />
        )}
      </View>
    </ScrollView>
  );
};

export default LoginPage;

const styles = StyleSheet.create({
  // CONTAINER
  scroll: {
    // flex: 1,
    backgroundColor: "white",
    flexGrow: 1,
  },
  image: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: moderateScale(24),
    backgroundColor: "rgba(0, 0, 0, 0.1)",
  },
  container: {
    flex: 1,
    justifyContent: "center",
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
    backgroundColor: "#FFFFFF",
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
    color: "#000000",
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
    backgroundColor: COLORS.PRIMARY_MEDIUM,
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
    marginBottom: moderateScale(72),
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
  inputUserName: { backgroundColor: COLORS.GRAY_SOFT },
  inputUserPassword: { backgroundColor: COLORS.GRAY_SOFT },
});
