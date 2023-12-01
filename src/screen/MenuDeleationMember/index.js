import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import {
  AppBar,
  ColorBgContainer,
  GeneralButton,
  GeneralTextInput,
  PopUpLoader,
  RootContainer,
} from "../../component";
import { useDispatch, useSelector } from "react-redux";
import { resetReducer } from "../../store/models/auth/actions";
import { COLORS, FONTS } from "../../assets/theme";
import { ms, moderateScale } from "react-native-size-matters";
import { ScrollView } from "react-native-gesture-handler";
import { Button, Menu, Divider, Avatar, Card, Modal } from "react-native-paper";
import { baseUrl } from "../../utils/apiURL";
import MyCalendar from "./Component/Calendar";
import {
  widthPercentageToDP,
  heightPercentageToDP,
} from "react-native-responsive-screen";
import axios from "axios";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import constants from "../../assets/constants/index.js";
import DropDownPicker from "react-native-dropdown-picker";
import moment from "moment";

export default function MenuDelegationMember({ navigation }) {
  const dispatch = useDispatch();
  const [username, setUsername] = useState("Azka");
  const user = useSelector((state) => state.auth.userData);
  const [openDropDown, setOpenDropDown] = useState(false);
  const [openDropDownMenu, setOpenDropDownMenu] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedEvents, setSelectedEvents] = useState([]);
  const [valueNamaMenu, setValueNamaMenu] = useState("");
  const [valueMemberId, setValueMemberId] = useState(0);
  const [ddlMember, setDdlMember] = useState([]);
  const [isLoadingGet, setIsLoadingGet] = useState(false);
  const uid = useSelector((state) => state?.auth?.user);
  const token = useSelector((state) => state.auth.token);
  const [ddlMenu, setDdlMenu] = useState([]);
  const [modalSuccesVis2, setModalSuccessVis2] = useState(false);
  const [modalErroVis, setModalErrorVis] = useState(false);
  const [dataJadwal, setDataJadwal] = useState([]);

  async function getData(id) {
    setIsLoadingGet(true);
    try {
      let res = await axios({
        url: `${baseUrl.URL}api/Member/getmemberbyuserid/${uid.UserId}`,
        method: "get",
        timeout: 38000,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(res, "<===res");
      if (res.status == 200) {
        // test for status you want, etc
        console.log(res.data.data, "<===res data member");

        setDdlMember(res.data.data);
        // setDdlUom(res.data.masterUomsList);
        setIsLoadingGet(false);
        // console.log(res.data, "transit");
      }
      // Don't forget to return something
      return res.data;
    } catch (err) {
      console.error(err);
      setIsLoadingGet(false);
    }
  }

  async function getDataJadwal(id) {
    setIsLoadingGet(true);
    try {
      let res = await axios({
        url: `${baseUrl.URL}api/Menu/getmenudelegationbyuserid/${uid.UserId}`,
        method: "get",
        timeout: 38000,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(res, "<===res");
      if (res.status == 200) {
        // test for status you want, etc
        console.log(res.data.data, "<===res data jadwal");

        setDataJadwal(res.data.data);
        // setDdlUom(res.data.masterUomsList);
        setIsLoadingGet(false);
        // console.log(res.data, "transit");
      }
      // Don't forget to return something
      return res.data;
    } catch (err) {
      console.error(err);
      setIsLoadingGet(false);
    }
  }

  async function getMenu(id) {
    setIsLoadingGet(true);
    try {
      let res = await axios({
        url: `${baseUrl.URL}api/Menu/menubyuserid/${uid.UserId}`,
        method: "get",
        timeout: 38000,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(res, "<===res");
      if (res.status == 200) {
        // test for status you want, etc
        console.log(res.data.data, "<===res data menu");

        setDdlMenu(res.data.data);
        // setDdlUom(res.data.masterUomsList);
        setIsLoadingGet(false);
        // console.log(res.data, "transit");
      }
      // Don't forget to return something
      return res.data;
    } catch (err) {
      console.error(err);
      setIsLoadingGet(false);
    }
  }

  const showModalAdd = () => {
    setModalVisible(true);
    // getData();
    console.log(uid);
  };

  const hideModalAdd = () => {
    setModalVisible(false);
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

    hideModalAdd();
    // getTaskDetail(route.params.assignmentId);
  };

  const hideModalError = () => {
    setModalErrorVis(false);

    // getTaskDetail(route.params.assignmentId);
  };

  const handleAdd = async () => {
    const body = {
      menuId: valueNamaMenu,
      memberId: valueMemberId,
      userId: parseInt(uid.UserId),
      assignedDate: selectedDate,
    };
    console.log(body);

    setIsLoadingGet(true);
    try {
      console.log(body);
      let res = await axios({
        url: `${baseUrl.URL}api/Menu/InsertMenuDelegation`,
        method: "POST",
        timeout: 58000,
        data: body,
        headers: {
          "Content-Type": "application/json",
          // Authorization: `Bearer ${token}`,
        },
      });
      console.log(res, "Success");
      console.log(res, "<= res");
      if (res.status == "200") {
        console.log(res.data.data, "<= res");
        setIsLoadingGet(false);
        // dispatch(setUserId(res.data.data[0]?.userId));
        getDataJadwal();
        setModalSuccessVis2(true);

        // test for status you want, etc
        // setLoadingUpload(false);
        // getTaskDetail(route.params.assignmentId);
        console.log(res, "Success");

        // setDataItem(res.data);
        // setDataInfo(res.data);
      } else {
        setIsLoadingGet(false);
      }
      // Don't forget to return something
      return res.data;
    } catch (err) {
      console.error(err, "error");
      setModalErrorVis(true);
      setIsLoadingGet(false);
    }
  };

  const data = [
    {
      menuScheduleId: 1,
      menuId: 1,
      userId: 1,
      memberId: 7,
      memberName: "Sukirja",
      menuName: "Ayam Bakar Madu",
      menuDescription: "Ayam bakar dioles madu ",
      menuNote: "test",
      assignedDate: "2023-11-20T00:00:00",
    },
    {
      menuScheduleId: 2,
      menuId: 1,
      userId: 1,
      memberId: 7,
      memberName: "Sukirja",
      menuName: "Ayam Bakar Madu",
      menuDescription: "Ayam bakar dioles madu ",
      menuNote: "test",
      assignedDate: "2023-11-12T03:31:08.706",
    },
    {
      menuScheduleId: 4,
      menuId: 13,
      userId: 1,
      memberId: 7,
      memberName: "Sukirja",
      menuName: "Dimsum",
      menuDescription:
        "Dimsum \n\nCara memasak :\n\n1. Rebus dimsum selama 15 menit\n\n2. Siap di sajikan",
      menuNote: "Jangan overcook",
      assignedDate: "2023-11-19T00:00:00",
    },
    {
      menuScheduleId: 5,
      menuId: 12,
      userId: 1,
      memberId: 7,
      memberName: "Sukirja",
      menuName: "Ikan Patin Fillet",
      menuDescription: "tesss",
      menuNote: "cobaaa",
      assignedDate: "2023-11-18T00:00:00",
    },
    {
      menuScheduleId: 6,
      menuId: 13,
      userId: 1,
      memberId: 7,
      memberName: "Sukirja",
      menuName: "Dimsum",
      menuDescription:
        "Dimsum \n\nCara memasak :\n\n1. Rebus dimsum selama 15 menit\n\n2. Siap di sajikan",
      menuNote: "Jangan overcook",
      assignedDate: "2023-11-20T00:00:00",
    },
  ];

  useEffect(() => {
    getData();
    getMenu();
    getDataJadwal();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      // Do something when the screen is focused
      console.log("Screen is focused");
      getDataJadwal();
      // Add your logic here to update the component or fetch new data

      // Example: Refresh data or update components
    }, [])
  );

  return (
    <ColorBgContainer style={{ paddingHorizontal: 24, paddingVertical: 72 }}>
      <RootContainer isTransparent>
        <AppBar
          title="Jadwal Menu"
          handleLogut={handleLogut}
          navigation={navigation}
        />
        <ScrollView style={styles.mainContainer}>
          <View style={{ marginBottom: ms(16) }}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: "700",
                color: COLORS.PRIMARY_DARK,
              }}
            >
              Jadwal Saya
            </Text>

            <View
              style={{
                backgroundColor: "black",
                borderBottomColor: COLORS.PRIMARY_DARK,
                borderBottomWidth: 4,
                width: 24,
              }}
            ></View>
          </View>
          <View>
            <Card
              style={{
                paddingHorizontal: ms(12),
                backgroundColor: COLORS.WHITE,
              }}
            >
              <MyCalendar
                data={dataJadwal}
                selectedDate={selectedDate}
                setSelectedEvents={setSelectedEvents}
                setSelectedDate={setSelectedDate}
                selectedEvents={selectedEvents}
                // modalVisible={modalVisible}
                // setModalVisible={setModalVisible}
              />
            </Card>
            {selectedEvents?.length == 0 ? (
              <>
                {/* <View>
                  <TouchableOpacity
                    style={styles.btnAdd}
                    onPress={showModalAdd}
                  >
                    <Text style={{ color: "white", fontWeight: "700" }}>
                      Tambah Jadwal Menu
                    </Text>
                  </TouchableOpacity>
                </View> */}
              </>
            ) : (
              <>
                <View style={{ marginBottom: ms(8), marginTop: ms(24) }}>
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: "700",
                      color: COLORS.GRAY_HARD,
                    }}
                  >
                    Jadwal Menu
                  </Text>
                </View>
                {/* <View>
                  <TouchableOpacity
                    style={styles.btnAdd}
                    onPress={showModalAdd}
                  >
                    <Text style={{ color: "white", fontWeight: "700" }}>
                      Tambah Jadwal Menu
                    </Text>
                  </TouchableOpacity>
                </View> */}
              </>
            )}

            {/* <Button onPress={() => console.log(selectedEvents)}>Test</Button> */}
            <View style={{ paddingVertical: 32, paddingHorizontal: ms(4) }}>
              {selectedEvents?.map((e) => (
                <Card
                  style={{
                    borderRadius: 8,
                    width: "100%",
                    borderLeftColor: COLORS.PRIMARY_DARK,
                    borderLeftWidth: 4,
                    height: ms(92),
                    // paddingRight: ms(32),
                    backgroundColor: COLORS.WHITE,
                    borderTopStartRadius: 10,
                    borderTopEndRadius: 10,
                    borderStart: "1px solid red",
                    marginBottom: ms(24),
                    paddingHorizontal: ms(12),
                    // backgroundColor: COLORS.WHITE,
                    paddingBottom: ms(32),
                  }}
                  // onPress={() => onPressNav(item.menuId)}
                >
                  <Card.Content
                    style={{
                      // marginTop: ms(4),
                      // width: "100%",
                      // flex: 1,
                      paddingHorizontal: ms(4),

                      // backgroundColor: "red",
                    }}
                  >
                    <View style={{ flexDirection: "row" }}>
                      <View>
                        <Text
                          numberOfLines={1}
                          ellipsizeMode="tail"
                          style={{
                            fontSize: 16,
                            fontWeight: "700",
                            color: COLORS.GRAY_HARD,
                          }}
                        >
                          {e?.menuName}
                        </Text>
                        <Text
                          numberOfLines={1}
                          ellipsizeMode="tail"
                          style={{
                            fontSize: 12,
                            fontWeight: "400",
                            color: COLORS.GRAY_HARD,
                          }}
                        >
                          {e.memberName}
                        </Text>
                        <Text
                          numberOfLines={1}
                          ellipsizeMode="tail"
                          style={{
                            fontSize: 12,
                            fontWeight: "400",
                            color: COLORS.PRIMARY_DARK,
                          }}
                        >
                          tanggal: {moment(e.assignedDate).format("YYYY-MM-DD")}
                        </Text>
                      </View>
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    ></View>

                    {/* <Text numberOfLines={3} ellipsizeMode="tail">
                          {item?.description}
                        </Text> */}
                  </Card.Content>
                </Card>
              ))}
            </View>
          </View>
          {isLoadingGet ? (
            <PopUpLoader visible={true} />
          ) : (
            <PopUpLoader visible={false} />
          )}
        </ScrollView>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          style={{ zIndex: 1000 }}
          onRequestClose={hideModalAdd}
        >
          <View style={styles.containermodalView}>
            <View style={{ marginBottom: ms(12) }}>
              <Text
                style={{
                  fontWeight: "400",
                  fontSize: 18,
                  color: COLORS.PRIMARY_DARK,
                }}
              >
                Tambah Jadwal
              </Text>
            </View>
            <View style={styles.inputForm}>
              <Text style={styles.text}>Menu</Text>

              <DropDownPicker
                placeholder="Pilih Menu"
                open={openDropDownMenu}
                value={valueNamaMenu}
                zIndex={3}
                items={ddlMenu.map((e) => {
                  return {
                    label: e.menuName,
                    value: e.menuId,
                  };
                })}
                setItems={setDdlMenu}
                setOpen={setOpenDropDownMenu}
                setValue={setValueNamaMenu}
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
            <View style={styles.inputForm}>
              <Text style={styles.text}>Member</Text>

              <DropDownPicker
                placeholder="Pilih Member"
                open={openDropDown}
                value={valueMemberId}
                zIndex={2}
                items={ddlMember.map((e) => {
                  return {
                    label: e.name,
                    value: e.memberId,
                  };
                })}
                setItems={setDdlMember}
                setOpen={setOpenDropDown}
                setValue={setValueMemberId}
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
              <View style={{ marginTop: ms(22) }}>
                <GeneralButton
                  style={{
                    backgroundColor: COLORS.PRIMARY_DARK,
                    marginBottom: ms(4),
                  }}
                  mode="contained"
                  onPress={handleAdd}
                >
                  Tambah
                </GeneralButton>
                <GeneralButton
                  style={{ backgroundColor: COLORS.PRIMARY_MEDIUM }}
                  mode="contained"
                  onPress={hideModalAdd}
                >
                  Close
                </GeneralButton>
              </View>
            </View>

            {/* <View>
              <TouchableOpacity
                style={styles.button}
                onPress={() => console.log(menuId)}
              >
                <Text style={{ color: "white" }}>test</Text>
              </TouchableOpacity>
            </View> */}
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
            <Text style={styles.modalText}>Menu Berhasil di Simpan</Text>
            <GeneralButton
              style={{ backgroundColor: COLORS.PRIMARY_DARK }}
              mode="contained"
              onPress={hideModalSuccess2}
            >
              Kembali Ke Daftar Menu
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
  btnAdd: {
    borderRadius: moderateScale(10),
    width: widthPercentageToDP(46),
    height: heightPercentageToDP(6),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.PRIMARY_DARK,
    alignSelf: "flex-end",
    marginBottom: moderateScale(5),
    marginTop: moderateScale(5),
    marginTop: moderateScale(10),
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    width: "100%",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  submitButton: {
    backgroundColor: "blue",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  submitButtonText: {
    color: "white",
  },
  closeButton: {
    marginTop: 10,
    alignItems: "center",
  },
  closeButtonText: {
    color: "red",
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
