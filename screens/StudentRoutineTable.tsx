import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import { fetchSchedule } from "../services/scheduleServices";
import { getLevelNameById } from "../services/levelsServices";
import { getSubjectNameById } from "../services/subjectServices";
import { getTeacherNameById } from "../services/teacherServices";
import { useAppSelector } from "../hooks/reduxHooks"; // Adjust path as needed
import { Schedule } from "../utils/types";

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

const StudentRoutineTable = () => {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "monday", title: "Mon" },
    { key: "tuesday", title: "Tues" },
    { key: "wednesday", title: "Wed" },
    { key: "thursday", title: "Thurs" },
    { key: "friday", title: "Fri" },
  ]);
  const [scheduleTable, setScheduleTable] = useState<Schedule | null>(null);
  const [levelName, setLevelName] = useState<string>("");

  const userInfo = useAppSelector((state) => state.user.user);

  const getSchedule = async () => {
    try {
      const schedule = await fetchSchedule(userInfo.class_id);
      const levelName = await getLevelNameById(userInfo.class_id);
      setLevelName(levelName);

      const updatedDays = await Promise.all(
        schedule.days.map(async (day) => {
          const updatedSubjects = await Promise.all(
            day.subjects.map(
              async (subject: { subject_id: string; teacher_id: string }) => {
                const subjectName = await getSubjectNameById(
                  subject.subject_id
                );
                const teacherName = await getTeacherNameById(
                  subject.teacher_id
                );

                return {
                  ...subject,
                  subject_name: subjectName,
                  teacher_name: teacherName,
                };
              }
            )
          );
          return {
            ...day,
            subjects: updatedSubjects,
          };
        })
      );

      setScheduleTable({
        ...schedule,
        days: updatedDays,
      });
      console.log(scheduleTable);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getSchedule();
    console.log(levelName);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!scheduleTable) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ff4e31" />
      </View>
    );
  }

  const renderScene = SceneMap({
    monday: () => <DaySchedule day={scheduleTable.days[0]} />, // Adjust index for correct day
    tuesday: () => <DaySchedule day={scheduleTable.days[1]} />,
    wednesday: () => <DaySchedule day={scheduleTable.days[2]} />,
    thursday: () => <DaySchedule day={scheduleTable.days[3]} />,
    friday: () => <DaySchedule day={scheduleTable.days[4]} />,
  });

  return (
    <ImageBackground
      source={require("../assets/images/Blue and Red Back to School Poster.png")}
      style={styles.background}
    >
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        renderTabBar={renderTabBar}
      />
    </ImageBackground>
  );
};

const DaySchedule = ({ day }) => (
  <ScrollView>
    <Text style={styles.title}>{day.dayName}</Text>
    <View style={styles.tableContainer}>
      <Text style={styles.tableHeader}>7:00-9:00</Text>
      {day.subjects.map((subject, index) => (
        <Text key={index} style={styles.subject}>
          {subject.subject_name} ({subject.teacher_name})
        </Text>
      ))}
    </View>
  </ScrollView>
);

const styles = StyleSheet.create({
  scene: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  background: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 10,
  },
  tableContainer: {
    width: "100%",
    paddingHorizontal: 20,
  },
  tableHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subject: {
    fontSize: 16,
    marginVertical: 5,
  },
});

export default StudentRoutineTable;
