import * as React from "react";
import { View } from "react-native";
import {
  Button,
  Dialog,
  Portal,
  PaperProvider,
  Text,
} from "react-native-paper";
import { COLORS } from "../../../assets/theme";

const PopUpConfirm = ({
  popUpVisible,
  hidePopUp,
  name,
  stat,
  handleClick,
  memberId,
}) => {
  const [visible, setVisible] = React.useState(false);

  // const showDialog = () => setVisible(true);

  // const hideDialog = () => setVisible(false);

  return (
    <View>
      <Portal>
        <Dialog visible={popUpVisible} onDismiss={hidePopUp}>
          <Dialog.Title>Pengaturan Tips</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              {stat === "active" ? (
                <Text>Apakah Yakin Menonaktifkan Tips {""}</Text>
              ) : (
                <Text>Apakah Yakin Mengaktifkan Tips {""}</Text>
              )}

              <Text style={{ fontWeight: "800", color: COLORS.PRIMARY_DARK }}>
                {name}
                {""}
              </Text>
              <Text>?</Text>
            </Text>
          </Dialog.Content>

          <Dialog.Actions>
            <Button onPress={hidePopUp}>Cancel</Button>
            {stat === "active" ? (
              <Button onPress={() => handleClick(false)}>Proses</Button>
            ) : (
              <Button onPress={() => handleClick(true)}>Proses</Button>
            )}
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};

export default PopUpConfirm;
