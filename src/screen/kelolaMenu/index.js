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

export default function KelolaMenu({ navigation }) {
  const uid = useSelector((state) => state?.auth?.user?.UserId);
  const token = useSelector((state) => state.auth.token);
  const [isLoadingGet, setIsLoadingGet] = useState(false);
  const [dataMenu, setDataMenu] = useState([]);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [isLoading, setIsLoading] = useState(false);

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
      userId: userId,
    };
    setIsLoadingGet(true);
    setIsLoading(false);
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

  const onChangeSearch = (query) => setSearchQuery(query);

  const onPressNav = (id) => {
    navigation.navigate("MenuDetail", { menuId: id });
  };

  useEffect(() => {
    // getMenu(uid);
    getMenuPagination(uid, 0);
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      // Do something when the screen is focused
      console.log("Screen is focused");
      getMenuPagination(uid, 0);
      // Add your logic here to update the component or fetch new data

      // Example: Refresh data or update components
    }, [])
  );

  const handleMomentumScrollEnd = _.debounce(() => {
    console.log("Scroll momentum ended");
    sumAllData == dataMenu?.length ? null : getMenuPagination(uid, 1);
    // Your custom logic here
  }, 1000);

  const renderFooter = () => {
    return isLoading ? (
      <ActivityIndicator
        style={{ marginVertical: 20 }}
        size="large"
        color={COLORS.PRIMARY_DARK}
      />
    ) : null;
  };

  return (
    <ColorBgContainer>
      <RootContainer>
        <AppBar title="Kelola Resep" dataTaskPending={[]} />

        <View style={styles.mainContainer}>
          <View style={{ marginBottom: ms(16) }}>
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
          </View>
          <View>
            <View style={styles.continerSearch}>
              <Searchbar
                placeholder="Cari Menu"
                onChangeText={onChangeSearch}
                value={searchQuery}
              />
            </View>
          </View>
          <View>
            <TouchableOpacity
              style={styles.btnAdd}
              onPress={() => navigation.navigate("TambahMenu")}
            >
              <Text style={{ color: "white", fontWeight: "700" }}>
                Tambah Menu
              </Text>
            </TouchableOpacity>
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
          <ScrollView
            // onMomentumScrollEnd={() =>
            //   sumAllData == dataMenu?.length ? null : getMenuPagination(uid, 1)
            // }
            onMomentumScrollEnd={() => handleMomentumScrollEnd()}
          >
            {dataMenu?.map((item) => (
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
                {isLoading && (
                  <View style={{ padding: 16 }}>
                    <ActivityIndicator size="small" color="#0000ff" />
                  </View>
                )}
              </>
            ))}
          </ScrollView>
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
    width: widthPercentageToDP(38),
    height: heightPercentageToDP(6),
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
  },
});
