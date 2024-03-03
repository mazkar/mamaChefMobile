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
import ColorBgContainer from "../../component/ColorBgContainer/index.js";
import { COLORS, FONTS } from "../../assets/theme/index.js";
import {
  Button,
  Menu,
  Divider,
  Avatar,
  Modal,
  DataTable,
  Card,
  Paragraph,
  TextInput,
  Searchbar,
} from "react-native-paper";
import { ms, moderateScale } from "react-native-size-matters";
import {
  AppBar,
  GeneralButton,
  OverviewProgres,
  PopUpLoader,
  GeneralTextInput,
  GeneralTextInput2,
} from "../../component/index";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import constants from "../../assets/constants/index.js";
import AsyncStorage from "@react-native-async-storage/async-storage";
// iCONS
import FaIcons from "react-native-vector-icons/Ionicons";
import { resetReducer } from "../../store/models/auth/actions.js";
import { useDispatch, useSelector } from "react-redux";
import API from "../../utils/apiService.js";
import axios from "axios";

import { baseUrl } from "../../utils/apiURL.js";
import ImagePickerExample from "./components/ImagePicker.jsx";
import DropDownPicker from "react-native-dropdown-picker";
import moment from "moment";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import PopUpConfirm from "./components/PopUpConfirm.jsx";

