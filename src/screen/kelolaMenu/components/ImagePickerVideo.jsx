// components/ImagePickerExample.js
import React, { useState, useEffect } from "react";
import {
  View,
  Button,
  Image,
  Platform,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { moderateScale, ms } from "react-native-size-matters";
import { GeneralButton } from "../../../component";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import { COLORS, FONTS } from "../../../assets/theme";
import * as FileSystem from "expo-file-system";
import { Ionicons, FontAwesome } from "@expo/vector-icons";

const ImagePickerVideo = ({ video, setVideo, videoToShow, setVideoToShow }) => {
  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          alert("Sorry, we need camera roll permissions to make this work!");
        }
      }
    })();
  }, []);

  const convertToBase64 = async (imageUri) => {
    let base64data = await FileSystem.readAsStringAsync(imageUri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    setVideo(base64data);
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: false,
      aspect: [4, 3],
      quality: 1,
      base64: true,
      bitrateMultiplier: 0.5,
    });

    console.log(result);

    if (!result.cancelled) {
      const fileInfo = await FileSystem.getInfoAsync(result.uri);
      const fileNameFromFileSystem = fileInfo.uri.split("/").pop();
      // convertToBase64(result.uri);
      setVideo(result.uri);
      setVideoToShow(fileNameFromFileSystem);
    }
  };

  return (
    <View>
      <View>
        <TouchableOpacity style={styles.btnAdd} onPress={pickImage}>
          {video == null ? (
            <>
              <FontAwesome
                name="image"
                size={11}
                style={{
                  fontSize: 16,
                  color: COLORS.WHITE,
                  marginRight: ms(4),
                }}
              />
              <Text style={{ color: "white", fontWeight: "700" }}>
                Pilih Video
              </Text>
            </>
          ) : (
            <>
              <FontAwesome
                name="image"
                size={11}
                style={{
                  fontSize: 16,
                  color: COLORS.WHITE,
                  marginRight: ms(4),
                }}
              />
              <Text style={{ color: "white", fontWeight: "700" }}>
                Pilih Ulang Video
              </Text>
            </>
          )}
          {/* <Text>{videoToShow}</Text> */}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  btnAdd: {
    borderRadius: moderateScale(10),
    width: widthPercentageToDP(38),
    flexDirection: "row",
    height: heightPercentageToDP(6),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.PRIMARY_DARK,
    alignSelf: "flex-start",
    marginBottom: moderateScale(5),
    marginTop: moderateScale(5),
    marginTop: moderateScale(10),
  },
});

export default ImagePickerVideo;
