import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  RefreshControl,
  StyleSheet,
  ImageBackground,
  Linking,
  FlatList,
  ActivityIndicator,
  TextInput,
} from "react-native";
import React, { useState, useCallback, useEffect } from "react";
import RootContainer from "../../component/RootContainer/index";
import { useNavigation } from "@react-navigation/core";
import ColorBgContainer from "../../component/ColorBgContainer";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { FontAwesome5 } from "@expo/vector-icons";
import { COLORS, FONTS } from "../../assets/theme";
import moment from "moment";
import {
  Button,
  Menu,
  Divider,
  Avatar,
  Card,
  Paragraph,
  Modal,
  Searchbar,
  IconButton,
} from "react-native-paper";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { ms, moderateScale } from "react-native-size-matters";
import {
  AppBar,
  GeneralButton,
  GeneralTextInput2,
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
import DropDownPicker from "react-native-dropdown-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { setMenuCount } from "../../store/models/menu/action";

export default function Dashboard({ navigation }) {
  const dispatch = useDispatch();
  const [dataMenu, setDataMenu] = useState([]);
  const currentVersion = "1.3";
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
  const [dataVersion, setDataVersion] = useState([]);
  const [isModalUpdateVisible, setIsModalUpdateVisible] = useState(false);
  const [selecteTab, setSelectedTab] = useState("all");
  const [openDropDownMember, setOpenDropDownMember] = useState(false);

  const tabFilter = [
    { id: 1, type: "all", label: "Semua Resep" },
    { id: 2, type: "userId", label: "Resep Terposting Anda" },
  ];

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
      pageSize: 5,
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
    // getMenuNewest(5);
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

  async function getMenuInCarts(userId) {
    try {
      let res = await axios({
        url: `${baseUrl.URL}api/BucketIngredients/getshopingcartbyuserid/${userId}`,
        method: "get",
        timeout: 8000,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.status == 200) {
        // test for status you want, etc
        console.log(res.data, "shoping carts");
        // setDataMenu(res?.data?.data.length);
        dispatch(setMenuCount(res?.data?.data));

        // console.log(res.data, "transit");
      }
      // Don't forget to return something
      return res.data;
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    getContentDashboard();
    getMenuInCarts(uid);
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      // Do something when the screen is focused
      console.log("Screen is focused");

      getMenuInCarts(uid);

      // Add your logic here to update the component or fetch new data

      // Example: Refresh data or update components
    }, [])
  );

  async function getApkVersion() {
    // setIsLoadingGet(true);
    try {
      let res = await axios({
        url: `${baseUrl.URL}api/MobileNotification/mobileVersion`,
        method: "get",
        timeout: 8000,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.status == 200) {
        // test for status you want, etc
        // setApkVersion(res?.data[0]);
        console.log(res.data, "version apk");
        if (res?.data?.data[0]?.versionNo != currentVersion) {
          setIsModalUpdateVisible(true);
        }
        setDataVersion(res?.data?.data);
        // setDataContent(res.data.data);
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

  const handleDownload = async () => {
    const urls = `${baseUrl.URL}${dataVersion[0].url}`;

    // Open the link using Linking
    const supported = await Linking.canOpenURL(urls);

    console.log(urls, "url download");

    if (supported) {
      await Linking.openURL(urls);
    } else {
      console.error("Don't know how to open URI: " + urls);
    }
  };

  const [comments, setComments] = useState([
    { username: "user1", text: "Nice post!" },
    { username: "user2", text: "Amazing!" },
  ]);
  const [newComment, setNewComment] = useState("");

  const handleAddComment = () => {
    if (newComment.trim()) {
      setComments([...comments, { username: "currentUser", text: newComment }]);
      setNewComment("");
    }
  };

  const [dataComment, setDataComment] = useState([]);
  const [isModalCommentVisible, setIsModalCommentVissible] = useState();
  const [selectedMenuId, setSelectedMenuId] = useState(0);

  const showModalComment = (menuId) => {
    setIsModalCommentVissible(true);
    getComment(menuId);
    setSelectedMenuId(menuId);
  };

  const hideModalComment = () => {
    setIsModalCommentVissible(false);
    setNewComment("");
  };

  async function getComment(menuId) {
    // setIsLoadingGet(true);
    try {
      let res = await axios({
        url: `${baseUrl.URL}api/MenuComment/commentbymenuid/${menuId}`,
        method: "get",
        timeout: 8000,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.status == 200) {
        // test for status you want, etc
        // setApkVersion(res?.data[0]);
        setDataComment(res?.data?.data);
        // setDataContent(res.data.data);
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

  async function insertComment(userId, page) {
    // console.log(pageNume, "page num");
    const body = {
      menuId: selectedMenuId,
      userId: uid,
      comment: newComment,
    };
    // setIsLoadingGet(true);
    // setIsLoading(true);
    try {
      let res = await axios({
        url: `${baseUrl.URL}api/MenuComment/insertcomment`,
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
        getComment(selectedMenuId);
        setNewComment("");
        // console.log(res.data, "transit");
      }
      // Don't forget to return something
      return res.data;
    } catch (err) {
      console.error(err);
      setIsLoading(false);
    }
  }

  async function deletetComment(id) {
    // console.log(pageNume, "page num");
    const body = {
      menuCommentId: id,
    };
    // setIsLoadingGet(true);
    // setIsLoading(true);
    try {
      let res = await axios({
        url: `${baseUrl.URL}api/MenuComment/deletecomment`,
        method: "DELETE",
        timeout: 20000,
        data: body,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.status == 200) {
        // test for status you want, etc
        getComment(selectedMenuId);
        // console.log(res.data, "transit");
      }
      // Don't forget to return something
      return res.data;
    } catch (err) {
      console.error(err);
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getApkVersion();
  }, []);

  const handleChangeTab = (tab) => {
    setSelectedTab(tab.type);
    if (tab.type == "all") {
      getMenuPagination(0, 1);
    } else if (tab.type == "userId") {
      getMenuNewest(15);
    }
  };

  const [isModalScheduleVisible, setIsmodalScheduleVisinle] = useState(false);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState(null);

  const [ddlMember, setDdlMember] = useState([]);
  const [valueMemberId, setValueMemberId] = useState(null);
  const [modalSuccesVis2, setModalSuccessVis2] = useState(false);
  const [error, setError] = useState(false);
  const [errorItems, setErrorItem] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [modalSuccesVis, setModalSuccessVis] = useState(false);

  const hideModalSuccess = () => {
    setModalSuccessVis(false);

    // getTaskDetail(route.params.assignmentId);
  };

  const showDatepicker = () => {
    setShowDatePicker(true);
  };

  const hideModalSuccess2 = () => {
    setModalSuccessVis2(false);

    setIsmodalScheduleVisinle(false);
    // getTaskDetail(route.params.assignmentId);
  };
  const showModalSchedule = (menuId, menuName) => {
    setIsmodalScheduleVisinle(true);
    setSelectedMenu(menuName);
    setSelectedMenuId(menuId);
    getData();
  };

  const hideModalSchedule = () => {
    setIsmodalScheduleVisinle(false);
    setOpenDropDownMember(false);
    setValueMemberId(null);
  };

  const handleAddSchedule = async () => {
    const body = {
      menuId: selectedMenuId,
      memberId: valueMemberId,
      userId: parseInt(uid),
      assignedDate: date,
    };
    console.log(body);

    // Check for null values
    let errorItems = [];
    if (!body.memberId && body.memberId != 0) errorItems.push("Member");
    if (!body.assignedDate) errorItems.push("Tanggal");

    if (errorItems.length > 0) {
      setError(true);
      setErrorItem(errorItems);
      setIsLoadingGet(false);
      setModalErrorVis(true);
      setIsmodalScheduleVisinle(false);
      setOpenDropDownMember(false);
      setErrorMessage(`${errorItems.join(", ")} wajib di Pilih!`);
      return;
    }
    console.log(body, "body");
    // setIsLoadingGet(true);
    try {
      console.log(body);
      let res = await axios({
        url: `${baseUrl.URL}api/Menu/InsertMenuDelegation`,
        method: "POST",
        timeout: 58000,
        data: body,
        headers: {
          "Content-Type": "application/json",
          // Authorization: `Bearer ${token}`,
        },
      });
      console.log(res, "Success");
      console.log(res, "<= res");
      if (res.status == 200) {
        console.log(res.data.data, "<= res");
        setIsLoadingGet(false);
        // dispatch(setUserId(res.data.data[0]?.userId));
        // getDataJadwal();
        setIsmodalScheduleVisinle(false);
        setModalSuccessVis2(true);
        setOpenDropDownMember(false);
        setValueMemberId(null);

        // test for status you want, etc
        // setLoadingUpload(false);
        // getTaskDetail(route.params.assignmentId);
        console.log(res, "Success");

        // setDataItem(res.data);
        // setDataInfo(res.data);
      } else {
        setIsLoadingGet(false);
      }
      // Don't forget to return something
      return res.data;
    } catch (err) {
      console.error(err, "error");
      setModalErrorVis(true);
      setIsmodalScheduleVisinle(false);
      setIsLoadingGet(false);
    }
  };

  async function getData(id) {
    setIsLoadingGet(true);
    try {
      let res = await axios({
        url: `${baseUrl.URL}api/Member/membermobile/${uid}`,
        method: "get",
        timeout: 38000,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(res, "<===res data member");
      if (res.status == 200) {
        // test for status you want, etc

        console.log(res.data.data, "<===res data member");

        setDdlMember(res.data.data);
        // setDdlUom(res.data.masterUomsList);
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

  async function insertMneuToChart(menuId, page, isPublish) {
    // console.log(isPublish, "isPublish");

    console.log(searchQuery, "page num");
    const body = {
      menuId: menuId,
      quantity: 1,
      reservedBy: parseInt(uid),
      reservedDate: moment().format("YYYY-MM-DD"),
      status: "booked",
    };
    // setIsLoadingGet(true);
    // setIsLoading(true);
    try {
      let res = await axios({
        url: `${baseUrl.URL}api/BucketIngredients/addmenutoshopingcart`,
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
        getMenuInCarts(uid);
        setModalSuccessVis(true);
        // console.log(res.data, "transit");
      }
      // Don't forget to return something
      return res.data;
    } catch (err) {
      console.error(err);
      setIsLoading(false);
      setModalErrorVis(true);
    }
  }

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === "ios");
    setDate(currentDate);

    // Convert the selected date to a string in a specific format
    const formattedDate = currentDate.toLocaleDateString("en-US"); // Adjust the locale as needed

    // Now, you can use the formattedDate as a string
    console.log("Selected Date:", formattedDate);

    // You can handle the selected date as needed
  };

  async function insertMneuToChart(menuId, page, isPublish) {
    // console.log(isPublish, "isPublish");

    console.log(searchQuery, "page num");
    const body = {
      menuId: menuId,
      quantity: 1,
      reservedBy: parseInt(uid),
      reservedDate: moment().format("YYYY-MM-DD"),
      status: "booked",
    };
    // setIsLoadingGet(true);
    // setIsLoading(true);
    try {
      let res = await axios({
        url: `${baseUrl.URL}api/BucketIngredients/addmenutoshopingcart`,
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
        getMenuInCarts(uid);
        setModalSuccessVis(true);
        // console.log(res.data, "transit");
      }
      // Don't forget to return something
      return res.data;
    } catch (err) {
      console.error(err);
      setIsLoading(false);
      setModalErrorVis(true);
    }
  }

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
                  </Text>
                </TouchableOpacity>
              </View>
            </View> */}

            {/* <View style={{ paddingVertical: 32 }}>
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
                        height: ms(198),
                        marginLeft: ms(12),
                        borderTopStartRadius: 10,
                        borderTopEndRadius: 10,
                        backgroundColor: COLORS.WHITE,
                        paddingBottom: ms(38),
                        position: "relative", // Make sure the card is relatively positioned
                      }}
                      onPress={() => onPressNav(item.menuId)}
                    >
                      <Card.Cover
                        style={{
                          width: "auto",
                          height: "70%",
                          borderTopStartRadius: 10,
                          borderTopEndRadius: 10,
                        }}
                        source={{ uri: `${item?.photo}` }}
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
                          <Text>{item?.recipeBy}</Text>
                        </Text>
                        <TouchableOpacity
                          style={{ marginTop: 12, alignSelf: "flex-end" }}
                          onPress={() => showModalComment(item?.menuId)}
                        >
                          <Icon
                            name="comment"
                            size={20}
                            color={COLORS.PRIMARY_DARK}
                          />
                        </TouchableOpacity>
                      </Card.Content>
                    </Card>
                  )}
                />
              )}
            </View>

            <Divider style={{ height: 3, color: "#EEEEEE" }} /> */}
            <View style={{ marginTop: 18 }}>
              <View style={{ flexDirection: "row", marginBottom: ms(32) }}>
                {tabFilter?.map((e) => (
                  <TouchableOpacity
                    style={
                      e.type == selecteTab
                        ? styles.tabActive
                        : styles.tabInactive
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
                {selecteTab == "all" ? (
                  <>
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
                          Semua Resep
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
                              // height: ms(186),
                              // paddingRight: ms(32),
                              marginLeft: ms(12),
                              borderTopStartRadius: 10,
                              borderTopEndRadius: 10,
                              marginBottom: ms(24),
                              backgroundColor: COLORS.WHITE,
                              paddingBottom: ms(12),
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
                                    style={{
                                      fontSize: 16,
                                      fontWeight: "700",
                                      color: COLORS.GRAY_HARD,
                                    }}
                                  >
                                    {item.menuName}
                                  </Text>
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
                                    <Text
                                      numberOfLines={3}
                                      ellipsizeMode="tail"
                                      style={{
                                        color: COLORS.PRIMARY_DARK,
                                        flexWrap: "wrap",
                                      }}
                                    >
                                      {item?.createBystr}
                                    </Text>
                                  </Text>
                                  <View style={{ flexDirection: "row" }}>
                                    <TouchableOpacity
                                      style={{
                                        marginTop: 12,
                                        alignSelf: "flex-end",
                                      }}
                                      onPress={() =>
                                        showModalComment(item?.menuId)
                                      }
                                    >
                                      <Text
                                        name="comment"
                                        style={{ color: COLORS.PRIMARY_DARK }}
                                      >
                                        Lihat Komentar
                                      </Text>
                                    </TouchableOpacity>
                                  </View>
                                </View>
                              </View>
                              <View
                                style={{
                                  flexDirection: "row",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  marginTop: 32,
                                }}
                              >
                                <TouchableOpacity
                                  onPress={() => onPressNav(item.menuId)}
                                  style={{
                                    backgroundColor: COLORS.PRIMARY_DARK,
                                    paddingHorizontal: ms(24),
                                    paddingVertical: ms(12),
                                    borderRadius: ms(8),

                                    marginLeft: ms(8),
                                    borderColor: COLORS.PRIMARY_DARK,
                                    borderWidth: 1,
                                  }}
                                >
                                  <Text
                                    style={{
                                      color: "white",
                                      fontWeight: "700",
                                    }}
                                  >
                                    Lihat Resep
                                  </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                  style={{
                                    backgroundColor: COLORS.WHITE,
                                    paddingHorizontal: ms(24),
                                    paddingVertical: ms(12),
                                    borderRadius: ms(8),

                                    marginLeft: ms(8),
                                    borderColor: COLORS.PRIMARY_DARK,
                                    borderWidth: 1,
                                  }}
                                  onPress={() =>
                                    insertMneuToChart(item?.menuId)
                                  }
                                >
                                  <FontAwesome5
                                    // onPress={showNotif}
                                    style={{
                                      fontSize: 20,
                                      color: COLORS.PRIMARY_MEDIUM,

                                      color: COLORS.PRIMARY_DARK,
                                    }}
                                    name="shopping-cart"
                                  />
                                </TouchableOpacity>

                                <TouchableOpacity
                                  style={{
                                    backgroundColor: COLORS.WHITE,
                                    paddingHorizontal: ms(24),
                                    paddingVertical: ms(12),
                                    borderRadius: ms(8),

                                    marginLeft: ms(8),
                                    borderColor: COLORS.PRIMARY_DARK,
                                    borderWidth: 1,
                                  }}
                                  onPress={() =>
                                    showModalSchedule(
                                      item?.menuId,
                                      item?.menuName
                                    )
                                  }
                                >
                                  <FontAwesome5
                                    // onPress={showNotif}
                                    style={{
                                      fontSize: 20,
                                      color: COLORS.PRIMARY_MEDIUM,

                                      color: COLORS.PRIMARY_DARK,
                                    }}
                                    name="calendar-alt"
                                  />
                                </TouchableOpacity>
                              </View>
                            </Card.Content>
                          </Card>
                        )}
                      />
                    </View>
                  </>
                ) : (
                  <>
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
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                    <View style={{ paddingVertical: 32 }}>
                      <FlatList
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.listData}
                        data={dataMenu2}
                        showsHorizontalScrollIndicator={false}
                        ListFooterComponent={renderFooter}
                        keyExtractor={(item) => item.menuId}
                        renderItem={({ item, index }) => (
                          <Card
                            style={{
                              borderRadius: 8,
                              width: "95%",
                              marginLeft: ms(12),
                              borderTopStartRadius: 10,
                              borderTopEndRadius: 10,
                              marginBottom: ms(24),
                              backgroundColor: COLORS.WHITE,
                              paddingBottom: ms(18),
                            }}
                          >
                            <Card.Content
                              style={{
                                paddingHorizontal: ms(4),
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
                                    style={{
                                      fontSize: 16,
                                      fontWeight: "700",
                                      color: COLORS.GRAY_HARD,
                                    }}
                                  >
                                    {item.menuName}
                                  </Text>
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
                                    <Text
                                      numberOfLines={3}
                                      ellipsizeMode="tail"
                                      style={{
                                        color: COLORS.PRIMARY_DARK,
                                        flexWrap: "wrap",
                                      }}
                                    >
                                      {item?.recipeBy}
                                    </Text>
                                  </Text>
                                  <View style={{ flexDirection: "row" }}>
                                    <TouchableOpacity
                                      style={{
                                        marginTop: 12,
                                        alignSelf: "flex-end",
                                      }}
                                      onPress={() =>
                                        showModalComment(item?.menuId)
                                      }
                                    >
                                      <Text
                                        name="comment"
                                        style={{ color: COLORS.PRIMARY_DARK }}
                                      >
                                        Lihat Komentar
                                      </Text>
                                    </TouchableOpacity>
                                  </View>
                                </View>
                              </View>
                              <View
                                style={{
                                  flexDirection: "row",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  marginTop: 32,
                                }}
                              >
                                <TouchableOpacity
                                  onPress={() => onPressNav(item.menuId)}
                                  style={{
                                    backgroundColor: COLORS.PRIMARY_DARK,
                                    paddingHorizontal: ms(24),
                                    paddingVertical: ms(12),
                                    borderRadius: ms(8),
                                    marginLeft: ms(8),
                                    borderColor: COLORS.PRIMARY_DARK,
                                    borderWidth: 1,
                                  }}
                                >
                                  <Text
                                    style={{
                                      color: "white",
                                      fontWeight: "700",
                                    }}
                                  >
                                    Lihat Resep
                                  </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                  style={{
                                    backgroundColor: COLORS.WHITE,
                                    paddingHorizontal: ms(24),
                                    paddingVertical: ms(12),
                                    borderRadius: ms(8),

                                    marginLeft: ms(8),
                                    borderColor: COLORS.PRIMARY_DARK,
                                    borderWidth: 1,
                                  }}
                                  onPress={() =>
                                    insertMneuToChart(item?.menuId)
                                  }
                                >
                                  <FontAwesome5
                                    // onPress={showNotif}
                                    style={{
                                      fontSize: 20,
                                      color: COLORS.PRIMARY_MEDIUM,

                                      color: COLORS.PRIMARY_DARK,
                                    }}
                                    name="shopping-cart"
                                  />
                                </TouchableOpacity>
                                <TouchableOpacity
                                  style={{
                                    backgroundColor: COLORS.WHITE,
                                    paddingHorizontal: ms(24),
                                    paddingVertical: ms(12),
                                    borderRadius: ms(8),
                                    marginLeft: ms(8),
                                    borderColor: COLORS.PRIMARY_DARK,
                                    borderWidth: 1,
                                  }}
                                  onPress={() =>
                                    showModalSchedule(
                                      item?.menuId,
                                      item?.menuName
                                    )
                                  }
                                >
                                  <FontAwesome5
                                    style={{
                                      fontSize: 20,
                                      color: COLORS.PRIMARY_DARK,
                                    }}
                                    name="calendar-alt"
                                  />
                                </TouchableOpacity>
                              </View>
                            </Card.Content>
                          </Card>
                        )}
                      />
                    </View>
                  </>
                )}
              </View>
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

        <Modal
          animationType="slide"
          transparent={true}
          visible={isModalUpdateVisible}
          onRequestClose={() => setIsModalUpdateVisible(false)}
        >
          {/* <View style={styles.centeredView}> */}
          <View style={styles.containermodalView}>
            {/* <View style={styles.imgSubmit}>
            <FontAwesome
              name="close"
              size={24}
              style={{ fontSize: 72, color: COLORS.RED_BG }}
            />
          </View> */}
            <Text style={styles.modalTextWarning}>
              Aplikasi Mamachef Versi {dataVersion[0]?.versionNo} Tersedia
              Silahkan Download Aplikasi Terbaru
            </Text>
            <TouchableOpacity
              style={{
                justifyContent: "center",
                alignSelf: "center",
                flex: 1,
              }}
              onPress={() => handleDownload()}
            >
              <Image
                source={require("../../assets/images/BrowserDownload.png")}
              />
            </TouchableOpacity>
            {/* <GeneralButton
            style={styles.gettingButton}
            mode="contained"
            onPress={hideModalError}
          >
            Close
          </GeneralButton> */}
          </View>
          {/* </View> */}
        </Modal>
        <PopUpLoader visible={isLoadingGet} />
        <Modal
          visible={isModalCommentVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={hideModalComment}
        >
          <View style={styles.containermodalView4}>
            <View style={styles.modalContainer}>
              <IconButton
                icon="close"
                size={24}
                onPress={hideModalComment}
                style={styles.closeIcon}
              />
              <Text style={styles.header}>Tambah Komentar</Text>
              {dataComment?.length === 0 ? (
                <View
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    // backgroundColor: "red",
                  }}
                >
                  <Icon
                    name="comment"
                    style={{ fontSize: 48, color: "gray" }}
                  />
                  <Text style={{ color: "gray" }}>Belum Ada Komentar ...</Text>
                </View>
              ) : (
                <FlatList
                  data={dataComment}
                  renderItem={({ item }) => (
                    <View style={styles.commentContainer}>
                      <View style={styles.avatarContainer}>
                        <Text style={styles.avatar}>
                          {item.commentBy.charAt(0).toUpperCase()}
                        </Text>
                      </View>
                      <View style={styles.commentContent}>
                        <Text style={styles.creatorName}>{item.commentBy}</Text>
                        <Text style={styles.commentText}>{item.comment}</Text>
                        <Text style={styles.date}>
                          {moment(item.commentDate).format("YYYY-MM-DD")}
                        </Text>
                      </View>
                      {item?.userId === parseInt(uid) ? (
                        <View>
                          <TouchableOpacity
                            onPress={() => deletetComment(item?.commentId)}
                          >
                            <Icon
                              name="delete-outline"
                              style={{ color: "red", fontSize: 16 }}
                            />
                          </TouchableOpacity>
                        </View>
                      ) : (
                        <></>
                      )}
                    </View>
                  )}
                  keyExtractor={(item, index) => index.toString()}
                  style={styles.commentList}
                />
              )}

              <TextInput
                style={styles.textInput}
                placeholder="Tulis Komentar..."
                multiline
                value={newComment}
                onChangeText={setNewComment}
              />
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={hideModalComment}
                >
                  <Text style={styles.buttonText}>Batalkan</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.sendButton}
                  onPress={() => {
                    insertComment();
                  }}
                >
                  <Text style={styles.buttonText}>Kirim</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        <Modal
          animationType="slide"
          transparent={true}
          visible={isModalScheduleVisible}
          onRequestClose={hideModalSchedule}
        >
          {/* <View style={styles.centeredView}> */}
          <View style={styles.containermodalView3}>
            <View style={{ marginBottom: 32 }}>
              <Text
                style={{
                  color: COLORS.PRIMARY_DARK,
                  fontSize: 18,
                  fontWeight: "500",
                }}
              >
                Jadwalkan Resep
              </Text>
            </View>
            <View>
              <View style={styles.inputForm}>
                <Text style={styles.text}>Resep</Text>
                <GeneralTextInput2
                  // placeholder={moment(dataMember?.dateofBirth).format(
                  //   "DD-MMMM-YYYY"
                  // )}
                  placeholder={selectedMenu}
                  mode="outlined"
                  value={selectedMenu}
                  // onPress={showDatePicker}
                  // hasErrors={authFailed}
                  disabled
                  messageError="Wrong Username/Password"
                  // onChangeText={(e) => setValueNameLast(e)}
                  style={{
                    width: "100%",
                    height: 48,
                    color: COLORS.PRIMARY_DARK,
                  }}
                />
              </View>
              <View style={styles.inputForm}>
                <Text style={styles.text}>Member</Text>

                <DropDownPicker
                  placeholder="Pilih Member"
                  open={openDropDownMember}
                  value={valueMemberId}
                  zIndex={2}
                  items={ddlMember.map((e) => {
                    return {
                      label: e.name,
                      value: e.memberId,
                    };
                  })}
                  setItems={setDdlMember}
                  setOpen={setOpenDropDownMember}
                  setValue={setValueMemberId}
                  //   //   dropDownDirection="BOTTOM"
                  //   placeholderStyle={styles.dropDownText}
                  //   dropDownContainerStyle={styles.dropDownContainer}
                  // ArrowUpIconComponent={() => <ICONS.IconChevronUpArrow />}
                  // ArrowDownIconComponent={() => <ICONS.IconChevronDownArrow />}
                  listMode="SCROLLVIEW"
                  itemKey="ingredientsId"
                  label="name"
                  style={{ borderColor: COLORS.GRAY_SOFT }}
                  //   style={{
                  //     borderWidth: open ? 2 : 1,
                  //     borderColor: open
                  //       ? COLORS.PRIMARY_MEDIUM
                  //       : COLORS.GRAY_MEDIUM,
                  //     height: 60,
                  //   }}
                  // style={{ position: "absolute", bottom: 0, left: 0, right: 0 }}
                />
              </View>

              <View>
                <Text style={styles.text}>Tanggal</Text>
                <View
                  style={{
                    // flex: 1,
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <GeneralTextInput2
                    // placeholder={moment(dataMember?.dateofBirth).format(
                    //   "DD-MMMM-YYYY"
                    // )}
                    placeholder={date.toLocaleDateString()}
                    mode="outlined"
                    value={date.toLocaleDateString()}
                    onPress={showDatePicker}
                    // hasErrors={authFailed}
                    disabled
                    messageError="Wrong Username/Password"
                    // onChangeText={(e) => setValueNameLast(e)}
                    style={{ width: "67%", height: 48 }}
                  />
                  <TouchableOpacity
                    onPress={showDatepicker}
                    style={{
                      backgroundColor: COLORS.PRIMARY_DARK,
                      borderRadius: 6,

                      width: "30%",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Text style={{ color: COLORS.WHITE }}>Pilih</Text>
                  </TouchableOpacity>
                  {showDatePicker && (
                    <DateTimePicker
                      testID="dateTimePicker"
                      value={date}
                      mode="datetime" // Change this to "date" for date-only picker
                      is24Hour={true}
                      display="default"
                      onChange={onChange}
                    />
                  )}
                </View>
              </View>
            </View>

            <View
              style={{
                flexDirection: "row",
                alignSelf: "flex-end",
                marginTop: 32,
              }}
            >
              <GeneralButton
                style={{
                  backgroundColor: COLORS.PRIMARY_MEDIUM,
                  marginRight: 4,
                }}
                mode="contained"
                onPress={hideModalSchedule}
              >
                Tutup
              </GeneralButton>
              <GeneralButton
                style={{ backgroundColor: COLORS.PRIMARY_DARK }}
                mode="contained"
                onPress={handleAddSchedule}
              >
                OK
              </GeneralButton>
            </View>
          </View>
          {/* </View> */}
        </Modal>

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalSuccesVis2}
          onRequestClose={hideModalSuccess2}
        >
          {/* <View style={styles.centeredView}> */}
          <View style={styles.containermodalView}>
            <View style={styles.imgSubmit}>
              <Ionicons
                name="checkmark-circle"
                size={24}
                style={{ fontSize: 72, color: COLORS.SUCCESS }}
              />
            </View>
            <Text style={styles.modalText}>Menu Berhasil di Simpan</Text>
            <GeneralButton
              style={{ backgroundColor: COLORS.PRIMARY_DARK }}
              mode="contained"
              onPress={hideModalSuccess2}
            >
              Kembali
            </GeneralButton>
          </View>
          {/* </View> */}
        </Modal>

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalSuccesVis}
          onRequestClose={hideModalSuccess}
        >
          {/* <View style={styles.centeredView}> */}
          <View style={styles.containermodalView}>
            <View style={styles.imgSubmit}>
              <Ionicons
                name="checkmark-circle"
                size={24}
                style={{ fontSize: 72, color: COLORS.SUCCESS }}
              />
            </View>
            <Text style={styles.modalText}>
              Menu Berhasil di Tambahkan ke Keranjang
            </Text>
            <GeneralButton
              style={{ backgroundColor: COLORS.PRIMARY_DARK }}
              mode="contained"
              onPress={hideModalSuccess}
            >
              Close
            </GeneralButton>
          </View>
          {/* </View> */}
        </Modal>
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
  containermodalView3: {
    flexDirection: "column",
    alignSelf: "center",
    // position: "absolute",
    width: constants.SCREEN_WIDTH * 0.9,
    height: 700,
    paddingHorizontal: 10,
    paddingTop: 0,
    paddingBottom: 28,
    backgroundColor: COLORS.WHITE,
    borderRadius: 10,
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
  modalTextWarning: {
    paddingTop: 20,
    marginBottom: 28,
    textAlign: "center",
    alignSelf: "center",
    fontSize: 15,
    letterSpacing: 1,
    lineHeight: 24,
    width: constants.SCREEN_WIDTH * 0.7,
    fontWeight: "500",
    color: "gray",
  },
  text2: {
    color: "white",
    fontSize: 11,
    fontWeight: "400",
    marginLeft: ms(24),
  },
  containermodalView2: {
    flexDirection: "column",
    flex: 1,
    alignSelf: "center",
    position: "absolute",
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 0,
    backgroundColor: COLORS.WHITE,
    borderRadius: 10,
    width: "90%",
    height: 700,
  },

  modalContainer: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    position: "relative",
    padding: 20,
    maxHeight: "100%", // Ensures the modal doesn’t exceed screen height
    flex: 1,
    justifyContent: "space-between", // Ensure there's space for FlatList and buttons
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    marginTop: 32,
  },
  commentList: {
    // flex: 1,
    marginBottom: 10,
  },

  commentContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.PRIMARY_DARK,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  avatar: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  commentContent: {
    flex: 1,
  },
  creatorName: {
    fontWeight: "bold",
  },
  commentText: {
    fontSize: 13,
  },
  date: {
    fontSize: 12,
    color: "#999",
    marginTop: 5,
  },
  textInput: {
    height: 100,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    color: COLORS.PRIMARY_DARK,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  closeButton: {
    backgroundColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  sendButton: {
    backgroundColor: COLORS.PRIMARY_DARK,
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  closeIcon: {
    position: "absolute",
    right: 10,
    top: 10,
    marginLeft: 12,
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
  containermodalView3: {
    flexDirection: "column",
    alignSelf: "center",
    // position: "absolute",
    width: constants.SCREEN_WIDTH * 0.8,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 28,
    backgroundColor: COLORS.WHITE,
    borderRadius: 10,
  },
  containermodalView4: {
    flexDirection: "column",
    alignSelf: "center",
    // position: "absolute",
    width: constants.SCREEN_WIDTH * 0.9,
    height: 700,
    paddingHorizontal: 10,
    paddingTop: 0,
    paddingBottom: 28,
    backgroundColor: COLORS.WHITE,
    borderRadius: 10,
  },
});
