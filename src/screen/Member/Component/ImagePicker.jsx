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

const ImagePickers = ({ image, setImage }) => {
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

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  return (
    <View>
      <View>
        <TouchableOpacity style={styles.btnAdd} onPress={pickImage}>
          {image == null ? (
            <Text style={{ color: "white", fontWeight: "700" }}>
              Pilih Gambar
            </Text>
          ) : (
            <Text style={{ color: "white", fontWeight: "700" }}>
              Pilih Ulang Gambar
            </Text>
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
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.PRIMARY_DARK,
    alignSelf: "flex-start",
    marginBottom: moderateScale(5),
    marginTop: moderateScale(5),
    marginTop: moderateScale(10),
  },
});

export default ImagePickers;
