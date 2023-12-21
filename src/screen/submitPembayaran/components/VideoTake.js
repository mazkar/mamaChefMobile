import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { ms, moderateScale } from "react-native-size-matters";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import { COLORS, FONTS } from "../../../assets/theme";
import { Ionicons, FontAwesome } from "@expo/vector-icons";

const RekamVideo = ({ video, setVideo, videoToShow, setVideoToShow }) => {
  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== "granted") {
          alert("Sorry, we need camera permissions to make this work!");
        }
      }
    })();
  }, []);

  const convertToBase64 = async (videoUri) => {
    let base64data = await FileSystem.readAsStringAsync(videoUri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    setVideo(base64data);
  };

  const recordVideo = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: false,
      aspect: [4, 3],
      quality: 1,
      base64: true,
      bitrateMultiplier: 0.3,
    });

    console.log(result);

    if (!result.cancelled) {
      const fileInfo = await FileSystem.getInfoAsync(result.uri);
      const fileNameFromFileSystem = fileInfo.uri.split("/").pop();
      setVideo(result.uri);
      setVideoToShow(fileNameFromFileSystem);
    }
  };

  return (
    <View>
      <View>
        <TouchableOpacity style={styles.btnAdd} onPress={recordVideo}>
          {video == null ? (
            <>
              <Ionicons
                name="videocam"
                size={11}
                style={{
                  fontSize: 16,
                  color: COLORS.WHITE,
                  marginRight: ms(4),
                }}
              />
              <Text style={{ color: "white", fontWeight: "700" }}>
                Rekam Video
              </Text>
            </>
          ) : (
            <>
              <Ionicons
                name="videocam"
                size={11}
                style={{
                  fontSize: 16,
                  color: COLORS.WHITE,
                  marginRight: ms(4),
                }}
              />
              <Text style={{ color: "white", fontWeight: "700" }}>
                Rekam Ulang
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  btnAdd: {
    borderRadius: moderateScale(10),
    width: widthPercentageToDP(38),
    height: heightPercentageToDP(6),
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.PRIMARY_DARK,
    alignSelf: "flex-start",
    marginBottom: moderateScale(5),
    marginTop: moderateScale(5),
    marginTop: moderateScale(10),
  },
});
export default RekamVideo;
