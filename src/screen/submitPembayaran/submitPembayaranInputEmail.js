import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  StyleSheet,
  FlatList,
  Image,
  ImageBackground,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import React, { useState, useCallback, useEffect } from "react";
import RootContainer from "../../component/RootContainer/index";
import { useNavigation } from "@react-navigation/core";
import ColorBgContainer from "../../component/ColorBgContainer/index.js";
import { COLORS, FONTS } from "../../assets/theme/index.js";
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

import { resetReducer } from "../../store/models/auth/actions.js";
import { useDispatch, useSelector } from "react-redux";
import API from "../../utils/apiService.js";
import axios from "axios";
import { baseUrl } from "../../utils/apiURL.js";
import DateTimePicker from "@react-native-community/datetimepicker";
import FaIcons from "react-native-vector-icons/FontAwesome5";
import moment from "moment";
import ImagePickerExample from "./components/ImagePicker.jsx";
import PhotoTake from "./components/PhotoTake.js";
import { WebView } from "react-native-webview";
import { Ionicons, FontAwesome } from "@expo/vector-icons";

export default function SubmitPembayaranInputEmail({ route, navigation }) {
  const [isLoading, setIsLoading] = useState(false);
  const [openDropDown, setOpenDropDown] = useState(false);
  const [modalSuccesVis, setModalSuccessVis] = useState(false);
  const [modalSuccesVis2, setModalSuccessVis2] = useState(false);
  const [modalErroVis, setModalErrorVis] = useState(false);
  const [dataPayment, setDataPayment] = useState([]);
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
  const [image, setImage] = useState(null);
  const [imageToShow, setImageToShow] = useState(null);
  const [imageType, setImageType] = useState(null);

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
  const [errorMsg, setErrorMsg] = useState("");
  //   const [date, setDate] = useState("");
  const [valueEmail, setValueEmail] = useState(null);
  const userId = useSelector((state) => state.auth.userId);
  const [dataBank, setDataBank] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [modalPaymentVis, setModalPaymentVis] = useState(false);

  const showModalPayment = () => {
    setModalPaymentVis(true);
    console.log(dataPayment?.midtrans?.redirect_url);
  };
  const hideModalPayment = () => {
    setModalPaymentVis(false);
  };

  const hideModalSuccess = () => {
    setModalSuccessVis(false);
    // navigation.navigate("Login");
    // getTaskDetail(route.params.assignmentId);
  };

  const hideModalSuccess2 = () => {
    setModalSuccessVis(false);
    navigation.navigate("Login");
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
      console.error(err, "error message");
      //   setIsLoadingGet(false);
    }
  }

  async function getBankList(id) {
    // setIsLoadingGet(true);
    try {
      let res = await axios({
        url: `${baseUrl.URL}api/bankaccount/true`,
        method: "get",
        timeout: 8000,
        headers: {
          "Content-Type": "application/json",
          //   Authorization: `Bearer ${token}`,
        },
      });
      console.log(res.data);
      if (res.status == 200) {
        // test for status you want, etc
        // console.log(res.data, "meeeeeeeee");
        setDataBank(res.data);

        // setIsLoadingGet(false);
      }
      // Don't forget to return something
      return res.data;
    } catch (err) {
      console.error(err);
      //   setIsLoadingGet(false);
    }
  }

  async function getDataPayment(email) {
    // setIsLoadingGet(true);
    try {
      let res = await axios({
        url: `${baseUrl.URL}api/Auth/GetPendingPaymentByEmail/getpendingpaymentbyemail/${email}`,
        method: "get",
        timeout: 8000,
        headers: {
          "Content-Type": "application/json",
          //   Authorization: `Bearer ${token}`,
        },
      });
      console.log(res.data, "<== res");
      if (res.data.code == "200") {
        // test for status you want, etc
        // console.log(res.data, "meeeeeeeee");
        // setDataPayment(res.data.data[[res.data.data.length - 1]]);
        // setEmail(res.data.data[[res.data.data.length - 1]?.email]);
        setModalSuccessVis(true);
        setSuccessMessage(res?.data?.message);
        // setIsLoadingGet(false);
        setDataPayment(res.data.data);
      } else {
        setModalErrorVis(true);
        setErrorMessage(res.data.message);
        setDataPayment([]);
      }
      // Don't forget to return something
      return res.data;
    } catch (err) {
      console.error(err);
      setModalErrorVis(true);
      setErrorMessage(err.message);
      setDataPayment([]);
      //   setIsLoadingGet(false);
    }
  }

  const handlePress = async () => {
    setIsLoading(true);

    const body = {
      masterBankAccounts: null,
      evidenceFile: image,
      email: dataPayment?.pendingList[0]?.email,
      subscriptionPeriodId: dataPayment?.pendingList[0]?.subsctriptionPeriodsId,
      transferBy: dataPayment?.pendingList[0]?.email,
      selectedBankId: valueBankId,
    };

    console.log(body);
    const config = {
      headers: {
        "Content-Type": "application/json",
        // Authorization: `Bearer ${token}`,
      },
    };
    const timeOut = {
      timeout: 200000,
    };

    axios
      .post(`${baseUrl.URL}api/Auth/SubmitPaymentMobile`, body, config, timeOut)
      .then((response) => {
        console.log(response.data);
        setIsLoading(false);
        setModalSuccessVis2(true);
        setSuccessMessage(response.data.message);
      })
      .catch((error) => {
        console.error("Error uploading the file", error);
        setIsLoading(false);
        setModalErrorVis(true);
        setErrorMessage(error.message);
      });
  };

  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);

  function formatRupiah(number) {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 2,
    }).format(number);
  }

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
    getBankList();
  }, []);

  const [value, setValue] = React.useState("first");
  const [valueBankId, setValueBankId] = React.useState("");
  const [valueRek, setValueRek] = React.useState("");
  const [valuePemilik, setValuePemilik] = React.useState("");

  const onChangeRadio = (val) => {
    console.log(val);
    setValue(val);
    setValueBankId(val.bankAccountId);
    setValueRek(val.accountNo);
    setValuePemilik(val.accountName);
  };

  const ImageBank = (val) => {
    console.log(val, "bankNae");
    if (val != "Mandiri") {
      return require("../../assets/images/logoMandiri.png");
    } else {
      return require("../../assets/images/logoBca.png");
    }
  };

  // useEffect(() => {
  //   getDataPayment();
  // }, []);

  const navigateMidtrans = (url) => {
    console.log(url, "url");
    navigation.navigate("OnlinePayment", {
      url: url,
    });
  };

  return (
    <>
      <RootContainer>
        {/* <AppBar title="Submit Pembayaran" /> */}
        <ScrollView contentContainerStyle={styles.scroll}>
          <View style={{ flex: 1, alignItems: "center" }}>
            <Image
              style={{ width: ms(208), height: ms(182) }}
              source={require("../../assets/images/mainLogo.png")}
            />
          </View>
          <Card style={styles.mainContainer}>
            <View>
              <View style={styles.inputForm}>
                {/* <Text style={styles.text}>Email</Text> */}

                <GeneralTextInput
                  placeholder={dataPayment?.email}
                  mode="outlined"
                  // value={email}
                  title="Email"
                  // hasErrors={authFailed}
                  messageError="Wrong Username/Password"
                  onChangeText={(e) => setValueEmail(e)}
                />
              </View>
              <View>
                <TouchableOpacity
                  style={styles.button2}
                  onPress={() => getDataPayment(valueEmail)}
                >
                  <Text style={{ color: "white" }}>Cari User</Text>
                </TouchableOpacity>
              </View>
              {dataPayment.length == 0 ? (
                <></>
              ) : (
                <>
                  <View style={styles.inputForm}>
                    <TouchableOpacity
                      style={{
                        borderRadius: 20,
                        backgroundColor: "#E870A3",
                        paddingHorizontal: ms(18),
                        paddingVertical: ms(12),
                        borderColor: "#E870A3",
                      }}
                      onPress={() => showModalPayment()}
                    >
                      <Text style={{ color: "white" }}>
                        Pembayaran Menggunakan Virtual Account atau Dompet
                        Digital
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginTop: 10,
                      marginTop: 20,
                      marginBottom: 20,
                    }}
                  >
                    <View
                      style={{
                        flex: 1,
                        height: 1,
                        backgroundColor: "lightgray",
                      }}
                    />
                    <View style={styles.txtRegister}>
                      <TouchableOpacity
                        onPress={() => navigation.navigate("Register")}
                      >
                        <Text
                          style={[
                            styles.textWhite,
                            { color: COLORS.PRIMARY_DARK },
                          ]}
                        >
                          Atau
                        </Text>
                      </TouchableOpacity>
                    </View>

                    <View
                      style={{
                        flex: 1,
                        height: 1,
                        backgroundColor: "lightgray",
                      }}
                    />
                  </View>
                </>
              )}

              <View style={styles.inputForm}>
                <Text style={styles.text}>Pilih Bank</Text>

                <View
                  style={{
                    flex: 1,
                    justifyContent: "space-between",
                    flexDirection: "row",
                  }}
                >
                  <RadioButton.Group
                    onValueChange={(newValue) => onChangeRadio(newValue)}
                    value={value}
                    style={{
                      width: 200,
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    {dataBank.map((e, i) => (
                      <View
                        style={{
                          flex: 1,
                          flexDirection: "row",
                          alignItems: "center",

                          border: "1px solid gray",
                        }}
                      >
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            marginBottom: ms(8),

                            justifyContent: "space-between",

                            border: "1px solid gray",
                            width: ms(292),
                            borderWidth: 1,
                            borderColor: "gray",
                            borderRadius: 5,
                            padding: 10,
                          }}
                        >
                          <View
                            style={{
                              flex: 1,
                              flexDirection: "row",
                              alignItems: "center",
                            }}
                          >
                            <RadioButton value={e} />
                            <Text style={{ color: "gray" }}>{e.bankName}</Text>
                          </View>
                          <View>
                            <Image
                              style={{ width: ms(76), height: ms(22) }}
                              source={ImageBank(e.bankName)}
                            />
                          </View>
                        </View>
                      </View>
                    ))}
                  </RadioButton.Group>
                </View>
                <View style={styles.inputForm}>
                  {/* <Text style={styles.text}>No Rekening</Text> */}

                  <GeneralTextInput
                    placeholder={valueRek}
                    mode="outlined"
                    //   value={email}
                    disabled
                    title="No Rekening"
                    // hasErrors={authFailed}
                    messageError="Wrong Username/Password"
                    onChangeText={(e) => setEmail(e)}
                    style={styles.inputUserName}
                  />
                </View>
                <View style={styles.inputForm}>
                  {/* <Text style={styles.text}>Nama Pemilik Rekening</Text> */}

                  <GeneralTextInput
                    placeholder={valuePemilik}
                    mode="outlined"
                    disabled
                    title="Nama Pemilik Rekening"
                    //   value={email}
                    // hasErrors={authFailed}
                    messageError="Wrong Username/Password"
                    onChangeText={(e) => setEmail(e)}
                    style={styles.inputUserName}
                  />
                </View>
                <View style={{ marginTop: ms(24) }}>
                  <Text style={styles.text}>Upload Bukti Transfer</Text>
                  <ImagePickerExample
                    image={image}
                    setImage={setImage}
                    setImageToShow={setImageToShow}
                    imageToShow={imageToShow}
                  />
                </View>
                <View style={styles.inputForm}>
                  <PhotoTake
                    image={image}
                    setImage={setImage}
                    setImageToShow={setImageToShow}
                    imageToShow={imageToShow}
                  />
                </View>
                <View>
                  {imageToShow && (
                    <Image
                      source={{ uri: imageToShow }}
                      style={{ width: 200, height: 200 }}
                    />
                  )}
                </View>
                {/* <View style={styles.inputForm}>
      <Button onPress={() => console.log(dataPayment.email)}>
        Console
      </Button>
    </View> */}
              </View>

              {/* <TouchableOpacity
        style={styles.button}
        onPress={() => console.log(token.user?.UserId)}
      >
        <Text style={styles.textBtn}>Sign In</Text>
      </TouchableOpacity> */}
            </View>
          </Card>

          {dataPayment?.length === 0 || dataPayment == "" ? (
            <></>
          ) : (
            <Card style={styles.mainContainer2}>
              <View style={styles.inputForm}>
                <Text style={styles.text}>Menunggu Pembayaran</Text>
              </View>
              <Divider />
              <View>
                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Text>Langganan : </Text>
                  <Text style={{ marginLeft: ms(24) }}>
                    {dataPayment?.pendingList[0]?.packageName}
                  </Text>
                </View>
                <Divider />
                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Text>Harga : </Text>
                  <Text style={{ marginLeft: ms(24) }}>
                    {formatRupiah(dataPayment.pendingList[0]?.amount)}
                  </Text>
                </View>
                <Divider />
                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Text>PPN : </Text>
                  <Text style={{ marginLeft: ms(24) }}>
                    {formatRupiah(dataPayment?.pendingList[0]?.taxAmount)}
                  </Text>
                </View>
                <Divider />
                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Text>Total : </Text>
                  <Text
                    style={{
                      marginLeft: ms(24),
                      color: COLORS.PRIMARY_DARK,
                      fontWeight: "600",
                    }}
                  >
                    {formatRupiah(dataPayment?.pendingList[0]?.totalAmount)}
                  </Text>
                </View>
              </View>
              <TouchableOpacity style={styles.button} onPress={handlePress}>
                <Text style={{ color: "white" }}>Daftar</Text>
              </TouchableOpacity>
            </Card>
          )}

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
            <Text style={styles.modalText}>{successMessage}</Text>
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

            <Text style={styles.modalText}>{errorMessage}</Text>
            <GeneralButton
              style={{ backgroundColor: COLORS.PRIMARY_DARK }}
              mode="contained"
              onPress={hideModalError}
            >
              Close
            </GeneralButton>
          </View>
          {/* </View> */}
        </Modal>
      </RootContainer>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalPaymentVis}
        onRequestClose={hideModalPayment}
      >
        {/* <View style={styles.centeredView}> */}
        <View style={styles.containermodalViewPayment}>
          <WebView source={{ uri: dataPayment?.midtrans?.redirect_url }} />
          <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
            <GeneralButton
              style={{
                backgroundColor: COLORS.PRIMARY_DARK,
                marginRight: ms(8),
              }}
              mode="contained"
              onPress={hideModalPayment}
            >
              Batal
            </GeneralButton>
            <GeneralButton
              style={{ backgroundColor: COLORS.PRIMARY_DARK }}
              mode="contained"
              onPress={hideModalPayment}
            >
              Selesai
            </GeneralButton>
          </View>
        </View>

        {/* </View> */}
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  scroll: {
    // flex: 1,
    backgroundColor: "white",
    // flexGrow: 1,

    paddingHorizontal: moderateScale(24),
  },
  mainContainer: {
    backgroundColor: COLORS.WHITE,
    paddingTop: ms(2),
    paddingHorizontal: moderateScale(10),
    paddingVertical: ms(10),
    marginTop: ms(20),
  },
  mainContainer2: {
    backgroundColor: "#FFFFFF",
    paddingTop: ms(2),
    paddingHorizontal: moderateScale(10),
    paddingVertical: ms(10),
    marginTop: ms(20),
    marginBottom: ms(32),
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
    borderRadius: moderateScale(5),
    width: widthPercentageToDP(65),
    height: heightPercentageToDP(7),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.PRIMARY_DARK,
    alignSelf: "center",
    color: "white",
    marginBottom: moderateScale(5),
    marginTop: moderateScale(18),
  },
  button2: {
    borderRadius: moderateScale(10),
    paddingHorizontal: ms(16),
    paddingVertical: ms(12),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.PRIMARY_DARK,
    alignSelf: "flex-end",
    color: "white",
    marginBottom: moderateScale(5),
    marginTop: moderateScale(18),
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
  containermodalViewPayment: {
    flexDirection: "column",
    alignSelf: "center",
    height: constants.SCREEN_HEIGHT * 0.9,
    // position: "absolute",
    width: constants.SCREEN_WIDTH * 1,
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
