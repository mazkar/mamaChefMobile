import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  StyleSheet,
  FlatList,
  Image,
} from "react-native";
import React, { useState, useCallback, useEffect } from "react";
import RootContainer from "../../component/RootContainer/index";
import { useNavigation } from "@react-navigation/core";
import ColorBgContainer from "../../component/ColorBgContainer";
import { COLORS, FONTS } from "../../assets/theme";
import {
  Button,
  Menu,
  Divider,
  Avatar,
  Card,
  Paragraph,
  RadioButton,
  Modal,
  Searchbar,
} from "react-native-paper";
import { ms, moderateScale } from "react-native-size-matters";
import constants from "../../assets/constants/index.js";
import {
  AppBar,
  GeneralButton,
  OverviewProgres,
  PopUpLoader,
  GeneralTextInput,
} from "../../component/index";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";

import AsyncStorage from "@react-native-async-storage/async-storage";
// iCONS
import FaIcons from "react-native-vector-icons/Ionicons";
import { resetReducer } from "../../store/models/auth/actions";
import { useDispatch, useSelector } from "react-redux";
import API from "../../utils/apiService";
import axios from "axios";
import DateTimePicker from "@react-native-community/datetimepicker";
import { baseUrl } from "../../utils/apiURL";
import ImagePickers from "./Component/ImagePicker";
import moment from "moment";
import { Ionicons, FontAwesome } from "@expo/vector-icons";

export default function TambahMember({ navigation }) {
  const [valueNamaMenu, setValueNamaMenu] = useState("");
  const [valuePendidikan, setValuePendidikan] = useState("");
  const [valueAlamat, setValueAlamat] = useState("");
  const [valueNoHp, setValueNoHp] = useState("");
  const [valueUsername, setValueUsername] = useState("");
  const [valuePassword, setValuePassword] = useState("");
  const [valueConfirmPassword, setValueConfirmPassword] = useState("");
  const [image, setImage] = useState(null);
  const user = useSelector((state) => state.auth.user);
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [modalSuccesVis, setModalSuccessVis] = useState(false);
  const [modalErroVis, setModalErrorVis] = useState(false);
  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === "ios");
    setDate(currentDate);
    // console.log(selectedDate);
    // Use currentDate as needed, for example, you can pass it to a parent component or handle it in this component.
  };

  const showDatePicker = () => {
    setShow(true);
  };

  const hideModalSuccess = () => {
    setModalSuccessVis(false);
    navigation.navigate("Member");

    // getTaskDetail(route.params.assignmentId);
  };

  const hideModalError = () => {
    setModalErrorVis(false);

    // getTaskDetail(route.params.assignmentId);
  };

  async function hadleDaftar() {
    setIsLoading(true);
    const body = {
      name: valueNamaMenu,
      userName: valueUsername,
      password: valuePassword,
      phoneNumber: valueNoHp,
      isActive: true,
      userId: parseInt(user.UserId),
      lmby: user.Email,
      lmdt: moment(),
    };

    console.log(body);

    try {
      console.log(body);
      let res = await axios({
        url: `${baseUrl.URL}api/Member/RegisterMember`,
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
        console.log(res.data.data, "<=== res berjhasil");
        setIsLoading(false);

        setModalSuccessVis(true);

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
      console.error(err, "error");
      setModalErrorVis(true);
      setIsLoading(false);
    }
  }

  return (
    <ColorBgContainer>
      <RootContainer>
        <AppBar title="Kelola Member" dataTaskPending={[]} />
        <ScrollView style={styles.mainContainer}>
          <View style={{ marginBottom: ms(16) }}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: "700",
                color: COLORS.PRIMARY_DARK,
              }}
            >
              Tambah Member
            </Text>
          </View>
          <View>
            <View style={styles.inputForm}>
              <Text style={styles.text}>Nama</Text>

              <GeneralTextInput
                placeholder="Nama"
                mode="outlined"
                value={valueNamaMenu}
                // hasErrors={authFailed}
                messageError="Wrong Username/Password"
                onChangeText={(e) => setValueNamaMenu(e)}
                style={styles.inputUserName}
              />
            </View>
            <View style={styles.inputForm}>
              <Text style={styles.text}>No Hp</Text>

              <GeneralTextInput
                placeholder="No HP"
                mode="outlined"
                value={valueNoHp}
                // hasErrors={authFailed}
                messageError="Wrong Username/Password"
                onChangeText={(e) => setValueNoHp(e)}
                style={styles.inputUserName}
              />
            </View>
            <View style={styles.inputForm}>
              <Text style={styles.text}>Usernmae/Email</Text>

              <GeneralTextInput
                placeholder="username/email"
                mode="outlined"
                value={valueUsername}
                // hasErrors={authFailed}
                messageError="Wrong Username/Password"
                onChangeText={(e) => setValueUsername(e)}
                style={styles.inputUserName}
              />
            </View>
            <View style={styles.inputForm}>
              <Text style={styles.text}>Password</Text>

              <GeneralTextInput
                placeholder="Password"
                mode="outlined"
                value={valuePassword}
                // hasErrors={authFailed}
                secureTextEntry={true}
                messageError="Wrong Username/Password"
                onChangeText={(e) => setValuePassword(e)}
                style={styles.inputUserName}
              />
            </View>
            <View style={styles.inputForm}>
              <Text style={styles.text}>Confirm Password</Text>

              <GeneralTextInput
                placeholder="Confirm Password"
                mode="outlined"
                value={valueConfirmPassword}
                // hasErrors={authFailed}
                secureTextEntry={true}
                messageError="Wrong Username/Password"
                onChangeText={(e) => setValueConfirmPassword(e)}
                style={styles.inputUserName}
              />
            </View>

            <TouchableOpacity style={styles.button} onPress={hadleDaftar}>
              <Text style={{ color: "white" }}>Daftar</Text>
            </TouchableOpacity>
            {/* <TouchableOpacity
              style={styles.button}
              onPress={() => console.log(user)}
            >
              <Text style={{ color: "white" }}>Daftar</Text>
            </TouchableOpacity> */}
          </View>
          {isLoading ? (
            <PopUpLoader visible={true} />
          ) : (
            <PopUpLoader visible={false} />
          )}
        </ScrollView>

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalSuccesVis}
          onRequestClose={hideModalSuccess}
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
            <Text style={styles.modalText}>Data Berhasil di Tambahkan</Text>
            <GeneralButton
              style={{ backgroundColor: COLORS.PRIMARY_DARK }}
              mode="contained"
              onPress={hideModalSuccess}
            >
              Close
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
            <Text style={styles.modalText}>Error</Text>
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
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  btnAdd: {
    borderRadius: moderateScale(10),
    width: widthPercentageToDP(38),
    height: heightPercentageToDP(6),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.PRIMARY_MEDIUM,
    alignSelf: "flex-end",
    marginBottom: moderateScale(5),
    marginTop: moderateScale(5),
    marginTop: moderateScale(10),
  },
  continerSearch: {
    // paddingHorizontal: 8,
    // paddingVertical: 8,
  },
  inputForm: {
    marginTop: ms(6),
  },
  text: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.PRIMARY_DARK,
  },
  button: {
    borderRadius: moderateScale(10),
    width: widthPercentageToDP(95),
    height: heightPercentageToDP(7),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.PRIMARY_DARK,
    alignSelf: "center",

    marginBottom: moderateScale(32),
    marginTop: moderateScale(18),
  },
  containermodalView: {
    flexDirection: "column",
    alignSelf: "stretch",
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
