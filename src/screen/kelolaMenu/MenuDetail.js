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
import moment from "moment";
import { Video } from "expo-av";
import * as FileSystem from "expo-file-system";

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

  return (
    <ColorBgContainer>
      <RootContainer>
        <AppBar title="Kelola Resep" dataTaskPending={[]} />

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
              uri: `data:image/png;base64,${dataMenu.photoURL}`,
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
                  color: COLORS.PRIMARY_DARK,
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
              <View style={{ marginBottom: ms(22) }}>
                <Text style={{ fontSize: ms(22), color: COLORS.GRAY_HARD }}>
                  Deskripsi
                </Text>
              </View>
              <Text style={{ color: COLORS.PRIMARY_DARK }}>
                {dataMenu.description}
              </Text>
              <View style={{ marginBottom: ms(22), marginTop: ms(12) }}>
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
                  uri: `data:video/mp4;base64,${dataMenu.videoURL}`,
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
          </View>
        </ScrollView>
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
});
