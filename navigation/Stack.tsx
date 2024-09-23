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
import RoutineTable from "../screens/RoutineTable";
import StudentRoutineTable from "../screens/StudentRoutineTable";
import SchoolGallary from "../screens/SchoolGallary";
import SubjectDetails from "../screens/SubjectMaterial";
import KidsGrades from "../screens/KidsGrades";

export type RootNavigationParamList = {
  navigate(arg0: string): unknown;
  Splash: undefined;
  Home: undefined;

  Login: undefined;
  Subjects: undefined;
  quiz: undefined;
  staff: undefined;
  // contact: undefined;

  grade: undefined;

  contact: undefined;
  routine: undefined;
  gallary: undefined;
  SubjectDetails: undefined;
  KidsGrade:undefined;
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
      <Stack.Screen name="gallary" component={SchoolGallary} />
      <Stack.Screen name="SubjectDetails" component={SubjectDetails} />
      <Stack.Screen name="KidsGrade" component={KidsGrades} />

      <Stack.Screen name="routine" component={StudentRoutineTable} />



    </Stack.Navigator>
  );
};

export default StackNavigation;
