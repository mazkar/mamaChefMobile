import React, { useState } from "react";
import { Calendar, LocaleConfig } from "react-native-calendars";
import { View, Text, StyleSheet } from "react-native";
import { COLORS } from "../../../assets/theme";

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
    console.log(events);
  };

  const markedDates = {};
  data.forEach((event) => {
    const date = event.assignedDate.split("T")[0];
    markedDates[date] = { marked: true };
  });

  if (selectedDate) {
    markedDates[selectedDate] = {
      selected: true,
      marked: markedDates[selectedDate]?.marked,
    };
  }

  return (
    <>
      <Calendar
        markedDates={markedDates}
        onDayPress={(day) => handleDatePress(day)}
        theme={{
          calendarBackground: "#ffffff",
          textSectionTitleColor: "#b6c1cd",
          selectedDayBackgroundColor: "pink", // Changed to pink
          selectedDayTextColor: "#ffffff", // Text color remains white
          todayTextColor: COLORS.PRIMARY_DARK,
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
          textDayFontWeight: "300",
          textMonthFontWeight: "bold",
          textDayHeaderFontWeight: "300",
          textDayFontSize: 16,
          textMonthFontSize: 16,
          textDayHeaderFontSize: 16,
        }}
      />
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
