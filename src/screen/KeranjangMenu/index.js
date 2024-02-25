import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  ScrollView,
  Linking,
} from "react-native";
import React, { useState, useEffect } from "react";
import RootContainer from "../../component/RootContainer/index";
import ColorBgContainer from "../../component/ColorBgContainer";
import {
  IconButton,
  Card,
  Checkbox,
  CheckBox,
  Button,
  DataTable,
  Modal,
  TextInput as InputNumber,
} from "react-native-paper";
import {
  AppBar,
  GeneralButton,
  OverviewProgres,
  PopUpLoader,
} from "../../component/index";
import { useDispatch, useSelector } from "react-redux";
import { ms, moderateScale } from "react-native-size-matters";
import { COLORS, FONTS } from "../../assets/theme";
import axios from "axios";
import { baseUrl } from "../../utils/apiURL";
import { setMenuCount } from "../../store/models/menu/action";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Ionicons, FontAwesome, MaterialIcons } from "@expo/vector-icons";
import moment from "moment";
import constants from "../../assets/constants/index.js";
import DropDownPicker from "react-native-dropdown-picker";
import { SafeAreaView } from "react-native-safe-area-context";

const NumberInput = ({
  quantity,
  uid,
  getMenuInCarts,
  shopingCartId,
  setSelectedItems,
}) => {
  const [value, setValue] = useState(quantity);

  const token = useSelector((state) => state.auth.token);

  const increment = () => {
    setValue(value + 1);
    updateQty(value + 1);
  };

  const decrement = () => {
    if (value > 1) {
      setValue(value - 1);
      updateQty(value - 1);
    }
  };

  async function updateQty(qty) {
    const body = {
      shopingChartId: shopingCartId,
      quantity: qty,
      reservedBy: parseInt(uid),
      reservedDate: moment().format("YYYY-MM-DD"),
      status: "booked",
    };
    // setIsLoadingGet(true);
    // setIsLoading(true);
    try {
      let res = await axios({
        url: `${baseUrl.URL}api/BucketIngredients/updatequantityshopingcart`,
        method: "PUT",
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
        getMenuInCarts(uid);
        setSelectedItems([]);
        // console.log(res.data, "transit");
      }
      // Don't forget to return something
      return res.data;
    } catch (err) {
      console.error(err);
      s;
    }
  }

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderRadius: 16,
        borderColor: COLORS.PRIMARY_DARK,
      }}
    >
      <IconButton icon="minus" size={16} onPress={decrement} />
      <TextInput
        style={{
          borderWidth: 0,
          padding: 0,
          width: 10,
          textAlign: "center",
          backgroundColor: "white",
          borderRadius: 10,
          color: COLORS.PRIMARY_DARK,
          borderColor: COLORS.PRIMARY_DARK,
        }}
        value={value.toString()}
        keyboardType="numeric"
        onChangeText={(text) => setValue(parseInt(text) || 0)}
      />
      <IconButton icon="plus" size={16} onPress={increment} />
    </View>
  );
};

