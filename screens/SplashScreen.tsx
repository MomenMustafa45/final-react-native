import { View, Text } from "react-native";
import React, { useEffect } from "react";
import { CommonActions, useNavigation } from "@react-navigation/native";
import { RootNavigationParamList } from "../navigation/Stack";
import LottieView from "lottie-react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getUserById } from "../services/userServices";
import { useAppDispatch } from "../hooks/reduxHooks";

type SplashScreenNavigationProp = StackNavigationProp<
  RootNavigationParamList,
  "Splash"
>;

const SplashScreen = () => {
  const navigation = useNavigation<SplashScreenNavigationProp>();
  const dispatch = useAppDispatch();

  const handleUserId = async () => {
    const userLogged = await AsyncStorage.getItem("userId");

    if (!userLogged) {
      navigation.dispatch(
        CommonActions.reset({ index: 0, routes: [{ name: "Login" }] })
      );
    } else {
      getUserById(userLogged, dispatch);
      console.log(userLogged);
      navigation.dispatch(
        CommonActions.reset({ index: 0, routes: [{ name: "Home" }] })
      );
    }
    console.log(userLogged);
  };

  useEffect(() => {
    const autoNavigate = setTimeout(() => {
      handleUserId();
    }, 4000);
    return () => clearTimeout(autoNavigate);
  }, []);
  return (
    <View className="flex-1 items-center justify-center bg-[#CECED0]">
      <LottieView
        source={require("../assets/icons/animation-splash-three.json")}
        style={{ width: "100%", height: "100%" }}
        autoPlay
        loop
      />
    </View>
  );
};

export default SplashScreen;
