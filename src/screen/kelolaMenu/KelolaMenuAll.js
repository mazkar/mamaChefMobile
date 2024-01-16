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
import CardMenuAll from "./components/CardMenuAll";
import _ from "lodash";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function KelolaMenuAll({ navigation }) {
  const uid = useSelector((state) => state?.auth?.user?.UserId);
  const token = useSelector((state) => state.auth.token);
  const [isLoadingGet, setIsLoadingGet] = useState(false);
  const [dataMenu, setDataMenu] = useState([]);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchState, setSeacrchState] = useState(false);
  const [dataMenuSearch, setDataMenuSearch] = useState([]);
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
  async function getMenuPagination(userId, page) {
    setPageNum(pageNume + 1);
    // console.log(pageNume, "page num");
    const body = {
      pageSize: 4,
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
      pageSize: 15,
      currentPage: 1,
      isPhoto: true,
      isVideo: false,
      userId: 0,
      keyword: searchQuery,
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
    sumAllData == dataMenu?.length ? null : getMenuPagination(0, 1);
    // Your custom logic here
  }, 1000);

  const handleReset = () => {
    setSeacrchState(false);
    setSearchQuery("");
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

  return (
    <ColorBgContainer>
      <RootContainer>
        <AppBar
          title="Rekomendasi Resep"
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
              Rekomendasi Resep
            </Text>
          </View>
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
                    onPress={() => getMenuPaginationSearch(0, 0)}
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
                  onPress={() => getMenuPaginationSearch(uid, 0)}
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
              {dataMenuSearch?.map((item) => (
                <>
                  <CardMenuAll
                    photoUrl={item?.photo}
                    namaMenu={item.menuName}
                    notes={item?.note}
                    menuId={item.menuId}
                    desc={item?.description}
                    onPressNav={onPressNav}
                    recipeBy={item?.recipeBy}
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
              onMomentumScrollEnd={() => handleMomentumScrollEnd()}
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
                    recipeBy={item?.recipeBy}
                  />
                  <Divider style={{ marginTop: ms(24) }} />
                  {/* {isLoading && (
                    <View style={{ padding: 16 }}>
                      <ActivityIndicator size="small" color="#0000ff" />
                    </View>
                  )} */}
                </>
              ))}
              {sumAllData === dataMenu?.length ? (
                <View style={{ alignSelf: "center", marginTop: ms(8) }}>
                  <Text style={{ fontWeight: "300", color: COLORS.GRAY_HARD }}>
                    Semua Menu Sudah di Tampilkan
                  </Text>
                </View>
              ) : (
                <></>
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
  },
});
