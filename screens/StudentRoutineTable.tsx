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
import Headero from "./components/Header";

const renderTabBar = (props) => (
  <TabBar
    {...props}
    indicatorStyle={{ backgroundColor: "#fff", borderRadius: 10 }}
    style={{ backgroundColor: "#fff", borderRadius: 10, marginHorizontal: 15 }}
    labelStyle={{ color: "#000", borderRadius: 10 }}
    activeColor="#1e40af"
    inactiveColor="#000"
  />
);

const StudentRoutineTable = () => {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "sunday", title: "sun" },
    { key: "monday", title: "Mon" },
    { key: "tuesday", title: "Tues" },
    { key: "wednesday", title: "Wed" },
    { key: "thursday", title: "Thurs" },
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
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getSchedule();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!scheduleTable) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4c73be" />
      </View>
    );
  }

  const renderScene = SceneMap({
    sunday: () => <DaySchedule day={scheduleTable["days"][0]} />, // Adjust index for correct day
    monday: () => <DaySchedule day={scheduleTable["days"][1]} />, // Adjust index for correct day
    tuesday: () => <DaySchedule day={scheduleTable["days"][2]} />,
    wednesday: () => <DaySchedule day={scheduleTable["days"][3]} />,
    thursday: () => <DaySchedule day={scheduleTable["days"][4]} />,
  });

  return (
    <ImageBackground
      source={require("../assets/images/home-bg.jpeg")}
      style={styles.background}
    >
      <Headero></Headero>
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
    {/* <Text style={styles.title}>{day.dayName}</Text> */}
    <View style={styles.tableContainer}>
      {day.subjects.map((subj, index) => {
        const periodTime =
          index === 0
            ? "7:00-9:00"
            : index === 1
            ? "9:00-11:00"
            : index === 2
            ? "11:00-1:00"
            : "1:00-3:00";

        return (
          <View key={index} style={styles.card}>
            <Text style={styles.periodNumber}>Period {index + 1}</Text>
            <Text style={styles.subjectName}>{subj.subject_name}</Text>
            <Text style={styles.teacherName}>{subj.teacher_name.name}</Text>
            <Text style={styles.periodTime}>{periodTime}</Text>
          </View>
        );
      })}
    </View>
  </ScrollView>
);

const styles = StyleSheet.create({
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
    padding: 30,
  },
  tableContainer: {
    width: "100%",
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  card: {
    backgroundColor: "#f5f6fc",
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  periodNumber: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  subjectName: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
  },
  teacherName: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },
  periodTime: {
    fontSize: 12,
    color: "#999",
  },
});

export default StudentRoutineTable;
