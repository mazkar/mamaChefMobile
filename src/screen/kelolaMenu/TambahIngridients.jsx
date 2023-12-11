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
} from "../../component/index";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import constants from "../../assets/constants/index.js";
import AsyncStorage from "@react-native-async-storage/async-storage";
// iCONS
import FaIcons from "react-native-vector-icons/Ionicons";
import { resetReducer } from "../../store/models/auth/actions";
import { useDispatch, useSelector } from "react-redux";
import API from "../../utils/apiService";
import axios from "axios";

import { baseUrl } from "../../utils/apiURL";
import ImagePickerExample from "./components/ImagePicker";
import DropDownPicker from "react-native-dropdown-picker";
import moment from "moment";
import { Ionicons, FontAwesome } from "@expo/vector-icons";

export default function TambahIngridients({ navigation, menuId }) {
  const [valueNamaMenu, setValueNamaMenu] = useState("");
  const [valueDesc, setValueDesc] = useState("");
  const [valuNote, setValeNote] = useState("");
  const [valueGambar, setValueGambar] = useState(null);
  // const [menuId, setMenuId] = useState(null);

  const [openDropDown, setOpenDropDown] = useState(false);
  const [ddlIngridients, setDdlIngridients] = useState([]);
  const [openDropDown2, setOpenDropDown2] = useState(false);
  const [ddlUom, setDdlUom] = useState([]);
  const [selectedIng, setSelectedIng] = useState(null);
  const [selectedUom, setSelectedUom] = useState(null);
  const [qty, setQty] = useState(0);
  const [data, setData] = useState([]);
  const [isLoadingGet, setIsLoadingGet] = useState(false);
  const uid = useSelector((state) => state?.auth?.user);
  const token = useSelector((state) => state.auth.token);
  const [modalSuccesVis, setModalSuccessVis] = useState(false);
  const [modalSuccesVis2, setModalSuccessVis2] = useState(false);
  const [modalErroVis, setModalErrorVis] = useState(false);

  async function getData(id) {
    setIsLoadingGet(true);
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
        setDdlIngridients(res.data.masterIngredientsList);
        setDdlUom(res.data.masterUomsList);
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

  async function handleDaftar() {
    setIsLoadingGet(true);

    const body = {
      menuIngredientId: 0,
      menuId: menuId,
      ingredientsId: selectedIng,
      quantity: qty,
      uomId: selectedUom,
      lmdt: `${moment().format("YYYY-MM-DD")}`,
      lmby: uid.Email,
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

        setModalSuccessVis(true);

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
  }

  async function handleSave(publish) {
    setIsLoadingGet(true);

    const body = {
      menuId: menuId,
      isPublished: true,
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
      }
      // Don't forget to return something
      return res.data;
    } catch (err) {
      console.error(err, "error");
      setModalErrorVis(true);
      setIsLoadingGet(false);
    }
  }

  const hideModalSuccess = () => {
    setModalSuccessVis(false);

    getData(menuId);
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
    getData(menuId);
  }, []);

  return (
    <ColorBgContainer>
      <RootContainer>
        <AppBar title="Kelola Menu" dataTaskPending={[]} />
        <ScrollView style={styles.mainContainer}>
          <View style={{ marginBottom: ms(16) }}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: "700",
                color: COLORS.PRIMARY_DARK,
              }}
            >
              Tambah
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
            <View style={styles.inputForm}>
              <Text style={styles.text}>Nama Menu</Text>

              <GeneralTextInput
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
            <View style={styles.inputForm}>
              <Text style={styles.text}>Kuantiti Bahan</Text>

              <GeneralTextInput
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
                // style={{ position: "absolute", bottom: 0, left: 0, right: 0 }}
                setItems={setDdlUom}
                setOpen={setOpenDropDown2}
                setValue={setSelectedUom}
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
            {/* <View>
              <TouchableOpacity
                style={styles.button}
                onPress={() => console.log(menuId)}
              >
                <Text style={{ color: "white" }}>test</Text>
              </TouchableOpacity>
            </View> */}
            <View>
              <TouchableOpacity style={styles.button} onPress={handleDaftar}>
                <Text style={{ color: "white" }}>Add</Text>
              </TouchableOpacity>
            </View>
            <View style={{ marginBottom: ms(16) }}>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "700",
                  color: COLORS.PRIMARY_DARK,
                }}
              >
                List Ingridients
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
            <Card style={styles.card}>
              <DataTable>
                <DataTable.Header>
                  <DataTable.Title>Bahan</DataTable.Title>
                  <DataTable.Title>Satuan</DataTable.Title>
                  <DataTable.Title>Jumlah</DataTable.Title>
                </DataTable.Header>

                {data.registeredIngredients?.map((item) => (
                  <DataTable.Row key={item.id}>
                    <DataTable.Cell>{item.ingredientsName}</DataTable.Cell>
                    <DataTable.Cell>{item.uom}</DataTable.Cell>
                    <DataTable.Cell>{item.quantity}</DataTable.Cell>
                  </DataTable.Row>
                ))}
              </DataTable>
            </Card>
            <View>
              <TouchableOpacity style={styles.button} onPress={handleSave}>
                <Text style={{ color: "white" }}>Save and Publish</Text>
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
    color: COLORS.PRIMARY_MEDIUM,
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
  card: {
    margin: 16,
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