export default function KeranjangMenu({ navigation }) {
  const dispatch = useDispatch();
  const [checked, setChecked] = React.useState(false);
  const [dataList, setDataList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const uid = useSelector((state) => state?.auth?.user?.UserId);
  const token = useSelector((state) => state.auth.token);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [modalRincian, setModalRincian] = useState(false);
  const [ingredientList, setIngredientList] = useState([]);
  const [openDropDown, setOpenDropDown] = useState(false);
  const [dataToko, setDataToko] = useState([]);
  const [selectedToko, setSelectedToko] = useState(null);
  const [selectedItems2, setSelectedItems2] = useState([]);
  const [selectAll2, setSelectAll2] = useState(false);
  const [qtyMenu, setQtyMenu] = useState([]);

  const handleLogut = () => {
    dispatch(resetReducer());
    navigation.reset({
      index: 0,
      routes: [{ name: "Login" }],
    });
  };

  async function getMenuInCarts(userId) {
    try {
      let res = await axios({
        url: `${baseUrl.URL}api/BucketIngredients/getshopingcartbyuserid/${userId}`,
        method: "get",
        timeout: 8000,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.status == 200) {
        // test for status you want, etc
        console.log(res.data, "shoping carts");
        setDataList(res.data.data);
        setIsLoading(true);
        dispatch(setMenuCount(res?.data?.data));

        // console.log(res.data, "transit");
      }
      // Don't forget to return something
      return res.data;
    } catch (err) {
      console.error(err);
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getMenuInCarts(uid);
  }, []);

  async function deleteMenu(e) {
    const body = {
      shopingChartId: e.shopingCartId,
      quantity: 0,
      reservedBy: parseInt(uid),
      reservedDate: moment().format("YYYY-MM-DD"),
      status: "deleted",
    };
    // setIsLoadingGet(true);
    // setIsLoading(true);
    try {
      let res = await axios({
        url: `${baseUrl.URL}api/BucketIngredients/updatequantityshopingcart`,
        method: "PUT",
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
        getMenuInCarts(uid);
        // console.log(res.data, "transit");
      }
      // Don't forget to return something
      return res.data;
    } catch (err) {
      console.error(err);
    }
  }

  function multiplyQuantities(data, qty) {
    // Create a map to store quantities based on menuId
    // console.log(data, "qty");
    const qtyMap = qty.reduce((map, item) => {
      map[item.menuId] = item.quantity;
      return map;
    }, {});

    // Multiply quantities in the data array based on menuId
    const result = data.map((item) => {
      const multipliedQty = item.qty * qtyMap[item.menuId];
      console.log(parseInt(item?.qty) * parseInt(qtyMap[item.menuId]), "wwww");
      return { ...item, qty: multipliedQty };
    });

    return result;
    // console.log(result, "mltiply");
  }

  function mergeIngredients(data) {
    const mergedIngredients = {};
    // console.log(data, "merged");
    data.forEach((item) => {
      const { ingredientsId, ingredientsName, qty, uom } = item;

      if (mergedIngredients[ingredientsId]) {
        mergedIngredients[ingredientsId].qty += qty;
        mergedIngredients[ingredientsId].uom = uom; // Update uom if needed
      } else {
        mergedIngredients[ingredientsId] = {
          ingredientsId,
          ingredientsName,
          qty,
          uom,
        };
      }
    });

    return Object.values(mergedIngredients);
  }
  async function handleGenerateIng(data, qtyId) {
    const body = {
      UserId: parseInt(uid),
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
        console.log(mergeIngredients(res.data.data), "menu pagination");
        setIngredientList(
          mergeIngredients(multiplyQuantities(res.data.data, qtyId))
        );
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
      setIsLoading(false);
    }
  }

  const onPressNav = (id) => {
    navigation.navigate("MenuDetail", { menuId: id, isEdit: false });
  };

  const handleCheckboxChange = (selectedItem) => {
    // console.log(selectedItem);
    if (
      selectedItems.some(
        (item) => item.shopingCartId === selectedItem.shopingCartId
      )
    ) {
      setSelectedItems((prevItems) =>
        prevItems.filter(
          (item) => item.shopingCartId !== selectedItem.shopingCartId
        )
      );
    } else {
      setSelectedItems((prevItems) => [
        ...prevItems,
        {
          shopingCartId: selectedItem.shopingCartId,
          menuId: selectedItem.menuId,
          quantity: selectedItem.quantity,
        },
      ]);
    }
  };

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

  const handleSelectAll = () => {
    // Toggle the "Select All" status
    setSelectAll((prevSelectAll) => !prevSelectAll);

    // If "Select All" is enabled, select all items; otherwise, unselect all items
    setSelectedItems((prevItems) =>
      selectAll
        ? []
        : dataList.map((item) => ({
            shopingCartId: item.shopingCartId,
            menuId: item.menuId,
          }))
    );
  };

  const showModalRincian = (menuList) => {
    setModalRincian(true);
    handleGenerateIng(
      menuList,
      menuList.map((e) => ({
        menuId: e?.menuId,
        quantity: e?.quantity,
      }))
    );
    getGrocery("all");
    console.log(menuList, "menuList");
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
        title="Keranjang"
        dataTaskPending={[]}
        handleLogut={handleLogut}
        navigation={navigation}
      />

      <ScrollView style={styles.mainContainer}>
        <View
          style={{
            width: "40%",
            paddingHorizontal: ms(12),
            marginTop: ms(20),
          }}
        >
          <TouchableOpacity
            onPress={handleSelectAll}
            style={{
              marginBottom: 10,
              backgroundColor: COLORS.PRIMARY_DARK,
              paddingHorizontal: ms(12),
              paddingVertical: ms(10),
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 10,
            }}
          >
            <Text style={{ color: "white" }}>
              {selectAll ? "Unselect All" : "Pilih Semua"}
            </Text>
          </TouchableOpacity>
        </View>
        {dataList?.map((e) => (
          <Card
            style={{
              marginTop: ms(18),
              paddingVertical: ms(18),
              backgroundColor: "white",
              paddingHorizontal: ms(18),
            }}
          >
            <View style={{ flexDirection: "row" }}>
              {/* <View>
                    <Checkbox
                      status={checked ? "checked" : "unchecked"}
                      onPress={() => {
                        setChecked(!checked);
                      }}
                    />
                  </View> */}
              <View>
                <Checkbox.Android
                  status={
                    selectedItems.some(
                      (selectedItem) =>
                        selectedItem.shopingCartId === e.shopingCartId
                    )
                      ? "checked"
                      : "unchecked"
                  }
                  onPress={() => handleCheckboxChange(e)}
                />
              </View>
              <View>
                <Image
                  style={{
                    width: ms(96),
                    height: ms(96),
                    borderRadius: ms(10),
                  }}
                  source={
                    e.photo == undefined
                      ? require("./../../assets/images/NoImage.jpeg")
                      : {
                          uri: `${e?.photo}`,
                        }
                  }
                />
              </View>
              <View style={{ marginLeft: ms(12) }}>
                <Text style={{ fontWeight: "600" }}>{e.menuName}</Text>
                <Text style={{ fontSize: 10, color: "gray" }} t>
                  Resep Oleh :{" "}
                </Text>
                <Text style={{ fontSize: 11, color: "gray" }} t>
                  {e.email}
                </Text>
                <TouchableOpacity
                  onPress={() => onPressNav(e.menuId)}
                  style={{}}
                >
                  <Text
                    style={{
                      fontWeight: "500",
                      color: COLORS.PRIMARY_DARK,
                      marginTop: 12,
                    }}
                  >
                    Lihat Resep
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View
              style={{
                alignItems: "flex-end",
                flexDirection: "row",

                justifyContent: "flex-end",
              }}
            >
              <MaterialIcons
                name="delete-outline"
                size={18}
                onPress={() => deleteMenu(e)}
                style={{
                  fontSize: 28,
                  color: COLORS.PRIMARY_DARK,
                  marginRight: ms(4),
                  alignSelf: "center",
                }}
              />

              <NumberInput
                quantity={e.quantity}
                uid={uid}
                setSelectedItems={setSelectedItems}
                getMenuInCarts={getMenuInCarts}
                shopingCartId={e.shopingCartId}
              />
            </View>
          </Card>
        ))}
      </ScrollView>
      {selectedItems.length == 0 ? (
        <></>
      ) : (
        <View
          style={{
            paddingHorizontal: ms(32),
            marginTop: ms(20),
            paddingBottom: ms(18),
          }}
        >
          <TouchableOpacity
            onPress={() => showModalRincian(selectedItems)}
            style={{
              marginBottom: 10,
              backgroundColor: COLORS.PRIMARY_DARK,
              paddingHorizontal: ms(12),
              paddingVertical: ms(10),
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 10,
            }}
          >
            <Text style={{ color: "white" }}>Lihat Rincian Resep</Text>
          </TouchableOpacity>
        </View>
      )}

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
                      <InputNumber
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
            <GeneralButton
              style={
                selectedToko === null
                  ? {
                      backgroundColor: "gray",
                      borderRadius: ms(8),
                      justifyContent: "center",
                    }
                  : {
                      backgroundColor: "#49C456",
                      borderRadius: ms(8),
                      justifyContent: "center",
                    }
              }
              mode="contained"
              onPress={kirimWa}
              disabled={selectedToko === null}
            >
              Kirim Whatssapp
            </GeneralButton>
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
    paddingHorizontal: 6,
    paddingVertical: 12,
  },
  btnAdd: {
    borderRadius: moderateScale(10),

    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.PRIMARY_DARK,
    alignSelf: "flex-end",
    marginBottom: moderateScale(5),
    marginTop: moderateScale(5),
    marginTop: moderateScale(10),
  },
  continerSearch: {
    // paddingHorizontal: 8,
    flexDirection: "row",
    alignItems: "center",
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
});
