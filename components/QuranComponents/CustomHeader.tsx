import { View, Text, Touchable, TouchableWithoutFeedback } from "react-native";
import React from "react";
import { Entypo, Feather, FontAwesome } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootNavigationParamList } from "../../navigation/Stack";

type NavigationProps = NavigationProp<RootNavigationParamList>;

type CustomDrawerHeaderProps = {
  setModalVisibleSearch: () => void;
};

const CustomHeader = ({ setModalVisibleSearch }: CustomDrawerHeaderProps) => {
  const navigation = useNavigation<NavigationProps>();

  return (
    <View className=" relative flex flex-row px-3 justify-between h-14 items-center">
      <LinearGradient
        // Background Linear Gradient
        colors={[
          "#08AD4A",
          "#3ACEB3",
          "#0CB697",
          "#08AD4A",
          "#08AD4A",
          "#08AD4A",
          "#08AD4A",
          "#08AD4A",
          "#08AD4A",
        ]}
        start={{ x: 0, y: 0 }} // Start from the left
        end={{ x: 1, y: 0 }} // End on the right
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          height: "100%",
        }}
      />
      <TouchableWithoutFeedback
        onPress={() => {
          navigation.goBack();
        }}
      >
        <Entypo name="arrow-left" size={25} color="white" />
      </TouchableWithoutFeedback>
      <Text className="text-white">مصحف المسلمين</Text>
      <TouchableWithoutFeedback onPress={setModalVisibleSearch}>
        <FontAwesome name="search" size={22} color="white" />
      </TouchableWithoutFeedback>
    </View>
  );
};

export default CustomHeader;
