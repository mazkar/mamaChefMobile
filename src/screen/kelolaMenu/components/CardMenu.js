import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import { ms } from "react-native-size-matters";
import { COLORS, FONTS } from "../../../assets/theme";
import { Card } from "react-native-paper";
import { FontAwesome5 } from "@expo/vector-icons";

export default function CardMenu({
  photoUrl,
  namaMenu,
  desc,
  notes,
  menuId,
  onPressNav,
  isPublish,
  recipeBy,
  insertMneuToChart,
}) {
  return (
    <View>
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
                width: ms(128),
                height: ms(128),
                borderRadius: ms(64),
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
                color: "gray",
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

            {/* <Text
              style={{
                fontWeight: "300",
                color: COLORS.PRIMARY_DARK,
                fontSize: ms(12),
              }}
            >
              Status:
            </Text> */}
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
        <View style={{ alignSelf: "center", flexDirection: "row" }}>
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
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            {isPublish && (
              <TouchableOpacity
                style={{
                  backgroundColor: COLORS.WHITE,
                  paddingHorizontal: ms(24),
                  paddingVertical: ms(12),
                  borderRadius: ms(8),

                  marginLeft: ms(8),
                  borderColor: COLORS.PRIMARY_DARK,
                  borderWidth: 1,
                }}
                onPress={() => insertMneuToChart(menuId)}
              >
                <FontAwesome5
                  // onPress={showNotif}
                  style={{
                    fontSize: 20,
                    color: COLORS.PRIMARY_MEDIUM,

                    color: COLORS.PRIMARY_DARK,
                  }}
                  name="shopping-cart"
                />
              </TouchableOpacity>
            )}

            <View
              style={{
                position: "absolute",
                top: -0,
                right: 9,

                borderRadius: 10, // Adjust the border radius to your liking
                paddingVertical: 2,
                paddingHorizontal: 6,
              }}
            >
              <Text style={{ color: COLORS.PRIMARY_DARK, fontSize: 18 }}>
                +
              </Text>
            </View>
          </View>
        </View>
      </Card>
    </View>
  );
}
