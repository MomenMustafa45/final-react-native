import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import SplashScreen from "../screens/SplashScreen";
import Home from "../screens/Home";

export type RootNavigationParamList = {
  Splash: undefined;
  Home: undefined;
};

const Stack = createStackNavigator<RootNavigationParamList>();

const StackNavigation = () => {
  return (
    <Stack.Navigator initialRouteName="Splash">
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Home" component={Home} />
    </Stack.Navigator>
  );
};

export default StackNavigation;
