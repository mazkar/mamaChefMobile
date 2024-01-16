import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  StyleSheet,
  FlatList,
  Image,
  ActivityIndicator,
} from "react-native";
import React, { useState, useCallback, useEffect, useRef } from "react";
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
import { Video } from "expo-av";
import { decode } from "base-64";

import * as FileSystem from "expo-file-system";
import moment from "moment/moment";
// import RNFS from "react-native-fs";
import LazyLoad from "react-lazyload";

export default function DetailTips({ navigation, route }) {
  const uid = useSelector((state) => state?.auth?.user?.UserId);
  const token = useSelector((state) => state.auth.token);
  const [isLoadingGet, setIsLoadingGet] = useState(false);
  const [dataTips, setDataTips] = useState([]);
  const [dataTanggal, setDataTangal] = useState([]);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [base64, setBase64] = useState(null);
  const dispatch = useDispatch();
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isVideoLoading, setIsVideoLoading] = useState(true);
  const [isVideoError, setIsVideoError] = useState(false);

  const handleLoadStart = () => {
    setIsVideoLoading(true);
    setIsVideoError(false);
  };

  const handleLoad = () => {
    setIsVideoLoading(false);
    setIsVideoError(false);
  };

  const handleError = () => {
    setIsVideoLoading(false);
    setIsVideoError(true);
  };

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

  async function getTips(userId) {
    setIsLoadingGet(true);
    try {
      let res = await axios({
        url: `${baseUrl.URL}api/TipsTricks/gettipsandtricksdetail/${route.params.id}`,
        method: "get",
        timeout: 8000,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(res, "==meeeeeeeee");
      //   convertBase64ToUrl(res.data.data.video);
      setBase64(res.data.data.video);
      setDataTips(res.data.data);
      setDataTangal(res.data.data.createdDate);
      // test for status you want, etc
      // console.log(res.data.data, "==meeeeeeeee");

      //   convertBase64ToUrl(res.data.data.video, "Video")
      //     .then((filePath) => {
      //       setDataTips(filePath);
      //     })
      //     .catch((error) => {
      //       console.error("Error:", error);
      //     });

      setIsLoadingGet(false);
      // console.log(res.data, "transit");

      // Don't forget to return something
      return res.data;
    } catch (err) {
      console.error(err, "error fetch");

      setIsLoadingGet(false);
    }
  }

  useEffect(() => {
    getTips();
  }, []);

  //   useFocusEffect(
  //     React.useCallback(() => {
  //       // Do something when the screen is focused
  //       // console.log("Screen is focused");
  //       getTips();
  //       // Add your logic here to update the component or fetch new data

  //       // Example: Refresh data or update components
  //     }, [])
  //   );

  const handleLogut = () => {
    dispatch(resetReducer());
    navigation.reset({
      index: 0,
      routes: [{ name: "Login" }],
    });
  };

  const handleVideoRef = async (component) => {
    const playbackObject = component;
    if (playbackObject) {
      await playbackObject.loadAsync({ uri: dataTips?.video });
    }
  };

  return (
    <ColorBgContainer>
      <RootContainer>
        <AppBar
          title="Tips & Trick"
          dataTaskPending={[]}
          navigation={navigation}
          handleLogut={handleLogut}
        />

        <View style={styles.mainContainer}>
          <View style={{ marginTop: ms(12) }}>
            {/* <View style={{ marginBottom: ms(22) }}>
              <Text style={{ fontSize: ms(22), color: COLORS.GRAY_HARD }}>
                Video Tips & Trick
              </Text>
            </View> */}
            <Video
              ref={videoRef}
              source={{
                uri: `${dataTips?.video}`,
              }}
              style={styles.video}
              // shouldPlay
              isLooping
              resizeMode="contain"
              onLoadStart={handleLoadStart}
              onLoad={handleLoad}
              useNativeControls
              onError={handleError}
            />
            <View style={styles.buttonContainer}>
              <Button
                title={isPlaying ? "Pause" : "Play"}
                onPress={togglePlay}
              />
            </View>

            {isVideoLoading && !isVideoError && (
              <View
                style={{
                  ...StyleSheet.absoluteFillObject,
                  justifyContent: "flex-start",
                  alignItems: "center",
                }}
              >
                <ActivityIndicator size="large" color={COLORS.PRIMARY_DARK} />
                <Text style={{ color: "grey" }}>Menunggu Video ...</Text>
              </View>
            )}

            {isVideoError && (
              <View
                style={{
                  ...StyleSheet.absoluteFillObject,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text>Error loading video</Text>
              </View>
            )}
            {/* <Video
              ref={videoRef}
              source={{
                uri: `${dataTips?.video}`,
              }}
              style={styles.video}
              useNativeControls // Enable built-in controls
              resizeMode="contain"
              isLooping
              onLoadStart={() => setIsPreloading(true)}
              onReadyForDisplay={() => setIsPreloading(false)}
            /> */}
          </View>
          <View style={{ marginBottom: ms(16) }}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: "700",
                color: "gray",
              }}
            >
              {dataTips?.namaTipsTricks}
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

          {/* <View
            style={{
              flexDirection: "row",
              // backgroundColor: COLORS.PRIMARY_ULTRASOFT,
              padding: ms(0),
              borderRadius: ms(6),
            }}
          >
            <View style={{ alignSelf: "center" }}>
              <Avatar.Text
                size={38}
                label="A"
                color={COLORS.PRIMARY_ULTRASOFT}
              />
            </View>
            <View style={{ marginLeft: ms(6) }}>
              <Text>
                <Text style={{ color: COLORS.DARK }}>dibuat oleh {""}</Text>
                <Text style={{ color: COLORS.PRIMARY_DARK }}>
                  aulian26@gmail.com
                </Text>
              </Text>

              <Text
                style={{ color: COLORS.DARK, fontSize: 11, fontWeight: "300" }}
              >
                Tanggal {moment(dataTanggal).format("YYYY-MMM-DD")}
              </Text>
            </View>
          </View> */}
          <Divider style={{ height: ms(2), marginTop: ms(24) }} />
          <View style={{ paddingHorizontal: ms(12) }}>
            <View
              style={{
                marginTop: ms(12),
                // backgroundColor: COLORS.PRIMARY_MEDIUM,
              }}
            >
              <View style={{ marginBottom: ms(22) }}>
                <Text style={{ fontSize: ms(22), color: COLORS.PRIMARY_DARK }}>
                  Tips Anda
                </Text>
              </View>
              <Text style={{ color: "gray" }}>{dataTips?.description}</Text>
            </View>
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
  video: {
    width: ms(340),
    height: 200,
    alignSelf: "center",
    borderRadius: ms(10),
  },
  buttonContainer: {
    marginTop: 20,
  },
});
