import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  RefreshControl,
  StyleSheet,
  ImageBackground,
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
  Modal,
  Searchbar,
} from "react-native-paper";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
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
import constants from "../../assets/constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
// iCONS
import FaIcons from "react-native-vector-icons/Ionicons";
import { resetReducer } from "../../store/models/auth/actions";
import { useDispatch, useSelector } from "react-redux";
import API from "../../utils/apiService";
import axios from "axios";
import { setUser } from "../../store/models/auth/actions";
import StarRating from "react-native-star-rating";
import { baseUrl } from "../../utils/apiURL";

export default function AboutUs({ navigation }) {
  const dispatch = useDispatch();
  const [dataMenu, setDataMenu] = useState([]);
  const [dataMenu2, setDataMenu2] = useState([]);
  const [searchQuery, setSearchQuery] = React.useState("");
  const uid = useSelector((state) => state?.auth?.user?.UserId);
  const token = useSelector((state) => state.auth.token);
  const [isLoadingGet, setIsLoadingGet] = useState(false);
  const [messageError, setMessageError] = useState("");
  const [rating, setRating] = useState(4);
  const [modalErroVis, setModalErrorVis] = useState(false);
  const hideModalError = () => {
    setModalErrorVis(false);

    // getTaskDetail(route.params.assignmentId);
  };

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
  async function getMenuNewest(userId) {
    setIsLoadingGet(true);
    try {
      let res = await axios({
        url: `${baseUrl.URL}api/Menu/GetNewestMenu/${userId}`,
        method: "get",
        timeout: 8000,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.status == 200) {
        // test for status you want, etc
        console.log(res.data, "newest");
        setDataMenu2(res.data.data);
        // setIsLoadingGet(false);
        // console.log(res.data, "transit");
      }
      // Don't forget to return something
      return res.data;
    } catch (err) {
      console.error(err);
      // setIsLoadingGet(false);
    }
  }

  const onPressNav = (id) => {
    navigation.navigate("MenuDetail", { menuId: id });
  };

  // useEffect(() => {
  //   getMenu(uid);
  //   getMenuNewest(uid);
  // }, []);

  return (
    <ColorBgContainer>
      <RootContainer>
        <AppBar
          title="Dashboard"
          dataTaskPending={[]}
          handleLogut={handleLogut}
          navigation={navigation}
        />

        {/* <TouchableOpacity onPress={handleLogut}>
          <Text>Log Out</Text>
        </TouchableOpacity> */}
        <ScrollView style={styles.mainContainer}>
          <View>
            <ImageBackground
              source={require("../../assets/images/Banner.png")}
              style={styles.imageBackground}
            >
              <Text style={styles.text}>Mama Chef</Text>
              <Text style={styles.text2}>
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text ever since the 1500s, when an unknown printer took a galley
                of type and scrambled it to make a type specimen book.
              </Text>
            </ImageBackground>
          </View>
          <View style={{ paddingHorizontal: ms(12), marginTop: ms(12) }}>
            <View>
              <Text style={{ fontWeight: "600" }}>TENTANG MAMACHEF</Text>
              <Text
                style={{
                  color: COLORS.BLACK,
                  fontWeight: "300",
                  marginTop: ms(8),
                }}
              >
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text ever since the 1500s, when an unknown printer took a galley
                of type and scrambled it to make a type specimen book.
              </Text>
            </View>
            <View style={{ marginTop: ms(8) }}>
              <Text style={{ fontWeight: "600" }}>
                Navigasi yang Simple dan Intuitif
              </Text>
              <Text
                style={{
                  color: COLORS.BLACK,
                  fontWeight: "300",
                  marginTop: ms(8),
                }}
              >
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text ever since the 1500s, when an unknown printer took a galley
                of type and scrambled it to make a type specimen book.
              </Text>
            </View>
            <View style={{ marginTop: ms(32), flex: 1 }}>
              <Text style={{ fontWeight: "600" }}>HUBUNGI KAMI</Text>
              <View style={{ flex: 1, flexDirection: "row" }}>
                <View style={{ marginRight: ms(4) }}>
                  <Image
                    source={require("../../assets/images/wha.png")}
                    style={{
                      height: ms(20),
                      width: ms(20),
                      marginBottom: ms(8),
                    }}
                  />
                  <Image
                    source={require("../../assets/images/ig.png")}
                    style={{
                      height: ms(20),
                      width: ms(20),
                      marginBottom: ms(8),
                    }}
                  />
                  <Image
                    source={require("../../assets/images/gm.png")}
                    style={{
                      height: ms(20),
                      width: ms(20),
                      marginBottom: ms(8),
                    }}
                  />
                </View>
                <View>
                  <Text style={{ marginBottom: ms(8) }}>
                    : (+62) 8125622133
                  </Text>
                  <Text style={{ marginBottom: ms(8) }}>
                    : mamachef@gmail.com
                  </Text>
                  <Text style={{ marginBottom: ms(8) }}>: mama_chef_idn</Text>
                </View>
              </View>
            </View>
          </View>

          {/* <View style={styles.continerSearch}>
            <Searchbar
              placeholder="Cari Menu"
              onChangeText={onChangeSearch}
              value={searchQuery}
            />
          </View> */}

          {/* Komponen Tips & Trik */}
          {/* <View
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
                  color: COLORS.GRAY_HARD,
                }}
              >
                Tips & Trick
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
              <TouchableOpacity onPress={() => navigation.navigate("Tips")}>
                <Text style={{ color: COLORS.PRIMARY_DARK }}>
                  Lihat Semua ({dataMenu?.length})
                </Text>
              </TouchableOpacity>
            </View>
          </View> */}

          {/* <View style={{ padding: 16, paddingVertical: 32 }}>
            <FlatList
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listData} // center emptyData component
              // data={surveyOpen}
              data={dataMenu}
              showsHorizontalScrollIndicator={false}
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
          </View> */}
        </ScrollView>
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
            <Text style={styles.modalText}>{messageError}</Text>
            <GeneralButton
              style={styles.gettingButton}
              mode="contained"
              onPress={hideModalError}
            >
              Close
            </GeneralButton>
          </View>
          {/* </View> */}
        </Modal>
        {/* <TouchableOpacity style={styles.button} onPress={handleLogut}>
          <Text style={{ color: COLORS.WHITE }}>Sign Out</Text>
        </TouchableOpacity> */}
        <PopUpLoader visible={isLoadingGet} />
      </RootContainer>
    </ColorBgContainer>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    // paddingHorizontal: 12,
    // paddingVertical: 12,
  },
  continerSearch: {
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  btnAdd: {
    borderRadius: moderateScale(10),
    width: ms(128),
    height: ms(48),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.PRIMARY_DARK,
    alignSelf: "flex-end",
    marginBottom: moderateScale(5),
    marginTop: moderateScale(5),
    marginTop: moderateScale(10),
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
  // listData: { flexGrow: 1 },
  overviewContainer: {
    // paddingVertical: 4,
    paddingHorizontal: 18,
    marginTop: ms(16),
    paddingVertical: 32,
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
  containermodalView: {
    flexDirection: "column",
    alignSelf: "center",
    position: "absolute",
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
  listData: {
    paddingVertical: ms(32),
  },
  imageBackground: {
    flex: 1,
    width: "100%",
    height: ms(202),
    // resizeMode: "stretch", // or 'contain' or 'stretch' or 'repeat' or 'center'
    justifyContent: "center",
    alignItems: "flex-start",
  },
  text: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
    marginLeft: ms(24),
    //
  },
  text2: {
    color: "white",
    fontSize: 11,
    fontWeight: "400",
    marginLeft: ms(24),
  },
});
