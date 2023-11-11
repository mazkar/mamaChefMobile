import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import { ms } from "react-native-size-matters";
import { COLORS, FONTS } from "../../../assets/theme";
import { Avatar } from "react-native-paper";

export default function CardMenu({
  photoUrl,
  namaMember,
  tglLahir,
  notes,
  noHp,
  address,
}) {
  return (
    <TouchableOpacity>
      <View
        style={{
          flexDirection: "row",
          //   justifyContent: "space-between",

          marginTop: ms(20),
          backgroundColor: COLORS.PRIMARY_ULTRASOFT,
          borderRadius: ms(12),
          paddingVertical: ms(12),
          paddingHorizontal: ms(12),
        }}
      >
        <View style={{ alignSelf: "center" }}>
          {/* <Image
            style={{
              width: ms(76),
              height: ms(76),
              borderRadius: ms(200),
            }}
            source={{
              uri: `data:image/png;base64,${photoUrl}`,
            }}
          /> */}
          <Avatar.Text size={86} label={namaMember.charAt(0).toUpperCase()} />
        </View>
        <View style={{ marginLeft: ms(24), width: "auto" }}>
          <Text
            style={{
              fontWeight: "bold",
              color: COLORS.PRIMARY_DARK,
              fontSize: ms(18),
              maxWidth: ms(200),
            }}
            numberOfLines={2}
          >
            {namaMember}
          </Text>
          <Text
            style={{
              fontWeight: "bold",
              color: COLORS.PRIMARY_DARK,
              fontSize: ms(11),
              maxWidth: ms(200),
            }}
            numberOfLines={2}
          >
            No Hp : {noHp}
          </Text>
          <Text
            style={{
              fontWeight: "500",
              color: COLORS.PRIMARY_MEDIUM,
              fontSize: ms(12),
            }}
          >
            Tanggal Lahir:
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
            {tglLahir}
          </Text>
          <Text
            style={{
              fontWeight: "500",
              color: COLORS.PRIMARY_MEDIUM,
              fontSize: ms(12),
            }}
          >
            Alamat:
          </Text>
          <Text
            numberOfLines={2}
            ellipsizeMode="tail"
            style={{
              fontWeight: "bold",
              color: COLORS.GRAY_MEDIUM,
              fontSize: ms(11),
              maxWidth: 200,
            }}
          >
            {address}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
