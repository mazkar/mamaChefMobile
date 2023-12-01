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
import {
  resetReducer,
  setToken,
  setUser,
} from "../../store/models/auth/actions";
import { COLORS, FONTS } from "../../assets/theme";
import { ms } from "react-native-size-matters";
import { ScrollView } from "react-native-gesture-handler";
import { Button, Menu, Divider, Avatar, Card, Modal } from "react-native-paper";
import { baseUrl } from "../../utils/apiURL";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import {
  widthPercentageToDP,
  heightPercentageToDP,
} from "react-native-responsive-screen";
import constants from "../../assets/constants/index.js";
import axios from "axios";

export default function EditProfil({ navigation }) {
  const dispatch = useDispatch();
  const [modalSuccesVis2, setModalSuccessVis2] = useState(false);
  const [modalErroVis, setModalErrorVis] = useState(false);
  const [username, setUsername] = useState("Azka");
  const [edit, setIsEdit] = useState(false);
  const [valueName, setValueName] = useState("");
  const [isLoadingGet, setIsLoadingGet] = useState(false);
  const [successMessage, setSuccessMessage] = useState("Success");
  const [errorMessage, setErrorMessage] = useState("error");

  const user = useSelector((state) => state?.auth?.user);

  const handleLogut = () => {
    dispatch(resetReducer());
    navigation.reset({
      index: 0,
      routes: [{ name: "Login" }],
    });
  };

  const hideModalSuccess2 = () => {
    setModalSuccessVis2(false);

    // getTaskDetail(route.params.assignmentId);
  };

  const hideModalError = () => {
    setModalErrorVis(false);

    // getTaskDetail(route.params.assignmentId);
  };

  const handleEdit = async () => {
    const body = {
      // userId: parseInt(user.UserId),
      userId: parseInt(user.UserId),
      firstName: valueName,
      lastName: "",
      sex: "",
      education: "",
      dateofBirth: "2023-11-26T07:30:22.719Z",
    };
    console.log(body);

    setIsLoadingGet(true);
    try {
      console.log(body);
      let res = await axios({
        url: `${baseUrl.URL}api/Auth/UpdateUserProfile`,
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
        <AppBar title="Ubah Profil" />
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
                {edit ? (
                  <GeneralTextInput
                    placeholder={user.FirstName}
                    mode="outlined"
                    value={valueName}
                    // hasErrors={authFailed}
                    messageError="Wrong Username/Password"
                    onChangeText={(e) => setValueName(e)}
                    style={{ width: "70%" }}
                  />
                ) : (
                  <View style={{ flexDirection: "row" }}>
                    <Avatar.Text size={32} label="A" color={COLORS.WHITE} />
                    <View style={{ alignSelf: "center", marginLeft: ms(6) }}>
                      <Text>{user.FirstName}</Text>
                    </View>
                    <View style={{ alignSelf: "center" }}>
                      <Image
                        source={require("../../assets/images/checked.png")}
                      />
                    </View>
                  </View>
                )}

                <View style={{ alignSelf: "center" }}>
                  {edit ? (
                    <TouchableOpacity onPress={() => handleEdit(false)}>
                      <Text style={{ color: COLORS.PRIMARY_DARK }}>
                        Confirm
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity onPress={() => setIsEdit(true)}>
                      <Text style={{ color: COLORS.PRIMARY_DARK }}>
                        Ubah Profil
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>

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
                EMAIL
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
                    <Text>{user.Email}</Text>
                  </View>
                  <View style={{ alignSelf: "center" }}>
                    <Image
                      source={require("../../assets/images/checked.png")}
                    />
                  </View>
                </View>
                <View style={{ alignSelf: "center" }}>
                  <TouchableOpacity>
                    <Text style={{ color: COLORS.PRIMARY_DARK }}>
                      Ubah Email
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
    // flexDirection: "column",
    // alignSelf: "center",
    // position: "absolute",
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
