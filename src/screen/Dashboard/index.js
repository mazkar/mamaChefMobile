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
  ActivityIndicator,
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
import { useFocusEffect } from "@react-navigation/native";
import { Tab } from "@rneui/themed";
import _ from "lodash";

export default function Dashboard({ navigation }) {
  const dispatch = useDispatch();
  const [dataMenu, setDataMenu] = useState([]);
  const [dataMenu2, setDataMenu2] = useState([]);
  const [dataMenuPagination, setDataMenuPagination] = useState([]);
  const [searchQuery, setSearchQuery] = React.useState("");
  const uid = useSelector((state) => state?.auth?.user?.UserId);
  const user = useSelector((state) => state?.auth?.user);
  const token = useSelector((state) => state.auth.token);
  const [isLoadingGet, setIsLoadingGet] = useState(false);
  const [messageError, setMessageError] = useState("");
  const [rating, setRating] = useState(4);
  const [dataContent, setDataContent] = useState([]);
  const [modalErroVis, setModalErrorVis] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [index, setIndex] = React.useState(0);
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
  async function getMenuNewest(count) {
    setIsLoading(true);
    const body = {
      pageSize: 5,
      currentPage: 1,
      isPhoto: true,
      isVideo: false,
      userId: uid,
    };
    setIsLoading(true);
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
        setDataMenu2(res.data.data);
        setIsLoading(false);
      }
      // Don't forget to return something
      return res.data;
    } catch (err) {
      console.error(err);
      setIsLoading(false);
    }
  }

  const [pageSize, setPageSize] = useState(3);
  const [sumAllData, setAllSumData] = useState(0);
  const [pageNume, setPageNum] = useState(1);
  async function getMenuPagination(userId, page) {
    setPageNum(pageNume + 1);
    // console.log(pageNume, "page num");
    const body = {
      pageSize: 1,
      currentPage: pageNume,
      isPhoto: true,
      isVideo: false,
      userId: 0,
    };
    // setIsLoadingGet(true);
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
        const newArray = [...dataMenuPagination, ...res.data.data];
        setDataMenuPagination(newArray);
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

  const onPressNav = (id) => {
    navigation.navigate("MenuDetail", { menuId: id });
  };

  const handleEndReached = (size) => {
    if (!isLoading) {
      getMenuPagination(uid, size);
    }
  };

  useEffect(() => {
    // getMenu(uid);
    getMenuNewest(5);
    getMenuPagination(0, 1);
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      console.log("Screen is focused");
      getMenuPagination(uid, 1);
      getMenuNewest(5);
    }, [])
  );

  const renderFooter = () => {
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
    sumAllData == dataMenuPagination?.length ? null : getMenuPagination(0, 1);
    // Your custom logic here
  }, 1500);

  async function getContentDashboard(userId) {
    setIsLoadingGet(true);
    try {
      let res = await axios({
        url: `${baseUrl.URL}api/ContentManagementMaster/getcontentbypage/dashboard`,
        method: "get",
        timeout: 8000,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.status == 200) {
        // test for status you want, etc
        console.log(res.data, "content");
        setDataContent(res.data.data);
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
    getContentDashboard();
  }, []);

  return (
    <ColorBgContainer>
      <RootContainer>
        <AppBar
          title="Dashboard"
          dataTaskPending={[]}
          handleLogut={handleLogut}
          navigation={navigation}
        />

        <ScrollView
          style={styles.mainContainer}
          onMomentumScrollEnd={() => handleMomentumScrollEnd()}
        >
          <View>
            <ImageBackground
              source={require("../../assets/images/Banner.png")}
              style={styles.imageBackground}
            >
              <Text style={styles.text}>Mama Chef</Text>
              <Text style={styles.text2}>{dataContent[0]?.content}</Text>
            </ImageBackground>
          </View>

          <View style={{ paddingHorizontal: ms(8) }}>
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
                    fontSize: 16,
                    fontWeight: "700",
                    color: COLORS.GRAY_HARD,
                  }}
                >
                  Resep Terposting Anda
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
                  <Text style={{ color: COLORS.PRIMARY_DARK }}>
                    Lihat Semua
                    {/* ({dataMenu2?.length}) */}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={{ paddingVertical: 32 }}>
              {dataMenu2.length == 0 ? (
                <View
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    width: "20vw",
                    alignItems: "center",
                    // backgroundColor: "red",
                  }}
                >
                  <Image
                    source={require("../../assets/images/empty_data.png")}
                  />
                  <Text
                    style={{
                      marginTop: ms(8),
                      color: COLORS.GRAY_HARD,
                      fontSize: 18,
                    }}
                  >
                    Kamu Belum Memposting Resep
                  </Text>
                </View>
              ) : (
                <FlatList
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={styles.listData} // center emptyData component
                  data={dataMenu2}
                  showsHorizontalScrollIndicator={false}
                  horizontal={true}
                  keyExtractor={(item) => item.menuId}
                  renderItem={({ item, index }) => (
                    <Card
                      style={{
                        borderRadius: 8,
                        width: ms(148),
                        height: ms(178),
                        marginLeft: ms(12),
                        borderTopStartRadius: 10,
                        borderTopEndRadius: 10,
                        backgroundColor: COLORS.WHITE,
                        paddingBottom: ms(38),
                      }}
                      onPress={() => onPressNav(item.menuId)}
                    >
                      <Card.Cover
                        style={{
                          width: "auto",
                          height: "80%",
                          borderTopStartRadius: 10,
                          borderTopEndRadius: 10,
                        }}
                        source={{
                          uri: `${item?.photo}`,
                        }}
                      />
                      <Card.Content
                        style={{
                          paddingHorizontal: ms(4),
                        }}
                      >
                        <View
                          style={{
                            backgroundColor: COLORS.PRIMARY_DARK,
                            borderRadius: ms(10),
                            alignContent: "center",

                            marginTop: ms(4),
                            width: "100%",
                            paddingHorizontal: ms(6),
                          }}
                        >
                          <Text
                            numberOfLines={1}
                            ellipsizeMode="tail"
                            style={{
                              fontSize: 11,
                              alignSelf: "center",
                              fontWeight: "600",
                              color: COLORS.WHITE,
                            }}
                          >
                            {item?.menuName}
                          </Text>
                        </View>

                        <Text
                          numberOfLines={2}
                          ellipsizeMode="tail"
                          style={{
                            fontSize: 11,

                            fontWeight: "500",
                            color: COLORS.PRIMARY_DARK,
                          }}
                        >
                          <Text style={{ color: COLORS.GRAY_HARD }}>
                            Resep Oleh :
                          </Text>
                          {"\n"}
                          <Text> {item?.recipeBy}</Text>
                        </Text>
                      </Card.Content>
                    </Card>
                  )}
                />
              )}
            </View>

            <Divider style={{ height: 3, color: "#EEEEEE" }} />

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
                    fontSize: 16,
                    fontWeight: "700",
                    color: COLORS.GRAY_HARD,
                  }}
                >
                  Rekomendasi Resep
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
                  onPress={() => navigation.navigate("KelolaMenuAll")}
                >
                  <Text style={{ color: COLORS.PRIMARY_DARK }}>
                    Lihat Semua
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={{ paddingVertical: 32 }}>
              <FlatList
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listData}
                data={dataMenuPagination}
                showsHorizontalScrollIndicator={false}
                ListFooterComponent={renderFooter}
                keyExtractor={(item) => item.menuId}
                renderItem={({ item, index }) => (
                  <Card
                    style={{
                      borderRadius: 8,
                      width: "95%",
                      height: ms(186),
                      // paddingRight: ms(32),
                      marginLeft: ms(12),
                      borderTopStartRadius: 10,
                      borderTopEndRadius: 10,
                      marginBottom: ms(24),
                      backgroundColor: COLORS.WHITE,
                      paddingBottom: ms(32),
                    }}
                  >
                    <Card.Content
                      style={{
                        paddingHorizontal: ms(4),

                        // backgroundColor: "red",
                      }}
                    >
                      <View style={{ flexDirection: "row" }}>
                        <View
                          style={{
                            borderRadius: ms(10),
                            alignContent: "center",

                            paddingHorizontal: ms(6),
                          }}
                        >
                          <Image
                            source={{
                              uri: `${item?.photo}`,
                            }}
                            style={{
                              width: ms(100),
                              height: ms(100),
                              borderRadius: ms(50),
                            }}
                            onError={(error) =>
                              console.log("Image load error:", error)
                            }
                          />
                        </View>
                        <View style={{ marginLeft: ms(16) }}>
                          <Text
                            numberOfLines={1}
                            ellipsizeMode="tail"
                            style={{
                              fontSize: 16,
                              fontWeight: "700",
                              color: COLORS.GRAY_HARD,
                            }}
                          >
                            {item.menuName}
                          </Text>

                          <View style={{ flexDirection: "row" }}>
                            <Text>(4)</Text>
                            <StarRating
                              disabled={true}
                              maxStars={5}
                              rating={rating}
                              selectedStar={(rating) => setRating(rating)}
                              fullStarColor={"gold"}
                              starStyle={{
                                marginTop: ms(4),
                                marginLeft: ms(2),
                              }}
                              containerStyle={{ width: 80 }}
                              starSize={14}
                            />
                          </View>
                          <Text>
                            <Text
                              style={{
                                color: COLORS.GRAY_HARD,
                                fontWeight: "600",
                                fontSize: 11,
                              }}
                            >
                              Resep Oleh:
                            </Text>
                            {"\n"}
                            <Text style={{ color: COLORS.PRIMARY_DARK }}>
                              {item?.recipeBy}
                            </Text>
                          </Text>
                        </View>
                      </View>
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <View>
                          <TouchableOpacity
                            onPress={() => onPressNav(item.menuId)}
                            style={styles.btnAdd}
                            // onPress={() => navigation.navigate("TambahTips")}
                          >
                            <Text style={{ color: "white", fontWeight: "700" }}>
                              Lihat Resep
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </Card.Content>
                  </Card>
                )}
              />
            </View>
          </View>
        </ScrollView>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalErroVis}
          onRequestClose={hideModalError}
        >
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
        </Modal>

        <PopUpLoader visible={isLoadingGet} />
      </RootContainer>
    </ColorBgContainer>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
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
