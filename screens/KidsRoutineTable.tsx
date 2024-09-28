import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  ActivityIndicator,
  ScrollView,
  Button,
} from "react-native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import { fetchSchedule } from "../services/scheduleServices";
import { useAppSelector } from "../hooks/reduxHooks";
import Headero from "./components/Header";
import { Picker } from '@react-native-picker/picker'; // Updated import

const KidsRoutine = () => {
  const [selectedKid, setSelectedKid] = useState("");
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "sunday", title: "Sun" },
    { key: "monday", title: "Mon" },
    { key: "tuesday", title: "Tue" },
    { key: "wednesday", title: "Wed" },
    { key: "thursday", title: "Thu" },
  ]);
  const [scheduleTable, setScheduleTable] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const kids = useAppSelector((state) => state.kids.kidsList); // Fetching kids from the Redux store

  const handleViewSchedule = async () => {
    if (selectedKid) {
      setLoading(true);
      setError(null); // Reset error before fetching
      try {
        const schedule = await fetchSchedule(selectedKid); // Use the selectedKid to fetch schedule
        console.log("Fetched schedule:", schedule); // Log the fetched schedule
        if (schedule && schedule.days && schedule.days.length > 0) {
          setScheduleTable(schedule);
        } else {
          setError("No schedule found for the selected student.");
        }
      } catch (error) {
        console.error("Error fetching schedule:", error);
        setError("Failed to fetch schedule. Please try again.");
      } finally {
        setLoading(false);
      }
    } else {
      setError("Please select a student to view the schedule."); // Alert if no kid is selected
    }
  };

  const renderTabBar = (props) => (
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor: "#fff" }}
      style={{ backgroundColor: "#fff" }}
      labelStyle={{ color: "#000" }}
      activeColor="#1e40af"
      inactiveColor="#000"
    />
  );

  const renderScene = scheduleTable && scheduleTable.days.length > 0
    ? SceneMap({
        sunday: () => <DaySchedule day={scheduleTable.days[0]} />,
        monday: () => <DaySchedule day={scheduleTable.days[1]} />,
        tuesday: () => <DaySchedule day={scheduleTable.days[2]} />,
        wednesday: () => <DaySchedule day={scheduleTable.days[3]} />,
        thursday: () => <DaySchedule day={scheduleTable.days[4]} />,
      })
    : null;

  return (
    <ImageBackground
      source={require("../assets/images/home-bg.jpeg")}
      style={styles.background}
    >
      <Headero />
      <View style={styles.container}>
        <Text style={styles.header}>Select a Student</Text>
        <Picker
          selectedValue={selectedKid}
          onValueChange={(itemValue) => setSelectedKid(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Select a kid" value="" />
          {kids.map((kid) => (
            <Picker.Item key={kid.id} label={kid.name} value={kid.id} />
          ))}
        </Picker>
        <Button title="View Schedule" onPress={handleViewSchedule} />

        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#4c73be" />
          </View>
        )}

        {scheduleTable && (
          <TabView
            navigationState={{ index, routes }}
            renderScene={renderScene}
            onIndexChange={setIndex}
            renderTabBar={renderTabBar}
          />
        )}

        {error && <Text style={styles.error}>{error}</Text>}
      </View>
    </ImageBackground>
  );
};

const DaySchedule = ({ day }) => {
  if (!day || !day.subjects || day.subjects.length === 0) {
    return <Text>No schedule available for this day.</Text>;
  }

  return (
    <ScrollView>
      <View style={styles.tableContainer}>
        {day.subjects.map((subj, index) => (
          <View key={index} style={styles.card}>
            <Text style={styles.periodNumber}>Period {index + 1}</Text>
            <Text style={styles.subjectName}>{subj.subject_name}</Text>
            <Text style={styles.teacherName}>{subj.teacher_name}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  picker: {
    height: 50,
    marginBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  tableContainer: {
    padding: 20,
  },
  card: {
    backgroundColor: "#f5f6fc",
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  periodNumber: {
    fontSize: 16,
    fontWeight: "bold",
  },
  subjectName: {
    fontSize: 14,
    fontWeight: "bold",
  },
  teacherName: {
    fontSize: 12,
    color: "#666",
  },
  error: {
    color: "red",
    textAlign: "center",
  },
});

export default KidsRoutine;
