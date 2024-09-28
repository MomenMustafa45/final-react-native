import { StatusBar } from "expo-status-bar";
import { Platform, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { Provider } from "react-redux";
import { Store } from "./Redux/Store";
import StackNavigation from "./navigation/Stack";
import { NavigationContainer } from "@react-navigation/native";
import React from "react";

export default function App() {
  return (
    <Provider store={Store}>
      <SafeAreaView
        style={{ flex: 1, paddingTop: Platform.OS == "android" ? 25 : 0 }}
      >
        <NavigationContainer>
          <StackNavigation />
        </NavigationContainer>
      </SafeAreaView>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
