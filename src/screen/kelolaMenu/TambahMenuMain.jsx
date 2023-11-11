import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Button, Text } from "react-native-elements";
import TambahMenu from "./tambahMenu";
import TambahIngridients from "./TambahIngridients";

const TambahMenuMain = ({ navigation }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const maxSteps = 3;
  const [menuId, setMenuId] = useState(null);

  const handleNext = (props) => {
    if (currentStep < maxSteps) {
      setCurrentStep(currentStep + 1);
      setMenuId(props);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return currentStep == 1 ? (
    <TambahMenu handleNext={handleNext} />
  ) : (
    <TambahIngridients menuId={menuId} navigation={navigation} />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  stepContainer: {
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "60%",
  },
});

export default TambahMenuMain;
