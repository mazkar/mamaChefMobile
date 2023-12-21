import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  StyleSheet,
  FlatList,
  Image,
  Animated,
  Dimensions,
} from "react-native";
import React, { useState, useRef, useEffect } from "react";
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
  Modal,
} from "react-native-paper";
import { ms, moderateScale } from "react-native-size-matters";
import {
  AppBar,
  GeneralButton,
  OverviewProgres,
  PopUpLoader,
  GeneralTextInput,
} from "../../component/index";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import constants from "../../assets/constants/index.js";

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
import moment from "moment";
import { Video } from "expo-av";
import * as FileSystem from "expo-file-system";
import PopUpConfirm from "./components/PopUpConfirm.jsx";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export default function MenuDetail({ navigation, route }) {
  const uid = useSelector((state) => state?.auth?.user?.UserId);
  const token = useSelector((state) => state.auth.token);
  const [isLoadingGet, setIsLoadingGet] = useState(false);
  const [dataMenu, setDataMenu] = useState([]);
  const [dataIng, setDataIng] = useState([]);
  const [searchQuery, setSearchQuery] = React.useState("");
  const scrollY = useRef(new Animated.Value(0)).current;
  const [videoUri, setVideoUri] = useState(null);
  const [modalSuccesVis, setModalSuccessVis] = useState(false);
  const [modalSuccesVis2, setModalSuccessVis2] = useState(false);
  const [modalErroVis, setModalErrorVis] = useState(false);
  const [modalEditDescVisible, setModalEditDescVisible] = useState(false);
  const [valueDesc, setValueDesc] = useState("");
  const [selectedDesc, setSelectedDesc] = useState("");

  const [modalEditNoteVisible, setModalEditNoteVisible] = useState(false);
  const [valueNote, setValueNote] = useState("");
  const [selectedNote, setSelectedNote] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const dispatch = useDispatch();
  const [popUpConfirmVis, setPopUpConfirmVis] = useState(false);

  const handleLogut = () => {
    dispatch(resetReducer());
    navigation.reset({
      index: 0,
      routes: [{ name: "Login" }],
    });
  };

  const converBase64 = (file) => {
    const base64Video = file;

    // Create a file URI
    const fileUri = `${FileSystem.documentDirectory}video.mp4`;

    // Save base64 content to a file
    FileSystem.writeAsStringAsync(fileUri, base64Video, {
      encoding: FileSystem.EncodingType.Base64,
    })
      .then(() => {
        setVideoUri(fileUri);
      })
      .catch((error) => {
        console.error("Error writing base64 to file:", error);
      });
  };

  const imageOpacity = scrollY.interpolate({
    inputRange: [0, 300], // Adjust the range based on when you want the image to start disappearing
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  const imageScale = scrollY.interpolate({
    inputRange: [0, 100], // Adjust the range based on when you want the image to start zooming
    outputRange: [1, 2], // Adjust the zoom level as needed
    extrapolate: "clamp",
  });

  async function getMenu(userId) {
    setIsLoadingGet(true);
    try {
      let res = await axios({
        url: `${baseUrl.URL}api/Menu/menudetail/${route.params.menuId}`,
        method: "get",
        timeout: 8000,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.status == 200) {
        // test for status you want, etc
        console.log(res.data, "res meni id");
        setDataMenu(res.data.data.menuById);
        setDataIng(res.data.data.menuIng);
        setIsLoadingGet(false);
        converBase64(res.data.data.menuById.videoURL);
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
    getMenu(uid);
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      // Do something when the screen is focused
      console.log("Screen is focused");
      getMenu(uid);
      // Add your logic here to update the component or fetch new data

      // Example: Refresh data or update components
    }, [])
  );

  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pauseAsync();
      } else {
        videoRef.current.playAsync();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const showModalEdit = (val) => {
    setModalEditDescVisible(true);
    setSelectedDesc(val);
    console.log(val);
  };

  const hideModalEdit = () => {
    setModalEditDescVisible(false);
    getMenu(uid);
  };

  const showModalEditNote = (val) => {
    setModalEditNoteVisible(true);
    setSelectedNote(val);
    console.log(val);
  };

  const hideModalEditNote = () => {
    setModalEditNoteVisible(false);
    getMenu(uid);
  };
  const hideModalSuccess = () => {
    setModalSuccessVis(false);
    setModalEditDescVisible(false);
    setModalEditNoteVisible(false);
    getMenu(uid);

    // handleNext(menuId);
    // getTaskDetail(route.params.assignmentId);
  };

  const hideModalSuccess2 = () => {
    setModalSuccessVis2(false);
    setModalEditDescVisible(false);
    setModalEditNoteVisible(false);
    getMenu(uid);
    navigation.navigate("KelolaMenu");
    // handleNext(menuId);
    // getTaskDetail(route.params.assignmentId);
  };

  const hideModalError = () => {
    setModalErrorVis(false);

    // getTaskDetail(route.params.assignmentId);
  };

  const showPopUpConfirm = () => {
    setPopUpConfirmVis(true);
  };

  const hidePopUp = () => {
    setPopUpConfirmVis(false);
  };

  async function handleEditDescr() {
    setIsLoadingGet(true);

    const body = {
      menuId: dataMenu?.menuId,
      description: valueDesc,
      lmby: parseInt(uid),
      // lmdt: moment().format("YYYY-MM-DD hh:mm:ss"),
      lmdt: moment().format("YYYY-MM-DD"),
    };

    try {
      console.log(body);
      let res = await axios({
        url: `${baseUrl.URL}api/Menu/updatemenudescription`,
        method: "PUT",
        timeout: 8000,
        data: body,
        headers: {
          "Content-Type": "application/json",
          // Authorization: `Bearer ${token}`,
        },
      });
      console.log(res, "Success");
      console.log(res, "<= res");
      if (res.status == "200") {
        console.log(res.data.data, "<= res");
        setIsLoadingGet(false);
        // dispatch(setUserId(res.data.data[0]?.userId));
        setSuccessMsg(res.data.message);
        setModalSuccessVis(true);
        setModalEditDescVisible(false);

        // test for status you want, etc
        // setLoadingUpload(false);
        // getTaskDetail(route.params.assignmentId);
        console.log(res, "Success");

        // setDataItem(res.data);
        // setDataInfo(res.data);
      } else {
        setIsLoadingGet(false);
        setModalEditDescVisible(false);
      }
      // Don't forget to return something
      return res.data;
    } catch (err) {
      console.error(err, "error");
      setModalErrorVis(true);
      setIsLoadingGet(false);
      setErrorMsg(err.message);
      setModalEditDescVisible(false);
    }
  }

  async function handleEditNote() {
    setIsLoadingGet(true);

    const body = {
      menuId: dataMenu?.menuId,
      note: valueNote,
      lmby: parseInt(uid),
      // lmdt: moment().format("YYYY-MM-DD hh:mm:ss"),
      lmdt: moment().format("YYYY-MM-DD"),
    };

    try {
      console.log(body);
      let res = await axios({
        url: `${baseUrl.URL}api/Menu/updatemenunote`,
        method: "PUT",
        timeout: 8000,
        data: body,
        headers: {
          "Content-Type": "application/json",
          // Authorization: `Bearer ${token}`,
        },
      });
      console.log(res, "Success");
      console.log(res, "<= res");
      if (res.status == "200") {
        console.log(res.data.data, "<= res");
        setIsLoadingGet(false);
        // dispatch(setUserId(res.data.data[0]?.userId));

        setModalSuccessVis(true);
        setModalEditNoteVisible(false);
        setSuccessMsg(res.data.message);
        // test for status you want, etc
        // setLoadingUpload(false);
        // getTaskDetail(route.params.assignmentId);
        console.log(res, "Success");

        // setDataItem(res.data);
        // setDataInfo(res.data);
      } else {
        setIsLoadingGet(false);
        setModalEditNoteVisible(false);
      }
      // Don't forget to return something
      return res.data;
    } catch (err) {
      console.error(err, "error");
      setModalErrorVis(true);
      setIsLoadingGet(false);
      setErrorMsg(err.message);
      setModalEditNoteVisible(false);
    }
  }

  async function handlePublished(stat) {
    setIsLoadingGet(true);

    const body = {
      menuId: dataMenu?.menuId,
      status: stat,
      lmby: parseInt(uid),
      // lmdt: moment().format("YYYY-MM-DD hh:mm:ss"),
      lmdt: moment().format("YYYY-MM-DD"),
    };

    try {
      console.log(body);
      let res = await axios({
        url: `${baseUrl.URL}api/Menu/updatemenustatus`,
        method: "PUT",
        timeout: 8000,
        data: body,
        headers: {
          "Content-Type": "application/json",
          // Authorization: `Bearer ${token}`,
        },
      });
      console.log(res, "Success");
      console.log(res, "<= res");
      if (res.status == "200") {
        console.log(res.data.data, "<= res");
        setIsLoadingGet(false);
        // dispatch(setUserId(res.data.data[0]?.userId));

        setModalSuccessVis2(true);
        setPopUpConfirmVis(false);
        setSuccessMsg(res.data.message);
        // test for status you want, etc
        // setLoadingUpload(false);
        // getTaskDetail(route.params.assignmentId);
        console.log(res, "Success");

        // setDataItem(res.data);
        // setDataInfo(res.data);
      } else {
        setIsLoadingGet(false);
        setPopUpConfirmVis(false);
      }
      // Don't forget to return something
      return res.data;
    } catch (err) {
      console.error(err, "error");
      setModalErrorVis(true);
      setPopUpConfirmVis(false);
      setIsLoadingGet(false);
      setErrorMsg(err.message);
    }
  }

  return (
    <ColorBgContainer>
      <RootContainer>
        <AppBar
          title="Kelola Resep"
          dataTaskPending={[]}
          navigation={navigation}
          handleLogut={handleLogut}
        />

        <ScrollView
          style={styles.scrollView}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false }
          )}
          scrollEventThrottle={16}
        >
          <Animated.Image
            source={{
              uri: `${dataMenu.photoURL}`,
            }}
            style={[
              styles.image,
              {
                opacity: imageOpacity,
                width: screenWidth,
                height: ms(299),
                transform: [{ scale: imageScale }],
              },
            ]}
          />
          <View style={{ paddingHorizontal: ms(12) }}>
            <View
              style={{
                marginBottom: ms(16),
                marginTop: ms(18),
                paddingHorizontal: ms(8),
              }}
            >
              <Text
                style={{
                  fontSize: 24,
                  fontWeight: "700",
                  color: "gray",
                }}
              >
                {dataMenu.menuName}
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
            <View style={{ flex: 1, flexDirection: "row" }}>
              <View style={{}}>
                <Avatar.Text
                  size={86}
                  label={dataMenu?.lmby?.charAt(0)?.toUpperCase()}
                  lable="A"
                />
              </View>
              <View style={{ marginLeft: ms(14), marginTop: ms(12) }}>
                <Text style={{ fontWeight: "600" }}>{dataMenu.lmby}</Text>
                <Text style={{ fontSize: 11 }}>
                  {moment(dataMenu.lmdt).format("DD-MMM-YYYY")}
                </Text>

                {route?.params?.isEdit ? (
                  <View
                    style={{
                      backgroundColor: dataMenu?.isPublished
                        ? "green"
                        : COLORS.RED_BG,
                      // backgroundColor: COLORS.RED_BG,
                      width: dataMenu?.isPublished ? ms(76) : ms(106),
                      width: ms(106),
                      paddingHorizontal: ms(6),
                      paddingVertical: ms(6),
                      alignItems: "center",
                      borderRadius: ms(12),
                    }}
                  >
                    <Text
                      style={{
                        fontWeight: "bold",
                        color: COLORS.WHITE,
                        fontSize: ms(11),
                        maxWidth: 200,
                      }}
                    >
                      {dataMenu?.isPublished ? "Published" : "Not Published"}
                    </Text>
                  </View>
                ) : (
                  <></>
                )}
              </View>
            </View>

            <Divider style={{ marginTop: ms(48), height: ms(2) }} />
            {/* Bahan-Bahan */}
            <View style={{ marginTop: ms(12) }}>
              <View style={{ marginBottom: ms(22) }}>
                <Text style={{ fontSize: ms(22), color: COLORS.GRAY_HARD }}>
                  Bahan
                </Text>
              </View>
              {dataIng?.map((e, i) => (
                <>
                  <View style={{ flexDirection: "row" }}>
                    <View
                      style={{
                        backgroundColor: COLORS.PRIMARY_DARK,
                        width: 24,
                        height: 24,
                        borderRadius: 12,
                        alignItems: "center",
                      }}
                    >
                      <Text
                        style={{
                          //   marginRight: ms(4),
                          fontSize: 14,
                          alignSelf: "center",
                          color: COLORS.WHITE,
                        }}
                      >
                        {i + 1}
                      </Text>
                    </View>

                    <Text
                      style={{
                        fontSize: 16,
                        color: COLORS.GRAY_HARD,
                        marginRight: ms(2),
                        marginLeft: ms(8),
                      }}
                    >
                      {e.quantity}
                    </Text>
                    <Text
                      style={{
                        marginLeft: ms(2),
                        marginRight: ms(4),
                        fontSize: 16,
                        color: COLORS.GRAY_HARD,
                      }}
                    >
                      {e.uom}
                    </Text>
                    <Text
                      style={{
                        marginRight: ms(4),
                        fontSize: 16,
                        color: COLORS.GRAY_HARD,
                      }}
                    >
                      {e.ingredientsName}
                    </Text>
                  </View>
                  <Divider style={{ marginTop: ms(6) }} />
                </>
              ))}
            </View>
            <Divider style={{ height: ms(2), marginTop: ms(24) }} />
            {/* Deskripsi */}
            <View style={{ marginTop: ms(12) }}>
              <View style={{ marginBottom: ms(22), flexDirection: "row" }}>
                <Text style={{ fontSize: ms(22), color: COLORS.GRAY_HARD }}>
                  Deskripsi
                </Text>
              </View>
              <Text style={{ color: COLORS.PRIMARY_DARK }}>
                {dataMenu?.description}
              </Text>
              <View
                style={{
                  marginBottom: ms(22),
                  marginTop: ms(12),
                  flexDirection: "row",
                }}
              >
                <Text style={{ fontSize: ms(22), color: COLORS.GRAY_HARD }}>
                  Catatan
                </Text>
              </View>
              <Text style={{ color: COLORS.PRIMARY_DARK }}>
                {dataMenu.note}
              </Text>
            </View>

            <Divider style={{ height: ms(2), marginTop: ms(24) }} />
            <View style={{ marginTop: ms(12) }}>
              <View style={{ marginBottom: ms(22) }}>
                <Text style={{ fontSize: ms(22), color: COLORS.GRAY_HARD }}>
                  Video Memasak
                </Text>
              </View>
              <Video
                ref={videoRef}
                // source={{ uri: videoUri }}
                source={{
                  uri: `${dataMenu.videoURL}`,
                }}
                style={styles.video}
                useNativeControls // Enable built-in controls
                resizeMode="contain"
                isLooping
              />
              <View style={styles.buttonContainer}>
                <Button
                  title={isPlaying ? "Pause" : "Play"}
                  onPress={togglePlay}
                />
              </View>
            </View>
            {route.params?.isEdit ? (
              dataMenu?.isPublished ? (
                <TouchableOpacity
                  onPress={showPopUpConfirm}
                  style={{
                    alignSelf: "center",
                    backgroundColor: COLORS.RED_BG,
                    width: ms(186),
                    height: ms(44),
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 12,
                    // marginBottom: ms(32),
                  }}
                >
                  <Text style={{ color: COLORS.WHITE }}>Sembunyikan Resep</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={showPopUpConfirm}
                  style={{
                    alignSelf: "center",
                    backgroundColor: "green",
                    width: ms(186),
                    height: ms(44),
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 12,
                    // marginBottom: ms(32),
                  }}
                >
                  <Text style={{ color: COLORS.WHITE }}>Publish Resep</Text>
                </TouchableOpacity>
              )
            ) : (
              <></>
            )}
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("EditBahan", {
                  menuId: route?.params?.menuId,
                })
              }
              style={{
                alignSelf: "center",
                backgroundColor: COLORS.PRIMARY_MEDIUM,
                width: ms(186),
                height: ms(44),
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 12,
                marginBottom: ms(32),
                marginTop: ms(8),
              }}
            >
              <Text style={{ color: COLORS.WHITE }}>Perbarui Resep</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
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
            <Text style={styles.modalText}>{successMsg}</Text>
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
            <Text style={styles.modalText}>{successMsg}</Text>
            <GeneralButton
              style={{ backgroundColor: COLORS.PRIMARY_DARK }}
              mode="contained"
              onPress={hideModalSuccess2}
            >
              Close
            </GeneralButton>
          </View>
          {/* </View> */}
        </Modal>

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
            <Text style={styles.modalText}>{errorMsg}</Text>
            <GeneralButton
              style={{ backgroundColor: COLORS.PRIMARY_MEDIUM }}
              mode="contained"
              onPress={hideModalError}
            >
              Close
            </GeneralButton>
          </View>
          {/* </View> */}
        </Modal>

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalEditDescVisible}
          onRequestClose={hideModalEdit}
        >
          {/* <View style={styles.centeredView}> */}
          <View style={styles.containermodalView}>
            <View>
              <Text
                style={{
                  fontWeight: "600",
                  fontSize: ms(18),
                  color: COLORS.PRIMARY_DARK,
                }}
              >
                Edit Deskripsi
              </Text>
            </View>
            <View style={{ marginBottom: ms(12) }}>
              {/* <Text style={styles.text}>Deskripsi</Text> */}

              <GeneralTextInput
                placeholder={selectedDesc}
                mode="outlined"
                value={valueDesc}
                // hasErrors={authFailed}
                label={selectedDesc}
                multiline
                numberOfLines={10}
                messageError="Wrong Username/Password"
                onChangeText={(e) => setValueDesc(e)}
                style={styles.inputUserName}
              />
            </View>
            <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
              <GeneralButton
                style={{ backgroundColor: COLORS.PRIMARY_DARK }}
                mode="contained"
                onPress={hideModalEdit}
              >
                Close
              </GeneralButton>
              <GeneralButton
                style={{ backgroundColor: COLORS.PRIMARY_DARK, marginLeft: 8 }}
                mode="contained"
                onPress={handleEditDescr}
              >
                Submit
              </GeneralButton>
            </View>
          </View>
          {/* </View> */}
        </Modal>

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalEditNoteVisible}
          onRequestClose={hideModalEditNote}
        >
          {/* <View style={styles.centeredView}> */}
          <View style={styles.containermodalView}>
            <View>
              <Text
                style={{
                  fontWeight: "600",
                  fontSize: ms(18),
                  color: COLORS.PRIMARY_DARK,
                }}
              >
                Edit Catatan
              </Text>
            </View>
            <View style={{ marginBottom: ms(12) }}>
              {/* <Text style={styles.text}>Deskripsi</Text> */}

              <GeneralTextInput
                placeholder={selectedNote}
                mode="outlined"
                value={valueNote}
                // hasErrors={authFailed}
                label={selectedNote}
                multiline
                numberOfLines={10}
                messageError="Wrong Username/Password"
                onChangeText={(e) => setValueNote(e)}
                style={styles.inputUserName}
              />
            </View>
            <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
              <GeneralButton
                style={{ backgroundColor: COLORS.PRIMARY_DARK }}
                mode="contained"
                onPress={hideModalEditNote}
              >
                Close
              </GeneralButton>
              <GeneralButton
                style={{ backgroundColor: COLORS.PRIMARY_DARK, marginLeft: 8 }}
                mode="contained"
                onPress={handleEditNote}
              >
                Submit
              </GeneralButton>
            </View>
          </View>
          {/* </View> */}
        </Modal>
        <PopUpConfirm
          popUpVisible={popUpConfirmVis}
          hidePopUp={hidePopUp}
          stat={dataMenu?.isPublished ? "active" : "inActive"}
          handleClick={handlePublished}
          name={dataMenu?.menuName}
        />
      </RootContainer>
      <PopUpLoader visible={isLoadingGet} />
    </ColorBgContainer>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  image: {
    width: 200,
    height: 200,
    alignSelf: "center",
  },
  video: {
    width: 300,
    height: 200,
    alignSelf: "center",
  },
  buttonContainer: {
    marginTop: 20,
  },
  containermodalView: {
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
});
