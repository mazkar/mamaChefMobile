import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from "react";
import {
  AppBar,
  ColorBgContainer,
  GeneralButton,
  GeneralTextInput,
  GeneralTextInput2,
  PopUpLoader,
  RootContainer,
} from "../../component";
import { useDispatch, useSelector } from "react-redux";
import {
  resetReducer,
  setToken,
  setUser,
} from "../../store/models/auth/actions";
import { COLORS, FONTS } from "../../assets/theme";
import { ms, moderateScale } from "react-native-size-matters";
import { ScrollView } from "react-native-gesture-handler";
import {
  Button,
  Menu,
  Divider,
  Avatar,
  Card,
  Modal,
  RadioButton,
} from "react-native-paper";
import { baseUrl } from "../../utils/apiURL";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import {
  widthPercentageToDP,
  heightPercentageToDP,
} from "react-native-responsive-screen";
import constants from "../../assets/constants/index.js";
import axios from "axios";
import { useFocusEffect } from "@react-navigation/native";
import moment from "moment";
import DropDownPicker from "react-native-dropdown-picker";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function EditBank({ navigation }) {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const [modalSuccesVis2, setModalSuccessVis2] = useState(false);
  const [modalErroVis, setModalErrorVis] = useState(false);
  const [username, setUsername] = useState("Azka");
  const [edit, setIsEdit] = useState(false);
  const uid = useSelector((state) => state?.auth?.user?.UserId);
  const [valueName, setValueName] = useState("");
  const [dataBank, setDataBank] = useState([]);
  const [valueNameLast, setValueNameLast] = useState("");
  const [valuePendidikan, setValuePendidikan] = useState("");
  const [valueKelamin, setValueKelamin] = useState("");
  const [valueTtl, setValueTtl] = useState("");
  const [isLoadingGet, setIsLoadingGet] = useState(false);
  const [successMessage, setSuccessMessage] = useState("Success");
  const [errorMessage, setErrorMessage] = useState("error");
  const [dataMember, setDataMember] = useState([]);
  const [openDropDown, setOpenDropDown] = useState(false);
  const [checked, setChecked] = useState("first");
  const [openDropDownMenu, setOpenDropDownMenu] = useState(false);
  const [value, setValue] = React.useState("first");
  const [valueBankId, setValueBankId] = React.useState("");
  const [valueRek, setValueRek] = React.useState("");
  const [valueAkun, setValueAkun] = React.useState("");
  const [valuePemilik, setValuePemilik] = React.useState("");
  const [ddlMenu, setDdlMenu] = useState([
    {
      id: 1,
      kelamin: "Pria",
    },
    { id: 2, kelamin: "Wanita" },
  ]);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const ImageBank = (val) => {
    console.log(val, "bankNae");
    if (val != "Mandiri") {
      return require("../../assets/images/logoMandiri.png");
    } else {
      return require("../../assets/images/logoBca.png");
    }
  };

  const onChangeRadio = (val) => {
    console.log(val);
    setValue(val);
    setValueBankId(val.bankAccountId);
    // setValueRek(val.accountNo);
    setValuePemilik(val.accountName);
  };

  async function getBankList(id) {
    setIsLoadingGet(true);
    try {
      let res = await axios({
        url: `${baseUrl.URL}api/MasterBank/getmasterbank`,
        method: "get",
        timeout: 8000,
        headers: {
          "Content-Type": "application/json",
          //   Authorization: `Bearer ${token}`,
        },
      });
      console.log(res, "data bank");
      if (res.status == 200) {
        // test for status you want, etc
        // console.log(res.data, "meeeeeeeee");
        setDataBank(res.data.data);

        setIsLoadingGet(false);
      }
      // Don't forget to return something
      return res.data;
    } catch (err) {
      console.error(err);
      setIsLoadingGet(false);
    }
  }

  const onChange = (event, selectedDate) => {
    // const currentDate = selectedDate || date;
    // setShowDatePicker(Platform.OS === "ios");
    // setDate(currentDate);
    // console.log(selectedDate, "selectedDate");

    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === "ios");
    setDate(currentDate);

    // Convert the selected date to a string in a specific format
    const formattedDate = currentDate.toLocaleDateString("en-US"); // Adjust the locale as needed

    // Now, you can use the formattedDate as a string
    console.log("Selected Date:", formattedDate);

    // You can handle the selected date as needed
  };

  const showDatepicker = () => {
    setShowDatePicker(true);
  };

  const user = useSelector((state) => state?.auth?.user);

  async function getMember(userId) {
    setIsLoadingGet(true);
    try {
      let res = await axios({
        url: `${baseUrl.URL}api/BankAccountUser/GetBankAccountUser/${uid}`,
        method: "get",
        timeout: 8000,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.data.code == "200") {
        // test for status you want, etc
        console.log(res.data.data, "<===res");
        setDataMember(res.data.data);
        setIsLoadingGet(false);
        setValueName(res.data.data.accountNo);
        setValuePemilik(res.data.data.bankName);
        setValue(res.data.data.accountName);
        // setValueTtl(moment(res.data.data.dateofBirth).format("YYYY-MM-DD"))
        setDate(new Date(res.data.data.dateofBirth));
        // console.log(res.data, "transit");
      }
      // Don't forget to return something
      return res.data;
    } catch (err) {
      console.error(err);
      setIsLoadingGet(false);
    }
  }

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
    // const body = {
    //   userId: parseInt(user.UserId),

    //   bankId: valueBankId,
    //   rekening: valueRek,
    //   akun: valueAkun,
    // };
    const body = {
      userId: parseInt(user.UserId),
      bankName: valueBankId,
      rekeningNo: valueRek,
      akun: valueAkun,
    };
    console.log(body);

    setIsLoadingGet(true);
    try {
      console.log(body);
      let res = await axios({
        url: `${baseUrl.URL}api/BankAccountUser/updateBankAccount`,
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
        setSuccessMessage("Update Berhasil");
        // getMember(uid);
        // dispatch(setUser(res.data.data));
        // dispatch(setUserId(res.data.data[0]?.userId));

        setModalSuccessVis2(true);
        // setIsEdit(false);
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

  useEffect(() => {
    getMember(uid);
    getBankList();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      // Do something when the screen is focused
      console.log("Screen is focused");
      getMember(uid);
      // Add your logic here to update the component or fetch new data

      // Example: Refresh data or update components
    }, [])
  );

  return (
    <ColorBgContainer style={{ paddingHorizontal: 24, paddingVertical: 72 }}>
      <RootContainer isTransparent>
        <AppBar title="Ubah Bank Akun" />
        <ScrollView style={styles.mainContainer}>
          {/* <Button onPress={() => console.log(user)}>test</Button> */}
          {/* <View>
            <View style={{ flexDirection: "row", marginBottom: ms(8) }}>
              <Text
                style={{
                  marginLeft: ms(4),
                  color: COLORS.GRAY_HARD,
                  fontWeight: "600",
                }}
              >
                BANK
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
                        {dataBank?.map((e, i) => (
                          <View
                            style={{
                              flex: 1,
                              flexDirection: "row",
                              alignItems: "center",

                              border: "1px solid black",
                            }}
                          >
                            <View
                              style={{
                                flexDirection: "row",
                                alignItems: "center",
                                marginBottom: ms(8),

                                justifyContent: "space-between",

                                border: "1px solid black",
                                width: ms(292),
                                borderWidth: 1,
                                borderColor: "black",
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
                                <Text style={{ color: COLORS.PRIMARY_DARK }}>
                                  {e.bankName}
                                </Text>
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
                  </View>
                ) : (
                  <View style={{ flexDirection: "row" }}>
                    <Avatar.Text size={32} label="A" color={COLORS.WHITE} />
                    <View style={{ alignSelf: "center", marginLeft: ms(6) }}>
                      <Text>{dataMember?.firstName}</Text>
                    </View>
                    <View style={{ alignSelf: "center" }}>
                      <Image
                        source={require("../../assets/images/checked.png")}
                      />
                    </View>
                  </View>
                )}
              </View>
            </Card>
          </View> */}
          <View style={{ marginTop: ms(12) }}>
            <View style={{ flexDirection: "row", marginBottom: ms(8) }}>
              {/* <Image source={require("../../assets/images/IconProfile.png")} /> */}
              <Text
                style={{
                  marginLeft: ms(4),
                  color: COLORS.GRAY_HARD,
                  fontWeight: "600",
                }}
              >
                AKUN
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
                  <GeneralTextInput2
                    placeholder={dataMember?.accountNo}
                    mode="outlined"
                    value={valueRek}
                    // hasErrors={authFailed}
                    messageError="Wrong Username/Password"
                    onChangeText={(e) => setValueRek(e)}
                    style={{ width: "100%" }}
                  />
                ) : (
                  <View style={{ flexDirection: "row" }}>
                    <Avatar.Text size={32} label="A" color={COLORS.WHITE} />
                    <View style={{ alignSelf: "center", marginLeft: ms(6) }}>
                      <Text>{dataMember?.accountNo}</Text>
                    </View>
                    <View style={{ alignSelf: "center" }}>
                      <Image
                        source={require("../../assets/images/checked.png")}
                      />
                    </View>
                  </View>
                )}

                {/* <View style={{ alignSelf: "center" }}>
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
                </View> */}

                {/* <View style={{ marginLeft: ms(12) }}>
                <Text style={{ fontWeight: "600" }}>{user?.fullname}</Text>
                <Text style={{ fontWeight: "300" }}>Mover</Text>
              </View> */}
              </View>
            </Card>
          </View>
          <View style={{ marginTop: ms(12), position: "relative" }}>
            <View style={{ flexDirection: "row", marginBottom: ms(8) }}>
              {/* <Image source={require("../../assets/images/IconProfile.png")} /> */}
              <Text
                style={{
                  marginLeft: ms(4),
                  color: COLORS.GRAY_HARD,
                  fontWeight: "600",
                }}
              >
                REKENING
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
                  // <DropDownPicker
                  //   placeholder={valueKelamin}
                  //   open={openDropDownMenu}
                  //   value={valueKelamin}
                  //   zIndex={1000}
                  //   style={{
                  //     // Your other styles here...
                  //     zIndex: 1000,
                  //   }}
                  //   items={ddlMenu.map((e) => {
                  //     return {
                  //       label: e.kelamin,
                  //       value: e.kelamin,
                  //     };
                  //   })}
                  //   // style={{ zIndex: 2 }}
                  //   setItems={setDdlMenu}
                  //   setOpen={setOpenDropDownMenu}
                  //   setValue={setValueKelamin}
                  //   //   //   dropDownDirection="BOTTOM"
                  //   //   placeholderStyle={styles.dropDownText}
                  //   //   dropDownContainerStyle={styles.dropDownContainer}
                  //   // ArrowUpIconComponent={() => <ICONS.IconChevronUpArrow />}
                  //   // ArrowDownIconComponent={() => <ICONS.IconChevronDownArrow />}
                  //   listMode="SCROLLVIEW"
                  //   itemKey="id"
                  //   label="name"

                  // />
                  <GeneralTextInput2
                    placeholder={dataMember?.accountName}
                    mode="outlined"
                    value={valueAkun}
                    // hasErrors={authFailed}
                    messageError="Wrong Username/Password"
                    onChangeText={(e) => setValueAkun(e)}
                    style={{ width: "100%" }}
                  />
                ) : (
                  <View style={{ flexDirection: "row" }}>
                    <Avatar.Text size={32} label="A" color={COLORS.WHITE} />
                    <View style={{ alignSelf: "center", marginLeft: ms(6) }}>
                      <Text>{dataMember?.accountName}</Text>
                    </View>
                    <View style={{ alignSelf: "center" }}>
                      <Image
                        source={require("../../assets/images/checked.png")}
                      />
                    </View>
                  </View>
                )}

                {/* <View style={{ alignSelf: "center" }}>
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
                </View> */}

                {/* <View style={{ marginLeft: ms(12) }}>
                <Text style={{ fontWeight: "600" }}>{user?.fullname}</Text>
                <Text style={{ fontWeight: "300" }}>Mover</Text>
              </View> */}
              </View>
            </Card>
          </View>

          <View>
            <View
              style={{
                flexDirection: "row",
                marginBottom: ms(8),
                marginTop: ms(8),
              }}
            >
              {/* <Image source={require("../../assets/images/IconProfile.png")} /> */}
              <Text
                style={{
                  marginLeft: ms(4),
                  color: COLORS.GRAY_HARD,
                  fontWeight: "600",
                }}
              >
                BANK
              </Text>
            </View>
            <Card
              style={{
                backgroundColor: "#ffff",
                paddingHorizontal: 16,
                paddingVertical: 16,
                zIndex: 99,
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
                  <View style={styles.inputForm}>
                    <View
                      style={{
                        flex: 1,
                        justifyContent: "space-between",
                        flexDirection: "row",
                      }}
                    >
                      <DropDownPicker
                        placeholder="Pilih Bank"
                        open={openDropDown}
                        value={valueBankId}
                        containerStyle={{
                          position: "relative",
                          zIndex: 100,
                          elevation: 1,
                        }}
                        dropDownContainerStyle={{
                          position: "absolute",

                          left: 0, // Adjust the left position as needed
                          right: 0, // Adjust the right position as needed
                          zIndex: 101,
                          elevation: 2,
                        }}
                        // zIndex={100}
                        items={dataBank.map((e) => {
                          return {
                            label: e.bankName,
                            value: e.bankName,
                          };
                        })}
                        setItems={setDataBank}
                        setOpen={setOpenDropDown}
                        setValue={setValueBankId}
                        //   //   dropDownDirection="BOTTOM"
                        //   placeholderStyle={styles.dropDownText}
                        //   dropDownContainerStyle={styles.dropDownContainer}
                        // ArrowUpIconComponent={() => <ICONS.IconChevronUpArrow />}
                        // ArrowDownIconComponent={() => <ICONS.IconChevronDownArrow />}
                        listMode="SCROLLVIEW"
                        itemKey="ingredientsId"
                        label="name"
                        //   style={{
                        //     borderWidth: open ? 2 : 1,
                        //     borderColor: open
                        //       ? COLORS.PRIMARY_MEDIUM
                        //       : COLORS.GRAY_MEDIUM,
                        //     height: 60,
                        //   }}
                        // style={{ position: "absolute", bottom: 0, left: 0, right: 0 }}
                      />
                    </View>

                    {/* <View style={styles.inputForm}>
                       <Button onPress={() => console.log(dataPayment.email)}>
                         Console
                       </Button>
                     </View> */}
                  </View>
                ) : (
                  <View style={{ flexDirection: "row" }}>
                    <Avatar.Text size={32} label="A" color={COLORS.WHITE} />
                    <View style={{ alignSelf: "center", marginLeft: ms(6) }}>
                      <Text>{dataMember?.bankName}</Text>
                    </View>
                    <View style={{ alignSelf: "center" }}>
                      <Image
                        source={require("../../assets/images/checked.png")}
                      />
                    </View>
                  </View>
                )}
              </View>
            </Card>
          </View>

          {edit ? (
            <>
              <View>
                <TouchableOpacity style={styles.button} onPress={handleEdit}>
                  <Text style={{ color: "white" }}>Submit Edit</Text>
                </TouchableOpacity>
              </View>
              <View>
                <TouchableOpacity
                  style={styles.button2}
                  onPress={() => setIsEdit(false)}
                >
                  <Text style={{ color: "white" }}>Batalkan</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <View>
              <TouchableOpacity
                style={styles.button}
                onPress={() => setIsEdit(true)}
              >
                <Text style={{ color: "white" }}>Edit Akun Bank</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>

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
        <PopUpLoader visible={isLoadingGet} />
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
    width: widthPercentageToDP(86),
    height: heightPercentageToDP(7),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.PRIMARY_DARK,
    alignSelf: "center",

    marginBottom: moderateScale(8),
    marginTop: moderateScale(18),
  },
  button2: {
    borderRadius: moderateScale(10),
    width: widthPercentageToDP(86),
    height: heightPercentageToDP(7),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.PRIMARY_MEDIUM,
    alignSelf: "center",

    marginBottom: moderateScale(32),
    marginTop: moderateScale(6),
  },
});
