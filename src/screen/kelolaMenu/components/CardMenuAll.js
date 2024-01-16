import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import { ms } from "react-native-size-matters";
import { COLORS, FONTS } from "../../../assets/theme";
import { Card } from "react-native-paper";

export default function CardMenuAll({
  photoUrl,
  namaMenu,
  desc,
  notes,
  menuId,
  onPressNav,
  isPublish,
  recipeBy,
}) {
  return (
    <TouchableOpacity onPress={() => onPressNav(menuId)}>
      <Card
        style={{
          marginTop: ms(20),
          backgroundColor: COLORS.WHITE,
          borderRadius: ms(12),
          paddingBottom: ms(18),
        }}
      >
        <View
          style={{
            flexDirection: "row",
            paddingHorizontal: ms(8),
            paddingVertical: ms(12),
          }}
        >
          <View>
            <Image
              style={{
                width: ms(112),
                height: ms(112),
                borderRadius: ms(56),
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
                fontWeight: "400",
                color: "grey",
                fontSize: ms(13),
              }}
            >
              {recipeBy}
            </Text>
          </View>
        </View>
        <View style={{ alignSelf: "center" }}>
          <TouchableOpacity
            style={{
              backgroundColor: COLORS.PRIMARY_DARK,
              paddingHorizontal: ms(24),
              paddingVertical: ms(12),
              borderRadius: ms(8),
            }}
            onPress={() => onPressNav(menuId, isPublish)}
          >
            <Text style={{ color: COLORS.WHITE }}>Lihat Resep</Text>
          </TouchableOpacity>
        </View>
      </Card>
    </TouchableOpacity>
  );
}
