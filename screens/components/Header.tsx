import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import { CommonActions, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { resetUser } from '../../Redux/Slices/userSlice';
import auth from '../../config/firebase';
import { signOut } from 'firebase/auth';
import { Avatar } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons'; 

const Headero = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const userInfo = useAppSelector((state) => state.user.user);

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
    <View style={styles.greetingContainer}>
      <Avatar.Image
        size={50}
        source={{ uri: userInfo.photoURL || 'https://example.com/default-avatar.png' }}
      />
      <Text style={styles.greetingText}>Hi {userInfo.name}</Text>
      <TouchableOpacity onPress={handleLogout}>
        <Icon name="log-out-outline" size={30} color="#000" style={{marginLeft:80}} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  greetingContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    // borderRadius: 10,
  },
  greetingText: {
    fontWeight: "bold",
    fontSize: 20,
    marginLeft: 10,
  },
});

export default Headero;
