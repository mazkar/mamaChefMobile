import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  StyleSheet,
  FlatList,
  Image,
} from "react-native";
import React, { useState, useCallback, useEffect } from "react";
import RootContainer from "../../component/RootContainer/index";
import { useNavigation } from "@react-navigation/core";
import ColorBgContainer from "../../component/ColorBgContainer";
import { COLORS, FONTS } from "../../assets/theme";
import {
  Button,
  Menu,
  Divider,
  Avatar,
  Card,
  Paragraph,
  Searchbar,
} from "react-native-paper";
import { ms, moderateScale } from "react-native-size-matters";
import {
  AppBar,
  GeneralButton,
  OverviewProgres,
  PopUpLoader,
  GeneralTextInput,
} from "../../component/index";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";

import AsyncStorage from "@react-native-async-storage/async-storage";
// iCONS
import FaIcons from "react-native-vector-icons/Ionicons";
import { resetReducer } from "../../store/models/auth/actions";
import { useDispatch, useSelector } from "react-redux";
import API from "../../utils/apiService";
import axios from "axios";

import { baseUrl } from "../../utils/apiURL";
import ImagePickerExample from "./components/ImagePicker";

export default function TambahMenu() {
  const [valueNamaMenu, setValueNamaMenu] = useState("");
  const [valueDesc, setValueDesc] = useState("");
  const [valuNote, setValeNote] = useState("");
  const [valueGambar, setValueGambar] = useState(null);
  return (
    <ColorBgContainer>
      <RootContainer>
        <AppBar title="Kelola Menu" dataTaskPending={[]} />
        <View style={styles.mainContainer}>
          <View style={{ marginBottom: ms(16) }}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: "700",
                color: COLORS.PRIMARY_DARK,
              }}
            >
              Tambah Menu
            </Text>
          </View>
          <View>
            <View style={styles.inputForm}>
              <Text style={styles.text}>Nama Menu</Text>

              <GeneralTextInput
                placeholder="Nama Menu"
                mode="outlined"
                value={valueNamaMenu}
                // hasErrors={authFailed}
                messageError="Wrong Username/Password"
                onChangeText={(e) => setValueNamaMenu(e)}
                style={styles.inputUserName}
              />
            </View>
            <View style={styles.inputForm}>
              <Text style={styles.text}>Deskripsi</Text>

              <GeneralTextInput
                placeholder="Nama Menu"
                mode="outlined"
                value={valueNamaMenu}
                // hasErrors={authFailed}
                messageError="Wrong Username/Password"
                onChangeText={(e) => setValueNamaMenu(e)}
                style={styles.inputUserName}
              />
            </View>
            <View style={styles.inputForm}>
              <Text style={styles.text}>Catatan</Text>

              <GeneralTextInput
                placeholder="Nama Menu"
                mode="outlined"
                value={valueNamaMenu}
                // hasErrors={authFailed}
                messageError="Wrong Username/Password"
                onChangeText={(e) => setValueNamaMenu(e)}
                style={styles.inputUserName}
              />
            </View>

            <View style={styles.inputForm}>
              <Text style={styles.text}>Upload Gambar</Text>
              <ImagePickerExample />
            </View>
          </View>
        </View>
      </RootContainer>
    </ColorBgContainer>
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
    width: widthPercentageToDP(38),
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
  inputForm: {
    marginTop: ms(6),
  },
  text: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.PRIMARY_MEDIUM,
  },
});
