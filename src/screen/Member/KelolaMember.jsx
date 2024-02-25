import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  StyleSheet,
  Dimensions,
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
  Searchbar,
  Modal,
} from "react-native-paper";
import constants from "../../assets/constants/index.js";

import { ms, moderateScale } from "react-native-size-matters";
import {
  AppBar,
  GeneralButton,
  GeneralTextInput,
  OverviewProgres,
  PopUpLoader,
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
import { setUser } from "../../store/models/auth/actions";
import { baseUrl } from "../../utils/apiURL";
import CardMenu from "./Component/CardMenu";
import moment from "moment";
import { useFocusEffect } from "@react-navigation/native";
import PopUpConfirm from "./Component/PopUpConfirm";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import CardMenuToko from "./Component/CardMenuToko.jsx";

export default function KelolaMember({ navigation }) {
  const uid = useSelector((state) => state?.auth?.user?.UserId);
  const token = useSelector((state) => state.auth.token);
  const [isLoadingGet, setIsLoadingGet] = useState(false);
  const [dataMember, setDataMember] = useState([]);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selecteMemberId, setSelectedMemberId] = useState(0);
  const [selectedActive, setSelectedActive] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [modalSuccesVis, setModalSuccessVis] = useState(false);
  const [modalSuccesVis2, setModalSuccessVis2] = useState(false);
  const [modalErroVis, setModalErrorVis] = useState(false);
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "first", title: "Kelola Member" },
    { key: "second", title: "Kelola Tempat Belanja" },
  ]);

  const dispatch = useDispatch();

  async function getMember(userId) {
    setIsLoadingGet(true);
    try {
      let res = await axios({
        url: `${baseUrl.URL}api/Member/getmemberbyuserid/${uid}`,
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
        // console.log(res.data, "transit");
      }
      // Don't forget to return something
      return res.data;
    } catch (err) {
      console.error(err);
      setIsLoadingGet(false);
    }
  }

  const onChangeSearch = (query) => setSearchQuery(query);

  async function hadleUpdate(memberId, stat) {
    // setIsLoadingGet(true);
    const body = {
      memberId: memberId,
      isActive: stat,
    };

    console.log(body);

    try {
      console.log(body);
      let res = await axios({
        url: `${baseUrl.URL}api/Member/UpdateStatus`,
        method: "PUT",
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
        setIsLoadingGet(false);

        // setModalSuccessVis(true);
        getMember(uid);
        setModalSuccessVis(true);
        setSuccessMessage(res.data.message);
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

  useEffect(() => {
    getMember(uid);
  }, []);

  const handleLogut = () => {
    dispatch(resetReducer());
    navigation.reset({
      index: 0,
      routes: [{ name: "Login" }],
    });
  };

  useFocusEffect(
    React.useCallback(() => {
      // Do something when the screen is focused
      console.log("Screen is focused");
      getMember(uid);
      // Add your logic here to update the component or fetch new data

      // Example: Refresh data or update components
    }, [])
  );

  const hideModalError = () => {
    setModalErrorVis(false);

    // getTaskDetail(route.params.assignmentId);
  };

  const hideModalSuccess = () => {
    setModalSuccessVis(false);

    // handleNext(menuId);
    // getTaskDetail(route.params.assignmentId);
  };

  // Combine routes
  const initialLayout = { width: 360 };

  const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

  // Define your tabs
  const FirstRoute = () => (
    <View style={[styles.scene, { backgroundColor: "#ff4081" }]}>
      <Text style={styles.text}>First Tab</Text>
    </View>
  );

  const SecondRoute = () => (
    <View style={[styles.scene, { backgroundColor: "#673ab7" }]}>
      <Text style={styles.text}>Second Tab</Text>
    </View>
  );

  const renderScene = SceneMap({
    first: FirstRoute,
    second: SecondRoute,
  });

  // Kelola Tempat Belanja

  const [dataToko, setDataToko] = useState([]);
  const [isLoadingGet2, setIsLoadingGet2] = useState(false);
  const [modalAdd, setModalAdd] = useState(false);
  const [valueToko, setValueToko] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState(null);
  const [selectedId, setSelectedId] = useState(null);

  const showModalAdd = () => {
    setModalAdd(true);
  };

  const hideModaladd = () => {
    setModalAdd(false);
  };

  async function getToko(stat) {
    setIsLoadingGet2(true);
    try {
      let res = await axios({
        url: `${baseUrl.URL}api/Grocery/GetGrocery/${stat}`,
        method: "get",
        timeout: 8000,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.data.code == "200") {
        // test for status you want, etc
        console.log(res.data.data, "data toko");
        setDataToko(res.data.data);
        setIsLoadingGet2(false);
        // console.log(res.data, "transit");
      }
      // Don't forget to return something
      return res.data;
    } catch (err) {
      console.error(err);
      setIsLoadingGet2(false);
    }
  }

  async function handleAddtoko(memberId, stat) {
    // setIsLoadingGet(true);
    const body = {
      groceryName: valueToko,
      phoneNumber: phoneNumber,
      userId: 0,
    };

    console.log(body);

    try {
      console.log(body);
      let res = await axios({
        url: `${baseUrl.URL}api/Grocery/InsertGrocery`,
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
        setIsLoadingGet(false);

        // setModalSuccessVis(true);
        getToko("all");
        setModalSuccessVis(true);
        setSuccessMessage(res.data.message);
        setModalAdd(false);
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

  async function hadleUpdateToko(id, toko, hp, stat) {
    // setIsLoadingGet(true);
    const body = {
      greenGroceryId: id,
      groceryName: toko,
      phoneNumber: hp,
      status: stat,
    };

    console.log(body);

    try {
      console.log(body);
      let res = await axios({
        url: `${baseUrl.URL}api/Grocery/UpdateGrocery`,
        method: "PUT",
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
        setIsLoadingGet(false);

        // setModalSuccessVis(true);
        getToko("all");
        setModalSuccessVis(true);
        setSuccessMessage(res.data.message);
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

  useEffect(() => {
    getToko("all");
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      // Do something when the screen is focused
      console.log("Screen is focused");
      getToko("all");
      // Add your logic here to update the component or fetch new data

      // Example: Refresh data or update components
    }, [])
  );

  return (
    <ColorBgContainer>
      <RootContainer>
        <AppBar
          title="Kelola Member"
          dataTaskPending={[]}
          navigation={navigation}
          handleLogut={handleLogut}
        />

        <ScrollView style={styles.mainContainer}>
          <View style={{ marginBottom: ms(16) }}>
            <View>
              <TabView
                navigationState={{ index, routes }}
                renderScene={renderScene}
                onIndexChange={setIndex}
                initialLayout={initialLayout}
                renderTabBar={(props) => (
                  <TabBar
                    {...props}
                    indicatorStyle={{ backgroundColor: COLORS.PRIMARY_DARK }}
                    style={{ backgroundColor: "transaparant" }}
                    labelStyle={{ color: "grey", fontSize: 10 }}
                  />
                )}
              />
            </View>
            {index == 0 ? (
              <View style={{ marginTop: ms(32) }}>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "700",
                    color: "gray",
                  }}
                >
                  Daftar Member
                </Text>
                <View
                  style={{
                    backgroundColor: "black",
                    borderBottomColor: COLORS.PRIMARY_DARK,
                    borderBottomWidth: 4,
                    width: 24,
                  }}
                ></View>
                <View>
                  <TouchableOpacity
                    style={styles.btnAdd}
                    onPress={() => navigation.navigate("TambahMembers")}
                  >
                    <Text style={{ color: "white", fontWeight: "700" }}>
                      Tambah Member
                    </Text>
                  </TouchableOpacity>
                </View>
                <FlatList
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={styles.listData} // center emptyData component
                  // data={surveyOpen}
                  data={dataMember}
                  // horizontal={true}
                  keyExtractor={(item) => item.memberId}
                  renderItem={({ item, index }) => (
                    <CardMenu
                      photoUrl={item?.photoBase64}
                      namaMember={item.name}
                      noHp={item.phoneNumber}
                      notes={item?.note}
                      tglLahir={moment(item?.birthDate).format("YYYY-MMM-DD")}
                      address={item?.address}
                      isActive={item?.isActive}
                      setSelectedActive={setSelectedActive}
                      setSelectedMemberId={setSelectedMemberId}
                      handleUpdate={hadleUpdate}
                      memberId={item?.memberId}
                      name={item?.name}
                      userId={uid}
                    />
                  )}
                />
              </View>
            ) : (
              <View style={{ marginTop: ms(32) }}>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "700",
                    color: "gray",
                  }}
                >
                  Daftar Tempat Belanja
                </Text>
                <View
                  style={{
                    backgroundColor: "black",
                    borderBottomColor: COLORS.PRIMARY_DARK,
                    borderBottomWidth: 4,
                    width: 24,
                  }}
                ></View>
                <View>
                  <TouchableOpacity
                    style={styles.btnAdd}
                    onPress={() => showModalAdd()}
                  >
                    <Text style={{ color: "white", fontWeight: "700" }}>
                      Tambah
                    </Text>
                  </TouchableOpacity>
                </View>
                <FlatList
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={styles.listData} // center emptyData component
                  // data={surveyOpen}
                  data={dataToko}
                  // horizontal={true}
                  keyExtractor={(item) => item.memberId}
                  renderItem={({ item, index }) => (
                    <CardMenuToko
                      photoUrl={item?.photoBase64}
                      namaMember={item.groceryName}
                      noHp={item.phoneNumber}
                      notes={item?.note}
                      tglLahir={moment(item?.birthDate).format("YYYY-MMM-DD")}
                      address={item?.address}
                      isActive={item?.isActive}
                      setSelectedActive={setSelectedActive}
                      setSelectedMemberId={setSelectedMemberId}
                      handleUpdate={hadleUpdateToko}
                      memberId={item?.greenGroceryId}
                      name={item?.groceryName}
                      userId={uid}
                    />
                  )}
                />
              </View>
            )}
          </View>
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
            <Text style={styles.modalText}>
              {successMessage == null ? "Berhasil" : successMessage}
            </Text>
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

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalAdd}
          onRequestClose={hideModaladd}
        >
          {/* <View style={styles.centeredView}> */}
          <View style={styles.containermodalView}>
            <View>
              <View style={{ marginBottom: ms(22) }}>
                <Text style={{ fontSize: 18, color: "gray" }}>
                  Tambah Tempat Belanja
                </Text>
              </View>
              <View style={styles.inputForm}>
                {/* <Text style={styles.text}>Email</Text> */}

                <GeneralTextInput
                  placeholder="Nama Tempat Belanja"
                  mode="outlined"
                  // value={email}
                  title="Nama Tempat Belanja"
                  // hasErrors={authFailed}
                  messageError="Wrong Username/Password"
                  onChangeText={(e) => setValueToko(e)}
                />
              </View>
              <View style={styles.inputForm}>
                {/* <Text style={styles.text}>Email</Text> */}

                <GeneralTextInput
                  placeholder="Nomor HP (Whatsapp)"
                  mode="outlined"
                  keyboardType="numeric"
                  // value={email}
                  title="Nomor HP (Whatsapp)"
                  // hasErrors={authFailed}
                  messageError="Wrong Username/Password"
                  onChangeText={(e) => setPhoneNumber(e)}
                />
              </View>
            </View>

            <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
              <GeneralButton
                style={{
                  backgroundColor: COLORS.PRIMARY_DARK,
                  marginTop: ms(32),
                }}
                mode="contained"
                onPress={hideModaladd}
              >
                Kembali
              </GeneralButton>
              <GeneralButton
                style={{
                  backgroundColor: COLORS.PRIMARY_DARK,
                  marginTop: ms(32),
                  marginLeft: 8,
                }}
                mode="contained"
                onPress={handleAddtoko}
              >
                Tambah
              </GeneralButton>
            </View>
          </View>
          {/* </View> */}
        </Modal>
      </RootContainer>
      <PopUpLoader visible={isLoadingGet} />
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
    paddingHorizontal: ms(18),
    paddingVertical: ms(12),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.PRIMARY_DARK,
    alignSelf: "flex-end",
    marginBottom: moderateScale(5),
    marginTop: moderateScale(5),
    marginTop: moderateScale(10),
  },
  inputForm: {
    // paddingHorizontal: 8,
    // paddingVertical: 8,
    marginTop: ms(32),
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
