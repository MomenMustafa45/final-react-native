import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, ImageBackground } from "react-native";
import { useAppSelector } from "../hooks/reduxHooks";
import { fetchSubjectsGrades } from "../services/gradeServices";
import Loader from "./components/Loader";

const Grades = () => {
  const userInfo = useAppSelector((state) => state.user.user);
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGrades = async () => {
      try {
        setLoading(true);
        const gradesArray = await fetchSubjectsGrades(userInfo.id);
        setGrades(gradesArray);
      } catch (error) {
        setError("Failed to fetch grades.");
      } finally {
        setLoading(false);
      }
    };
    fetchGrades();
  }, [userInfo.id]);

  const calculatePercentage = () => {
    if (grades.length === 0) {
      return 0; // إذا لم يكن هناك درجات، النسبة ستكون 0
    }
    const totalGrades = grades.reduce((acc, grade) => acc + grade.grade, 0);
    const maxTotalGrades = grades.length * 100; // أقصى درجات ممكنة
    return Math.round((totalGrades / maxTotalGrades) * 100); // النسبة المئوية لأقرب عدد صحيح
  };

  const getEvaluation = (percentage) => {
    if (percentage >= 85) {
      return "You are Excellent!";
    } else if (percentage >= 70) {
      return "You are Good!";
    } else {
      return "Keep Trying!";
    }
  };

  const percentage = calculatePercentage();
  const evaluation = getEvaluation(percentage);

  return (
    <ImageBackground
      source={require("../assets/images/Pastel Purple fun Creative Modern Minimalist Kids Smile Phone Wallpaper (2).png")}
      style={styles.background}
    >
      <View style={styles.container}>
        
        {loading ? (
          <Loader /> // عرض Loader أثناء التحميل
        ) : error ? (
          <Text style={styles.error}>{error}</Text>
        ) : (
          <View style={styles.gradeContainer}>
            <Text style={styles.evaluation}>{evaluation}</Text>
            <FlatList
              data={grades}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <View style={styles.row}>
                  <Text style={styles.subject}>{item.subjectName}</Text>
                  <Text style={styles.grade}>{item.grade}</Text>
                  <Text style={styles.quizScore}>{item.quizScore}</Text>
                </View>
              )}
            />
          </View>
        )}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
  },
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    paddingTop: 200,
  },
  gradeContainer: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
    marginTop:100
  },
  evaluation: {
    fontSize: 24,
    fontWeight: "600",
    textAlign: "center",
    color: "#4CAF50",
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  subject: {
    fontSize: 18,
    flex: 2,
    color: "#333",
  },
  grade: {
    fontSize: 18,
    flex: 1,
    backgroundColor: "#e6efff",
    textAlign: "center",
    color: "black",
  },
  quizScore: {
    fontSize: 18,
    flex: 1,
    backgroundColor: "#f0f9ee",
    textAlign: "center",
    color: "black",
  },
  error: {
    color: "red",
    textAlign: "center",
  },
});

export default Grades;
