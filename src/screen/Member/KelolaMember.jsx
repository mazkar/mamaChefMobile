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
import CardMenu from "./Component/CardMenu";
import moment from "moment";
import { useFocusEffect } from "@react-navigation/native";

export default function KelolaMember({ navigation }) {
  const uid = useSelector((state) => state?.auth?.user?.UserId);
  const token = useSelector((state) => state.auth.token);
  const [isLoadingGet, setIsLoadingGet] = useState(false);
  const [dataMember, setDataMember] = useState([]);
  const [searchQuery, setSearchQuery] = React.useState("");

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

  useEffect(() => {
    getMember(uid);
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      // Do something when the screen is focused
      console.log("Screen is focused");
      getMember(uid);
      // Add your logic here to update the component or fetch new data

      // Example: Refresh data or update components
    }, [])
  );

  return (
    <ColorBgContainer>
      <RootContainer>
        <AppBar title="Kelola Member" dataTaskPending={[]} />

        <ScrollView style={styles.mainContainer}>
          <View style={{ marginBottom: ms(16) }}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: "700",
                color: COLORS.PRIMARY_DARK,
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
                  address={item.address}
                />
              )}
            />
          </View>
        </ScrollView>
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
