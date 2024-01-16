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
  Modal,
  Searchbar,
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

import AsyncStorage from "@react-native-async-storage/async-storage";
// iCONS
import FaIcons from "react-native-vector-icons/Ionicons";
import { resetReducer } from "../../store/models/auth/actions";
import { useDispatch, useSelector } from "react-redux";
import API from "../../utils/apiService";
import axios from "axios";
import constants from "../../assets/constants/index.js";
import { baseUrl } from "../../utils/apiURL";
import ImagePickerExample from "./components/ImagePicker";
import ImagePickerVideo from "./components/ImagePickerVideo";
import moment from "moment";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import PhotoTake from "./components/PhotoTake.js";
import RekamVideo from "./components/VideoTake.js";

export default function TambahMenu({ handleNext, navigation }) {
  const [valueNamaMenu, setValueNamaMenu] = useState("");
  const [valueDesc, setValueDesc] = useState("");
  const [valuNote, setValeNote] = useState("");
  const [valueGambar, setValueGambar] = useState(null);
  const [image, setImage] = useState(null);
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
  const [imagetoShow, setImageToShow] = useState(null);
  const [video, setVideo] = useState(null);
  const [videoToShow, setVideoToShow] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [modalSuccesVis, setModalSuccessVis] = useState(false);
  const [modalErroVis, setModalErrorVis] = useState(false);
  const [menuId, setMenuId] = useState([]);

  const handleLogut = () => {
    dispatch(resetReducer());
    navigation.reset({
      index: 0,
      routes: [{ name: "Login" }],
    });
  };

  const hideModalSuccess = () => {
    setModalSuccessVis(false);

    handleNext(menuId);
    // getTaskDetail(route.params.assignmentId);
  };

  const hideModalError = () => {
    setModalErrorVis(false);

    // getTaskDetail(route.params.assignmentId);
  };

  const handlePress = async () => {
    setIsLoading(true);
    // const body = {
    //   MenuName: valueNamaMenu,
    //   Description: "no nte",
    //   Note: valuNote,
    //   PhotoFile: image,
    //   VideoFile: video,
    //   LMBY: user.Email,
    //   IsPublished: 0,
    //   LMDT: `${moment().format("YYYY-MM-DD")}`,
    //   CreatedBy: parseInt(user.UserId),
    // };
    const imageUri = image.replace("file://", ""); // Remove 'file://' from the URI
    const videoUri = video.replace("file://", ""); // Remove 'file://' from the URI

    const formData = new FormData();
    formData.append("MenuName", valueNamaMenu);
    formData.append("Description", valueDesc);
    formData.append("Note", valuNote);
    formData.append("PhotoFile", {
      uri: image,
      name: "photo.jpg",
      type: "image/jpg",
    });

    formData.append("VideoFile", {
      uri: video,
      name: "video.mp4",
      type: "video/mp4",
    });
    formData.append("LMBY", user.Email);
    formData.append("IsPublished", false);
    formData.append("LMDT", `${moment().format("YYYY-MM-DD")}`);
    formData.append("CreatedBy", parseInt(user.UserId));
    // console.log(imageUri, "foto");
    // console.log(videoUri, "video");
    // formData.append("myFile", {
    //   uri: `${image}`, // Replace with the actual file path
    //   name: "evidenceFile",
    //   type: "image/jpg", // Adjust the MIME type according to your file
    // });
    // console.log(formData, "form");
    // let res = await axios({
    //   url: `${baseUrl.URL}api/Menu/RegisterMenuMobile`,
    //   method: "POST",
    //   timeout: 280000,
    //   headers: {
    //     "Content-Type": "multipart/form-data",
    //     Authorization: `Bearer ${token}`,
    //   },
    // });
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    };
    const timeOut = {
      timeout: 200000,
    };

    axios
      .post(`${baseUrl.URL}api/Menu/RegisterMenu`, formData, config, timeOut)
      .then((response) => {
        console.log(response.data);
        setIsLoading(false);
        setModalSuccessVis(true);
        setMenuId(response.data.data[0]?.menuId);
      })
      .catch((error) => {
        console.error("Error uploading the file", error);
        setIsLoading(false);
        setModalErrorVis(true);
      });
  };

  return (
    <ColorBgContainer>
      <RootContainer>
        <AppBar
          title="Kelola Resep"
          dataTaskPending={[]}
          navigation={navigation}
          handleLogut={handleLogut}
        />
        <ScrollView style={styles.mainContainer}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "700",
              color: COLORS.PRIMARY_DARK,
            }}
          >
            Tambah Resep
          </Text>
          <Card
            style={{
              backgroundColor: COLORS.WHITE,
              paddingHorizontal: ms(24),
              paddingVertical: ms(18),
              borderRadius: ms(6),
            }}
          >
            <View style={{ marginBottom: ms(16) }}></View>
            <View>
              <View style={styles.inputForm}>
                <GeneralTextInput
                  placeholder="Nama Resep"
                  mode="outlined"
                  title="Nama Resep"
                  value={valueNamaMenu}
                  // hasErrors={authFailed}
                  messageError="Wrong Username/Password"
                  onChangeText={(e) => setValueNamaMenu(e)}
                  style={styles.inputUserName}
                />
              </View>
              <View style={styles.inputForm}>
                {/* <Text style={styles.text}>Deskripsi</Text> */}

                <GeneralTextInput
                  placeholder="Deskripsi"
                  mode="outlined"
                  value={valueDesc}
                  // hasErrors={authFailed}
                  title="Deskripsi"
                  multiline
                  numberOfLines={10}
                  messageError="Wrong Username/Password"
                  onChangeText={(e) => setValueDesc(e)}
                  style={styles.inputUserName}
                />
              </View>
              <View style={styles.inputForm}>
                <GeneralTextInput
                  placeholder="Catatan"
                  mode="outlined"
                  title="Catatan"
                  // multiline
                  // numberOfLines={5}
                  value={valuNote}
                  // hasErrors={authFailed}
                  messageError="Wrong Username/Password"
                  onChangeText={(e) => setValeNote(e)}
                  style={styles.inputUserName}
                />
              </View>

              <View style={styles.inputForm}>
                <Text style={styles.text}>Upload Gambar</Text>
                <ImagePickerExample
                  image={image}
                  setImage={setImage}
                  imagetoShow={imagetoShow}
                  setImageToShow={setImageToShow}
                />
              </View>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Divider style={{ flex: 1 }} />
                <Text style={{ marginHorizontal: 10, fontWeight: "200" }}>
                  Atau
                </Text>
                <Divider style={{ flex: 1 }} />
              </View>
              <View style={styles.inputForm}>
                {/* <Text style={styles.text}>Upload Gambar</Text> */}
                <PhotoTake
                  image={image}
                  setImage={setImage}
                  imagetoShow={imagetoShow}
                  setImageToShow={setImageToShow}
                />
              </View>

              <View>
                {imagetoShow && (
                  <Image
                    source={{ uri: imagetoShow }}
                    style={{ width: 200, height: 200 }}
                  />
                )}
              </View>
              <View style={styles.inputForm}>
                <Text style={styles.text}>Upload Video</Text>
                <ImagePickerVideo
                  video={video}
                  setVideo={setVideo}
                  videoToShow={videoToShow}
                  setVideoToShow={setVideoToShow}
                />
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Divider style={{ flex: 1 }} />
                  <Text style={{ marginHorizontal: 10, fontWeight: "200" }}>
                    Atau
                  </Text>
                  <Divider style={{ flex: 1 }} />
                </View>
                <RekamVideo
                  video={video}
                  setVideo={setVideo}
                  videoToShow={videoToShow}
                  setVideoToShow={setVideoToShow}
                />

                <Text style={{ color: COLORS.PRIMARY_DARK }}>
                  {videoToShow}
                </Text>
              </View>

              <View>
                <TouchableOpacity style={styles.button} onPress={handlePress}>
                  <FontAwesome
                    name="pencil-square-o"
                    size={11}
                    style={{
                      fontSize: 18,
                      color: COLORS.WHITE,
                      marginRight: ms(4),
                    }}
                  />
                  <Text style={{ color: "white" }}>Tambah Resep</Text>
                </TouchableOpacity>
              </View>
              {/* <View>
              <TouchableOpacity
                style={styles.button}
                onPress={() => console.log(image)}
              >
                <Text style={{ color: "white" }}>test</Text>
              </TouchableOpacity>
            </View> */}
            </View>
          </Card>
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
            <Text style={styles.modalText}>Data Berhasil di Tambahkan</Text>
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
            <Text style={styles.modalText}>Error</Text>
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
        {isLoading ? (
          <PopUpLoader visible={true} />
        ) : (
          <PopUpLoader visible={false} />
        )}
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
  button: {
    borderRadius: moderateScale(10),
    width: widthPercentageToDP(86),
    height: heightPercentageToDP(7),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.PRIMARY_DARK,
    alignSelf: "center",
    flexDirection: "row",
    marginBottom: moderateScale(32),
    marginTop: moderateScale(18),
  },
  btnAdd: {
    borderRadius: moderateScale(10),
    width: widthPercentageToDP(38),
    height: heightPercentageToDP(6),
    justifyContent: "center",
    alignItems: "center",

    backgroundColor: COLORS.PRIMARY_MEDIUM,
    alignSelf: "flex-end",
    marginBottom: moderateScale(5),
    marginTop: moderateScale(5),
    marginTop: moderateScale(10),
  },
  continerSearch: {
    // paddingHorizontal: 8,
    // paddingVertical: 8,
  },
  inputForm: {
    marginTop: ms(6),
  },
  text: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.PRIMARY_DARK,
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
