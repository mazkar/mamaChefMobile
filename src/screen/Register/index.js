import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  StyleSheet,
  FlatList,
  ImageBackground,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
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
  TextInput,
  Checkbox,
  Paragraph,
  Modal,
  Searchbar,
} from "react-native-paper";

import { ms, moderateScale } from "react-native-size-matters";
import {
  AppBar,
  GeneralButton,
  OverviewProgres,
  DateTimePickers,
  GeneralTextInput,
  TextInputPassword,
  PopUpLoader,
  DropDown,
} from "../../component/index";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import constants from "../../assets/constants/index.js";
import AsyncStorage from "@react-native-async-storage/async-storage";
// iCONS

import { resetReducer, setUserId } from "../../store/models/auth/actions";
import { useDispatch, useSelector } from "react-redux";
import API from "../../utils/apiService";
import axios from "axios";
import { baseUrl } from "../../utils/apiURL";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import moment from "moment";

export default function Register({ navigation }) {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [openDropDown, setOpenDropDown] = useState(false);
  const [modalSuccesVis, setModalSuccessVis] = useState(false);
  const [modalErroVis, setModalErrorVis] = useState(false);
  const [itemsDropDown, setItemDropDown] = useState([
    { label: "Laki - laki", value: "Laki - laki" },
    { label: "Perempuan", value: "Perempuan" },
  ]);

  const [openDropDown2, setOpenDropDown2] = useState(false);
  const [itemsDropDown2, setItemDropDown2] = useState([
    { label: "3 Bulan", value: 1 },
    { label: "6 Bulan", value: 2 },
    { label: "12 Bulan", value: 3 },
  ]);

  //FORM
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [selectedGender, setSelectedGender] = useState("");
  const [selectedPeriode, setSelectedPeriode] = useState("");
  const [Pendidikan, setPendidikan] = useState("");
  const [alamat, setAlamat] = useState("");
  const [referal, setReferal] = useState("");
  const [namaDepan, setNamaDepan] = useState("");
  const [namaBelakang, setNamaBelakang] = useState();
  const [biaya, setBiaya] = useState("");
  const [dataPeriode, setDataPeriode] = useState(null);
  const [messageError, setMessageError] = useState("");
  const [showPassword, setShowPassword] = useState(true);
  const [showPassword2, setShowPassword2] = useState(true);
  const [checked, setChecked] = useState(false);

  const handleCheckboxToggle = () => {
    setChecked(!checked);
  };
  //   const [date, setDate] = useState("");

  const hideModalSuccess = () => {
    setModalSuccessVis(false);
    navigation.push("PilihPaket");

    // getTaskDetail(route.params.assignmentId);
  };

  const hideModalError = () => {
    setModalErrorVis(false);

    // getTaskDetail(route.params.assignmentId);
  };
  const onChangePeriode = (value) => {
    console.log(value);
  };

  async function handleDaftar() {
    setIsLoading(true);

    const body = {
      // firstName: namaDepan,
      // lastName: namaBelakang,
      email: email,
      password: password,
      // sex: selectedGender,
      // education: Pendidikan,
      // dateofBirth: moment(date).format("YYYY-MM-DD"),
      referalCode: referal,
      // subscriptionId: selectedPeriode,
    };

    try {
      console.log(body);
      let res = await axios({
        url: `${baseUrl.URL}api/Auth/RegisterUser`,
        method: "POST",
        timeout: 8000,
        data: body,
        headers: {
          "Content-Type": "application/json",
          // Authorization: `Bearer ${token}`,
        },
      });
      console.log(res, "Success");
      if (res.data.code == "200") {
        console.log(res.data.data, "<= res");
        setIsLoading(false);
        dispatch(setUserId(res.data.data[0]?.userId));

        setModalSuccessVis(true);

        // test for status you want, etc
        // setLoadingUpload(false);
        // getTaskDetail(route.params.assignmentId);
        console.log(res, "Success");

        // setDataItem(res.data);
        // setDataInfo(res.data);
      } else {
        setIsLoading(false);
        setModalErrorVis(true);
        setMessageError(res.data.message);
      }
      // Don't forget to return something
      return res.data;
    } catch (err) {
      console.error(err, "error");
      setModalErrorVis(true);
      setIsLoading(false);
    }
  }

  async function getSubcriptionPrice(id) {
    // setIsLoadingGet(true);
    try {
      let res = await axios({
        url: `${baseUrl.URL}api/usersubs/getperioddetail/${id}`,
        method: "get",
        timeout: 8000,
        headers: {
          "Content-Type": "application/json",
          //   Authorization: `Bearer ${token}`,
        },
      });
      if (res.status == 200) {
        // test for status you want, etc
        // console.log(res.data, "meeeeeeeee");
        setDataPeriode(res.data.data);
        setBiaya(res.data.data.price.toString());

        // setIsLoadingGet(false);
        console.log(res.data.data.price, "transit");
      }
      // Don't forget to return something
      return res.data;
    } catch (err) {
      console.error(err);
      //   setIsLoadingGet(false);
    }
  }

  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);

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

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };
  const togglePassword2 = () => {
    setShowPassword2(!showPassword2);
  };

  useEffect(() => {
    getSubcriptionPrice(selectedPeriode);
  }, [selectedPeriode]);

  return (
    <RootContainer>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.mainContainer}>
          <View
            style={[
              styles.container,
              {
                flexDirection: "column",
                justifyContent: "center",
                // backgroundColor: "red",
                flex: 1,
                alignItems: "center",
              },
            ]}
          >
            <Text style={[styles.welcomeText, { fontWeight: "bold" }]}>
              Registrasi
            </Text>
          </View>

          <View>
            <View style={styles.inputForm}>
              {/* <Text style={styles.text}>Email</Text> */}

              <GeneralTextInput
                placeholder="Email"
                label="Email"
                mode="outlined"
                value={email}
                // hasErrors={authFailed}
                messageError="Wrong Username/Password"
                onChangeText={(e) => setEmail(e)}
                style={styles.inputUserName}
              />
            </View>
            <View style={styles.inputForm}>
              <GeneralTextInput
                placeholder="Kata Sandi"
                mode="outlined"
                value={password}
                label="Kata Sandi"
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
            <View style={styles.inputForm}>
              <GeneralTextInput
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
                right={
                  <TextInput.Icon
                    icon={showPassword2 ? "eye" : "eye-off"}
                    color={COLORS.PRIMARY_DARK}
                    onPress={togglePassword2}
                  />
                }
                onChangeText={(e) => setPassword2(e)}
                style={styles.inputUserName}
              />
              {password == password2 && password != "" ? (
                <Text style={{ color: COLORS.SUCCESS }} t>
                  Kata Sandi Sesuai
                </Text>
              ) : password2 != "" ? (
                <Text style={{ color: COLORS.RED_BG }}>
                  Kata Sandi Tidak Sesuai
                </Text>
              ) : null}

              {/* <Text>Kata Sandi Minimal 8 Karakter</Text> */}
            </View>

            <View style={styles.inputForm}>
              <GeneralTextInput
                placeholder="Referal"
                mode="outlined"
                value={referal}
                // hasErrors={authFailed}
                messageError="Wrong Username/Password"
                onChangeText={(e) => setReferal(e)}
                style={styles.inputUserName}
              />
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: ms(8),
                paddingRight: ms(10),
              }}
            >
              <View style={{ alignSelf: "flex-start" }}>
                <Checkbox.Android
                  status={checked ? "checked" : "unchecked"}
                  onPress={handleCheckboxToggle}
                />
              </View>

              <Text>
                <Text>Dengan Melakukan Pendafaran, berarti </Text>
                <Text>anda telah menyetujui </Text>
                <Text style={{ fontWeight: "600", color: COLORS.PRIMARY_DARK }}>
                  Syarat Ketentuan{" "}
                </Text>
                <Text>dan </Text>
                <Text style={{ fontWeight: "600", color: COLORS.PRIMARY_DARK }}>
                  Kebijakan Privasi
                </Text>
                <Text> Mama Chef</Text>
              </Text>
            </View>

            <TouchableOpacity
              style={styles.button}
              onPress={handleDaftar}
              // disabled={checked}
            >
              <Text style={{ color: COLORS.WHITE }}>Daftar</Text>
            </TouchableOpacity>

            {/* <TouchableOpacity
              style={styles.button}
              onPress={() => console.log(token.user?.UserId)}
            >
              <Text style={styles.textBtn}>Sign In</Text>
            </TouchableOpacity> */}
          </View>
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
            {/* <FaIcons
              name="check-underline-circle"
              style={{ fontSize: 72, color: COLORS.SUCCESS }}
            /> */}
            <Ionicons
              name="checkmark-circle"
              size={24}
              style={{ fontSize: 72, color: COLORS.SUCCESS }}
            />
          </View>
          <Text style={styles.modalText}>Data Berhasil di Tambahkan</Text>
          <GeneralButton
            style={styles.gettingButton}
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
    </RootContainer>
  );
}

