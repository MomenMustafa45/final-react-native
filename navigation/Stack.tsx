import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import SplashScreen from "../screens/SplashScreen";
import Home from "../screens/Home";
import Login from "../screens/Login";
import Subjects from "../screens/Subjects";
import Quiz from "../screens/Quiz";
import Staff from "../screens/Staff";
import Contact from "../screens/Contact";
import Grades from "../screens/Grades";
import StudentRoutineTable from "../screens/StudentRoutineTable";
import SchoolGallary from "../screens/SchoolGallary";
import SubjectDetails from "../screens/SubjectMaterial";
import QuizList from "../screens/QuizList";
import QuranScreen from "../screens/QuranScreen";

export type RootNavigationParamList = {
  navigate(arg0: string): unknown;
  Splash: undefined;
  Home: undefined;

  Login: undefined;
  Subjects: undefined;
  quiz: { subjectId: string };
  quizList: undefined;
  staff: undefined;
  // contact: undefined;
  quran: undefined;
  grade: undefined;
  contact: undefined;
  routine: undefined;
  gallary: undefined;
  SubjectDetails: undefined;
};

const Stack = createStackNavigator<RootNavigationParamList>();

const StackNavigation = () => {
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Subjects" component={Subjects} />
      <Stack.Screen name="staff" component={Staff} />
      <Stack.Screen name="contact" component={Contact} />
      <Stack.Screen name="grade" component={Grades} />
      <Stack.Screen name="quiz" component={Quiz} />
      <Stack.Screen name="quizList" component={QuizList} />
      <Stack.Screen name="gallary" component={SchoolGallary} />
      <Stack.Screen name="SubjectDetails" component={SubjectDetails} />

      <Stack.Screen name="routine" component={StudentRoutineTable} />
      <Stack.Screen name="quran" component={QuranScreen} />
    </Stack.Navigator>
  );
};

export default StackNavigation;
