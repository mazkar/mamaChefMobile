import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  StyleSheet,
  FlatList,
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
} from "react-native-paper";
import { ms } from "react-native-size-matters";
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

export default function Dashboard({ navigation }) {
  const dispatch = useDispatch();
  const [dataMenu, setDataMenu] = useState([]);
  const [searchQuery, setSearchQuery] = React.useState("");
  const uid = useSelector((state) => state?.auth?.user?.UserId);
  const token = useSelector((state) => state.auth.token);
  const [isLoadingGet, setIsLoadingGet] = useState(false);

  const onChangeSearch = (query) => setSearchQuery(query);

  const handleLogut = () => {
    dispatch(resetReducer());
    navigation.reset({
      index: 0,
      routes: [{ name: "Login" }],
    });
  };

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

  useEffect(() => {
    getMenu(uid);
  }, []);

  return (
    <ColorBgContainer>
      <RootContainer>
        <AppBar title="Dashboard" dataTaskPending={[]} />
        {/* <TouchableOpacity onPress={handleLogut}>
          <Text>Log Out</Text>
        </TouchableOpacity> */}
        <View style={styles.mainContainer}>
          <View style={styles.continerSearch}>
            <Searchbar
              placeholder="Cari Menu"
              onChangeText={onChangeSearch}
              value={searchQuery}
            />
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              paddingHorizontal: ms(12),
              marginTop: ms(20),
            }}
          >
            <View>
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
              />
            </View>
            <View>
              <TouchableOpacity
                onPress={() => navigation.navigate("KelolaMenu")}
              >
                <Text style={{ color: COLORS.PRIMARY_MEDIUM }}>
                  Lihat Semua (10)
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={{ padding: 16 }}>
            <FlatList
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listData} // center emptyData component
              // data={surveyOpen}
              data={dataMenu}
              horizontal={true}
              keyExtractor={(item) => item.menuId}
              renderItem={({ item, index }) => (
                <Card
                  style={{
                    borderRadius: 8,
                    width: ms(206),
                    height: ms(236),
                    marginLeft: ms(12),
                    borderTopStartRadius: 24,
                    borderTopEndRadius: 24,
                    backgroundColor: COLORS.WHITE,
                    paddingBottom: ms(32),
                  }}
                >
                  <Card.Cover
                    style={{
                      width: "auto",
                      height: "60%",
                      borderTopStartRadius: 24,
                      borderTopEndRadius: 24,
                    }}
                    source={{
                      uri: `data:image/jpeg;base64,${item?.photoURL}`,
                    }}
                  />
                  <Card.Content style={{ marginTop: ms(4), width: "100%" }}>
                    <Text style={{ fontSize: 16, fontWeight: "700" }}>
                      {item?.menuName}
                    </Text>
                    <Text style={{ fontSize: 12, fontWeight: "500" }}>
                      Deskripsi
                    </Text>
                    <Paragraph>{item?.description}</Paragraph>
                  </Card.Content>
                </Card>
              )}
            />
          </View>
        </View>
        <TouchableOpacity style={styles.button} onPress={handleLogut}>
          <Text style={{ color: COLORS.WHITE }}>Sign Out</Text>
        </TouchableOpacity>

        <PopUpLoader visible={isLoadingGet} />
      </RootContainer>
    </ColorBgContainer>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  continerSearch: {
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  button: {
    borderRadius: ms(10),
    width: widthPercentageToDP(95),
    height: heightPercentageToDP(7),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.PRIMARY_DARK,
    alignSelf: "center",
    marginBottom: ms(5),
    marginTop: ms(10),
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
  listData: { flexGrow: 1 },
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
});
