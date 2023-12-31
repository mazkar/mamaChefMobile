import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import { ms } from "react-native-size-matters";
import { COLORS, FONTS } from "../../../assets/theme";

export default function CardMenu({
  photoUrl,
  namaMenu,
  desc,
  notes,
  menuId,
  onPressNav,
  isPublish,
}) {
  return (
    <TouchableOpacity onPress={() => onPressNav(menuId, isPublish)}>
      <View
        style={{
          flexDirection: "row",
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
            source={
              photoUrl == undefined
                ? require("./../../../assets/images/NoImage.jpeg")
                : {
                    uri: `${photoUrl}`,
                  }
            }
          />
        </View>
        <View style={{ marginLeft: ms(12), width: "auto" }}>
          <Text
            style={{
              fontWeight: "bold",
              color: COLORS.PRIMARY_DARK,
              fontSize: ms(18),
              maxWidth: ms(200),
            }}
            numberOfLines={2}
          >
            {namaMenu}
          </Text>
          <Text
            style={{
              fontWeight: "300",
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
          <Text
            style={{
              fontWeight: "300",
              color: COLORS.PRIMARY_DARK,
              fontSize: ms(12),
            }}
          >
            Catatan:
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
            {notes}
          </Text>
          <Text
            style={{
              fontWeight: "300",
              color: COLORS.PRIMARY_DARK,
              fontSize: ms(12),
            }}
          >
            Status:
          </Text>
          <View
            style={{
              backgroundColor: isPublish ? "green" : COLORS.RED_BG,
              width: isPublish ? ms(76) : ms(106),
              paddingHorizontal: ms(6),
              paddingVertical: ms(6),
              alignItems: "center",
              borderRadius: ms(12),
            }}
          >
            <Text
              style={{
                fontWeight: "bold",
                color: COLORS.WHITE,
                fontSize: ms(11),
                maxWidth: 200,
              }}
            >
              {isPublish ? "Published" : "Not Published"}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
