import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  StyleSheet,
  FlatList,
  Image,
  Linking,
} from "react-native";
import React, { useState, useCallback, useEffect } from "react";
import RootContainer from "../../component/RootContainer/index";

import { useNavigation } from "@react-navigation/core";
import ColorBgContainer from "../../component/ColorBgContainer/index.js";
import { COLORS, FONTS } from "../../assets/theme/index.js";
import {
  Button,
  Menu,
  Divider,
  Avatar,
  Modal,
  DataTable,
  Card,
  Checkbox,
  Paragraph,
  TextInput,
  Searchbar,
} from "react-native-paper";
import { ms, moderateScale } from "react-native-size-matters";
import {
  AppBar,
  GeneralButton,
  OverviewProgres,
  PopUpLoader,
  GeneralTextInput,
  GeneralTextInput2,
} from "../../component/index";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import constants from "../../assets/constants/index.js";
import AsyncStorage from "@react-native-async-storage/async-storage";
// iCONS
import FaIcons from "react-native-vector-icons/Ionicons";
import { resetReducer } from "../../store/models/auth/actions.js";
import { useDispatch, useSelector } from "react-redux";
import API from "../../utils/apiService.js";
import axios from "axios";

import { baseUrl } from "../../utils/apiURL.js";
import DateTimePicker from "@react-native-community/datetimepicker";
import DropDownPicker from "react-native-dropdown-picker";
import moment from "moment";
import { Ionicons, FontAwesome } from "@expo/vector-icons";

