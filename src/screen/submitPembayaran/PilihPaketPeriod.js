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
import { Ionicons, FontAwesome } from "@expo/vector-icons";
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
import ImagePickerExample from "../kelolaMenu/components/ImagePicker";
import PhotoTake from "../kelolaMenu/components/PhotoTake";

export default function PilihPaketPeriod({ navigation }) {
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
  const [image, setImage] = useState(null);
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
  //   const [date, setDate] = useState("");
  const userId = useSelector((state) => state?.auth?.userId);
  const [dataBank, setDataBank] = useState([]);
  const [messageError, setMessageError] = useState("");
  const [returnData, setReturnData] = useState([]);
  const [selectedSubsctriptionPeriodsId, setSelectedSubsctriptionPeriodsId] =
    useState(null);

  const hideModalSuccess = () => {
    setModalSuccessVis(false);
    navigation.push("OtpValidation", {
      userId: returnData[0]?.userId,
      subscriptionId: returnData[0]?.subscriptionId,
    });
    // getTaskDetail(route.params.assignmentId);
  };

  const hideModalError = () => {
    setModalErrorVis(false);

    // getTaskDetail(route.params.assignmentId);
  };
  const onChangePeriode = (value) => {
    console.log(value);
  };

  async function postData(id) {
    setIsLoading(true);
    setSelectedSubsctriptionPeriodsId(id);
    const body = {
      userId: userId,
      subssubscriptionId: id,
    };
    try {
      let res = await axios({
        url: `${baseUrl.URL}api/Auth/UpdateSubsId`,
        method: "POST",
        timeout: 8000,
        data: body,
        headers: {
          "Content-Type": "application/json",
          //   Authorization: `Bearer ${token}`,
        },
      });
      console.log(body);
      if (res.data.code == "200") {
        // test for status you want, etc
        // console.log(res.data, "meeeeeeeee");
        setIsLoading(false);
        setModalSuccessVis(true);
        setReturnData(res.data.data);
        // setIsLoadingGet(false);
        // console.log(res.data, "transit");
      } else {
        setModalErrorVis(true);
        setMessageError(res.data.message);
        setIsLoading(false);
      }
      // Don't forget to return something
      return res.data;
    } catch (err) {
      console.error(err);
      setModalErrorVis(true);
      setIsLoading(false);
      //   setIsLoadingGet(false);
    }
  }

  async function getBankList(id) {
    // setIsLoadingGet(true);
    setIsLoading(true);
    try {
      let res = await axios({
        url: `${baseUrl.URL}api/UserSubs/getmasterperiod`,
        method: "get",
        timeout: 8000,
        headers: {
          "Content-Type": "application/json",
          //   Authorization: `Bearer ${token}`,
        },
      });
      console.log(res.data.data, "<==");
      if (res.data.code == "200") {
        // test for status you want, etc
        // console.log(res.data, "meeeeeeeee");
        setDataBank(res.data.data);
        setIsLoading(false);

        // setIsLoadingGet(false);
      }
      // Don't forget to return something
      return res.data;
    } catch (err) {
      console.error(err);
      //   setIsLoadingGet(false);
      setIsLoading(false);
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

  function formatRupiah(number) {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 2,
    }).format(number);
  }

  return (
    <RootContainer>
      <AppBar title="Pilih Paket" />
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* <View style={{ flex: 1, alignItems: "center" }}>
          <Image
            style={{ width: ms(208), height: ms(178) }}
            source={require("../../assets/images/mainLogo.png")}
          />
        </View> */}
        <View style={{ flexDirection: "row" }}>
          <Image
            style={{ width: ms(22), height: ms(22) }}
            source={require("../../assets/images/premiumIcon.png")}
          />
          <Text
            style={{
              color: COLORS.GRAY_HARD,
              fontWeight: "600",
              fontSize: 18,
              marginLeft: ms(4),
            }}
          >
            Paket Premium
          </Text>
        </View>
        {dataBank.map((e, i) => (
          <Card style={styles.mainContainer}>
            <View style={{ flex: 1, flexDirection: "row", marginTop: ms(20) }}>
              <View>
                <Image
                  style={{ width: 100, height: 100 }}
                  source={require("../../assets/images/paymentLogo.png")}
                />
              </View>
              <View style={{ marginLeft: 24 }}>
                <Text style={{ fontSize: 22, fontWeight: "600" }}>
                  {e.labelPeriod}
                </Text>
                <Text>Biaya Langganan</Text>
                <Text style={{ color: COLORS.PRIMARY_DARK }}>
                  {formatRupiah(e.prices)}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.buttonPilih}
              onPress={() => postData(e.subsctriptionPeriodsId)}
            >
              <Text style={{ color: "white" }}>Pilih</Text>
            </TouchableOpacity>
            {/* <TouchableOpacity
              style={styles.buttonPilih}
              onPress={() => console.log(userId)}
            >
              <Text style={{ color: "white" }}>Pilih</Text>
            </TouchableOpacity> */}
          </Card>
        ))}

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
          <Text style={styles.modalText}>Paket Berhasil di Tambahkan</Text>
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
    // backgroundColor: "#FFFFFF",

    paddingTop: ms(2),
    paddingHorizontal: moderateScale(20),
    paddingVertical: ms(20),
    marginTop: ms(20),
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
    backgroundColor: COLORS.PRIMARY_DARK,
    alignSelf: "center",
    color: "white",
    marginBottom: moderateScale(5),
    marginTop: moderateScale(18),
  },
  buttonPilih: {
    borderRadius: moderateScale(5),
    width: widthPercentageToDP(75),
    height: heightPercentageToDP(7),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.PRIMARY_DARK,
    alignSelf: "center",
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
