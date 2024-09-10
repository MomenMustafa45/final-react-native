import { View, Text } from "react-native";
import React, { useEffect } from "react";
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
} from "react-native-reanimated";
import { CommonActions, useNavigation } from "@react-navigation/native";
import { RootNavigationParamList } from "../navigation/Stack";

const SplashScreen = () => {
  const navigation = useNavigation<RootNavigationParamList>();

  const opacityAnimation = useSharedValue(0);

  const config = {
    duration: 2000,
  };

  const style = useAnimatedStyle(() => {
    return {
      opacity: opacityAnimation.value,
    };
  });

  // const handleUserId = async () => {
  //   const userInfo = await AsyncStorage.getItem("userInfo");

  //   if (!userInfo) {
  //     navigation.dispatch(
  //       CommonActions.reset({ index: 0, routes: [{ name: "Landing" }] })
  //     );
  //   } else {
  //     navigation.dispatch(
  //       CommonActions.reset({ index: 0, routes: [{ name: "Home" }] })
  //     );
  //   }
  // };

  useEffect(() => {
    opacityAnimation.value = withTiming(1, config);
    const autoNavigate = setTimeout(() => {
      navigation.dispatch(
        CommonActions.reset({ index: 0, routes: [{ name: "Home" }] })
      );
    }, 3100);
    return () => clearTimeout(autoNavigate);
  }, []);
  return (
    <View>
      <Text>SplashScreen</Text>
    </View>
  );
};

export default SplashScreen;
