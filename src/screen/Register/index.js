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

import { resetReducer } from "../../store/models/auth/actions";
import { useDispatch, useSelector } from "react-redux";
import API from "../../utils/apiService";
import axios from "axios";
import { baseUrl } from "../../utils/apiURL";
import DateTimePicker from "@react-native-community/datetimepicker";
import FaIcons from "react-native-vector-icons/FontAwesome5";
import moment from "moment";

export default function Register() {
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
  const [selectedGender, setSelectedGender] = useState("");
  const [selectedPeriode, setSelectedPeriode] = useState("");
  const [Pendidikan, setPendidikan] = useState("");
  const [alamat, setAlamat] = useState("");
  const [referal, setReferal] = useState("");
  const [namaDepan, setNamaDepan] = useState("");
  const [namaBelakang, setNamaBelakang] = useState();
  const [biaya, setBiaya] = useState("");
  const [dataPeriode, setDataPeriode] = useState(null);
  //   const [date, setDate] = useState("");

  const hideModalSuccess = () => {
    setModalSuccessVis(false);

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
      firstName: namaDepan,
      lastName: namaBelakang,
      email: email,
      password: password,
      sex: selectedGender,
      education: Pendidikan,
      dateofBirth: moment(date).format("YYYY-MM-DD"),
      referalCode: referal,
      subscriptionId: selectedPeriode,
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
      if (res.status == "200") {
        console.log(res);
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

  useEffect(() => {
    getSubcriptionPrice(selectedPeriode);
  }, [selectedPeriode]);

  return (
    <RootContainer>
      <ScrollView contentContainerStyle={styles.scroll}>
        <ImageBackground
          resizeMode="cover"
          blurRadius={13}
          style={styles.image}
          source={require("../../assets/images/bg-login.png")}
        >
          <View style={styles.mainContainer}>
            <View style={[styles.container, { flexDirection: "column" }]}>
              <Text style={[styles.welcomeText, { fontWeight: "bold" }]}>
                Buat Akun Baru
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
              <View style={styles.inputForm}>
                <Text style={styles.text}>Nama Depan</Text>

                <GeneralTextInput
                  placeholder="Nama Depan"
                  mode="outlined"
                  value={namaDepan}
                  // hasErrors={authFailed}
                  messageError="Wrong Username/Password"
                  onChangeText={(e) => setNamaDepan(e)}
                  style={styles.inputUserName}
                />
              </View>
              <View style={styles.inputForm}>
                <Text style={styles.text}>Nama Belakang</Text>

                <GeneralTextInput
                  placeholder="Nama Belakang"
                  mode="outlined"
                  value={namaBelakang}
                  // hasErrors={authFailed}
                  messageError="Wrong Username/Password"
                  onChangeText={(e) => setNamaBelakang(e)}
                  style={styles.inputUserName}
                />
              </View>
              <View style={styles.inputForm}>
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
              </View>
              <View style={styles.inputForm}>
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
                  style={styles.inputUserName}
                />
              </View>
              <View style={styles.inputForm}>
                <Text style={styles.text}>Gender</Text>

                <DropDownPicker
                  placeholder="Gender"
                  open={openDropDown}
                  value={selectedGender}
                  items={itemsDropDown}
                  setItems={setItemDropDown}
                  setOpen={setOpenDropDown}
                  setValue={setSelectedGender}
                  //   //   dropDownDirection="BOTTOM"
                  //   placeholderStyle={styles.dropDownText}
                  //   dropDownContainerStyle={styles.dropDownContainer}
                  // ArrowUpIconComponent={() => <ICONS.IconChevronUpArrow />}
                  // ArrowDownIconComponent={() => <ICONS.IconChevronDownArrow />}
                  listMode="SCROLLVIEW"
                  //   style={{
                  //     borderWidth: open ? 2 : 1,
                  //     borderColor: open
                  //       ? COLORS.PRIMARY_MEDIUM
                  //       : COLORS.GRAY_MEDIUM,
                  //     height: 60,
                  //   }}
                />
              </View>
              <View style={styles.inputForm}>
                <Text style={styles.text}>Pendidikan</Text>

                <GeneralTextInput
                  placeholder="Pendidikan"
                  mode="outlined"
                  value={Pendidikan}
                  // hasErrors={authFailed}
                  messageError="Wrong Username/Password"
                  onChangeText={(e) => setPendidikan(e)}
                  style={styles.inputUserName}
                />
              </View>
              <View style={styles.inputForm}>
                <Text style={styles.text}>Alamat</Text>

                <GeneralTextInput
                  placeholder="Alamat"
                  mode="outlined"
                  value={alamat}
                  // hasErrors={authFailed}
                  messageError="Wrong Username/Password"
                  onChangeText={(e) => setAlamat(e)}
                  style={styles.inputUserName}
                />
              </View>
              <View style={styles.inputForm}>
                <Text style={styles.text}>Referal</Text>

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
              <View style={styles.inputForm}>
                <Text style={styles.text}>Tanggal Lahir</Text>
                <View>
                  <TouchableOpacity onPress={showDatePicker}>
                    <GeneralTextInput
                      placeholder={moment(date).format("YYYY-MM-DD")}
                      mode="outlined"
                      //   value={referal}
                      // hasErrors={authFailed}
                      messageError="Wrong Username/Password"
                      //   onPress={showDatePicker}
                      disabled
                      style={styles.inputUserName}
                    />
                  </TouchableOpacity>
                </View>
                {show && (
                  <DateTimePicker
                    testID="dateTimePicker"
                    value={date}
                    mode="date" // Change to "time" if you want to pick a time
                    is24Hour={true}
                    display="default"
                    onChange={onChangeDate}
                  />
                )}
                {/* <Text>{date}</Text> */}
              </View>
              <View style={styles.inputForm}>
                <Text style={styles.text}>Periode Langganan</Text>

                <DropDownPicker
                  placeholder="Periode Langganan"
                  open={openDropDown2}
                  value={selectedPeriode}
                  items={itemsDropDown2}
                  setItems={setItemDropDown2}
                  setOpen={setOpenDropDown2}
                  setValue={setSelectedPeriode}
                  //   //   dropDownDirection="BOTTOM"
                  //   placeholderStyle={styles.dropDownText}
                  //   dropDownContainerStyle={styles.dropDownContainer}
                  // ArrowUpIconComponent={() => <ICONS.IconChevronUpArrow />}
                  // ArrowDownIconComponent={() => <ICONS.IconChevronDownArrow />}
                  listMode="SCROLLVIEW"
                  //   style={{
                  //     borderWidth: open ? 2 : 1,
                  //     borderColor: open
                  //       ? COLORS.PRIMARY_MEDIUM
                  //       : COLORS.GRAY_MEDIUM,
                  //     height: 60,
                  //   }}
                />
              </View>

              <View style={styles.inputForm}>
                <Text style={styles.text}>Biaya</Text>

                <GeneralTextInput
                  placeholder={biaya}
                  mode="outlined"
                  value={biaya}
                  disabled
                  // hasErrors={authFailed}
                  messageError="Wrong Username/Password"
                  //   onChangeText={(e) => setBiaya(e)}
                  style={styles.inputUserName}
                />
              </View>

              <TouchableOpacity style={styles.button} onPress={handleDaftar}>
                <Text style={styles.textBtn}>Daftar</Text>
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
        </ImageBackground>
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
            <FaIcons
              name="check-circle"
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
            <FaIcons
              name="check-circle"
              style={{ fontSize: 72, color: COLORS.SUCCESS }}
            />
          </View>
          <Text style={styles.modalText}>Error</Text>
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
  welcomeText: {
    color: COLORS.WHITE,
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
    width: widthPercentageToDP(95),
    height: heightPercentageToDP(7),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.PRIMARY_MEDIUM,
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
