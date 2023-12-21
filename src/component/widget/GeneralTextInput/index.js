import * as React from "react";
import { StyleSheet, View } from "react-native";
import {
  TextInput as TxtInputPaper,
  HelperText,
  Card,
  Text,
} from "react-native-paper";
import { COLORS } from "../../../assets/theme";
import { ms } from "react-native-size-matters";

const TextInput = ({
  placeholder,
  left,
  hasErrors,
  value,
  messageError,
  title,
  ...rest
}) => {
  return (
    <Card
      style={{
        paddingHorizontal: 9,
        backgroundColor: "white",
        // paddingVertical: ms(6),
        // paddingHorizontal: ms(12),
      }}
    >
      <View
        style={{
          paddingHorizontal: ms(8),
          marginBottom: ms(2),
          paddingTop: ms(4),
        }}
      >
        <Text style={{ color: "gray" }}>{title}</Text>
      </View>
      <View style={{ paddingBottom: ms(8) }}>
        <TxtInputPaper
          textColor={COLORS.PRIMARY_DARK}
          placeholderTextColor={COLORS.PRIMARY_DARK}
          outlineColor={COLORS.WHITE}
          placeholder={placeholder}
          theme={{
            roundness: 8,
            colors: {
              text: COLORS.PRIMARY_DARK, // Change this to the desired text color
            },
          }}
          {...rest}
        />
      </View>

      {/* <HelperText type="error" visible={hasErrors}>
        {messageError}
      </HelperText> */}
    </Card>
  );
};

export default TextInput;

const styles = StyleSheet.create({});
