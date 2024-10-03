import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useAppSelector } from "../hooks/reduxHooks"; // Assumed hook for fetching user info
import { useNavigation, useRoute } from "@react-navigation/native";
import {
  addGradeToStudent,
  checkIfStudentCompletedQuiz,
  getQuizQuestions,
  markQuizAsCompleted,
} from "../services/quizServices";
import { RootNavigationParamList } from "../navigation/Stack";

const Quiz = () => {
  const userInfo = useAppSelector((state) => state.user.user);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [answer, setAnswer] = useState("");
  const [subject, setSubject] = useState(null); // Initialize with null
  const [isloading, setIsLoading] = useState(false);
  const navigate = useNavigation<RootNavigationParamList>();
  const route = useRoute<any>();
  const { subjectId } = route.params; // Get subjectId from params
  console.log("hello from squiz", subjectId);

  // Ensure subjectId is properly assigned and is not undefined
  useEffect(() => {
    if (subjectId) {
      setSubject(subjectId); // Set subjectId once it's available
    }
  }, [subjectId]);

  // Check if student has already taken the quiz
  const isVisitedQuizBefore = async (subject) => {
    try {
      const isVisited = await checkIfStudentCompletedQuiz(subject, userInfo.id);
      if (isVisited) {
        Alert.alert("Alert!", "You can't take the same quiz two times", [
          {
            text: "Understood",
            onPress: () => {
              navigate.navigate("Home");
            },
          },
        ]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Fetch quiz questions and handle quiz state
  useEffect(() => {
    if (subjectId) {
      setIsLoading(true);
      getQuizQuestions(subjectId, (questions) => {
        setQuizQuestions([...questions]);
        if (questions.length < 1) {
          Alert.alert("Alert!", "Exam not ready yet.", [
            {
              text: "Okay!",
              onPress: () => {
                navigate.navigate("Home");
              },
            },
          ]);
        }
      });

      isVisitedQuizBefore(subject);
      setIsLoading(false);
    }
  }, [subject]);

  const currentQuestion = quizQuestions[currentQuestionIndex];

  // Handle next question
  const handleNextQuestion = () => {
    if (answer) {
      if (currentQuestionIndex < quizQuestions.length) {
        console.log(currentQuestion?.options, "hello");

        if (
          currentQuestion?.options.indexOf(answer) ==
          currentQuestion.correctAnswer
        ) {
          setScore((prev) => prev + 1);
        }

        if (currentQuestionIndex === quizQuestions.length - 1) {
          setQuizCompleted(true);
          markQuizAsCompleted(subject, userInfo.id);
          addGradeToStudent({
            studentId: userInfo.id,
            subjectId: subject,
            level_id: userInfo.class_id,
            score: (score + 1).toString(),
          });
        } else {
          setCurrentQuestionIndex((prev) => prev + 1);
        }
        setAnswer("");
      }
    }
  };

  const handleOptionPress = (option) => {
    setAnswer(option);
  };

  if (isloading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4c73be" />
      </View>
    );
  }

  return (
    <ImageBackground
      source={require("../assets/images/home2.png")}
      style={styles.background}
    >
      <View className="bg-[#ffffff99] w-full mb-4 items-center justify-center p-5">
        <Text className="text-xl font-bold">Hi {userInfo.name}</Text>
        <Text>Good Luck!</Text>
      </View>
      <View style={styles.container}>
        {!quizCompleted ? (
          <>
            <Text style={styles.questionText}>{currentQuestion?.question}</Text>
            {currentQuestion?.options.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.optionButton,
                  currentQuestion.options.indexOf(answer) == index &&
                    styles.selectedOption,
                ]}
                onPress={() => {
                  handleOptionPress(option);
                }}
              >
                <Text style={styles.optionText}>{option}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.nextButton}
              onPress={handleNextQuestion}
            >
              <Text style={styles.nextButtonText}>Next</Text>
            </TouchableOpacity>
          </>
        ) : (
          <View style={styles.resultContainer}>
            <Text style={styles.resultText}>Quiz Completed!</Text>
            <Text style={styles.resultText}>
              Your Score is {score} out of {quizQuestions.length}
            </Text>
            <TouchableOpacity
              style={styles.nextButton}
              onPress={() => {
                navigate.navigate("Home");
              }}
            >
              <Text style={styles.nextButtonText}>Go Home</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ImageBackground>
  );
};

export default Quiz;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 5,
    maxWidth: 350,
    width: "90%",
  },
  greetingText: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  questionText: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 20,
    textAlign: "center",
  },
  optionButton: {
    backgroundColor: "#f0f0f0",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: "center",
  },
  selectedOption: {
    backgroundColor: "#d6eaff",
  },
  optionText: {
    fontSize: 16,
  },
  nextButton: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    alignItems: "center",
  },
  nextButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  resultContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  resultText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    zIndex: 20,
  },
});
