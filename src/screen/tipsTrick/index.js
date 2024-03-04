import {
  View,
  Text,
  TouchableOpacity,
  RefreshControl,
  StyleSheet,
  FlatList,
  ScrollView,
  Image,
  ActivityIndicator,
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
} from "react-native-paper";
import { ms, moderateScale } from "react-native-size-matters";
import {
  AppBar,
  GeneralButton,
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
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import _ from "lodash";
import CardMenu from "./components/CardMenu";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const tabFilter = [
  { id: 1, type: "all", label: "Semua Tips" },
  { id: 2, type: "userId", label: "Tips Saya" },
  { id: 3, type: "draft", label: "Draft tips" },
];

export default function TipsAndTrick({ navigation }) {
  const uid = useSelector((state) => state?.auth?.user?.UserId);
  const token = useSelector((state) => state.auth.token);
  const [isLoadingGet, setIsLoadingGet] = useState(false);
  const [dataTips, setDataTips] = useState([]);
  const [dataTipsUid, setDataTipsUid] = useState([]);
  const [dataTipsDraft, setDataTipsDraft] = useState([]);
  const [dataTipsSearch, setDataTipsSearch] = useState([]);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const [searchState, setSeacrchState] = useState(false);
  const [selecteTab, setSelectedTab] = useState("all");

  // async function getTips(userId) {
  //   setIsLoadingGet(true);
  //   try {
  //     let res = await axios({
  //       url: `${baseUrl.URL}api/TipsTricks/gettipsandtrickbystatus/true`,
  //       method: "get",
  //       timeout: 8000,
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });
  //     if (res.status == 200) {
  //       // test for status you want, etc
  //       console.log(res, "meeeeeeeee");
  //       setDataTips(res.data.data);
  //       setIsLoadingGet(false);
  //       // console.log(res.data, "transit");
  //     }
  //     // Don't forget to return something
  //     return res.data;
  //   } catch (err) {
  //     console.error(err, "error fetch");

  //     setIsLoadingGet(false);
  //   }
  // }

  const [pageSize, setPageSize] = useState(3);
  const [sumAllData, setAllSumData] = useState(0);
  const [sumAllDataUid, setAllSumDataUid] = useState(0);
  const [sumAllDataDraft, setAllSumDataDraft] = useState(0);
  const [pageNume, setPageNum] = useState(1);
  async function getTips(userId, page) {
    setPageNum(pageNume + 1);
    console.log(searchQuery, "page num");
    const body = {
      pageSize: 15,
      currentPage: pageNume,
      isPhoto: false,
      isVideo: false,
      userId: 0,
      // keyword: "garpit",
    };
    setIsLoadingGet(true);
    setIsLoading(true);
    try {
      let res = await axios({
        url: `${baseUrl.URL}api/TipsTricks/gettipsandtrickall`,
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
        const newArray = [...dataTips, ...res.data.data];
        setDataTips(newArray);
        setIsLoading(false);
        setIsLoadingGet(false);
        setPageSize(pageSize);
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
  async function getTipsDraft(userId, page) {
    setPageNum(pageNume + 1);
    console.log(searchQuery, "page num");
    const body = {
      pageSize: 15,
      currentPage: pageNume,
      isPhoto: false,
      isVideo: false,
      status: false,
      userId: parseInt(userId),
      // keyword: "garpit",
    };
    setIsLoadingGet(true);
    setIsLoading(true);
    try {
      let res = await axios({
        url: `${baseUrl.URL}api/TipsTricks/gettipsandtrickall`,
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
        const newArray = [...dataTipsDraft, ...res.data.data];
        setDataTipsDraft(newArray);
        setIsLoading(false);
        setIsLoadingGet(false);
        setPageSize(pageSize);
        setAllSumDataDraft(parseInt(res.data.message));
        // console.log(res.data, "transit");
      }
      // Don't forget to return something
      return res.data;
    } catch (err) {
      console.error(err);
      setIsLoading(false);
    }
  }

  async function getTipsUid(userId, page) {
    setPageNum(pageNume + 1);
    console.log(searchQuery, "page num");
    const body = {
      pageSize: 15,
      currentPage: pageNume,
      isPhoto: false,
      isVideo: false,
      status: true,
      userId: parseInt(userId),
      // keyword: "garpit",
    };
    setIsLoadingGet(true);
    setIsLoading(true);
    try {
      let res = await axios({
        url: `${baseUrl.URL}api/TipsTricks/gettipsandtrickall`,
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
        const newArray = [...dataTipsUid, ...res.data.data];
        setDataTipsUid(newArray);
        setIsLoading(false);
        setIsLoadingGet(false);
        setPageSize(pageSize);
        setAllSumDataUid(parseInt(res.data.message));
        // console.log(res.data, "transit");
      }
      // Don't forget to return something
      return res.data;
    } catch (err) {
      console.error(err);
      setIsLoading(false);
    }
  }

  async function getTipsSearch(userId, page) {
    setPageNum(pageNume + 1);
    console.log(searchQuery, "page num");
    const body = {
      pageSize: 15,
      currentPage: 1,
      isPhoto: false,
      isVideo: false,
      userId: 0,
      keyword: searchQuery,
    };
    setIsLoadingGet(true);
    setIsLoading(true);
    try {
      let res = await axios({
        url: `${baseUrl.URL}api/TipsTricks/gettipsandtrickall`,
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
        // console.log(res.data, "menu pagination");
        // const newArray = [...dataTips, ...res.data.data];
        setDataTipsSearch(res.data.data);
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

  const onPressDetail = (id, name, description) => {
    navigation.navigate("DetailTips", {
      id: id,
      name: name,
      desc: description,
      tab: selecteTab,
    });
    setSelectedTab("all");
  };

  const onChangeSearch = (query) => setSearchQuery(query);

  useEffect(() => {
    getTips();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      // Do something when the screen is focused
      // console.log("Screen is focused");
      getTips();
      // Add your logic here to update the component or fetch new data

      // Example: Refresh data or update components
    }, [])
  );
  const handleLogut = () => {
    dispatch(resetReducer());
    navigation.reset({
      index: 0,
      routes: [{ name: "Login" }],
    });
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

  const handleMomentumScrollEnd = _.debounce(() => {
    console.log("Scroll momentum ended");
    sumAllData == dataTips?.length ? null : getTips(uid, 1);
    // Your custom logic here
  }, 1500);

  const handleReset = () => {
    setSeacrchState(false);
    setSearchQuery("");
    getTips(uid, 1);
    setDataTipsSearch([]);
  };

  const handleChangeTab = (tab) => {
    setSelectedTab(tab.type);
    if (tab.type == "all") {
      getTips(0, 1);
      setPageNum(1);
      setDataTipsUid([]);
      setDataTipsDraft([]);
    } else if (tab.type == "userId") {
      getTipsUid(uid, 1);
      setPageNum(1);
      setDataTips([]);
      setDataTipsDraft([]);
    } else if (tab.type == "draft") {
      getTipsDraft(uid, 1);
      setPageNum(1);
      setDataTipsUid([]);
      setDataTips([]);
    }
  };

  return (
    <ColorBgContainer>
      <RootContainer>
        <AppBar
          title="Tips & Trick"
          dataTaskPending={[]}
          navigation={navigation}
          handleLogut={handleLogut}
        />

        <View style={styles.mainContainer}>
          <View style={{ flexDirection: "row", marginBottom: ms(32) }}>
            {tabFilter?.map((e) => (
              <TouchableOpacity
                style={
                  e.type == selecteTab ? styles.tabActive : styles.tabInactive
                }
                onPress={() => handleChangeTab(e)}
              >
                <Text
                  style={
                    e.type == selecteTab
                      ? { color: "white" }
                      : { color: COLORS.PRIMARY_DARK }
                  }
                >
                  {e.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View>
            <View style={styles.continerSearch}>
              <Searchbar
                placeholder="Cari Tips"
                onChangeText={onChangeSearch}
                value={searchQuery}
                style={{
                  backgroundColor: "white",
                  borderWidth: 1,
                  borderColor: COLORS.PRIMARY_DARK,
                  // flexDirection: "row-reverse",
                  // paddingRight: ms(12),
                  flex: 1,
                }}
              />
              {searchState ? (
                <>
                  <TouchableOpacity
                    style={{
                      width: widthPercentageToDP(14),
                      backgroundColor: COLORS.PRIMARY_DARK,
                      height: heightPercentageToDP(7),
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: ms(6),
                      marginLeft: ms(6),
                      flexDirection: "row",
                    }}
                    onPress={() => handleReset()}
                  >
                    <MaterialCommunityIcons
                      name="close"
                      size={24}
                      color="white"
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      width: widthPercentageToDP(14),
                      backgroundColor: COLORS.PRIMARY_DARK,
                      height: heightPercentageToDP(7),
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: ms(6),
                      marginLeft: ms(6),
                      flexDirection: "row",
                    }}
                    onPress={() => getTipsSearch(uid, 0)}
                  >
                    <MaterialCommunityIcons
                      name="magnify"
                      size={24}
                      color="white"
                    />
                  </TouchableOpacity>
                </>
              ) : (
                <TouchableOpacity
                  style={{
                    width: widthPercentageToDP(14),
                    backgroundColor: COLORS.PRIMARY_DARK,
                    height: heightPercentageToDP(7),
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: ms(6),
                    marginLeft: ms(6),
                    flexDirection: "row",
                  }}
                  onPress={() => getTipsSearch(uid, 0)}
                >
                  <MaterialCommunityIcons
                    name="magnify"
                    size={24}
                    color="white"
                  />
                </TouchableOpacity>
              )}
            </View>
          </View>
          <View>
            <TouchableOpacity
              style={styles.btnAdd}
              onPress={() => navigation.navigate("TambahTips")}
            >
              <FontAwesome
                name="pencil-square-o"
                size={11}
                style={{
                  fontSize: 18,
                  color: COLORS.WHITE,
                  marginRight: ms(4),
                }}
              />
              <Text style={{ color: "white", fontWeight: "700" }}>
                Tulis Tips & Trick
              </Text>
            </TouchableOpacity>
          </View>

          {searchState ? (
            <ScrollView
              // onMomentumScrollEnd={() =>
              //   sumAllData == dataMenu?.length ? null : getMenuPagination(uid, 1)
              // }
              onMomentumScrollEnd={() => handleMomentumScrollEnd()}
            >
              {dataTipsSearch?.map((item) => (
                <>
                  <CardMenu
                    // photoUrl={item?.photoURL}
                    namaMenu={item.name}
                    // notes={item?.note}
                    id={item.tipstrickid}
                    onPressDetail={onPressDetail}
                    desc={item?.description}
                    selectedId={selectedId}
                    setSelectedId={setSelectedId}
                  />
                  <Divider />
                </>
              ))}
            </ScrollView>
          ) : selecteTab == "all" ? (
            <ScrollView>
              {dataTips?.map((item) => (
                <>
                  <CardMenu
                    // photoUrl={item?.photoURL}
                    namaMenu={item.name}
                    // notes={item?.note}
                    id={item.tipstrickid}
                    onPressDetail={onPressDetail}
                    desc={item?.description}
                    selectedId={selectedId}
                    setSelectedId={setSelectedId}
                  />
                  <Divider />
                </>
              ))}
              {sumAllData == dataTips?.length ? null : (
                <View style={{ marginTop: ms(18) }}>
                  <TouchableOpacity
                    onPress={() => getTips(uid, 1)}
                    style={{
                      justifyContent: "center",
                      alignSelf: "center",
                      flex: 1,
                      backgroundColor: "blue",
                      backgroundColor: COLORS.PRIMARY_DARK,
                      paddingHorizontal: ms(8),
                      paddingVertical: ms(8),
                      borderRadius: 10,
                    }}
                  >
                    <Text style={{ color: "white" }}>Lihat Lebih Banyak</Text>
                  </TouchableOpacity>
                </View>
              )}
            </ScrollView>
          ) : selecteTab == "userId" ? (
            <ScrollView>
              {dataTipsUid?.map((item) => (
                <>
                  <CardMenu
                    // photoUrl={item?.photoURL}
                    namaMenu={item.name}
                    // notes={item?.note}
                    id={item.tipstrickid}
                    onPressDetail={onPressDetail}
                    desc={item?.description}
                    selectedId={selectedId}
                    setSelectedId={setSelectedId}
                  />
                  <Divider />
                </>
              ))}
              {sumAllDataUid == dataTipsUid?.length ? null : (
                <View style={{ marginTop: ms(18) }}>
                  <TouchableOpacity
                    onPress={() => getTipsUid(uid, 1)}
                    style={{
                      justifyContent: "center",
                      alignSelf: "center",
                      flex: 1,
                      backgroundColor: "blue",
                      backgroundColor: COLORS.PRIMARY_DARK,
                      paddingHorizontal: ms(8),
                      paddingVertical: ms(8),
                      borderRadius: 10,
                    }}
                  >
                    <Text style={{ color: "white" }}>Lihat Lebih Banyak</Text>
                  </TouchableOpacity>
                </View>
              )}
            </ScrollView>
          ) : (
            <ScrollView>
              {dataTipsDraft?.map((item) => (
                <>
                  <CardMenu
                    // photoUrl={item?.photoURL}
                    namaMenu={item.name}
                    // notes={item?.note}
                    id={item.tipstrickid}
                    onPressDetail={onPressDetail}
                    desc={item?.description}
                    selectedId={selectedId}
                    setSelectedId={setSelectedId}
                  />
                  <Divider />
                </>
              ))}
              {sumAllDataDraft == dataTipsDraft?.length ? null : (
                <View style={{ marginTop: ms(18) }}>
                  <TouchableOpacity
                    onPress={() => getTipsDraft(uid, 1)}
                    style={{
                      justifyContent: "center",
                      alignSelf: "center",
                      flex: 1,
                      backgroundColor: "blue",
                      backgroundColor: COLORS.PRIMARY_DARK,
                      paddingHorizontal: ms(8),
                      paddingVertical: ms(8),
                      borderRadius: 10,
                    }}
                  >
                    <Text style={{ color: "white" }}>Lihat Lebih Banyak</Text>
                  </TouchableOpacity>
                </View>
              )}
            </ScrollView>
          )}

          <RenderFooter />
        </View>
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
    width: widthPercentageToDP(42),
    height: heightPercentageToDP(6),
    justifyContent: "center",
    flexDirection: "row",
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
  },
  tabInactive: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: COLORS.PRIMARY_DARK,
    paddingHorizontal: ms(16),
    paddingVertical: ms(6),
    borderRadius: 10,
    marginRight: ms(12),
  },
  tabActive: {
    backgroundColor: COLORS.PRIMARY_DARK,
    borderWidth: 1,
    borderColor: COLORS.PRIMARY_DARK,
    paddingHorizontal: ms(16),
    paddingVertical: ms(6),
    borderRadius: 10,
    marginRight: ms(12),
  },
});

