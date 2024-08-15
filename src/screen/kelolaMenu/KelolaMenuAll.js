import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  Image,
} from "react-native";
import React, { useState, useCallback, useEffect } from "react";
import { useFocusEffect } from "@react-navigation/native";
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
import { ms, moderateScale } from "react-native-size-matters";
import {
  AppBar,
  GeneralButton,
  GeneralTextInput2,
  OverviewProgres,
  PopUpLoader,
} from "../../component/index";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import DropDownPicker from "react-native-dropdown-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
// iCONS
import FaIcons from "react-native-vector-icons/Ionicons";
import { resetReducer } from "../../store/models/auth/actions";
import { useDispatch, useSelector } from "react-redux";
import API from "../../utils/apiService";
import axios from "axios";
import { setUser } from "../../store/models/auth/actions";
import { baseUrl } from "../../utils/apiURL";
import CardMenuAll from "./components/CardMenuAll";
import _ from "lodash";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { setMenuCount } from "../../store/models/menu/action";
import moment from "moment";
import constants from "../../assets/constants/index.js";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function KelolaMenuAll({ navigation }) {
  const uid = useSelector((state) => state?.auth?.user?.UserId);
  const token = useSelector((state) => state.auth.token);
  const [isLoadingGet, setIsLoadingGet] = useState(false);
  const [dataMenu, setDataMenu] = useState([]);
  const [searchQuery, setSearchQuery] = React.useState("null");
  const [searchQueryCreator, setSearchQueryCreator] = React.useState("null");
  const [isLoading, setIsLoading] = useState(false);
  const [searchState, setSeacrchState] = useState(false);
  const [dataMenuSearch, setDataMenuSearch] = useState([]);
  const dispatch = useDispatch();
  const [modalSuccesVis, setModalSuccessVis] = useState(false);
  const [modalErroVis, setModalErrorVis] = useState(false);
  const [openDropDown, setOpenDropDown] = useState(false);
  const [openDropDownMember, setOpenDropDownMember] = useState(false);
  const [showSearchMenu, setShowSearchMenu] = useState(false);

  async function getMenu(userId) {
    setIsLoadingGet(true);
    try {
      let res = await axios({
        url: `${baseUrl.URL}api/Menu/menubyuserid/${userId}`,
        method: "get",
        timeout: 8000,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.status == 200) {
        // test for status you want, etc
        console.log(res.data, "meeeeeeeee");
        setDataMenu(res.data.data);
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

  const [pageSize, setPageSize] = useState(3);
  const [sumAllData, setAllSumData] = useState(0);
  const [pageNume, setPageNum] = useState(1);
  async function getMenuPagination(userId, page) {
    setPageNum(pageNume + 1);
    // console.log(pageNume, "page num");
    const body = {
      pageSize: 3,
      currentPage: pageNume,
      isPhoto: true,
      isVideo: false,
      userId: 0,
    };
    setIsLoadingGet(false);
    setIsLoading(true);
    try {
      let res = await axios({
        url: `${baseUrl.URL}api/Menu/getmenupagination`,
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
        console.log(res.data, "menu pagination");
        const newArray = [...dataMenu, ...res.data.data];
        setDataMenu(newArray);
        setIsLoading(false);
        setIsLoadingGet(false);
        setPageSize(pageSize + page);
        setAllSumData(parseInt(res.data.message));
        // console.log(res.data, "transit");
      }
      // Don't forget to return something
      return res.data;
    } catch (err) {
      console.error(err);
      setIsLoading(false);
    }
  }

  async function getMenuPaginationSearch(userId, page) {
    // setPageNum(pageNume + page);
    console.log(searchQuery, "page num");
    const body = {
      pageSize: 25,
      currentPage: 1,
      isPhoto: true,
      isVideo: false,
      userId: 0,
      keywordMenuName: searchQuery,
      keywordKreator: searchQueryCreator,
    };
    setIsLoadingGet(true);
    // setIsLoading(false);
    try {
      let res = await axios({
        url: `${baseUrl.URL}api/Menu/getmenupagination`,
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
        console.log(res.data, "menu pagination");
        // const newArray = [...dataMenu, ...res.data.data];
        setDataMenuSearch(res.data.data);
        setIsLoading(false);
        setIsLoadingGet(false);
        setSeacrchState(true);
        // setPageSize(pageSize);
        // setAllSumData(parseInt(res.data.message));
        // console.log(res.data, "transit");
      }
      // Don't forget to return something
      return res.data;
    } catch (err) {
      console.error(err);
      setIsLoading(false);
    }
  }

  async function getMenuPaginationSearchUser() {
    // setPageNum(pageNume + page);
    // console.log(searchQuery, "page num");

    setIsLoadingGet(true);
    // setIsLoading(false);
    try {
      let res = await axios({
        url: `${baseUrl.URL}api/Menu/menubyusername/${searchQuery}`,
        method: "GET",
        timeout: 20000,
        // data: body,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.status == 200) {
        // test for status you want, etc
        console.log(res.data, "menu pagination");
        // const newArray = [...dataMenu, ...res.data.data];
        setDataMenuSearch(res.data.data);
        setIsLoading(false);
        setIsLoadingGet(false);
        setSeacrchState(true);
        // setPageSize(pageSize);
        // setAllSumData(parseInt(res.data.message));
        // console.log(res.data, "transit");
      }
      // Don't forget to return something
      return res.data;
    } catch (err) {
      console.error(err);
      setIsLoading(false);
    }
  }

  const handleSearch = (uid, page) => {
    console.log(selectedIng);
    if (selectedIng === "Menu") {
      getMenuPaginationSearch(uid, page);
    } else {
      getMenuPaginationSearchUser();
    }
  };

  const onChangeSearch = (query) => setSearchQuery(query);
  const onChangeSearchCreator = (query) => setSearchQueryCreator(query);

  const onPressNav = (id) => {
    navigation.navigate("MenuDetail", { menuId: id, isEdit: false });
  };

  useEffect(() => {
    // getMenu(uid);
    getMenuPagination(0, 0);
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      // Do something when the screen is focused
      console.log("Screen is focused");
      getMenuPagination(0, 0);
      // Add your logic here to update the component or fetch new data

      // Example: Refresh data or update components
    }, [])
  );

  const handleMomentumScrollEnd = _.debounce(() => {
    console.log("Scroll momentum ended");
    sumAllData == dataMenu?.length || sumAllData <= dataMenu.length
      ? null
      : getMenuPagination(0, 1);
    // Your custom logic here
  }, 1000);

  const handleReset = () => {
    setSeacrchState(false);
    // setSearchQuery("");
    getMenuPagination(0, 1);
  };

  const RenderFooter = () => {
    return isLoading ? (
      <ActivityIndicator
        style={{ marginVertical: 20 }}
        size="large"
        color={COLORS.PRIMARY_DARK}
      />
    ) : null;
  };

  const handleLogut = () => {
    dispatch(resetReducer());
    navigation.reset({
      index: 0,
      routes: [{ name: "Login" }],
    });
  };

  async function getMenuInCarts(userId) {
    try {
      let res = await axios({
        url: `${baseUrl.URL}api/BucketIngredients/getshopingcartbyuserid/${userId}`,
        method: "get",
        timeout: 8000,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.status == 200) {
        // test for status you want, etc
        console.log(res.data, "shoping carts");
        // setDataMenu(res?.data?.data.length);
        dispatch(setMenuCount(res?.data?.data));

        // console.log(res.data, "transit");
      }
      // Don't forget to return something
      return res.data;
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    getMenuInCarts(uid);
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      // Do something when the screen is focused
      console.log("Screen is focused");

      getMenuInCarts(uid);

      // Add your logic here to update the component or fetch new data

      // Example: Refresh data or update components
    }, [])
  );

  async function insertMneuToChart(menuId, page, isPublish) {
    // console.log(isPublish, "isPublish");

    console.log(searchQuery, "page num");
    const body = {
      menuId: menuId,
      quantity: 1,
      reservedBy: parseInt(uid),
      reservedDate: moment().format("YYYY-MM-DD"),
      status: "booked",
    };
    // setIsLoadingGet(true);
    // setIsLoading(true);
    try {
      let res = await axios({
        url: `${baseUrl.URL}api/BucketIngredients/addmenutoshopingcart`,
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
        console.log(res.data, "menu pagination");
        getMenuInCarts(uid);
        setModalSuccessVis(true);
        // console.log(res.data, "transit");
      }
      // Don't forget to return something
      return res.data;
    } catch (err) {
      console.error(err);
      setIsLoading(false);
      setModalErrorVis(true);
    }
  }

  const hideModalSuccess = () => {
    setModalSuccessVis(false);

    // getTaskDetail(route.params.assignmentId);
  };

  const hideModalError = () => {
    setModalErrorVis(false);

    // getTaskDetail(route.params.assignmentId);
  };

  const [selectedIng, setSelectedIng] = useState("Menu");
  const [ddlIngridients, setDdlIngridients] = useState([]);

  const [isModalScheduleVisible, setIsmodalScheduleVisinle] = useState(false);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [selectedMenuId, setSelectedMenuId] = useState(null);
  const [ddlMember, setDdlMember] = useState([]);
  const [valueMemberId, setValueMemberId] = useState(null);
  const [modalSuccesVis2, setModalSuccessVis2] = useState(false);
  const [error, setError] = useState(false);
  const [errorItems, setErrorItem] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  const hideModalSuccess2 = () => {
    setModalSuccessVis2(false);

    setIsmodalScheduleVisinle(false);
    // getTaskDetail(route.params.assignmentId);
  };
  const showModalSchedule = (menuId, menuName) => {
    setIsmodalScheduleVisinle(true);
    setSelectedMenu(menuName);
    setSelectedMenuId(menuId);
    getData();
  };

  const hideModalSchedule = () => {
    setIsmodalScheduleVisinle(false);
    setOpenDropDownMember(false);
    setValueMemberId(null);
  };

  const showDatepicker = () => {
    setShowDatePicker(true);
  };

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === "ios");
    setDate(currentDate);

    // Convert the selected date to a string in a specific format
    const formattedDate = currentDate.toLocaleDateString("en-US"); // Adjust the locale as needed

    // Now, you can use the formattedDate as a string
    console.log("Selected Date:", formattedDate);

    // You can handle the selected date as needed
  };

  async function getData(id) {
    setIsLoadingGet(true);
    try {
      let res = await axios({
        url: `${baseUrl.URL}api/Member/membermobile/${uid}`,
        method: "get",
        timeout: 38000,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(res, "<===res data member");
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

  const handleAddSchedule = async () => {
    const body = {
      menuId: selectedMenuId,
      memberId: valueMemberId,
      userId: parseInt(uid),
      assignedDate: date,
    };
    console.log(body);

    // Check for null values
    let errorItems = [];
    if (!body.memberId && body.memberId != 0) errorItems.push("Member");
    if (!body.assignedDate) errorItems.push("Tanggal");

    if (errorItems.length > 0) {
      setError(true);
      setErrorItem(errorItems);
      setIsLoadingGet(false);
      setModalErrorVis(true);
      setIsmodalScheduleVisinle(false);
      setOpenDropDownMember(false);
      setErrorMessage(`${errorItems.join(", ")} wajib di Pilih!`);
      return;
    }
    console.log(body, "body");
    // setIsLoadingGet(true);
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
      if (res.status == 200) {
        console.log(res.data.data, "<= res");
        setIsLoadingGet(false);
        // dispatch(setUserId(res.data.data[0]?.userId));
        // getDataJadwal();
        setIsmodalScheduleVisinle(false);
        setModalSuccessVis2(true);
        setOpenDropDownMember(false);
        setValueMemberId(null);

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
      setIsmodalScheduleVisinle(false);
      setIsLoadingGet(false);
    }
  };

  const showMenuSearch = () => {
    setShowSearchMenu(true);
  };
  const hideMenuSearch = () => {
    setShowSearchMenu(false);
  };

  return (
    <ColorBgContainer>
      <RootContainer>
        <AppBar
          title="Semua Resep"
          dataTaskPending={[]}
          handleLogut={handleLogut}
          navigation={navigation}
        />

        <View style={styles.mainContainer}>
          <View style={{ marginBottom: ms(8), flexDirection: "row" }}>
            <Image source={require("../../assets/images/IconRekomen.png")} />
            <Text
              style={{
                fontSize: 16,
                fontWeight: "700",
                color: "gray",
                marginLeft: ms(4),
                alignSelf: "center",
              }}
            >
              Semua Resep
            </Text>
          </View>

          {showSearchMenu ? (
            <View>
              <View style={{ alignSelf: "flex-end" }}>
                <TouchableOpacity onPress={() => hideMenuSearch()}>
                  <Text style={{ color: COLORS.PRIMARY_DARK, fontSize: 15 }}>
                    Sembunyikan Pencarian Resep
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={styles.continerSearch}>
                <Searchbar
                  placeholder="Cari Resep"
                  onChangeText={onChangeSearch}
                  // placeholderTextColor={COLORS.PRIMARY_DARK}
                  inputStyle={{ color: COLORS.PRIMARY_DARK }}
                  style={{
                    // flexDirection: "row-reverse",
                    // paddingRight: ms(12),
                    // backgroundColor: "white",
                    flex: 1,
                  }}
                />
              </View>
              <View style={styles.continerSearch}>
                <Searchbar
                  placeholder="Cari Resep Kreator"
                  onChangeText={onChangeSearchCreator}
                  // placeholderTextColor={COLORS.PRIMARY_DARK}
                  inputStyle={{ color: COLORS.PRIMARY_DARK }}
                  style={{
                    color: COLORS.PRIMARY_DARK,
                    // flexDirection: "row-reverse",
                    // paddingRight: ms(12),
                    // backgroundColor: "white",
                    flex: 1,
                  }}
                />
              </View>
              <View
                style={{
                  // backgroundColor: "red",
                  alignSelf: "flex-end",
                  paddingHorizontal: 8,
                  marginTop: 12,
                }}
              >
                {searchState ? (
                  <View style={{ flexDirection: "row" }}>
                    <TouchableOpacity
                      style={{
                        backgroundColor: COLORS.PRIMARY_DARK,
                        paddingHorizontal: ms(32),
                        paddingVertical: 12,
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: ms(6),
                        marginLeft: ms(6),
                        flexDirection: "row",
                      }}
                      onPress={() => handleReset()}
                    >
                      <Text style={{ color: "white", fontSize: 16 }}>
                        Reset
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      disabled={searchQuery === ""}
                      style={{
                        backgroundColor: COLORS.PRIMARY_DARK,
                        paddingHorizontal: ms(32),
                        paddingVertical: 12,
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: ms(6),
                        marginLeft: ms(6),
                        flexDirection: "row",
                      }}
                      onPress={() => handleSearch(uid, 0)}
                    >
                      <Text style={{ color: "white", fontSize: 16 }}>
                        Cari Resep
                      </Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity
                    disabled={searchQuery === ""}
                    style={{
                      backgroundColor: COLORS.PRIMARY_DARK,
                      paddingHorizontal: ms(32),
                      paddingVertical: 12,
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: ms(6),
                      marginLeft: ms(6),
                      flexDirection: "row",
                    }}
                    onPress={() => handleSearch(uid, 0)}
                  >
                    <Text style={{ color: "white", fontSize: 16 }}>
                      Cari Resep
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ) : (
            <View style={{ alignSelf: "flex-end" }}>
              <TouchableOpacity onPress={() => showMenuSearch()}>
                <Text style={{ color: COLORS.PRIMARY_DARK, fontSize: 15 }}>
                  Pencarian Resep
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* <View
                style={{
                  backgroundColor: "black",
                  borderBottomColor: COLORS.PRIMARY_DARK,
                  borderBottomWidth: 4,
                  width: 24,
                }}
              />
            </View> */}
          {searchState ? (
            <ScrollView
            // onMomentumScrollEnd={() =>
            //   sumAllData == dataMenu?.length ? null : getMenuPagination(uid, 1)
            // }
            // onMomentumScrollEnd={() => handleMomentumScrollEnd()}
            >
              {dataMenuSearch?.map((item) => (
                <>
                  <CardMenuAll
                    photoUrl={item?.photo}
                    namaMenu={item.menuName}
                    notes={item?.note}
                    menuId={item.menuId}
                    desc={item?.description}
                    onPressNav={onPressNav}
                    recipeBy={item?.createBystr}
                    insertMneuToChart={insertMneuToChart}
                    showModalSchedule={showModalSchedule}
                  />
                  <Divider style={{ marginTop: ms(24) }} />
                  {/* {isLoading && (
                    <View style={{ padding: 16 }}>
                      <ActivityIndicator size="small" color="#0000ff" />
                    </View>
                  )} */}
                </>
              ))}
            </ScrollView>
          ) : (
            <ScrollView
            // onMomentumScrollEnd={() =>
            //   sumAllData == dataMenu?.length ? null : getMenuPagination(uid, 1)
            // }
            // onMomentumScrollEnd={() => handleMomentumScrollEnd()}
            >
              {dataMenu?.map((item) => (
                <>
                  <CardMenuAll
                    photoUrl={item?.photo}
                    namaMenu={item.menuName}
                    notes={item?.note}
                    menuId={item.menuId}
                    desc={item?.description}
                    onPressNav={onPressNav}
                    recipeBy={item?.createBystr}
                    insertMneuToChart={insertMneuToChart}
                    showModalSchedule={showModalSchedule}
                  />
                  <Divider style={{ marginTop: ms(24) }} />
                  {/* {isLoading && (
                    <View style={{ padding: 16 }}>
                      <ActivityIndicator size="small" color="#0000ff" />
                    </View>
                  )} */}
                </>
              ))}
              {sumAllData === dataMenu?.length ||
              sumAllData <= dataMenu.length ? (
                <View style={{ alignSelf: "center", marginTop: ms(8) }}>
                  <Text style={{ fontWeight: "300", color: COLORS.GRAY_HARD }}>
                    Semua Resep Sudah di Tampilkan
                  </Text>
                </View>
              ) : (
                <View style={{ alignSelf: "center", marginTop: ms(8) }}>
                  <TouchableOpacity
                    style={styles.buttonSee}
                    onPress={handleMomentumScrollEnd}
                  >
                    <Text style={{ color: "white" }}>
                      {" "}
                      Tampilkan Lebih Banyak Resep
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </ScrollView>
          )}
          {/* <FlatList
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listData} // center emptyData component
            // data={surveyOpen}
            data={dataMenu}
            ListFooterComponent={renderFooter}
            // onEndReached={
            //   sumAllData != dataMenu?.length ? getMenuPagination(uid, 2) : null
            // } // Callback when the end of the list is reached
            // onEndReachedThreshold={0.8}
            // horizontal={true}
            keyExtractor={(item) => item.menuId}
            renderItem={({ item, index }) => (
              <>
                <CardMenu
                  photoUrl={item?.photo}
                  namaMenu={item.menuName}
                  notes={item?.note}
                  menuId={item.menuId}
                  desc={item?.description}
                  onPressNav={onPressNav}
                />
                <Divider style={{ marginTop: ms(24) }} />
              </>
            )}
          /> */}
        </View>
        <RenderFooter />
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
              Menu Berhasil di Tambahkan ke Keranjang
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
            <Text style={styles.modalText}> {errorMessage}</Text>

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
              Kembali
            </GeneralButton>
          </View>
          {/* </View> */}
        </Modal>

        <Modal
          animationType="slide"
          transparent={true}
          visible={isModalScheduleVisible}
          onRequestClose={hideModalSchedule}
        >
          {/* <View style={styles.centeredView}> */}
          <View style={styles.containermodalView}>
            <View style={{ marginBottom: 32 }}>
              <Text
                style={{
                  color: COLORS.PRIMARY_DARK,
                  fontSize: 18,
                  fontWeight: "500",
                }}
              >
                Jadwalkan Resep
              </Text>
            </View>
            <View>
              <View style={styles.inputForm}>
                <Text style={styles.text}>Resep</Text>
                <GeneralTextInput2
                  // placeholder={moment(dataMember?.dateofBirth).format(
                  //   "DD-MMMM-YYYY"
                  // )}
                  placeholder={selectedMenu}
                  mode="outlined"
                  value={selectedMenu}
                  // onPress={showDatePicker}
                  // hasErrors={authFailed}
                  disabled
                  messageError="Wrong Username/Password"
                  // onChangeText={(e) => setValueNameLast(e)}
                  style={{
                    width: "100%",
                    height: 48,
                    color: COLORS.PRIMARY_DARK,
                  }}
                />
              </View>
              <View style={styles.inputForm}>
                <Text style={styles.text}>Member</Text>

                <DropDownPicker
                  placeholder="Pilih Member"
                  open={openDropDownMember}
                  value={valueMemberId}
                  zIndex={2}
                  items={ddlMember.map((e) => {
                    return {
                      label: e.name,
                      value: e.memberId,
                    };
                  })}
                  setItems={setDdlMember}
                  setOpen={setOpenDropDownMember}
                  setValue={setValueMemberId}
                  //   //   dropDownDirection="BOTTOM"
                  //   placeholderStyle={styles.dropDownText}
                  //   dropDownContainerStyle={styles.dropDownContainer}
                  // ArrowUpIconComponent={() => <ICONS.IconChevronUpArrow />}
                  // ArrowDownIconComponent={() => <ICONS.IconChevronDownArrow />}
                  listMode="SCROLLVIEW"
                  itemKey="ingredientsId"
                  label="name"
                  style={{ borderColor: COLORS.GRAY_SOFT }}
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

              <View>
                <Text style={styles.text}>Tanggal</Text>
                <View
                  style={{
                    // flex: 1,
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <GeneralTextInput2
                    // placeholder={moment(dataMember?.dateofBirth).format(
                    //   "DD-MMMM-YYYY"
                    // )}
                    placeholder={date.toLocaleDateString()}
                    mode="outlined"
                    value={date.toLocaleDateString()}
                    onPress={showDatePicker}
                    // hasErrors={authFailed}
                    disabled
                    messageError="Wrong Username/Password"
                    // onChangeText={(e) => setValueNameLast(e)}
                    style={{ width: "67%", height: 48 }}
                  />
                  <TouchableOpacity
                    onPress={showDatepicker}
                    style={{
                      backgroundColor: COLORS.PRIMARY_DARK,
                      borderRadius: 6,

                      width: "30%",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Text style={{ color: COLORS.WHITE }}>Pilih</Text>
                  </TouchableOpacity>
                  {showDatePicker && (
                    <DateTimePicker
                      testID="dateTimePicker"
                      value={date}
                      mode="datetime" // Change this to "date" for date-only picker
                      is24Hour={true}
                      display="default"
                      onChange={onChange}
                    />
                  )}
                </View>
              </View>
            </View>

            <View
              style={{
                flexDirection: "row",
                alignSelf: "flex-end",
                marginTop: 32,
              }}
            >
              <GeneralButton
                style={{
                  backgroundColor: COLORS.PRIMARY_MEDIUM,
                  marginRight: 4,
                }}
                mode="contained"
                onPress={hideModalSchedule}
              >
                Tutup
              </GeneralButton>
              <GeneralButton
                style={{ backgroundColor: COLORS.PRIMARY_DARK }}
                mode="contained"
                onPress={handleAddSchedule}
              >
                OK
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
    width: widthPercentageToDP(41),
    height: heightPercentageToDP(6),
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.PRIMARY_DARK,
    alignSelf: "flex-end",
    marginBottom: moderateScale(5),
    marginTop: moderateScale(5),
    marginTop: moderateScale(10),
  },
  continerSearch: {
    // paddingHorizontal: 8,
    // paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    paddingHorizontal: ms(8),
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
  text: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.PRIMARY_DARK,
  },
  buttonSee: {
    backgroundColor: COLORS.PRIMARY_DARK,
    borderWidth: 1,
    borderColor: COLORS.PRIMARY_DARK,
    paddingHorizontal: ms(16),
    paddingVertical: ms(10),
    borderRadius: 10,
    marginRight: ms(12),
  },
});
