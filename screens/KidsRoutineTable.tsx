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
import { Picker } from "@react-native-picker/picker"; // Updated import
import { useDispatch, useSelector } from "react-redux";
import { getKids } from "../Redux/Slices/KidsSlice";

const KidsRoutine = () => {
  const [selectedKid, setSelectedKid] = useState("");
  const kids = useSelector((state) => state.kids.kidsList);

 // Fetching kids from the Redux store

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "sunday", title: "Sun" },
    { key: "monday", title: "Mon" },
    { key: "tuesday", title: "Tue" },
    { key: "wednesday", title: "Wed" },
    { key: "thursday", title: "Thu" },
  ]);
  const userInfo = useAppSelector((state) => state.user.user);
  const dispatch = useDispatch();

  const [scheduleTable, setScheduleTable] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  useEffect(() => {
    const parentId = userInfo.id;
    if (parentId) {
      dispatch(getKids(parentId));
    }
  }, [dispatch, userInfo.id]); 
  const handleViewSchedule = async () => {
    if (selectedKid) {
      setLoading(true);
      setError(null); // Reset error before fetching
      try {
        const schedule = await fetchSchedule(selectedKid); // Use the selectedKid to fetch schedule
        if (schedule && schedule.days && schedule.days.length > 0) {
          setScheduleTable(schedule);
        } else {
          setScheduleTable(null);
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

  const renderScene =
    scheduleTable && scheduleTable.days.length > 0
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
      source={require("../assets/images/bg.png")}
      style={styles.background}
    >
      <Headero />
      <View style={styles.container}>
        <Picker
          selectedValue={selectedKid}
          onValueChange={(itemValue) => {
            setSelectedKid(itemValue);
          }}
          style={styles.picker}
        >
          <Picker.Item label="Select a kid" value="" enabled={false} />
          {kids.map((kid) => (
            <Picker.Item key={kid.id} label={kid.name} value={kid.class_id} />
          ))}
        </Picker>
        <Button title="View Schedule" onPress={handleViewSchedule} color="#002749" />

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
          <View key={subj.id || index} style={styles.card}>
            <Text style={styles.periodNumber}>Period {index + 1}</Text>
            <Text style={styles.subjectName}>{subj.subjectName}</Text>
            <Text style={styles.teacherName}>{subj.teacherName}</Text>
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
  picker: {
    height: 50,
    marginBottom: 20,
    marginTop: 50,
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
