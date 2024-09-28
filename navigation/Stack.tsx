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
// import RoutineTable from "../screens/RoutineTable";
import StudentRoutineTable from "../screens/StudentRoutineTable";
import SchoolGallary from "../screens/SchoolGallary";
import SubjectDetails from "../screens/SubjectMaterial";
import KidsGrades from "../screens/KidsGrades";
import ParentRoutineTable from "../screens/Quiz";
import KidsRoutine from "../screens/KidsRoutineTable";
import Chat from "../screens/Chatt";
import TeacherTable from "../screens/TeacherTable";
import Attendance from "../screens/Attendance";
import MyCalendar from "../screens/Calendar";
import ParentAttendance from "../screens/ParentAttendance";
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
  KidsGrade:undefined;
  kidsRoutine :undefined;
  chat:undefined;
  TeacherTable:undefined;
  attendance:undefined;
  parentAttendance:undefined;
  calendar:undefined;
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
      <Stack.Screen name="chat" component={Chat} />
      <Stack.Screen name="TeacherTable" component={TeacherTable} />

      <Stack.Screen name="quizList" component={QuizList} />
      <Stack.Screen name="gallary" component={SchoolGallary} />
      <Stack.Screen name="SubjectDetails" component={SubjectDetails} />
      <Stack.Screen name="KidsGrade" component={KidsGrades} />
      <Stack.Screen name="kidsRoutine" component={KidsRoutine} />
      <Stack.Screen name="attendance" component={Attendance} />
      <Stack.Screen name="calendar" component={MyCalendar} />
      <Stack.Screen name="parentAttendance" component={ParentAttendance} />

      <Stack.Screen name="routine" component={StudentRoutineTable} />
      <Stack.Screen name="quran" component={QuranScreen} />
    </Stack.Navigator>
  );
};

export default StackNavigation;
