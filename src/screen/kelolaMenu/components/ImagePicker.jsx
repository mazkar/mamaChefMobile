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

const ImagePickerExample = ({
  image,
  setImage,
  imageToShow,
  setImageToShow,
}) => {
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
    setImage(base64data);
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: true,
      bitrateMultiplier: 0.5,
    });

    console.log(result);
    const convertToBlob = async (imageUri) => {
      try {
        let base64data = await FileSystem.readAsStringAsync(imageUri, {
          encoding: FileSystem.EncodingType.Base64,
        });

        // Convert base64 to binary
        let binary = atob(base64data);

        // Create an ArrayBuffer and a DataView to represent the binary data
        let buffer = new ArrayBuffer(binary.length);
        let view = new DataView(buffer);

        // Populate the buffer with the binary data
        for (let i = 0; i < binary.length; i++) {
          view.setUint8(i, binary.charCodeAt(i));
        }

        // Create a Blob from the ArrayBuffer
        let blob = new Blob([buffer], { type: "image/jpeg" }); // Adjust the type according to the file type

        return blob;
      } catch (error) {
        console.error("Error converting image to blob:", error);
        return null;
      }
    };

    if (!result.cancelled) {
      // const fileInfo = await FileSystem.getInfoAsync(result.uri);
      // const file = {
      //   uri: fileInfo.uri,
      //   name: fileInfo.uri.split("/").pop(),
      //   type: "image/jpeg", // Adjust the type according to the file type
      // };
      const blob = await convertToBlob(result.uri);
      setImage(blob);
      setImageToShow(result.uri);
      setImage(result.uri);
      // setImage(formData);
    }
  };

  return (
    <View>
      <View>
        <TouchableOpacity style={styles.btnAdd} onPress={pickImage}>
          {imageToShow == null ? (
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
                Pilih Gambar
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
                Pilih Ulang Gambar
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
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.PRIMARY_DARK,
    alignSelf: "flex-start",
    flexDirection: "row",
    marginBottom: moderateScale(5),
    marginTop: moderateScale(5),
    marginTop: moderateScale(10),
  },
});

export default ImagePickerExample;
