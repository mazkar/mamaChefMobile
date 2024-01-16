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

export default function TipsAndTrick({ navigation }) {
  const uid = useSelector((state) => state?.auth?.user?.UserId);
  const token = useSelector((state) => state.auth.token);
  const [isLoadingGet, setIsLoadingGet] = useState(false);
  const [dataTips, setDataTips] = useState([]);
  const [dataTipsSearch, setDataTipsSearch] = useState([]);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const [searchState, setSeacrchState] = useState(false);

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
  const [pageNume, setPageNum] = useState(1);
  async function getTips(userId, page) {
    setPageNum(pageNume + 1);
    console.log(searchQuery, "page num");
    const body = {
      pageSize: 10,
      currentPage: pageNume,
      isPhoto: false,
      isVideo: false,
      userId: userId,
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
    });
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
          {/* <View style={{ marginBottom: ms(16) }}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: "700",
                color: COLORS.PRIMARY_DARK,
              }}
            >
              Menu Kamu
            </Text>

            <View
              style={{
                backgroundColor: "black",
                borderBottomColor: COLORS.PRIMARY_DARK,
                borderBottomWidth: 4,
                width: 24,
              }}
            ></View>
          </View> */}
          <View>
            <View style={styles.continerSearch}>
              <Searchbar
                placeholder="Cari Tips"
                onChangeText={onChangeSearch}
                value={searchQuery}
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
          ) : (
            <ScrollView onMomentumScrollEnd={() => handleMomentumScrollEnd()}>
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
});
