import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import { ms, moderateScale } from "react-native-size-matters";
import { COLORS, FONTS } from "../../../assets/theme";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";

export default function CardMenu({
  photoUrl,
  namaMenu,
  desc,
  notes,
  onPressDetail,
  id,
}) {
  return (
    <View>
      <View
        style={{
          flexDirection: "row",
          //   justifyContent: "space-between",

          marginTop: ms(20),
          backgroundColor: COLORS.WHITE,
          borderRadius: ms(12),
        }}
      >
        <View>
          <Image
            style={{
              width: ms(132),
              height: ms(132),
              borderRadius: ms(12),
            }}
            source={require("./../../../assets/images/NoImage.jpeg")}
          />
        </View>
        <View style={{ marginLeft: ms(12), width: "auto" }}>
          <Text
            style={{
              fontWeight: "bold",
              color: COLORS.GRAY_HARD,
              fontSize: ms(18),
              maxWidth: ms(200),
            }}
            numberOfLines={2}
          >
            {namaMenu}
          </Text>
          <Text
            style={{
              fontWeight: "500",
              color: COLORS.PRIMARY_DARK,
              fontSize: ms(12),
            }}
          >
            Deskripsi:
          </Text>
          <Text
            style={{
              fontWeight: "bold",
              color: COLORS.GRAY_MEDIUM,
              fontSize: ms(11),
              maxWidth: 200,
            }}
            numberOfLines={3}
            ellipsizeMode="tail"
          >
            {desc}
          </Text>
        </View>
      </View>
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          alignContent: "center",
          justifyContent: "flex-end",
          marginBottom: ms(4),
        }}
      >
        <TouchableOpacity
          style={styles.btnAdd}
          onPress={() => onPressDetail(id, namaMenu, desc)}
        >
          <Text style={{ color: "white" }}>Lihat Detail</Text>
        </TouchableOpacity>
        {/* <TouchableOpacity style={styles.btnAdd2}>
          <Text style={{ color: "white" }}>Edit</Text>
        </TouchableOpacity> */}
      </View>
    </View>
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
    width: widthPercentageToDP(28),
    height: heightPercentageToDP(6),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.PRIMARY_DARK,
    alignSelf: "flex-end",
    marginBottom: moderateScale(5),
    marginTop: moderateScale(5),
    marginTop: moderateScale(10),
    marginRight: ms(4),
  },
  btnAdd2: {
    borderRadius: moderateScale(10),
    width: widthPercentageToDP(24),
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
});
