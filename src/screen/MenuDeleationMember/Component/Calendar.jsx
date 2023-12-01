import React, { useState } from "react";
import { Calendar, LocaleConfig } from "react-native-calendars";
import { View, Text, Modal, Button, StyleSheet, FlatList } from "react-native";
import { ms } from "react-native-size-matters";
import { COLORS } from "../../../assets/theme";
import { Card } from "react-native-paper";

LocaleConfig.locales["en"] = {
  monthNames: [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ],
  monthNamesShort: [
    "Jan.",
    "Feb.",
    "Mar.",
    "Apr.",
    "May",
    "Jun.",
    "Jul.",
    "Aug.",
    "Sep.",
    "Oct.",
    "Nov.",
    "Dec.",
  ],
  dayNames: [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ],
  dayNamesShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
};

LocaleConfig.defaultLocale = "en";

const MyCalendar = ({
  data,
  selectedDate,
  setSelectedDate,
  selectedEvents,
  setSelectedEvents,
  // setModalVisible,
  // modalVisible,
}) => {
  // Organize data based on assigned date
  const organizedData = data.reduce((acc, event) => {
    const date = event.assignedDate.split("T")[0];
    if (!acc[date]) {
      acc[date] = [event];
    } else {
      acc[date].push(event);
    }
    return acc;
  }, {});

  const handleDatePress = (day) => {
    const date = day.dateString;
    const events = organizedData[date] || [];
    setSelectedDate(date);
    setSelectedEvents(events);
    // setModalVisible(true);
    console.log(events);
  };
  const markedDates = {};
  data.forEach((event) => {
    const date = event.assignedDate.split("T")[0];
    markedDates[date] = { marked: true };
  });

  return (
    <>
      <Calendar
        markedDates={markedDates}
        // onDayPress={(day) => handleDatePress(day)}
        onDayPress={(day) => handleDatePress(day)}
        theme={{
          calendarBackground: "#ffffff",
          textSectionTitleColor: "#b6c1cd",
          selectedDayBackgroundColor: "#00adf5",
          selectedDayTextColor: "#ffffff",
          todayTextColor: "#00adf5",
          dayTextColor: "#2d4150",
          textDisabledColor: "#d9e1e8",
          dotColor: COLORS.PRIMARY_DARK,
          selectedDotColor: "#ffffff",
          arrowColor: COLORS.PRIMARY_DARK,
          disabledArrowColor: "#d9e1e8",
          monthTextColor: COLORS.GRAY_HARD,
          indicatorColor: "blue",
          textDayFontFamily: "monospace",
          textMonthFontFamily: "monospace",
          textDayHeaderFontFamily: "monospace",
          textDayFontWeight: "00",
          textMonthFontWeight: "bold",
          textDayHeaderFontWeight: "300",
          textDayFontSize: 16,
          textMonthFontSize: 16,
          textDayHeaderFontSize: 16,
        }}
      />

      {/* <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{selectedDate}</Text>
            <View style={{ paddingVertical: 32 }}>
              <FlatList
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listData} // center emptyData component
                data={selectedEvents}
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item.menuId}
                renderItem={({ item, index }) => (
                  <Card
                    style={{
                      borderRadius: 8,
                      width: ms(138),
                      height: ms(168),
                      marginLeft: ms(12),
                      borderTopStartRadius: 10,
                      borderTopEndRadius: 10,
                      backgroundColor: COLORS.WHITE,
                      paddingBottom: ms(32),
                    }}
                    onPress={() => onPressNav(item.menuId)}
                  >
                    <Card.Content
                      style={{
                        paddingHorizontal: ms(4),
                      }}
                    >
                      <View
                        style={{
                          backgroundColor: COLORS.PRIMARY_DARK,
                          borderRadius: ms(10),
                          alignContent: "center",

                          marginTop: ms(4),
                          width: "100%",
                          paddingHorizontal: ms(6),
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 12,
                            alignSelf: "center",
                            fontWeight: "600",
                            color: COLORS.WHITE,
                          }}
                        >
                          {item?.menuName}
                        </Text>
                      </View>

                      <Text
                        style={{
                          fontSize: 12,
                          fontWeight: "500",
                          color: COLORS.PRIMARY_DARK,
                        }}
                      >
                        Oleh : Budi
                      </Text>
                    </Card.Content>
                  </Card>
                )}
              />
            </View>
            <Button title="Close" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal> */}
    </>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "80%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  eventContainer: {
    marginBottom: 10,
  },
});
export default MyCalendar;
