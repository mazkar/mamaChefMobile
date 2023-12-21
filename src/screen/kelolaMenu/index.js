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
import CardMenu from "./components/CardMenu";
import _ from "lodash";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Tab } from "@rneui/themed";

export default function KelolaMenu({ navigation }) {
  const uid = useSelector((state) => state?.auth?.user?.UserId);
  const token = useSelector((state) => state.auth.token);
  const [isLoadingGet, setIsLoadingGet] = useState(false);
  const [dataMenu, setDataMenu] = useState([]);
  const [dataMenuNyPublish, setDataMenuNyPublish] = useState([]);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchState, setSeacrchState] = useState(false);
  const [dataMenuSearch, setDataMenuSearch] = useState([]);
  const [index, setIndex] = React.useState(0);
  const [valueIsPublish, setValueIsPublish] = useState(true);
  const dispatch = useDispatch();

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
  async function getMenuPagination(userId, page, isPublish) {
    console.log(isPublish, "isPublish");
    setPageNum(pageNume + 1);
    console.log(searchQuery, "page num");
    const body = {
      pageSize: 3,
      currentPage: pageNume,
      isPhoto: true,
      isVideo: false,
      userId: userId,
      status: true,
      // keyword: "garpit",
    };
    setIsLoadingGet(true);
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

  const [pageSizeNyPulish, setPageSizeNyPulish] = useState(3);
  const [sumAllDataNyPulish, setAllSumDataNyPulish] = useState(0);
  const [pageNumeNyPulish, setPageNumNyPulish] = useState(1);
  async function getMenuPaginationNyPulish(userId, page, isPublish) {
    // console.log(isPublish, "isPublish");
    setPageNumNyPulish(pageNumeNyPulish + 1);
    console.log(searchQuery, "page num");
    const body = {
      pageSize: 4,
      currentPage: pageNumeNyPulish,
      isPhoto: true,
      isVideo: false,
      userId: userId,
      status: false,
      // keyword: "garpit",
    };
    setIsLoadingGet(true);
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
        const newArray = [...dataMenuNyPublish, ...res.data.data];

        setDataMenuNyPublish(newArray);

        setIsLoading(false);
        setIsLoadingGet(false);
        setPageSize(pageSize);
        setAllSumDataNyPulish(parseInt(res.data.message));
        // console.log(res.data, "transit");
      }
      // Don't forget to return something
      return res.data;
    } catch (err) {
      console.error(err);
      setIsLoading(false);
    }
  }

  async function getMenuPaginationSearch(userId, page, isPublish) {
    // setPageNum(pageNume + page);
    console.log(searchQuery, "page num");
    const body = {
      pageSize: 15,
      currentPage: 1,
      isPhoto: true,
      isVideo: false,
      userId: userId,
      keyword: searchQuery,
      status: isPublish,
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

  const onChangeSearch = (query) => setSearchQuery(query);

  const onPressNav = (id, isEdit) => {
    navigation.navigate("MenuDetail", { menuId: id, isEdit: true });
  };

  useEffect(() => {
    // getMenu(uid);
    getMenuPagination(uid, 0, valueIsPublish);
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      // Do something when the screen is focused
      console.log("Screen is focused");

      getMenuPagination(uid, 0);

      getMenuPaginationNyPulish(uid, 0);

      // Add your logic here to update the component or fetch new data

      // Example: Refresh data or update components
    }, [])
  );

  useEffect(() => {
    const handleBlur = () => {
      // Do something when the screen loses focus
      setDataMenu([]);
      setDataMenuNyPublish([]);
      setPageNumNyPulish(1);
      setPageNum(1);
      // Add your logic here to handle blur events
    };

    const unsubscribe = navigation.addListener("blur", handleBlur);

    return () => {
      // Cleanup function for when the component unmounts
      unsubscribe();
    };
  }, [navigation]);

  const handleMomentumScrollEnd = _.debounce(() => {
    console.log("Scroll momentum ended");
    sumAllData == dataMenu?.length
      ? null
      : getMenuPagination(uid, 1, valueIsPublish);
    // Your custom logic here
  }, 1000);

  const handleMomentumScrollEndNyPulish = _.debounce(() => {
    console.log("Scroll momentum ended");
    sumAllDataNyPulish == dataMenuNyPublish?.length
      ? null
      : getMenuPaginationNyPulish(uid, 1, valueIsPublish);
    // Your custom logic here
  }, 1000);

  const RenderFooter = () => {
    return isLoading ? (
      <ActivityIndicator
        style={{ marginVertical: 20 }}
        size="large"
        color={COLORS.PRIMARY_DARK}
      />
    ) : null;
  };

  const handleReset = () => {
    setSeacrchState(false);
    setSearchQuery("");
    getMenuPagination(uid, 1, valueIsPublish);
  };

  const handlerDoneTab = (val) => {
    console.log(index);
    if (val === 0) {
      getMenuPagination(uid, 1, true);
      setValueIsPublish(true);
    } else {
      // setDataMenuNyPublish([]);

      getMenuPaginationNyPulish(uid, 1, false);
      setValueIsPublish(false);

      console.log("tab 1");
    }
    setIndex(val);
  };

  const handleLogut = () => {
    dispatch(resetReducer());
    navigation.reset({
      index: 0,
      routes: [{ name: "Login" }],
    });
  };

  return (
    <ColorBgContainer>
      <RootContainer>
        <AppBar
          title="Kelola Resep"
          dataTaskPending={[]}
          handleLogut={handleLogut}
          navigation={navigation}
        />

        <View style={styles.mainContainer}>
          <View style={{ marginBottom: ms(16) }}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: "700",
                color: "gray",
              }}
            >
              Resep Kamu
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
              onMomentumScrollEnd={() => handleMomentumScrollEnd()}
            >
              <View>
                <View style={styles.continerSearch}>
                  <Searchbar
                    placeholder="Cari Resep"
                    onChangeText={onChangeSearch}
                    value={searchQuery}
                    // icon={() => (
                    //   <TouchableOpacity
                    //     style={{
                    //       padding: ms(8),
                    //       borderRadius: ms(0),
                    //     }}
                    //   >
                    //     <MaterialCommunityIcons
                    //       name="close"
                    //       size={24}
                    //       color="black"
                    //     />
                    //   </TouchableOpacity>
                    // )}
                    style={{
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
                        onPress={() => getMenuPaginationSearch(uid, 0, true)}
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
                      onPress={() =>
                        getMenuPaginationSearch(uid, 0, valueIsPublish)
                      }
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
              {dataMenuSearch?.map((item) => (
                <>
                  <CardMenu
                    photoUrl={item?.photo}
                    namaMenu={item.menuName}
                    notes={item?.note}
                    menuId={item.menuId}
                    desc={item?.description}
                    onPressNav={onPressNav}
                    isPublish={valueIsPublish}
                  />
                  <Divider style={{ marginTop: ms(24) }} />
                  {isLoading && (
                    <View style={{ padding: 16 }}>
                      <ActivityIndicator size="small" color="#0000ff" />
                    </View>
                  )}
                </>
              ))}
            </ScrollView>
          ) : (
            <>
              <View
                style={{
                  height: ms(63),
                  marginTop: ms(24),
                  // elevation: 1,
                  // borderColor: Platform.OS === "ios" ? COLORS.GRAY_MEDIUM : null,
                }}
              >
                <Tab
                  disableIndicator={true}
                  value={index}
                  onChange={handlerDoneTab}
                  dense
                >
                  <Tab.Item
                    containerStyle={(active) => ({
                      paddingVertical: 8,
                      backgroundColor: active
                        ? COLORS.PRIMARY_DARK
                        : COLORS.WHITE,
                      borderRadius: 16,
                      width: ms(12),
                    })}
                    titleStyle={(active) => ({
                      color: active ? COLORS.WHITE : "black",
                      fontSize: 11,
                      textDecorationLine: active ? "underline" : "none",
                    })}
                  >
                    {`Resep Ter-Publish`}
                  </Tab.Item>
                  <Tab.Item
                    containerStyle={(active) => ({
                      paddingVertical: 8,
                      backgroundColor: active
                        ? COLORS.PRIMARY_DARK
                        : COLORS.WHITE,
                      borderRadius: 16,
                      width: ms(12),
                    })}
                    titleStyle={(active) => ({
                      color: active ? COLORS.WHITE : "black",
                      fontSize: 11,
                      textDecorationLine: active ? "underline" : "none",
                    })}
                  >{`Resep Belum Ter-Publish`}</Tab.Item>
                </Tab>
              </View>
              {index === 0 ? (
                <ScrollView
                  // onMomentumScrollEnd={() =>
                  //   sumAllData == dataMenu?.length ? null : getMenuPagination(uid, 1)
                  // }
                  onMomentumScrollEnd={() => handleMomentumScrollEnd()}
                >
                  <View>
                    <View style={styles.continerSearch}>
                      <Searchbar
                        placeholder="Cari Resep"
                        onChangeText={onChangeSearch}
                        value={searchQuery}
                        // icon={() => (
                        //   <TouchableOpacity
                        //     style={{
                        //       padding: ms(8),
                        //       borderRadius: ms(0),
                        //     }}
                        //   >
                        //     <MaterialCommunityIcons
                        //       name="close"
                        //       size={24}
                        //       color="black"
                        //     />
                        //   </TouchableOpacity>
                        // )}
                        style={{
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
                            onPress={() =>
                              getMenuPaginationSearch(uid, 0, true)
                            }
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
                          onPress={() =>
                            getMenuPaginationSearch(uid, 0, valueIsPublish)
                          }
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
                      onPress={() => navigation.navigate("TambahMenu")}
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
                        Tambah Resep
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {dataMenu?.map((item) => (
                    <>
                      <CardMenu
                        photoUrl={item?.photo}
                        namaMenu={item.menuName}
                        notes={item?.note}
                        menuId={item.menuId}
                        desc={item?.description}
                        onPressNav={onPressNav}
                        isPublish={valueIsPublish}
                      />
                      <Divider style={{ marginTop: ms(24) }} />
                      {isLoading && (
                        <View style={{ padding: 16 }}>
                          <ActivityIndicator size="small" color="#0000ff" />
                        </View>
                      )}
                    </>
                  ))}
                  {sumAllData === dataMenu?.length ? (
                    <View style={{ alignSelf: "center", marginTop: ms(8) }}>
                      <Text
                        style={{ fontWeight: "300", color: COLORS.GRAY_HARD }}
                      >
                        Semua Menu Sudah di Tampilkan
                      </Text>
                    </View>
                  ) : (
                    <></>
                  )}
                </ScrollView>
              ) : (
                <ScrollView
                  // onMomentumScrollEnd={() =>
                  //   sumAllData == dataMenu?.length ? null : getMenuPagination(uid, 1)
                  // }
                  onMomentumScrollEnd={() => handleMomentumScrollEndNyPulish()}
                >
                  <View>
                    <View style={styles.continerSearch}>
                      <Searchbar
                        placeholder="Cari Resep"
                        onChangeText={onChangeSearch}
                        value={searchQuery}
                        // icon={() => (
                        //   <TouchableOpacity
                        //     style={{
                        //       padding: ms(8),
                        //       borderRadius: ms(0),
                        //     }}
                        //   >
                        //     <MaterialCommunityIcons
                        //       name="close"
                        //       size={24}
                        //       color="black"
                        //     />
                        //   </TouchableOpacity>
                        // )}
                        style={{
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
                            onPress={() =>
                              getMenuPaginationSearch(uid, 0, valueIsPublish)
                            }
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
                          onPress={() => getMenuPaginationSearch(uid, 0, false)}
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
                  {dataMenuNyPublish?.map((item) => (
                    <>
                      <CardMenu
                        photoUrl={item?.photo}
                        namaMenu={item.menuName}
                        notes={item?.note}
                        menuId={item.menuId}
                        desc={item?.description}
                        onPressNav={onPressNav}
                        isPublish={valueIsPublish}
                        isEdit={true}
                      />
                      <Divider style={{ marginTop: ms(24) }} />
                      {isLoading && (
                        <View style={{ padding: 16 }}>
                          <ActivityIndicator size="small" color="#0000ff" />
                        </View>
                      )}
                    </>
                  ))}
                  {sumAllData === dataMenu?.length ? (
                    <View style={{ alignSelf: "center", marginTop: ms(8) }}>
                      <Text
                        style={{ fontWeight: "300", color: COLORS.GRAY_HARD }}
                      >
                        Semua Menu Sudah di Tampilkan
                      </Text>
                    </View>
                  ) : (
                    <></>
                  )}
                </ScrollView>
              )}
            </>
          )}
          <RenderFooter />

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
    flexDirection: "row",
    alignItems: "center",
  },
});
