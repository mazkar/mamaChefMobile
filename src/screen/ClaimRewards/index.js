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
  DataTable,
  TextInput,
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
  GeneralTextInput2,
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

export default function ClaimRewards({ navigation, route }) {
  const [isLoading, setIsLoading] = useState(false);
  const [openDropDown, setOpenDropDown] = useState(false);
  const [modalSuccesVis, setModalSuccessVis] = useState(false);
  const [modalErroVis, setModalErrorVis] = useState(false);
  const [isModalClaimVisible, setIsModalClaimVisible] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [dataMember, setDataMember] = useState([]);
  const [valueuang, setValueUang] = useState(0);
  const [dataUser, setDataUser] = useState([]);
  //   const [date, setDate] = useState("");
  const userId = useSelector((state) => state?.auth);
  const uid = useSelector((state) => state?.auth?.user?.UserId);
  const token = useSelector((state) => state.auth.token);
  const [dataBank, setDataBank] = useState([]);
  const [messageError, setMessageError] = useState("");
  const [returnData, setReturnData] = useState([]);
  const [dataSummaryClaim, setDataSummaryClaim] = useState([]);
  const [selectedSubsctriptionPeriodsId, setSelectedSubsctriptionPeriodsId] =
    useState(null);

  const hideModalSuccess = () => {
    setModalSuccessVis(false);

    // getTaskDetail(route.params.assignmentId);
  };

  const hideModalError = () => {
    setModalErrorVis(false);

    // getTaskDetail(route.params.assignmentId);
  };

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

  const showModalClaim = (data) => {
    setIsModalClaimVisible(true);
    console.log(data);
    // setSelectedData(data);
  };

  const hideModalClaim = () => {
    setIsModalClaimVisible(false);
  };

  const handleClaim = async () => {
    const body = {
      userId: uid,
      claimedAmount: valueuang,
      claimDate: moment().format("YYYY-MM-DD"),
      bankTransfer: dataBank?.bankName,
      accountNumber: dataBank?.accountNo,
      accountName: dataBank?.accountNo,
      status: "Submitted",
    };
    try {
      let res = await axios({
        url: `${baseUrl.URL}api/ClaimBonus/insertclaimbonus`,
        method: "post",
        timeout: 8000,
        method: "POST",
        timeout: 20000,
        data: body,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.status === 200) {
        // test for status you want, etc
        console.log(res, "dataRewards");
        setMessageError(res.data.message);
        setModalSuccessVis(true);
        setIsModalClaimVisible(false);
        getSummaryClaim(1);
        getDataUser(uid);
      }
      // Don't forget to return something
      return res.data;
    } catch (err) {
      console.error(err);
      setModalErrorVis(true);
      setMessageError(err.message);
    }
  };

  async function getDataUser(userId) {
    try {
      let res = await axios({
        url: `${baseUrl.URL}api/Auth/GetSummaryUser/getsummaryuser/${userId}`,
        method: "get",
        timeout: 8000,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.status == 200) {
        // test for status you want, etc
        console.log(res.data, "data user get");
        setDataUser(res.data.data);

        // console.log(res.data, "transit");
      }
      // Don't forget to return something
      return res.data;
    } catch (err) {
      console.error(err);
    }
  }

  async function getDataBank(userId) {
    try {
      let res = await axios({
        url: `${baseUrl.URL}api/BankAccountUser/GetBankAccountUser/${userId}`,
        method: "get",
        timeout: 8000,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.status == 200) {
        // test for status you want, etc
        console.log(res.data, "data bank");
        setDataBank(res.data.data);

        // console.log(res.data, "transit");
      }
      // Don't forget to return something
      return res.data;
    } catch (err) {
      console.error(err);
    }
  }

  const getSummaryClaim = async (currentPage) => {
    const body = {
      pageSize: 10,
      currentPage: currentPage,
      isPhoto: false,
      isVideo: false,
      status: true,
      userId: parseInt(uid, 10),
      keyword: "string",
    };
    try {
      let res = await axios({
        url: `${baseUrl.URL}api/ClaimBonus/getclaimedbonus`,
        method: "post",
        timeout: 8000,
        method: "POST",
        timeout: 20000,
        data: body,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.status == 200) {
        // test for status you want, etc
        console.log(res.data, "dataRewards");
        setDataSummaryClaim(res.data.data);

        // console.log(res.data, "transit");
      }
      // Don't forget to return something
      return res.data;
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getDataUser(uid);
    getSummaryClaim(1);
    getDataBank(uid);
  }, []);

  const dispatch = useDispatch();

  const handleLogut = () => {
    dispatch(resetReducer());
    navigation.reset({
      index: 0,
      routes: [{ name: "Login" }],
    });
  };

  return (
    <RootContainer>
      <AppBar
        title="Reward"
        navigation={navigation}
        handleLogut={handleLogut}
      />
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* <Button onPress={() => console.log(route.param)}>test</Button> */}

        <Card style={styles.mainContainer}>
          <View style={{ flex: 1, flexDirection: "row", marginTop: ms(20) }}>
            <View>
              <Image
                style={{ width: 100, height: 100 }}
                source={require("../../assets/images/rewards.png")}
              />
            </View>
            <View style={{ marginLeft: 24 }}>
              <Text style={{ fontSize: 20, color: "gray", fontWeight: "600" }}>
                Reward Kamu
              </Text>

              <Text style={{ color: COLORS.PRIMARY_DARK }}>
                {formatRupiah(dataUser?.totalBonusReferal?.referalOwnerBonus)}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.buttonPilih}
            onPress={() => showModalClaim()}
          >
            <Text style={{ color: "white" }}>Claim Reward</Text>
          </TouchableOpacity>
          {/* <TouchableOpacity
                style={styles.buttonPilih}
                onPress={() => console.log(userId)}
              >
                <Text style={{ color: "white" }}>Pilih</Text>
              </TouchableOpacity> */}
        </Card>

        <View style={{ marginTop: ms(24), marginBottom: ms(24) }}>
          <Text style={{ fontSize: 18, color: "gray", fontWeight: "600" }}>
            History
          </Text>
        </View>

        <Card style={styles.card}>
          <DataTable>
            <DataTable.Header>
              {/* <DataTable.Title>
                    <View>
                      <Checkbox.Android
                        status={selectAll2 ? "checked" : "unchecked"}
                        onPress={() => handleSelectAll2()}
                      />
                    </View>
                  </DataTable.Title> */}
              <DataTable.Title>Tgl Pengajuan</DataTable.Title>
              <DataTable.Title>Jumlah claim</DataTable.Title>
              <DataTable.Title>Status</DataTable.Title>
            </DataTable.Header>

            {dataSummaryClaim?.map((item) => (
              <DataTable.Row key={item.ingredientsId}>
                {/* <DataTable.Cell>
                      <View>
                        <Checkbox.Android
                          status={
                            selectedItems2.some(
                              (selectedItem) =>
                                selectedItem.ingredientsId ===
                                item.ingredientsId
                            )
                              ? "checked"
                              : "unchecked"
                          }
                          onPress={() => handleCheckboxChange2(item)}
                        />
                      </View>
                    </DataTable.Cell> */}
                <DataTable.Cell>
                  <Text style={styles.textBahan}>
                    {moment(item?.claimDate).format("YYYY-MM-DD")}
                  </Text>
                </DataTable.Cell>
                <DataTable.Cell>
                  <Text style={styles.textBahan}>
                    {formatRupiah(item?.claimedAmmount)}
                  </Text>
                </DataTable.Cell>
                <DataTable.Cell>
                  <Text
                    style={
                      item.status === "Approved"
                        ? {
                            color: "green",
                            fontSize: ms(10),
                            fontWeight: "600",
                          }
                        : { color: "blue", fontSize: ms(10), fontWeight: "600" }
                    }
                  >
                    {item.status}
                  </Text>
                </DataTable.Cell>
              </DataTable.Row>
            ))}
          </DataTable>
        </Card>

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
          <Text style={styles.modalText}>{messageError}</Text>
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
          <Text style={styles.modalText}>{messageError}</Text>
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
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalClaimVisible}
        onRequestClose={hideModalClaim}
      >
        {/* <View style={styles.centeredView}> */}
        <View style={styles.containermodalView}>
          <View style={{ marginVertical: ms(12) }}>
            <TextInput
              placeholder={dataMember?.accountName}
              mode="outlined"
              value={dataBank?.accountName}
              // hasErrors={authFailed}
              label="Nama Akun"
              disabled
              multiline
              numberOfLines={1}
              messageError="Wrong Username/Password"
              style={styles.inputUserName}
            />
          </View>
          <View style={{ marginVertical: ms(12) }}>
            <TextInput
              placeholder={dataBank?.bankName}
              mode="outlined"
              value={dataBank?.bankName}
              // hasErrors={authFailed}
              label="Bank"
              disabled
              multiline
              numberOfLines={1}
              messageError="Wrong Username/Password"
              style={styles.inputUserName}
            />
          </View>
          <View style={{ marginVertical: ms(12) }}>
            <TextInput
              placeholder={dataBank?.accountNo}
              mode="outlined"
              value={dataBank?.accountNo}
              // hasErrors={authFailed}
              label="No Rekening"
              disabled
              multiline
              numberOfLines={1}
              messageError="Wrong Username/Password"
              style={styles.inputUserName}
            />
          </View>
          <View style={{ marginVertical: ms(12) }}>
            <TextInput
              placeholder="Minimal RP.20.000"
              mode="outlined"
              value={0}
              // hasErrors={authFailed}
              keyboardType="numeric"
              label="Jumlah reward"
              onChangeText={(e) => setValueUang(e)}
              multiline
              numberOfLines={1}
              messageError="Wrong Username/Password"
              style={styles.inputUserName}
            />
          </View>

          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-end",
            }}
          >
            <GeneralButton
              style={{ backgroundColor: COLORS.PRIMARY_MEDIUM, marginRight: 4 }}
              mode="contained"
              onPress={hideModalClaim}
            >
              Batal
            </GeneralButton>
            <GeneralButton
              style={{ backgroundColor: COLORS.PRIMARY_DARK }}
              mode="contained"
              onPress={() => handleClaim()}
            >
              Ajukan
            </GeneralButton>
          </View>
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
  textBahan: {
    color: "gray",
    fontSize: ms(10),
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
  card: {
    marginBottom: 16,
    backgroundColor: COLORS.WHITE,
  },
});
