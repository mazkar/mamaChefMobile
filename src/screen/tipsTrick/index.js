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

export default function tipsAndTrick({ navigation }) {
  const uid = useSelector((state) => state?.auth?.user?.UserId);
  const token = useSelector((state) => state.auth.token);
  const [isLoadingGet, setIsLoadingGet] = useState(false);
  const [dataTips, setDataTips] = useState([]);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [errorMsg, setErrorMsg] = useState("");

  async function getTips(userId) {
    setIsLoadingGet(true);
    try {
      let res = await axios({
        url: `${baseUrl.URL}api/TipsTricks/gettipsandtrickall`,
        method: "get",
        timeout: 8000,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.status == 200) {
        // test for status you want, etc
        console.log(res, "meeeeeeeee");
        setDataTips(res.data.data);
        setIsLoadingGet(false);
        // console.log(res.data, "transit");
      }
      // Don't forget to return something
      return res.data;
    } catch (err) {
      console.error(err, "error fetch");

      setIsLoadingGet(false);
    }
  }

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

  return (
    <ColorBgContainer>
      <RootContainer>
        <AppBar title="Tips & Trick" dataTaskPending={[]} />

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
                Tulis Tips & Trick
              </Text>
            </TouchableOpacity>
          </View>

          <CardMenu
            // photoUrl={item?.photoURL}
            namaMenu="test"
            // notes={item?.note}
            desc="test"
          />
          {/* <View
                  style={{
                    backgroundColor: "black",
                    borderBottomColor: COLORS.PRIMARY_DARK,
                    borderBottomWidth: 4,
                    width: 24,
                  }}
                />
              </View> */}
          {/* <FlatList
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listData} // center emptyData component
            // data={surveyOpen}
            data={dataMenu}
            // horizontal={true}
            keyExtractor={(item) => item.menuId}
            renderItem={({ item, index }) => (
              <CardMenu
                photoUrl={item?.photoURL}
                namaMenu={item.menuName}
                notes={item?.note}
                desc={item?.description}
              />
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
