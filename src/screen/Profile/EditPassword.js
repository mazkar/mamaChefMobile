import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import {
  AppBar,
  ColorBgContainer,
  GeneralButton,
  GeneralTextInput,
  GeneralTextInput2,
  PopUpLoader,
  RootContainer,
} from "../../component/index.js";
import { useDispatch, useSelector } from "react-redux";
import {
  resetReducer,
  setToken,
  setUser,
} from "../../store/models/auth/actions.js";
import { COLORS, FONTS } from "../../assets/theme/index.js";
import { ms, moderateScale } from "react-native-size-matters";
import { ScrollView } from "react-native-gesture-handler";
import {
  Button,
  Menu,
  Divider,
  Avatar,
  Card,
  Modal,
  TextInput,
} from "react-native-paper";
import { baseUrl } from "../../utils/apiURL.js";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import {
  widthPercentageToDP,
  heightPercentageToDP,
} from "react-native-responsive-screen";
import constants from "../../assets/constants/index.js";
import axios from "axios";

export default function EditPassword({ navigation }) {
  const dispatch = useDispatch();
  const [modalSuccesVis2, setModalSuccessVis2] = useState(false);
  const [modalErroVis, setModalErrorVis] = useState(false);
  const [username, setUsername] = useState("Azka");
  const [edit, setIsEdit] = useState(false);
  const [valueName, setValueName] = useState("");
  const [isLoadingGet, setIsLoadingGet] = useState(false);
  const [successMessage, setSuccessMessage] = useState("Success");
  const [errorMessage, setErrorMessage] = useState("error");
  const [showPassword, setShowPassword] = useState(true);
  const [showPassword2, setShowPassword2] = useState(true);
  const [showPassword3, setShowPassword3] = useState(true);
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [password3, setPassword3] = useState("");

  const user = useSelector((state) => state?.auth?.user);

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };
  const togglePassword2 = () => {
    setShowPassword2(!showPassword2);
  };
  const togglePassword3 = () => {
    setShowPassword3(!showPassword3);
  };

  const handleLogut = () => {
    dispatch(resetReducer());
    navigation.reset({
      index: 0,
      routes: [{ name: "Login" }],
    });
  };

  const hideModalSuccess2 = () => {
    setModalSuccessVis2(false);
    navigation.navigate("Profile");
    // getTaskDetail(route.params.assignmentId);
  };

  const hideModalError = () => {
    setModalErrorVis(false);

    // getTaskDetail(route.params.assignmentId);
  };

  const handleEdit = async () => {
    const body = {
      userId: parseInt(user?.UserId),
      email: user?.Email,
      latestPassword: password3,
      newPassword: password,
    };
    console.log(body);

    setIsLoadingGet(true);
    try {
      console.log(body);
      let res = await axios({
        url: `${baseUrl.URL}api/Auth/UpdatePassword`,
        method: "POST",
        timeout: 58000,
        data: body,
        headers: {
          "Content-Type": "application/json",
          // Authorization: `Bearer ${token}`,
        },
      });

      if (res.status == "200") {
        console.log(res.data.data, "<= res");
        setIsLoadingGet(false);
        setSuccessMessage(res.data.message);
        // dispatch(setUser(res.data.data));
        // dispatch(setUserId(res.data.data[0]?.userId));

        setModalSuccessVis2(true);
        setIsEdit(false);
        // test for status you want, etc
        // setLoadingUpload(false);
        // getTaskDetail(route.params.assignmentId);
        console.log(res, "Success");

        // setDataItem(res.data);
        // setDataInfo(res.data);
      } else {
        setIsLoadingGet(false);
        setIsEdit(false);
      }
      // Don't forget to return something
      return res.data;
    } catch (err) {
      console.error(err, "error");
      setModalErrorVis(true);
      setIsLoadingGet(false);
      setErrorMessage(err.message);
    }
  };

  return (
    <ColorBgContainer style={{ paddingHorizontal: 24, paddingVertical: 72 }}>
      <RootContainer isTransparent>
        <AppBar title="Ubah Kata Sandi" />
        <View style={styles.mainContainer}>
          {/* <Button onPress={() => console.log(user)}>test</Button> */}
          <View>
            <View style={{ flexDirection: "row", marginBottom: ms(8) }}>
              {/* <Image source={require("../../assets/images/IconProfile.png")} /> */}
              <Text
                style={{
                  marginLeft: ms(4),
                  color: COLORS.GRAY_HARD,
                  fontWeight: "600",
                }}
              >
                Masukan Kata Sandi Lama
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
                <GeneralTextInput2
                  placeholder="Kata Sandi"
                  mode="outlined"
                  value={password3}
                  label="Kata Sandi"
                  style={{ width: "100%" }}
                  // hasErrors={authFailed}
                  secureTextEntry={showPassword3}
                  // messageError="Wrong Username/Password"
                  // icoPress={() => {
                  //   setHidePassword(!hidePassword);
                  //   return false;
                  // }}
                  right={
                    <TextInput.Icon
                      icon={showPassword3 ? "eye" : "eye-off"}
                      color={COLORS.PRIMARY_DARK}
                      onPress={togglePassword3}
                    />
                  }
                  onChangeText={(e) => setPassword3(e)}
                />
                {/* <View style={{ marginLeft: ms(12) }}>
                <Text style={{ fontWeight: "600" }}>{user?.fullname}</Text>
                <Text style={{ fontWeight: "300" }}>Mover</Text>
              </View> */}
              </View>
            </Card>
          </View>
          <View>
            <View style={{ flexDirection: "row", marginBottom: ms(8) }}>
              {/* <Image source={require("../../assets/images/IconProfile.png")} /> */}
              <Text
                style={{
                  marginLeft: ms(4),
                  color: COLORS.GRAY_HARD,
                  fontWeight: "600",
                }}
              >
                Masukan Kata Sandi Baru
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
                <GeneralTextInput2
                  placeholder="Kata Sandi"
                  mode="outlined"
                  value={password}
                  label="Kata Sandi"
                  style={{ width: "100%" }}
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
                />
                {/* <View style={{ marginLeft: ms(12) }}>
                <Text style={{ fontWeight: "600" }}>{user?.fullname}</Text>
                <Text style={{ fontWeight: "300" }}>Mover</Text>
              </View> */}
              </View>
            </Card>
          </View>
          <View style={{ marginTop: ms(16) }}>
            <View style={{ flexDirection: "row", marginBottom: ms(8) }}>
              {/* <Image source={require("../../assets/images/IconProfile.png")} /> */}
              <Text
                style={{
                  marginLeft: ms(4),
                  color: COLORS.GRAY_HARD,
                  fontWeight: "600",
                }}
              >
                Ulangi Kata Sandi Baru
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
                <GeneralTextInput2
                  placeholder="Ulangi Kata Sandi"
                  mode="outlined"
                  value={password}
                  label="Ulangi Kata Sandi"
                  // hasErrors={authFailed}
                  secureTextEntry={showPassword2}
                  // messageError="Wrong Username/Password"
                  // icoPress={() => {
                  //   setHidePassword(!hidePassword);
                  //   return false;
                  // }}
                  style={{ width: "100%" }}
                  right={
                    <TextInput.Icon
                      icon={showPassword2 ? "eye" : "eye-off"}
                      color={COLORS.PRIMARY_DARK}
                      onPress={togglePassword2}
                    />
                  }
                  onChangeText={(e) => setPassword2(e)}
                />

                {/* <View style={{ marginLeft: ms(12) }}>
                <Text style={{ fontWeight: "600" }}>{user?.fullname}</Text>
                <Text style={{ fontWeight: "300" }}>Mover</Text>
              </View> */}
              </View>
              {password == password2 && password != "" ? (
                <Text style={{ color: COLORS.SUCCESS }} t>
                  Kata Sandi Sesuai
                </Text>
              ) : password2 != "" ? (
                <Text style={{ color: COLORS.RED_BG }}>
                  Kata Sandi Tidak Sesuai
                </Text>
              ) : null}
            </Card>
          </View>
          {password == password2 && password != "" ? (
            <TouchableOpacity onPress={handleEdit} style={styles.button}>
              <Text style={{ color: COLORS.WHITE }}>Submit</Text>
            </TouchableOpacity>
          ) : password2 != "" ? (
            <TouchableOpacity style={styles.buttonDisabled} disabled>
              <Text style={{ color: COLORS.WHITE }}>Submit</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.buttonDisabled} disabled>
              <Text style={{ color: COLORS.WHITE }}>Submit</Text>
            </TouchableOpacity>
          )}

          {isLoadingGet ? (
            <PopUpLoader visible={true} />
          ) : (
            <PopUpLoader visible={false} />
          )}
        </View>

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalSuccesVis2}
          onRequestClose={hideModalSuccess2}
        >
          {/* <View style={styles.centeredView}> */}
          <View style={styles.containermodalView}>
            <View style={styles.imgSubmit}>
              <Ionicons
                name="checkmark-circle"
                size={24}
                style={{ fontSize: 72, color: COLORS.SUCCESS }}
              />
            </View>
            <Text style={styles.modalText}>{successMessage}</Text>
            <GeneralButton
              style={{ backgroundColor: COLORS.PRIMARY_DARK }}
              mode="contained"
              onPress={hideModalSuccess2}
            >
              Kembali
            </GeneralButton>
          </View>
          {/* </View> */}
        </Modal>

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
            <Text style={styles.modalText}>{errorMessage}</Text>
            <GeneralButton
              style={{ backgroundColor: COLORS.PRIMARY_MEDIUM }}
              mode="contained"
              onPress={hideModalError}
            >
              Close
            </GeneralButton>
          </View>
          {/* </View> */}
        </Modal>
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
  containermodalView: {
    flexDirection: "column",
    alignSelf: "center",
    // position: "absolute",
    width: constants.SCREEN_WIDTH * 0.8,
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
  button: {
    borderRadius: moderateScale(10),
    width: widthPercentageToDP(90),
    height: heightPercentageToDP(7),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.PRIMARY_DARK,
    alignSelf: "center",
    marginBottom: moderateScale(5),
    marginTop: moderateScale(10),
  },
  buttonDisabled: {
    borderRadius: moderateScale(10),
    width: widthPercentageToDP(90),
    height: heightPercentageToDP(7),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.GRAY_HARD,
    alignSelf: "center",
    marginBottom: moderateScale(5),
    marginTop: moderateScale(10),
  },
});
