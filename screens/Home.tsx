import { View, Text, StyleSheet, ImageBackground } from "react-native";
import React, { useEffect } from "react";
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
import { Header } from "@react-navigation/stack";
import Headero from "./components/Header";

const Home = () => {
  const userInfo = useAppSelector((state) => state.user.user);

  const navigation = useNavigation<RootNavigationParamList>();

  const arr = [
    { iconName: "book", text: "Subjects", screen: "Subjects" },
    { iconName: "table", text: "Routine Table", screen: "routine" },
    { iconName: "question", text: "Quiz", screen: "quiz" },
    { iconName: "bar-chart", text: "Grades", screen: "grade" },
    { iconName: "user", text: "Staff", screen: "staff" },
    { iconName: "phone", text: "Ask Doubts", screen: "contact" },
    { iconName: "image", text: "School gallary", screen: "gallary" },
    { iconName: "qrcode", text: "Attendance", screen: "attendance" },
    { iconName: "calendar", text: "Calendar", screen: "calendar" },
    // { iconName: "sign-out", text: "Log out " ,screen :"Login" },
  ];
  const dispatch = useAppDispatch();
  const navigate = useNavigation();
  const handleLogout = async () => {
    try {
      console.log("logout fun");
      await AsyncStorage.removeItem("userId");
      dispatch(resetUser());

      // Sign out from Firebase
      await signOut(auth);
      navigate.dispatch(
        CommonActions.reset({ index: 0, routes: [{ name: "Login" }] })
      );
    } catch (error) {
      console.error("Error logging out: ", error);
    }
  };
  return (
    <ImageBackground
      source={require("../assets/images/home-bg.jpeg")} // Use require for local images
      style={styles.background}
    >
      <Headero/>
      <View style={styles.container}>
        <View style={styles.cardContainer}>
          {arr.map((item, index) => (
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
  greetingContainer: {
    marginBottom: 20,
    flexDirection: "row",
    gap: 20,
    marginRight: 200,
  },
  greetingText: {
    fontWeight: "bold",
    fontSize: 20,
    marginBottom: 10,
    marginLeft: 60,
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
    color: "#345fb4",
  },
  cardText: {
    fontWeight: "bold",
    color: "black",
  },
});

export default Home;
