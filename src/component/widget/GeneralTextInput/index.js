import * as React from "react";
import { StyleSheet } from "react-native";
import { TextInput as TxtInputPaper, HelperText } from "react-native-paper";
import { COLORS } from "../../../assets/theme";

const TextInput = ({
  placeholder,
  left,
  hasErrors,
  value,
  messageError,
  ...rest
}) => {
  return (
    <>
      <TxtInputPaper
        placeholder={placeholder}
        theme={{
          roundness: 8,
          colors: {
            text: COLORS.PRIMARY_DARK, // Change this to the desired text color
          },
        }}
        {...rest}
      />
      {/* <HelperText type="error" visible={hasErrors}>
        {messageError}
      </HelperText> */}
    </>
  );
};

export default TextInput;

const styles = StyleSheet.create({});
