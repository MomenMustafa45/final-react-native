import { View, Text, StyleSheet, ImageBackground } from "react-native";
import React from "react";
import { Avatar, ButtonGroup } from "@rneui/themed";
import Icon from "react-native-vector-icons/FontAwesome";
import { TouchableOpacity } from "react-native-gesture-handler";
import { CommonActions, useNavigation } from "@react-navigation/native";
import { RootNavigationParamList } from "../navigation/Stack";
import { Button } from "react-native-paper";
import { useDispatch } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { resetUser } from "../Redux/Slices/userSlice";
import { signOut } from "firebase/auth";
import auth from "../config/firebase";
import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks";
import Headero from "./components/Header";

// import Icon from "react-native-vector-icons/Ionicons"; // مثال لاستيراد مكتبة Ionicons


const Home = () => {
  const userInfo = useAppSelector((state) => state.user.user);
  const navigation = useNavigation<RootNavigationParamList>();

  const arr = [
    { iconName: "book", text: "Subjects", screen: "Subjects" },
    { iconName: "table", text: "Routine Table", screen: "routine" },
    { iconName: "table", text: "Routine Table", screen: "TeacherTable" },

    { iconName: "table", text: "Kids Routine Table", screen: "kidsRoutine" },
    { iconName: "question", text: "Quiz", screen: "quiz" },
    { iconName: "bar-chart", text: "Grades", screen: "grade" },
    { iconName: "bar-chart", text: "Kids Grade", screen: "KidsGrade" },
    { iconName: "user", text: "Staff", screen: "staff" },
    { iconName: "phone", text: "Ask Doubts", screen: "contact" },
    { iconName: "image", text: "School Gallery", screen: "gallary" },
    { iconName: "comments", text: "Class Chat", screen: "chat" },
    
    // { iconName: "image", text: "School gallary", screen: "gallary" },
    { iconName: "qrcode", text: "Attendance", screen: "attendance" },
    { iconName: "check", text: "Kids Attendance", screen: "parentAttendance" },
    { iconName: "calendar", text: "Calendar", screen: "calendar" },

  ];

  const filteredArr = arr.filter((item) => {
    if (userInfo.role === "parent") {
      return !["routine",  "grade",  "quiz","Subjects","attendance",'TeacherTable'].includes(item.screen);
    }
    if (userInfo.role === "student") {
      return !["kidsRoutine", "KidsGrade" , 'TeacherTable' , "parentAttendance"].includes(item.screen);
    }
    return true; // Show all for other roles
  });

   
    // { iconName: "sign-out", text: "Log out " ,screen :"Login" },
  
  const dispatch = useAppDispatch();
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("userId");
      dispatch(resetUser());
      await signOut(auth);
      navigation.dispatch(
        CommonActions.reset({ index: 0, routes: [{ name: "Login" }] })
      );
    } catch (error) {
      console.error("Error logging out: ", error);
    }
  };

  return (
    <ImageBackground
      source={require("../assets/images/home2.png")}
      style={styles.background}
    >
      <Headero />
      <View style={styles.container}>
        <View style={styles.cardContainer}>
          {filteredArr.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.card}
              onPress={() => navigation.navigate(item.screen)}
            >
              <View style={styles.iconContainer}>
                <Icon
                  name={item.iconName}
                  size={50}
                  color="#900"
                  style={styles.icon}
                />
                <Text style={styles.cardText}>{item.text}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ImageBackground>
  );
};

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
  cardContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    justifyContent: "center",
    marginTop: 50,
  },
  card: {
    backgroundColor: "#f5f6fc",
    width: 150,
    height: 150,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  iconContainer: {
    alignItems: "center",
  },
  icon: {
    paddingTop: 10,
    paddingBottom: 10,
    color: "#1e3a8a",
  },
  cardText: {
    fontWeight: "bold",
    color: "#ea580c",
  },
});

export default Home;