const styles = StyleSheet.create({
  scroll: {
    // flex: 1,
    backgroundColor: "white",
    flexGrow: 1,
  },
  mainContainer: {
    // backgroundColor: "#FFFFFF",
    paddingTop: ms(24),
    paddingHorizontal: 22,
    // paddingHorizontal: moderateScale(10),
  },
  image: {
    flex: 1,
    // justifyContent: "center",
    paddingHorizontal: moderateScale(24),
    backgroundColor: "rgba(0, 0, 0, 0.1)",
  },
  container: {
    // flex: 1,
    // justifyContent: "center",
    padding: 10,
  },
  inputUserName: {
    height: 72,
    border: "0px",
    backgroundColor: "transparent",
  },
  welcomeText: {
    color: COLORS.GRAY_HARD,
    fontStyle: "Poppins",
    fontSize: moderateScale(20),
    marginRight: moderateScale(8),
    paddingBottom: moderateScale(10),
    fontWeight: "bold",
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
    width: widthPercentageToDP(88),
    height: heightPercentageToDP(7),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.PRIMARY_DARK,
    alignSelf: "center",

    marginBottom: moderateScale(5),
    marginTop: moderateScale(18),
  },
  containermodalView: {
    flexDirection: "column",
    alignSelf: "stretch",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 28,
    paddingHorizontal: 32,
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
