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

const NumberInput = ({ quantity, uid, getMenuInCarts, shopingCartId }) => {
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

  const onPressNav = (id) => {
    navigation.navigate("MenuDetail", { menuId: id, isEdit: false });
  };

  const handleCheckboxChange = (selectedItem) => {
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

  const sendWhatsAppMessage = () => {
    const phoneNumber = "+6289515552237";
    const message = "test";

    // Use the `Linking` API to create the WhatsApp URL with the phone number and message
    const url = `whatsapp://send?phone=${phoneNumber}&text=${encodeURIComponent(
      message
    )}`;

    // Open the WhatsApp chat with the predefined message
    Linking.openURL(url)
      .then(() => console.log("WhatsApp opened successfully"))
      .catch((err) => console.error("Error opening WhatsApp:", err));
  };

  return (
    <ColorBgContainer>
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
          <View style={{ paddingHorizontal: ms(12), marginTop: ms(20) }}>
            <TouchableOpacity
              onPress={sendWhatsAppMessage}
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
      </RootContainer>
    </ColorBgContainer>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    paddingHorizontal: 4,
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
});
