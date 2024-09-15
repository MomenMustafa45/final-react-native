import { View, Text, StyleSheet, ImageBackground } from "react-native";
import React from "react";
import { Avatar } from "@rneui/themed";
import Icon from "react-native-vector-icons/FontAwesome";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useAppDispatch } from "../hooks/reduxHooks";
import { resetUser } from "../Redux/Slices/userSlice";
import { signOut } from "firebase/auth";
import auth from "../config/firebase";
import { CommonActions, useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
const Home = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigation();

  const arr = [
    { iconName: "", text: "Subjects" },
    { iconName: "rocket", text: "salma" },

    { iconName: "rocket", text: "salma" },

    { iconName: "rocket", text: "salma" },

    { iconName: "rocket", text: "salma" },

    { iconName: "rocket", text: "salma" },
  ];

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
      <View style={styles.container}>
        <View style={styles.greetingContainer}>
          <Text style={styles.greetingText}>Hi Salma</Text>

          <Avatar
            size={32}
            rounded
            source={{ uri: "https://randomuser.me/api/portraits/men/36.jpg" }}
          />
          <TouchableOpacity
            onPress={() => {
              handleLogout();
            }}
          >
            <Text>Logout</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.cardContainer}>
          {[...arr].map((item, index) => (
            // <TouchableOpacity></TouchableOpacity>
            <View key={index} style={styles.card}>
              <View style={styles.iconContainer}>
                <Icon
                  name={item.iconName}
                  size={50}
                  color="#900"
                  style={styles.icon}
                />
                <Text style={styles.cardText}>{item.text}</Text>
              </View>
            </View>
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
    padding: 0, // Ensures the background image covers the whole area
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
  },
  avatarRow: {
    flexDirection: "row",
    gap: 10, // You can replace this with margin in older React Native versions
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
