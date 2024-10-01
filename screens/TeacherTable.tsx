import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  ScrollView,
} from "react-native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import { getTeacherSchedule } from "../services/teacherServices";
import { useAppSelector } from "../hooks/reduxHooks";
import Loader from "./components/Loader";
import Headero from "./components/Header";

const renderTabBar = (props) => (
  <TabBar
    {...props}
    indicatorStyle={{ backgroundColor: "#fff", borderRadius: 10 }}
    style={{ backgroundColor: "#fff", borderRadius: 10, marginHorizontal: 15 }}
    labelStyle={{ color: "#000", borderRadius: 10 }}
    activeColor="#ea580c"
    inactiveColor="#000"
  />
);

const TeacherTable = () => {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "sunday", title: "Sun" },
    { key: "monday", title: "Mon" },
    { key: "tuesday", title: "Tues" },
    { key: "wednesday", title: "Wed" },
    { key: "thursday", title: "Thurs" },
  ]);
  const [schedules, setSchedules] = useState(null);
  const [loading, setLoading] = useState(true); // حالة التحميل

  const teacherInfo = useAppSelector((state) => state.user.user);

  const fetchSchedules = async () => {
    try {
      const fetchedSchedules = await getTeacherSchedule(teacherInfo.id);
      console.log("Fetched schedules: ", fetchedSchedules); // تحقق من الهيكل
      if (fetchedSchedules.length > 0) {
        setSchedules(fetchedSchedules[0]); // استخدام الكائن الأول
      } else {
        setSchedules(null); // في حال عدم وجود جداول
      }
    } catch (error) {
      console.error("Error fetching schedules: ", error);
    } finally {
      setLoading(false); // إيقاف حالة التحميل بعد المحاولة
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, [teacherInfo.id]);

  // في حال التحميل
  if (loading) {
    return <Loader />;
  }

  // في حال عدم وجود جدول
  if (!schedules || !schedules.days || schedules.days.length < 5) {
    return (
      <ImageBackground
        source={require("../assets/images/home2.png")}
        style={styles.background}
      >
        <Headero />
        <View style={styles.noScheduleContainer}>
          <Text style={styles.noScheduleText}>No schedule found.</Text>
        </View>
      </ImageBackground>
    );
  }

  const renderScene = SceneMap({
    sunday: () => <DaySchedule day={schedules.days[0]} levelName={schedules.level_name} />,
    monday: () => <DaySchedule day={schedules.days[1]} levelName={schedules.level_name} />,
    tuesday: () => <DaySchedule day={schedules.days[2]} levelName={schedules.level_name} />,
    wednesday: () => <DaySchedule day={schedules.days[3]} levelName={schedules.level_name} />,
    thursday: () => <DaySchedule day={schedules.days[4]} levelName={schedules.level_name} />,
  });

  return (
    <ImageBackground
      source={require("../assets/images/home2.png")}
      style={styles.background}
    >
      <Headero />
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        renderTabBar={renderTabBar}
      />
    </ImageBackground>
  );
};

const DaySchedule = ({ day, levelName }) => (
  <ScrollView>
    <View style={styles.tableContainer}>
      {day.subjects.map((subj, index) => {
        const periodTime = index === 0
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
            <Text style={styles.levelTitle}>Level: {levelName}</Text>
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
  levelTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#000',
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
    color: "#ea580c",
  },
  noScheduleContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noScheduleText: {
    fontSize: 18,
    color: "#ea580c",
  },
});

export default TeacherTable;
