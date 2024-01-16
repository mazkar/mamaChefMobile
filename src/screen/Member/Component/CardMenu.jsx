import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import React, { useState } from "react";
import { ms } from "react-native-size-matters";
import { COLORS, FONTS } from "../../../assets/theme";
import { Avatar, Card } from "react-native-paper";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { IconButton, MD3Colors } from "react-native-paper";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import PopUpConfirm from "./PopUpConfirm";

const Tag = ({ label, color }) => (
  <View style={[styles.tag, { backgroundColor: color }]}>
    <Text style={styles.tagText}>{label}</Text>
  </View>
);

export default function CardMenu({
  photoUrl,
  namaMember,
  tglLahir,
  notes,
  noHp,
  address,
  isActive,
  setSelectedActive,
  setSelectedMemberId,
  handleUpdate,
  memberId,
  name,
}) {
  const [visible, setVisible] = React.useState(false);

  const openMenu = () => setVisible(true);
  const [stat, setStat] = useState(false);
  const [selectedName, setSelectedName] = useState("");

  const closeMenu = () => setVisible(false);

  const handleClick = (memberId, stat) => {
    console.log(memberId, stat);
    handleUpdate(memberId, stat);
    setPopVisible(false);
  };

  const [popUpVisible, setPopVisible] = useState(false);

  const showPopUpConfirm = (stat, name) => {
    setPopVisible(true);
    setStat(stat);
    setSelectedName(name);
  };

  const hidePopUp = () => {
    setPopVisible(false);
  };

  return (
    <View>
      <Card
        style={{
          // flexDirection: "row",
          // justifyContent: "space-between",
          flex: 1,
          marginTop: ms(20),
          backgroundColor: COLORS.WHITE,
          borderWidth: 1, // Set the border width
          borderColor: COLORS.PRIMARY_DARK, // Set the border color
          borderRadius: ms(12),
          paddingVertical: ms(12),
          paddingHorizontal: ms(12),
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",

            // marginTop: ms(20),
            // backgroundColor: COLORS.WHITE,
            // borderWidth: 1, // Set the border width
            // borderColor: COLORS.PRIMARY_DARK, // Set the border color
            // borderRadius: ms(12),
            // paddingVertical: ms(12),
            // paddingHorizontal: ms(12),
          }}
        >
          <View style={{ alignSelf: "center", flexDirection: "row" }}>
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
            <View style={{ width: "auto", marginLeft: ms(4) }}>
              <View style={{ flexDirection: "row" }}>
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
                <View style={{ alignSelf: "center", marginLeft: ms(2) }}>
                  {isActive ? (
                    // <Tag
                    //   name="checkmark-circle"
                    //   size={24}
                    //   style={{ fontSize: 12, color: COLORS.SUCCESS }}
                    // />
                    <Tag label="Active" color={COLORS.SUCCESS} />
                  ) : (
                    // <FontAwesome
                    //   name="times-circle-o"
                    //   size={24}
                    //   style={{ fontSize: 12, color: COLORS.RED_BG }}
                    // />
                    <Tag label="InActive" color={COLORS.RED_BG} />
                  )}
                </View>
              </View>

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
                  color: "gray",
                  fontSize: ms(12),
                }}
              >
                Tanggal Lahir:
              </Text>
              <Text
                style={{
                  fontWeight: "300",
                  color: "gray",
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
                  fontWeight: "300",
                  color: "gray",
                  fontSize: ms(12),
                }}
              >
                Alamat:
              </Text>
              <Text
                numberOfLines={2}
                ellipsizeMode="tail"
                style={{
                  fontWeight: "300",
                  color: "gray",
                  fontSize: ms(11),
                  maxWidth: 200,
                }}
              >
                {address}
              </Text>
            </View>
          </View>

          {isActive ? (
            <TouchableOpacity
              // onPress={() => handleClick(memberId, false)}
              onPress={() => showPopUpConfirm("active", name)}
              style={{
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 10,
                // backgroundColor: COLORS.RED_BG,
                // alignSelf: "center",
                borderWidth: 1,
                borderColor: COLORS.RED_BG,
                padding: 6,
                width: widthPercentageToDP(8),
                height: heightPercentageToDP(4),
                // position: "relative",
              }}
            >
              <FontAwesome
                name="power-off"
                size={24}
                style={{ fontSize: 12, color: COLORS.RED_BG }}
              />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              // onPress={() => handleClick(memberId, true)}
              onPress={() => showPopUpConfirm("inActive", name)}
              style={{
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 10,
                backgroundColor: COLORS.WHITE,
                // alignSelf: "center",
                borderWidth: 1,
                borderColor: "green",
                padding: 6,
                width: widthPercentageToDP(8),
                height: heightPercentageToDP(4),
              }}
            >
              <FontAwesome
                name="check-circle"
                size={24}
                style={{ fontSize: 14, color: "green" }}
              />
            </TouchableOpacity>
          )}
        </View>
      </Card>
      <PopUpConfirm
        popUpVisible={popUpVisible}
        hidePopUp={hidePopUp}
        stat={stat}
        name={name}
        memberId={memberId}
        handleClick={handleClick}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  tag: {
    padding: 3,
    borderRadius: 4,
    marginRight: 8,
  },
  tagText: {
    color: "#fff",
    fontSize: 9,
  },
});
