import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  Image,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { TouchableOpacity } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { useAppSelector } from "../hooks/reduxHooks";
import { useNavigation } from "@react-navigation/native";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../config/firebase";
import { RootNavigationParamList } from "../navigation/Stack";

const QuizList = () => {
  const [quizSubjects, setQuizSubjects] = useState([]);
  const [isloading, setIsLoading] = useState(false);

  const studentInfo = useAppSelector((state) => state.user.user); // Assuming student ID is here
  const navigation = useNavigation<RootNavigationParamList>();
  useEffect(() => {
    const fetchQuizNotifications = async () => {
      try {
        setIsLoading(true);

        // Fetch all subjects
        const subjectsRef = collection(db, "subjects");
        const subjectsSnapshot = await getDocs(subjectsRef);

        const notificationSubjects = [];

        // Loop through each subject
        for (const subjectDoc of subjectsSnapshot.docs) {
          const subjectData = subjectDoc.data();

          // Check the visitedExam array
          const { visitedExam = [], name } = subjectData;

          // Skip subjects where the student has already taken the exam
          if (visitedExam.includes(studentInfo.id)) {
            continue; // Skip this subject if the student ID is present in visitedExam
          }

          // Reference to the quiz subcollection
          const quizRef = collection(db, "subjects", subjectDoc.id, "quiz");
          const quizSnapshot = await getDocs(quizRef);

          // Check if the quiz collection has 20 or more documents
          if (quizSnapshot.size >= 1) {
            notificationSubjects.push({
              id: subjectDoc.id,
              name: name || "Unnamed Subject",
              totalQuizzes: quizSnapshot.size,
            });
          }
        }

        // Set the subjects that meet the criteria
        setQuizSubjects([...notificationSubjects]);
        console.log(quizSubjects);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching quiz notifications: ", error);
      }
    };

    fetchQuizNotifications();
  }, [studentInfo.id]);

  const handleButtonClick = (subjectId: string) => {
    navigation.navigate("quiz", { subjectId });
  };

  if (isloading) {
    return (
      <ImageBackground
        source={require("../assets/images/home-bg.jpeg")}
        style={styles.loadingContainer}
      >
        <ActivityIndicator size="large" color="#4c73be" />
      </ImageBackground>
    );
  }

  return (
    <ImageBackground
      source={require("../assets/images/home-bg.jpeg")}
      style={styles.background}
    >
      <View style={styles.container}>
        <View style={styles.greetingContainer}>
          <Text style={styles.greetingText}>Hi {studentInfo.name}</Text>
        </View>

        {quizSubjects.length > 0 ? (
          <FlatList
            data={quizSubjects}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <View style={styles.iconContainer}>
                  <Text style={styles.subjectName}>{item.name}</Text>
                  <Text style={styles.description}>
                    Number of Questions: {item.totalQuizzes}
                  </Text>

                  <TouchableOpacity
                    style={styles.materialsButton}
                    onPress={() => handleButtonClick(item.id)}
                  >
                    <Text style={styles.materialsButtonText}>Take Quiz</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
            showsVerticalScrollIndicator={false}
            numColumns={2}
            contentContainerStyle={styles.cardContainer}
          />
        ) : (
          <Text>There is no exam at the moment, come back later</Text>
        )}
      </View>
    </ImageBackground>
  );
};

export default QuizList;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
    margin: 0,
    padding: 0,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  stretch: {
    width: 100, // Adjust width as needed
    height: 100, // Adjust height as needed
    resizeMode: "cover", // Ensures the image covers the area without stretching
  },
  greetingContainer: {
    marginBottom: 20,
    flexDirection: "row",
    gap: 20,
  },
  greetingText: {
    fontWeight: "bold",
    fontSize: 20,
    // marginBottom: 10,
  },
  cardContainer: {
    justifyContent: "center",
  },
  card: {
    backgroundColor: "#f5f6fc",
    width: 340,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    margin: 10,
    borderColor: "#9ca3af",
    borderWidth: 1,
    padding: 20,
  },
  iconContainer: {
    alignItems: "center",
    // padding: 15,
  },
  subjectName: {
    fontWeight: "bold",
    color: "black",
    fontSize: 20,
    textAlign: "left",
    marginBottom: 5,
  },
  description: {
    color: "#6b7280",
    fontSize: 14,
    textAlign: "center",
    // marginBottom: 10,
    paddingHorizontal: 5,
  },
  materialsButton: {
    marginTop: 10,
    paddingHorizontal: 25,
    paddingVertical: 15,
    backgroundColor: "#1e40af",
    borderRadius: 25,
    width: "80%",
    alignItems: "center",
  },
  materialsButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    zIndex: 20,
  },
});
