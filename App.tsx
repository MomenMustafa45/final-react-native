import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { Provider } from "react-redux";
import { Store } from "./Redux/Store";

export default function App() {
  return (
    <View style={styles.container}>
      <Provider store={Store}>
        <Text className="text-white text-3xl bg-black">
          Open up App.tsx to start working on your asdasdws!
        </Text>
        <StatusBar style="auto" />
      </Provider>
    </View>
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
