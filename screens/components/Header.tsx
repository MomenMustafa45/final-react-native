import React from 'react';
import { Text, View, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';
import { useAppDispatch } from '../../hooks/reduxHooks';
import { CommonActions, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { resetUser } from '../../Redux/Slices/userSlice';
import auth from '../../config/firebase';
import { signOut } from 'firebase/auth';
import { Button } from 'react-native-elements'; // Adjust if needed
import { Avatar } from 'react-native-elements'; // Ensure this import is correct

const Headero = ({ userInfo = { name: 'Guest', photoURL: '' } }) => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation();

  const handleLogout = async () => {
    try {
      console.log("logout fun");
      await AsyncStorage.removeItem("userId");
      dispatch(resetUser());

      // Sign out from Firebase
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
      source={require('../../assets/images/Colorful Minimalist Personal LinkedIn Banner.png')} // Adjust the path to your background image
      style={styles.background}
    >
      <View style={styles.greetingContainer}>
        <Text style={styles.greetingText}>Hi {userInfo.name}</Text>

        <TouchableOpacity onPress={handleLogout}>
          <Button title="Log Out" buttonStyle={styles.button} />
        </TouchableOpacity>

        <Avatar
          size={32}
          rounded
          source={{ uri: userInfo.photoURL }}
        />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  greetingContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.6)', // Semi-transparent background
    borderRadius: 10,
  },
  greetingText: {
    fontWeight: "bold",
    fontSize: 20,
    marginRight: 20,
  },
  button: {
    backgroundColor: "#1e40af",
    marginVertical: 10,
  },
});

export default Headero;