export default function EditBahan({ navigation, menuId, route }) {
  const [valueNamaMenu, setValueNamaMenu] = useState("");
  const dispatch = useDispatch();
  const [valueGambar, setValueGambar] = useState(null);
  // const [menuId, setMenuId] = useState(null);

  const [openDropDown, setOpenDropDown] = useState(false);
  const [ddlIngridients, setDdlIngridients] = useState([]);
  const [openDropDown2, setOpenDropDown2] = useState(false);
  const [ddlUom, setDdlUom] = useState([]);
  const [selectedIng, setSelectedIng] = useState(null);
  const [selectedUom, setSelectedUom] = useState(null);
  const [qty, setQty] = useState(null);
  const [data, setData] = useState([]);
  const [isLoadingGet, setIsLoadingGet] = useState(false);
  const uid = useSelector((state) => state?.auth?.user);
  const token = useSelector((state) => state.auth.token);
  const [modalSuccesVis, setModalSuccessVis] = useState(false);
  const [modalSuccesVis2, setModalSuccessVis2] = useState(false);
  const [modalErroVis, setModalErrorVis] = useState(false);
  const [valueOther, setValueOther] = useState(null);
  const [valueRemark, setValueRemark] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [flahPublish, setFlagPublish] = useState(true);
  const [popUpConfirmVis, setPopUpConfirmVis] = useState(false);
  const [selectedbahanId, setSelectedBahanId] = useState(0);
  const [selectedbahanNama, setSelectedBahanNama] = useState("");
  const [modalAddbahan, setModalAddBahan] = useState(false);
  const [dataMenu, setDataMenu] = useState([]);
  const [modalEditNote, setModalEditNote] = useState(false);
  const [modalEditDesc, setModalEditDesc] = useState(false);
  const [valueNote, setValueNote] = useState("");
  const [valueDesc, setValueDesc] = useState("");

  async function getData(id) {
    setIsLoadingGet(true);

    const newIngredient = {
      ingredientsId: 0,
      name: "Bahan Lain",
      uom: "sdt",
      qty: "0",
      isActive: "1",
      lmby: 1,
      lmdt: "2023-12-12T00:00:00",
    };
    try {
      let res = await axios({
        url: `${baseUrl.URL}api/Menu/setupmenuing/${id}`,
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
        console.log(res.data, "<===res");
        setData(res.data);

        let option = res?.data?.masterIngredientsList?.map((item, idx) => {
          return {
            ingredientsId: item?.ingredientsId,
            name: item?.name,
            uom: item?.uom,
            qty: item?.qty,
            isActive: item?.isActive,
            lmby: item?.lmby,
            lmdt: item?.lmdt,
          };
        });

        setDdlIngridients([newIngredient, ...option]);

        // setDdlIngridients(res.data.masterIngredientsList.push(newIngredient));
        setDdlUom(res.data.masterUomsList);
        setIsLoadingGet(false);
        setFlagPublish(res?.data?.ablePublish);

        setDataMenu(res?.data?.insertedMenu);
        // console.log(res.data, "transit");
        setValueDesc(res?.data?.insertedMenu?.description);
        setValueNote(res?.data?.insertedMenu?.note);
      }
      // Don't forget to return something
      return res.data;
    } catch (err) {
      console.error(err);
      setIsLoadingGet(false);
    }
  }

  async function handleDaftar() {
    setIsLoadingGet(true);

    const body = {
      menuIngredientId: 0,
      menuId: route?.params?.menuId,
      ingredientsId: selectedIng,
      quantity: qty,
      otherIngridients: valueOther,
      note: valueRemark,
      uomId: selectedUom,
      lmdt: `${moment().format("YYYY-MM-DD")}`,
      lmby: uid.UserId,
    };

    try {
      console.log(body);
      let res = await axios({
        url: `${baseUrl.URL}api/Menu/InsertMenuIng`,
        method: "POST",
        timeout: 8000,
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
        setModalAddBahan(false);
        setModalSuccessVis(true);
        setSuccessMessage(res?.data?.message);
        // test for status you want, etc
        // setLoadingUpload(false);
        // getTaskDetail(route.params.assignmentId);
        console.log(res, "Success");

        // setDataItem(res.data);
        // setDataInfo(res.data);
      } else {
        setIsLoadingGet(false);
        setModalErrorVis(true);
        setModalAddBahan(false);
        setErrorMessage(res?.data?.message);
      }
      // Don't forget to return something
      return res.data;
    } catch (err) {
      console.error(err, "error");
      setModalErrorVis(true);
      setIsLoadingGet(false);
      setModalAddBahan(false);
      setErrorMessage(err?.message);
    }
  }

  async function handleDelete() {
    setIsLoadingGet(true);

    const body = {
      menuIngredientId: 0,
      menuId: route?.params?.menuId,
      ingredientsId: selectedIng,
      quantity: qty,
      otherIngridients: valueOther,
      note: valueRemark,
      uomId: selectedUom,
      lmdt: `${moment().format("YYYY-MM-DD")}`,
      lmby: uid.UserId,
    };

    try {
      console.log(body);
      let res = await axios({
        url: `${baseUrl.URL}api/Menu/deletemenuing/${selectedbahanId}`,
        method: "DELETE",
        timeout: 8000,
        // data: body,
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
        setModalAddBahan(false);
        setModalSuccessVis(true);
        setSuccessMessage(res?.data?.message);
        setPopUpConfirmVis(false);
        // test for status you want, etc
        // setLoadingUpload(false);

        // getTaskDetail(route.params.assignmentId);
        console.log(res, "Success");

        // setDataItem(res.data);
        // setDataInfo(res.data);
      } else {
        setIsLoadingGet(false);
        setModalErrorVis(true);
        setPopUpConfirmVis(false);
        setModalAddBahan(false);
        setErrorMessage(res?.data?.message);
      }
      // Don't forget to return something
      return res.data;
    } catch (err) {
      console.error(err, "error");
      setModalErrorVis(true);
      setPopUpConfirmVis(false);
      setIsLoadingGet(false);
      setErrorMessage(err?.message);
      setModalAddBahan(false);
    }
  }

  async function handleSave(publish) {
    setIsLoadingGet(true);

    const body = {
      menuId: route?.params?.menuId,
      isPublished: publish,
      lmby: uid.Email,
    };

    try {
      console.log(body);
      let res = await axios({
        url: `${baseUrl.URL}api/Menu/savemenu`,
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

        setModalSuccessVis2(true);

        // test for status you want, etc
        // setLoadingUpload(false);
        // getTaskDetail(route.params.assignmentId);
        console.log(res, "Success");

        // setDataItem(res.data);
        // setDataInfo(res.data);
      } else {
        setIsLoadingGet(false);
        setModalErrorVis(true);
        setErrorMessage(res.data.message);
      }
      // Don't forget to return something
      return res.data;
    } catch (err) {
      console.error(err, "error");
      setModalErrorVis(true);
      setIsLoadingGet(false);
      setErrorMessage(err.message);
    }
  }

  const hideModalSuccess = () => {
    setModalSuccessVis(false);

    getData(route?.params?.menuId);
    // getTaskDetail(route.params.assignmentId);
  };
  const hideModalSuccess2 = () => {
    setModalSuccessVis2(false);

    navigation.navigate("KelolaMenu");
    // getTaskDetail(route.params.assignmentId);
  };

  const hideModalError = () => {
    setModalErrorVis(false);

    // getTaskDetail(route.params.assignmentId);
  };

  useEffect(() => {
    getData(route?.params?.menuId);
  }, []);

  const handleLogut = () => {
    dispatch(resetReducer());
    navigation.reset({
      index: 0,
      routes: [{ name: "Login" }],
    });
  };

  const showPopUpConfirm = (item) => {
    setPopUpConfirmVis(true);
    console.log(item);
    setSelectedBahanId(item.menuIngredientId);
    setSelectedBahanNama(item?.ingredientsName);
  };

  const hidePopUp = () => {
    setPopUpConfirmVis(false);
  };

  const showModalAddBahan = () => {
    setModalAddBahan(true);
  };

  const hideModalAddBahan = () => {
    setModalAddBahan(false);
  };

  const showModalEditNote = () => {
    setModalEditNote(true);
  };
  const showModalEditDesc = () => {
    setModalEditDesc(true);
  };

  const hideModalEditNote = () => {
    setModalEditNote(false);
  };
  const hideModalEditDesc = () => {
    setModalEditDesc(false);
  };

  async function handleEditDescr() {
    setIsLoadingGet(true);

    const body = {
      menuId: route?.params.menuId,
      description: valueDesc,
      lmby: parseInt(uid.UserId),
      // lmdt: moment().format("YYYY-MM-DD hh:mm:ss"),
      lmdt: moment().format("YYYY-MM-DD"),
    };

    try {
      console.log(body);
      let res = await axios({
        url: `${baseUrl.URL}api/Menu/updatemenudescription`,
        method: "PUT",
        timeout: 8000,
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
        setSuccessMessage(res.data.message);
        setModalSuccessVis(true);
        setModalEditDesc(false);

        // test for status you want, etc
        // setLoadingUpload(false);
        // getTaskDetail(route.params.assignmentId);
        console.log(res, "Success");

        // setDataItem(res.data);
        // setDataInfo(res.data);
      } else {
        setIsLoadingGet(false);
        setModalEditDesc(false);
        setModalErrorVis(true);
        setErrorMessage(res.data.message);
      }
      // Don't forget to return something
      return res.data;
    } catch (err) {
      console.error(err, "error");
      setModalErrorVis(true);
      setIsLoadingGet(false);
      setErrorMsg(err.message);
      setModalEditDesc(false);
    }
  }

  async function handleEditNote() {
    setIsLoadingGet(true);

    const body = {
      menuId: route?.params?.menuId,
      note: valueNote,
      lmby: parseInt(uid.UserId),
      // lmdt: moment().format("YYYY-MM-DD hh:mm:ss"),
      lmdt: moment().format("YYYY-MM-DD"),
    };

    try {
      console.log(body);
      let res = await axios({
        url: `${baseUrl.URL}api/Menu/updatemenunote`,
        method: "PUT",
        timeout: 8000,
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

        setModalSuccessVis(true);
        setModalEditNote(false);
        setSuccessMessage(res.data.message);
        // test for status you want, etc
        // setLoadingUpload(false);
        // getTaskDetail(route.params.assignmentId);
        console.log(res, "Success");

        // setDataItem(res.data);
        // setDataInfo(res.data);
      } else {
        setIsLoadingGet(false);
        setModalEditNote(false);
        setModalErrorVis(true);
        setErrorMessage(res.data.message);
      }
      // Don't forget to return something
      return res.data;
    } catch (err) {
      console.error(err, "error");
      setModalErrorVis(true);
      setIsLoadingGet(false);
      setErrorMsg(err.message);
      setModalEditNote(false);
    }
  }

  useEffect(() => {
    if (selectedIng != 0) {
      setValueOther(null);
      setValueRemark(null);
    }
  }, [selectedIng]);

  return (
    <ColorBgContainer>
      <RootContainer>
        <AppBar
          title="Kelola Resep"
          dataTaskPending={[]}
          navigation={navigation}
          handleLogut={handleLogut}
        />
        {/* <Button onPress={() => console.log(uid)}>test</Button> */}
        {/* <Button onPress={() => console.log(selectedIng)}>Test</Button>
        <Button onPress={() => getData(menuId)}>Test</Button> */}
        <ScrollView style={styles.mainContainer}>
          <View style={{ marginBottom: ms(32) }}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: "700",
                color: "gray",
              }}
            >
              Resep Anda
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
                borderRadius: 8,
                width: "96%",
                // height: ms(186),
                // paddingRight: ms(32),
                marginLeft: ms(12),
                borderTopStartRadius: 10,
                borderTopEndRadius: 10,
                marginBottom: ms(24),
                backgroundColor: COLORS.WHITE,
                paddingBottom: ms(32),
                paddingRight: ms(32),
              }}
            >
              <Card.Content
                style={{
                  paddingHorizontal: ms(4),
                  paddingRight: ms(32),
                  // backgroundColor: "red",
                }}
              >
                <View style={{ flexDirection: "row" }}>
                  <View
                    style={{
                      // backgroundColor: COLORS.PRIMARY_DARK,
                      borderRadius: ms(10),
                      alignContent: "center",
                      // justifyContent: "center",
                      // flex: 1,
                      // width: "100%",
                      paddingHorizontal: ms(6),
                    }}
                  >
                    <Image
                      source={{
                        uri: `${dataMenu?.photoURL}`,
                      }}
                      style={{
                        width: ms(100),
                        height: ms(100),
                        borderRadius: ms(50),
                      }}
                      onError={(error) =>
                        console.log("Image load error:", error)
                      }
                    />
                  </View>
                  <View style={{ marginLeft: ms(6) }}>
                    <Text
                      numberOfLines={1}
                      ellipsizeMode="tail"
                      style={{
                        fontSize: 16,
                        fontWeight: "700",
                        color: COLORS.GRAY_HARD,
                      }}
                    >
                      {dataMenu?.menuName}
                    </Text>

                    <Text>
                      <Text
                        style={{
                          color: COLORS.GRAY_HARD,
                          fontWeight: "600",
                          fontSize: 11,
                        }}
                      >
                        Resep Oleh:
                      </Text>
                      {"\n"}
                      <Text style={{ color: COLORS.PRIMARY_DARK }}>
                        {dataMenu?.lmby}
                      </Text>
                    </Text>

                    <View style={{ paddingRight: ms(26) }}>
                      <Text>
                        <Text
                          style={{
                            color: COLORS.GRAY_HARD,
                            fontWeight: "600",
                            fontSize: 11,
                          }}
                        >
                          Catatan:
                        </Text>
                        {"\n"}
                        <Text style={{ color: COLORS.PRIMARY_DARK }}>
                          {dataMenu?.note}
                        </Text>
                      </Text>
                    </View>
                  </View>
                </View>
                <View style={{ paddingRight: ms(8), marginLeft: ms(12) }}>
                  <Text>
                    <Text
                      style={{
                        color: COLORS.GRAY_HARD,
                        fontWeight: "600",
                        fontSize: 11,
                      }}
                    >
                      Deskripsi:
                    </Text>
                    {"\n"}
                    <Text style={{ color: COLORS.PRIMARY_DARK }}>
                      {dataMenu?.description}
                    </Text>
                  </Text>
                </View>
              </Card.Content>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  marginLeft: ms(28),
                  marginTop: ms(16),
                }}
              >
                <GeneralButton
                  style={{
                    backgroundColor: COLORS.PRIMARY_DARK,
                    marginRight: ms(4),
                  }}
                  mode="contained"
                  onPress={showModalEditDesc}
                >
                  Ubah Deskripsi
                </GeneralButton>
                <GeneralButton
                  style={{ backgroundColor: COLORS.PRIMARY_DARK }}
                  mode="contained"
                  onPress={showModalEditNote}
                >
                  Ubah Catatan
                </GeneralButton>
              </View>
            </Card>
          </View>

          {/* Bahan Makakan */}
          <View>
            <View style={{ marginBottom: ms(16) }}>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "700",
                  color: "gray",
                }}
              >
                List Bahan
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

            <View style={{ alignSelf: "flex-end" }}>
              <TouchableOpacity
                style={styles.button3}
                onPress={showModalAddBahan}
              >
                <Text style={{ color: "white" }}>Tambah Bahan</Text>
              </TouchableOpacity>
            </View>
            <Card style={styles.card}>
              <DataTable>
                <DataTable.Header>
                  <DataTable.Title>Bahan</DataTable.Title>
                  <DataTable.Title>Jumlah</DataTable.Title>
                  <DataTable.Title>Satuan</DataTable.Title>
                  <DataTable.Title>status</DataTable.Title>
                  <DataTable.Title></DataTable.Title>
                </DataTable.Header>

                {data.registeredIngredients?.map((item) => (
                  <DataTable.Row key={item.id}>
                    <DataTable.Cell>
                      <Text style={styles.textBahan}>
                        {item.ingredientsName}
                      </Text>
                    </DataTable.Cell>
                    <DataTable.Cell
                      style={{ alignItems: "center", justifyContent: "center" }}
                    >
                      <Text style={styles.textBahan}>{item.quantity}</Text>
                    </DataTable.Cell>
                    <DataTable.Cell
                      style={{ alignItems: "center", justifyContent: "center" }}
                    >
                      <Text style={styles.textBahan}>{item.uom}</Text>
                    </DataTable.Cell>
                    <DataTable.Cell
                      style={{ alignItems: "center", justifyContent: "center" }}
                    >
                      {item?.isIngActive ? (
                        <Ionicons
                          name="checkmark-circle"
                          size={11}
                          style={{ fontSize: 18, color: COLORS.SUCCESS }}
                        />
                      ) : (
                        <Ionicons
                          name="alert-circle"
                          size={24}
                          style={{ fontSize: 18, color: COLORS.PRIMARY_MEDIUM }}
                        />
                      )}
                    </DataTable.Cell>
                    <DataTable.Cell
                      style={{ alignItems: "center", justifyContent: "center" }}
                    >
                      <TouchableOpacity onPress={() => showPopUpConfirm(item)}>
                        <Ionicons
                          name="trash"
                          size={24}
                          style={{ fontSize: 18, color: COLORS.RED_BG }}
                        />
                      </TouchableOpacity>
                    </DataTable.Cell>
                  </DataTable.Row>
                ))}
              </DataTable>
              {/* <View
                style={{ paddingHorizontal: ms(4), paddingVertical: ms(16) }}
              >
                {data?.registeredIngredients?.map((item, idx) => (
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-around",
                    }}
                  >
                    <View>
                      <Text style={styles.textBahan}>{idx + 1}.</Text>
                    </View>
                    <View style={{}}>
                      <Text style={styles.textBahan}>
                        {item?.ingredientsName}
                      </Text>
                    </View>
                    <View style={{}}>
                      <Text style={styles.textBahan}>{item?.quantity}</Text>
                    </View>
                    <View>
                      <Text style={styles.textBahan}>{item?.uom}</Text>
                    </View>
                  </View>
                ))}
              </View> */}
            </Card>
            {flahPublish ? (
              <View>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => handleSave(true)}
                >
                  <Text style={{ color: "white" }}>Simpan dan Publish</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <></>
            )}

            <View>
              <TouchableOpacity
                style={styles.button2}
                onPress={() => handleSave(false)}
              >
                <Text style={{ color: "white" }}>Simpan Sebagai Draft</Text>
              </TouchableOpacity>
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
          visible={modalSuccesVis}
          style={{ zIndex: 1000 }}
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

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalAddbahan}
          style={{ zIndex: 1000 }}
          onRequestClose={hideModalAddBahan}
        >
          {/* <View style={styles.centeredView}> */}
          <View style={styles.containermodalView3}>
            <View style={styles.inputForm}>
              <Text style={styles.text}>Nama Menu</Text>

              <GeneralTextInput2
                placeholder={data.menuName}
                mode="outlined"
                value={valueNamaMenu}
                disabled
                // hasErrors={authFailed}
                messageError="Wrong Username/Password"
                onChangeText={(e) => setValueNamaMenu(e)}
                style={styles.inputUserName}
              />
            </View>
            <View style={styles.inputForm}>
              <Text style={styles.text}>Bahan</Text>

              <DropDownPicker
                placeholder="Pilih Bahan"
                open={openDropDown}
                value={selectedIng}
                zIndex={3}
                items={ddlIngridients.map((e) => {
                  return {
                    label: e.name,
                    value: e.ingredientsId,
                  };
                })}
                setItems={setDdlIngridients}
                setOpen={setOpenDropDown}
                setValue={setSelectedIng}
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

            {selectedIng === 0 ? (
              <>
                <View style={styles.inputForm}>
                  <Text style={styles.text}>Bahan Lainnya</Text>

                  <GeneralTextInput2
                    placeholder="Masukan Bahan Lainnya"
                    mode="outlined"
                    value={valueOther}
                    // hasErrors={authFailed}
                    messageError="Wrong Username/Password"
                    onChangeText={(e) => setValueOther(e)}
                    style={styles.inputUserName}
                  />
                </View>
                <View style={styles.inputForm}>
                  <Text style={styles.text}>Catatan</Text>

                  <GeneralTextInput2
                    placeholder="Catatan"
                    mode="outlined"
                    value={valueRemark}
                    // hasErrors={authFailed}
                    messageError="Wrong Username/Password"
                    onChangeText={(e) => setValueRemark(e)}
                    style={styles.inputUserName}
                  />
                </View>
              </>
            ) : (
              <></>
            )}

            <View style={styles.inputForm}>
              <Text style={styles.text}>Kuantiti Bahan</Text>

              <GeneralTextInput2
                placeholder="Kuantiti Bahan"
                mode="outlined"
                value={qty}
                keyboardType="numeric"
                // hasErrors={authFailed}
                messageError="Wrong Username/Password"
                onChangeText={(e) => setQty(e)}
                style={styles.inputUserName}
              />
            </View>
            <View style={styles.inputForm}>
              <Text style={styles.text}>Satuan</Text>

              <DropDownPicker
                placeholder="Pilih Bahan"
                open={openDropDown2}
                value={selectedUom}
                zIndex={2}
                items={ddlUom.map((e) => {
                  return {
                    label: e.uomName,
                    value: e.uomId,
                  };
                })}
                setItems={setDdlUom}
                setOpen={setOpenDropDown2}
                setValue={setSelectedUom}
                listMode="SCROLLVIEW"
              />
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-end",
                marginTop: ms(16),
              }}
            >
              <GeneralButton
                style={{
                  backgroundColor: COLORS.PRIMARY_MEDIUM,
                  marginRight: ms(4),
                }}
                mode="contained"
                onPress={hideModalAddBahan}
              >
                Batalkan
              </GeneralButton>
              <GeneralButton
                style={{ backgroundColor: COLORS.PRIMARY_DARK }}
                mode="contained"
                onPress={handleDaftar}
              >
                Tambah
              </GeneralButton>
            </View>
          </View>
          {/* </View> */}
        </Modal>

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalEditDesc}
          onRequestClose={hideModalEditDesc}
        >
          {/* <View style={styles.centeredView}> */}
          <View style={styles.containermodalView3}>
            <View>
              <Text
                style={{
                  fontWeight: "600",
                  fontSize: ms(18),
                  color: "gray",
                  marginBottom: ms(22),
                }}
              >
                Ubah Deskripsi
              </Text>
            </View>
            <View style={{ marginBottom: ms(12) }}>
              {/* <Text style={styles.text}>Deskripsi</Text> */}

              <GeneralTextInput
                // placeholder={valueDesc}
                mode="outlined"
                value={valueDesc}
                // hasErrors={authFailed}
                defaultValue={valueDesc}
                title="Deskripsi"
                multiline
                numberOfLines={10}
                messageError="Wrong Username/Password"
                onChangeText={(e) => setValueDesc(e)}
                style={styles.inputUserName}
              />
            </View>
            <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
              <GeneralButton
                style={{ backgroundColor: COLORS.PRIMARY_DARK }}
                mode="contained"
                onPress={hideModalEditDesc}
              >
                Batal
              </GeneralButton>
              <GeneralButton
                style={{ backgroundColor: COLORS.PRIMARY_DARK, marginLeft: 8 }}
                mode="contained"
                onPress={handleEditDescr}
              >
                Proses
              </GeneralButton>
            </View>
          </View>
          {/* </View> */}
        </Modal>

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalEditNote}
          onRequestClose={hideModalEditNote}
        >
          {/* <View style={styles.centeredView}> */}
          <View style={styles.containermodalView3}>
            <View>
              <Text
                style={{
                  fontWeight: "600",
                  fontSize: ms(18),
                  color: COLORS.PRIMARY_DARK,
                }}
              >
                Edit Catatan
              </Text>
            </View>
            <View style={{ marginBottom: ms(12) }}>
              {/* <Text style={styles.text}>Deskripsi</Text> */}

              <GeneralTextInput
                // placeholder={valueNote}
                defaultValue={valueNote}
                mode="outlined"
                value={valueNote}
                // hasErrors={authFailed}
                title="Catatan"
                multiline
                numberOfLines={10}
                messageError="Wrong Username/Password"
                onChangeText={(e) => setValueNote(e)}
                style={styles.inputUserName}
              />
            </View>
            <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
              <GeneralButton
                style={{ backgroundColor: COLORS.PRIMARY_DARK }}
                mode="contained"
                onPress={hideModalEditNote}
              >
                Batal
              </GeneralButton>
              <GeneralButton
                style={{ backgroundColor: COLORS.PRIMARY_DARK, marginLeft: 8 }}
                mode="contained"
                onPress={handleEditNote}
              >
                Proses
              </GeneralButton>
            </View>
          </View>
          {/* </View> */}
        </Modal>

        <PopUpConfirm
          popUpVisible={popUpConfirmVis}
          hidePopUp={hidePopUp}
          // stat={dataMenu?.isPublished ? "active" : "inActive"}
          handleClick={handleDelete}
          name={selectedbahanNama}
        />
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

    marginBottom: moderateScale(4),
    marginTop: moderateScale(18),
  },
  button2: {
    borderRadius: moderateScale(10),
    width: widthPercentageToDP(95),
    height: heightPercentageToDP(7),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.PRIMARY_DARK,
    alignSelf: "center",

    marginBottom: moderateScale(32),
    marginTop: moderateScale(2),
  },
  button3: {
    borderRadius: moderateScale(10),
    width: widthPercentageToDP(38),
    height: heightPercentageToDP(7),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.PRIMARY_DARK,
    alignSelf: "center",

    marginBottom: moderateScale(4),
    marginTop: moderateScale(18),
  },
  card: {
    margin: 16,
    backgroundColor: COLORS.WHITE,
  },
  containermodalView: {
    flexDirection: "column",
    alignSelf: "center",
    position: "absolute",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 28,
    backgroundColor: COLORS.WHITE,
    borderRadius: 10,
  },
  containermodalView3: {
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
  containermodalView2: {
    flexDirection: "column",
    alignSelf: "center",
    position: "absolute",
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
  textBahan: {
    color: "gray",
    fontSize: ms(10),
  },
});