export default function BucketIngredients({ navigation, menuId, route }) {
  const [valueNamaMenu, setValueNamaMenu] = useState("");
  const dispatch = useDispatch();
  const [isLoadingGet, setIsLoadingGet] = useState(false);
  const [dataList, setDataList] = useState([]);
  const [searchState, setSearchState] = useState(false);
  const uid = useSelector((state) => state?.auth?.user);
  const token = useSelector((state) => state.auth.token);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [date2, setDate2] = useState(new Date());
  const [showDatePicker2, setShowDatePicker2] = useState(false);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === "ios");
    setDate(currentDate);

    // Convert the selected date to a string in a specific format
    const formattedDate = currentDate.toLocaleDateString("en-US"); // Adjust the locale as needed

    // Now, you can use the formattedDate as a string
    console.log("Selected Date:", formattedDate);

    // You can handle the selected date as needed
  };

  const onChange2 = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker2(Platform.OS === "ios");
    setDate2(currentDate);

    // Convert the selected date to a string in a specific format
    const formattedDate = currentDate.toLocaleDateString("en-US"); // Adjust the locale as needed

    // Now, you can use the formattedDate as a string
    console.log("Selected Date:", formattedDate);

    // You can handle the selected date as needed
  };

  const showDatepicker = () => {
    setShowDatePicker(true);
  };
  const showDatepicker2 = () => {
    setShowDatePicker2(true);
  };

  const handleLogut = () => {
    dispatch(resetReducer());
    navigation.reset({
      index: 0,
      routes: [{ name: "Login" }],
    });
  };

  async function handleGenerateMenu(data) {
    setIsLoadingGet(true);
    setSearchState(true);
    const body = {
      userId: uid?.UserId,
      dateStart: moment(date).format("YYYY-MM-DD"),
      dateEnd: moment(date2).format("YYYY-MM-DD"),
    };
    // setIsLoadingGet(true);
    // setIsLoading(true);
    try {
      let res = await axios({
        url: `${baseUrl.URL}api/BucketIngredients/getbucketingredients`,
        method: "POST",
        timeout: 20000,
        data: body,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.status == 200) {
        // test for status you want, etc
        console.log(res.data, "menu pagination");
        setDataList(res.data.data);
        setIsLoadingGet(false);
        // getMenuInCarts(uid);
        // console.log(res.data, "transit");
      }
      // Don't forget to return something
      return res.data;
    } catch (err) {
      console.error(err);
      setIsLoadingGet(false);
    }
  }

  const handleResetDate = () => {
    setSearchState(false);
    setDataList([]);
  };

  const [modalRincian, setModalRincian] = useState(false);
  const [ingredientList, setIngredientList] = useState([]);
  const [openDropDown, setOpenDropDown] = useState(false);
  const [dataToko, setDataToko] = useState([]);
  const [selectedToko, setSelectedToko] = useState(null);
  const [selectedItems2, setSelectedItems2] = useState([]);
  const [selectAll2, setSelectAll2] = useState(false);

  async function handleGenerateIng(data) {
    const body = {
      UserId: parseInt(uid.UserId),
      MenuList: JSON.stringify(data),
    };
    // setIsLoadingGet(true);
    // setIsLoading(true);
    try {
      let res = await axios({
        url: `${baseUrl.URL}api/BucketIngredients/getallingredientsbymenulist`,
        method: "POST",
        timeout: 20000,
        data: body,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.status == 200) {
        // test for status you want, etc
        console.log(res.data, "menu pagination");
        setIngredientList(res.data.data);
        // getMenuInCarts(uid);
        // console.log(res.data, "transit");
      }
      // Don't forget to return something
      return res.data;
    } catch (err) {
      console.error(err);
    }
  }

  async function getGrocery(stat) {
    try {
      let res = await axios({
        url: `${baseUrl.URL}api/Grocery/GetGrocery/${stat}`,
        method: "get",
        timeout: 8000,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.status == 200) {
        // test for status you want, etc
        console.log(res.data, "grocery list");
        setDataToko(res.data.data);
        // console.log(res.data, "transit");
      }
      // Don't forget to return something
      return res.data;
    } catch (err) {
      console.error(err);
      setIsLoadingGet(false);
    }
  }

  const handleSelectAll2 = () => {
    // Toggle the "Select All" status
    setSelectAll2((prevSelectAll) => !prevSelectAll);

    // If "Select All" is enabled, select all items; otherwise, unselect all items
    setSelectedItems2((prevItems) =>
      selectAll2
        ? []
        : ingredientList.map((item) => ({
            ingredientsId: item.ingredientsId,
            ingredientsName: item.ingredientsName,
            qty: item.qty,
            uom: item.uom,
          }))
    );
  };

  const handleCheckboxChange2 = (selectedItem) => {
    if (
      selectedItems2.some(
        (item) => item.ingredientsId === selectedItem.ingredientsId
      )
    ) {
      // If the item is already selected, remove it
      setSelectedItems2((prevItems) =>
        prevItems.filter(
          (item) => item.ingredientsId !== selectedItem.ingredientsId
        )
      );
    } else {
      // If the item is not selected, add it to the selectedItems2 array
      setSelectedItems2((prevItems) => [
        ...prevItems,
        {
          ingredientsId: selectedItem.ingredientsId,
          ingredientsName: selectedItem.ingredientsName,
          qty: selectedItem.qty,
          uom: selectedItem.uom,
        },
      ]);
    }
  };

  const showModalRincian = (menuList) => {
    setModalRincian(true);
    handleGenerateIng(menuList);
    getGrocery("all");
  };

  const hideModalRincian = () => {
    setModalRincian(false);
  };

  function generateOrderString(data) {
    let output = "Saya mau pesan :\n";

    data.forEach((item, index) => {
      output += `${index + 1}. ${item.ingredientsName} ${item.qty} ${
        item.uom
      }\n`;
    });

    return output;
  }

  const kirimWa = () => {
    setModalRincian(false);
    sendWhatsAppMessage(
      generateOrderString(ingredientList?.filter((e) => e.qty != 0))
    );
  };

  const sendWhatsAppMessage = (messagedata) => {
    let phoneNumber = selectedToko;
    let modifiedNumber = phoneNumber?.replace(/^0/, "+62");
    const message = messagedata;

    // Use the `Linking` API to create the WhatsApp URL with the phone number and message
    const url = `whatsapp://send?phone=${modifiedNumber}&text=${encodeURIComponent(
      message
    )}`;

    // Open the WhatsApp chat with the predefined message
    Linking.openURL(url)
      .then(() => console.log("WhatsApp opened successfully"))
      .catch((err) => console.error("Error opening WhatsApp:", err));
  };

  const updateQuantity = (newQty, targetIngredientsId) => {
    console.log(newQty, targetIngredientsId);
    setIngredientList((prevIngredients) =>
      prevIngredients.map((ingredient) =>
        ingredient.ingredientsId === targetIngredientsId
          ? { ...ingredient, qty: parseInt(newQty) }
          : ingredient
      )
    );
  };

  return (
    <RootContainer>
      <AppBar
        title="Bucket Ingredients"
        dataTaskPending={[]}
        navigation={navigation}
        handleLogut={handleLogut}
      />
      <ScrollView style={styles.mainContainer}>
        <View style={{ marginBottom: ms(16) }}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "700",
              color: "gray",
            }}
          >
            Pilih Rentang Tanggal
          </Text>

          <View
            style={{
              backgroundColor: "black",
              borderBottomColor: COLORS.PRIMARY_DARK,
              borderBottomWidth: 4,
              width: 24,
            }}
          ></View>
        </View>
        <View
          style={{
            elevation: 5,
            borderRadius: 20,
            borderWidth: 1,
            borderColor: "#E870A3",
            backgroundColor: "white",
            paddingHorizontal: ms(18),
            paddingVertical: ms(20),
          }}
        >
          <View>
            <View style={{ marginBottom: ms(8) }}>
              <Text style={{ color: "gray" }}>Dari Tanggal</Text>
            </View>
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <GeneralTextInput2
                // placeholder={moment(dataMember?.dateofBirth).format(
                //   "DD-MMMM-YYYY"
                // )}
                placeholder={date.toLocaleDateString()}
                mode="outlined"
                value={date.toLocaleDateString()}
                onPress={showDatePicker}
                // hasErrors={authFailed}
                disabled
                messageError="Wrong Username/Password"
                // onChangeText={(e) => setValueNameLast(e)}
                style={{ width: "67%", height: 48 }}
              />
              {/* <Button
                      onPress={() => console.log(date.toLocaleDateString())}
                    >
                      test
                    </Button> */}
              <TouchableOpacity
                onPress={showDatepicker}
                style={{
                  backgroundColor: COLORS.PRIMARY_DARK,
                  borderRadius: 6,

                  width: "30%",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text style={{ color: COLORS.WHITE }}>Pilih</Text>
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePicker
                  testID="dateTimePicker"
                  value={date}
                  mode="datetime" // Change this to "date" for date-only picker
                  is24Hour={true}
                  display="default"
                  onChange={onChange}
                />
              )}
            </View>
          </View>

          <View>
            <View style={{ marginBottom: ms(8), marginTop: ms(24) }}>
              <Text style={{ color: "gray" }}>Sampai Tanggal</Text>
            </View>
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <GeneralTextInput2
                // placeholder={moment(dataMember?.dateofBirth).format(
                //   "DD-MMMM-YYYY"
                // )}
                placeholder={date2.toLocaleDateString()}
                mode="outlined"
                value={date2.toLocaleDateString()}
                onPress={showDatePicker2}
                // hasErrors={authFailed}
                disabled
                messageError="Wrong Username/Password"
                // onChangeText={(e) => setValueNameLast(e)}
                style={{ width: "67%", height: 48 }}
              />
              {/* <Button
                      onPress={() => console.log(date.toLocaleDateString())}
                    >
                      test
                    </Button> */}
              <TouchableOpacity
                onPress={showDatepicker2}
                style={{
                  backgroundColor: COLORS.PRIMARY_DARK,
                  borderRadius: 6,

                  width: "30%",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text style={{ color: COLORS.WHITE }}>Pilih</Text>
              </TouchableOpacity>
              {showDatePicker2 && (
                <DateTimePicker
                  testID="dateTimePicker"
                  value={date2}
                  mode="datetime" // Change this to "date" for date-only picker
                  is24Hour={true}
                  display="default"
                  onChange={onChange2}
                />
              )}
            </View>
          </View>

          <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
            {searchState ? (
              <View
                style={{
                  marginTop: ms(20),
                  marginRight: ms(8),
                }}
              >
                <TouchableOpacity
                  onPress={handleResetDate}
                  style={{
                    marginBottom: 10,
                    backgroundColor: COLORS.WHITE,
                    paddingHorizontal: ms(12),
                    paddingVertical: ms(10),
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 10,
                    borderWidth: 1,
                    borderColor: "#E870A3",
                  }}
                >
                  <Text style={{ color: COLORS.PRIMARY_DARK }}>Atur Ulang</Text>
                </TouchableOpacity>
              </View>
            ) : null}

            <View
              style={{
                marginTop: ms(20),
              }}
            >
              <TouchableOpacity
                onPress={handleGenerateMenu}
                style={{
                  marginBottom: 10,
                  backgroundColor: COLORS.PRIMARY_DARK,
                  paddingHorizontal: ms(32),
                  paddingVertical: ms(10),
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 10,
                }}
              >
                <Text style={{ color: "white" }}>Cari</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {searchState ? (
          <>
            <View style={{ marginTop: ms(32) }}>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "700",
                  color: "gray",
                }}
              >
                Hasil Pencarian
              </Text>

              <View
                style={{
                  backgroundColor: "black",
                  borderBottomColor: COLORS.PRIMARY_DARK,
                  borderBottomWidth: 4,
                  width: 24,
                }}
              ></View>
            </View>
            <View
              style={{
                elevation: 5,
                borderRadius: 20,
                borderWidth: 1,
                borderColor: "#E870A3",
                backgroundColor: "white",
                paddingHorizontal: ms(18),
                paddingVertical: ms(10),
                marginTop: ms(16),
                marginBottom: ms(32),
              }}
            >
              {dataList?.map((data) => (
                <View
                  style={{
                    elevation: 5,
                    borderRadius: 20,
                    borderWidth: 1,
                    borderColor: "#E870A3",
                    backgroundColor: "white",
                    paddingHorizontal: ms(18),
                    paddingVertical: ms(20),
                    marginTop: ms(32),
                  }}
                >
                  <View style={{}}>
                    <View span={24}>
                      <Text style={{ fontSize: 18, fontWeight: "600" }}>
                        {data?.menuName}
                      </Text>
                    </View>
                    <View span={24}>
                      <Text>
                        <Text>Tanggal :</Text>

                        <Text style={{ color: "#E870A3", fontWeight: "600" }}>
                          {moment(data?.assignedDate).format("YYYY-MM-DD")}
                        </Text>
                      </Text>
                    </View>
                    <View span={24}>
                      <Text>
                        <Text>Tugas Untuk :</Text>
                        <Text style={{ color: "#E870A3", fontWeight: "600" }}>
                          {data?.memberName}
                        </Text>
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
              <View
                style={{
                  marginTop: ms(20),
                }}
              >
                <TouchableOpacity
                  onPress={() => showModalRincian(dataList)}
                  style={{
                    marginBottom: 10,
                    backgroundColor: COLORS.PRIMARY_DARK,
                    paddingHorizontal: ms(32),
                    paddingVertical: ms(10),
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 10,
                  }}
                >
                  <Text style={{ color: "white" }}>Tampilkan Bahan Bahan</Text>
                </TouchableOpacity>
              </View>
            </View>
          </>
        ) : null}
      </ScrollView>
      <PopUpLoader visible={isLoadingGet} />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalRincian}
        onRequestClose={hideModalRincian}
      >
        <View style={styles.containermodalView}>
          <View style={{ marginBottom: 18 }}>
            <Text style={{ fontSize: 18, color: "gray" }}>Rincial Bahan</Text>
          </View>
          <ScrollView>
            <View style={styles.card}>
              <DataTable>
                <DataTable.Header>
                  {/* <DataTable.Title>
                    <View>
                      <Checkbox.Android
                        status={selectAll2 ? "checked" : "unchecked"}
                        onPress={() => handleSelectAll2()}
                      />
                    </View>
                  </DataTable.Title> */}
                  <DataTable.Title>Bahan</DataTable.Title>
                  <DataTable.Title>Jumlah</DataTable.Title>
                  <DataTable.Title>Satuan</DataTable.Title>
                </DataTable.Header>

                {ingredientList?.map((item) => (
                  <DataTable.Row key={item.ingredientsId}>
                    {/* <DataTable.Cell>
                      <View>
                        <Checkbox.Android
                          status={
                            selectedItems2.some(
                              (selectedItem) =>
                                selectedItem.ingredientsId ===
                                item.ingredientsId
                            )
                              ? "checked"
                              : "unchecked"
                          }
                          onPress={() => handleCheckboxChange2(item)}
                        />
                      </View>
                    </DataTable.Cell> */}
                    <DataTable.Cell>
                      <Text style={styles.textBahan}>
                        {item.ingredientsName}
                      </Text>
                    </DataTable.Cell>
                    <DataTable.Cell
                      style={{ alignItems: "center", justifyContent: "center" }}
                    >
                      {/* <Text style={styles.textBahan}>{item.qty}</Text> */}
                      <TextInput
                        onChangeText={(newQty) =>
                          updateQuantity(newQty, item.ingredientsId)
                        }
                        placeholder={item?.qty.toString()}
                        style={{
                          backgroundColor: "white",
                          fontSize: 12,
                          height: 29,
                        }}
                        keyboardType="numeric"
                      />
                    </DataTable.Cell>
                    <DataTable.Cell
                      style={{ alignItems: "center", justifyContent: "center" }}
                    >
                      <Text style={styles.textBahan}>{item.uom}</Text>
                    </DataTable.Cell>
                  </DataTable.Row>
                ))}
              </DataTable>
            </View>
          </ScrollView>
          <View style={styles.inputForm}>
            <Text style={styles.text}>Pilih Tujuan : </Text>
            {/* <Button onPress={() => console.log(ingredientList)}>test</Button> */}
            <DropDownPicker
              placeholder="Pilih Tujuan"
              open={openDropDown}
              value={selectedToko}
              zIndex={3}
              items={dataToko.map((e) => {
                return {
                  label: e.groceryName,
                  value: e.phoneNumber,
                };
              })}
              setItems={setDataToko}
              setOpen={setOpenDropDown}
              setValue={setSelectedToko}
              listMode="SCROLLVIEW"
              itemKey="ingredientsId"
              label="name"
            />
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-end",
              marginTop: ms(32),
            }}
          >
            <GeneralButton
              style={{ marginRight: ms(8) }}
              mode="contained"
              onPress={hideModalRincian}
            >
              Batal
            </GeneralButton>
            <TouchableOpacity
              style={
                selectedToko === null
                  ? {
                      backgroundColor: "gray",
                      borderRadius: ms(8),
                      justifyContent: "center",
                      paddingHorizontal: ms(12),
                    }
                  : {
                      backgroundColor: "#49C456",
                      borderRadius: ms(8),
                      justifyContent: "center",
                      paddingHorizontal: ms(12),
                    }
              }
              // mode="contained"
              onPress={kirimWa}
              disabled={selectedToko === null}
            >
              <Text style={{ color: "white", fontWeight: "600" }}>
                Kirim Whatssapp
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        {/* <View style={styles.centeredView}> */}

        {/* </View> */}
      </Modal>
    </RootContainer>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    paddingHorizontal: 24,

    paddingBottom: 72,
    marginTop: ms(22),
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
    color: COLORS.PRIMARY_DARK,
  },
  button: {
    borderRadius: moderateScale(10),
    width: widthPercentageToDP(95),
    height: heightPercentageToDP(7),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.PRIMARY_DARK,
    alignSelf: "center",

    marginBottom: moderateScale(4),
    marginTop: moderateScale(18),
  },
  button2: {
    borderRadius: moderateScale(10),
    width: widthPercentageToDP(95),
    height: heightPercentageToDP(7),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.PRIMARY_DARK,
    alignSelf: "center",

    marginBottom: moderateScale(32),
    marginTop: moderateScale(2),
  },
  button3: {
    borderRadius: moderateScale(10),
    width: widthPercentageToDP(38),
    height: heightPercentageToDP(7),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.PRIMARY_DARK,
    alignSelf: "center",

    marginBottom: moderateScale(4),
    marginTop: moderateScale(18),
  },
  containermodalView: {
    flexDirection: "column",
    alignSelf: "center",
    // position: "absolute",
    width: constants.SCREEN_WIDTH * 0.9,
    maxHeight: ms(550),
    paddingVertical: ms(48),
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 28,
    backgroundColor: COLORS.WHITE,
    borderRadius: 10,
  },
  modalText: {
    paddingTop: 20,
    marginBottom: 28,
    textAlign: "center",
    alignSelf: "center",
    fontSize: 17,
    letterSpacing: 1,
    lineHeight: 24,
    width: constants.SCREEN_WIDTH * 0.7,
    fontWeight: "600",
  },
  imgSubmit: {
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    marginBottom: 16,
    backgroundColor: COLORS.WHITE,
  },
  textBahan: {
    color: "gray",
    fontSize: ms(10),
  },
});
