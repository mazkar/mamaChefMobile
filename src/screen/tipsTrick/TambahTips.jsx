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

export default function TambahTips({ navigation }) {
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
  const [messageError, setMessageError] = useState("");

  const hideModalSuccess = () => {
    setModalSuccessVis(false);

    navigation.navigate("Tips");
    // getTaskDetail(route.params.assignmentId);
  };

  const hideModalError = () => {
    setModalErrorVis(false);

    // getTaskDetail(route.params.assignmentId);
  };

  const handlePress = async () => {
    setIsLoading(true);
    const body = {
      name: valueNamaMenu,
      description: valueDesc,
      videoFile: video,
      createdBy: parseInt(user.UserId),
    };

    // const formData = new FormData();
    // formData.append("MenuName", valueNamaMenu);
    // formData.append("Description", valueDesc);
    // formData.append("Note", valuNote);
    // formData.append("PhotoFile", image);
    // formData.append("VideoFile", video);
    // formData.append("LMBY", user.Email);
    // formData.append("IsPublished", false);
    // formData.append("LMDT", `${moment().format("YYYY-MM-DD")}`);
    // formData.append("CreatedBy", parseInt(user.UserId));

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
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    const timeOut = {
      timeout: 200000,
    };

    axios
      .post(
        `${baseUrl.URL}api/TipsTricks/inserttipstrickmobile`,
        body,
        config,
        timeOut
      )
      .then((response) => {
        console.log(response.data);
        setIsLoading(false);
        setModalSuccessVis(true);
        // setMenuId(response.data.data[0]?.menuId);
      })
      .catch((error) => {
        console.error("Error uploading the file", error);
        setIsLoading(false);
        setModalErrorVis(true);
        setMessageError(error.message);
      });
  };

  return (
    <ColorBgContainer>
      <RootContainer>
        <AppBar title="Tips & Trick" dataTaskPending={[]} />
        <ScrollView style={styles.mainContainer}>
          <View style={{ marginBottom: ms(24) }}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: "700",
                color: COLORS.PRIMARY_DARK,
              }}
            >
              Tambah Tips & Trick
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

          <Card
            style={{
              backgroundColor: COLORS.PRIMARY_ULTRASOFT,
              paddingHorizontal: ms(24),
              paddingVertical: ms(32),
              borderRadius: ms(6),
            }}
          >
            <View style={{ marginBottom: ms(16) }}></View>
            <View>
              <View style={styles.inputForm}>
                {/* <Text style={styles.text}>Nama Menu</Text> */}

                <GeneralTextInput
                  placeholder="Nama Menu"
                  mode="outlined"
                  label="Judul"
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
                  label="Deskripsi"
                  // hasErrors={authFailed}
                  multiline
                  numberOfLines={10}
                  messageError="Wrong Username/Password"
                  onChangeText={(e) => setValueDesc(e)}
                  style={styles.inputUserName}
                />
              </View>

              <View style={styles.inputForm}>
                <Text style={styles.text}>Upload Vide</Text>
                <ImagePickerVideo
                  video={video}
                  setVideo={setVideo}
                  videoToShow={videoToShow}
                  setVideoToShow={setVideoToShow}
                />
              </View>
              <Text style={{ color: COLORS.PRIMARY_DARK }}>{videoToShow}</Text>
              <View>
                <TouchableOpacity style={styles.button} onPress={handlePress}>
                  <Text style={{ color: "white" }}>Tambahkan Tips</Text>
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
            <Text style={styles.modalText}>{messageError}</Text>
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
    alignSelf: "stretch",
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
