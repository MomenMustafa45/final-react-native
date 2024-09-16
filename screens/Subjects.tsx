import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ImageBackground,
  StyleSheet,
} from "react-native";
import { useDispatch } from "react-redux";
import { fetchSubjectsByLevel } from "../services/subjectServices";
import { useAppSelector } from "../hooks/reduxHooks";
import { useNavigation } from "@react-navigation/native";
import { Image } from "@rneui/themed";

function Subjects() {
  const [filteredSubjects, setFilteredSubjects] = useState([]);
  const dispatch = useDispatch();
  const userInfo = useAppSelector((state) => state.user.user);
  const navigation = useNavigation();

  useEffect(() => {
    const loadSubjects = async () => {
      if (userInfo.class_id) {
        const data = await fetchSubjectsByLevel(userInfo.class_id);
        setFilteredSubjects([...data]);
        console.log(filteredSubjects);
      }
    };

    console.log(userInfo);

    loadSubjects();
  }, [userInfo.class_id]);

  // دالة للتعامل مع الضغط على زر الاختبار
  const handleButtonClick = (subjectId) => {
    // navigation.navigate("QuizScreen", { subjectId });
  };

  // دالة لعرض تفاصيل المادة
  const showDetails = (subjectId) => {
    // navigation.navigate("SubjectDetailsScreen", { subjectId });
  };

  return (
    <ImageBackground
      source={require("../assets/images/home-bg.jpeg")} // Use require for local images
      style={styles.background}
    >
      <View style={styles.container}>
        <View style={styles.greetingContainer}>
          <Text style={styles.greetingText}>Hi {userInfo.name}</Text>
        </View>

        <FlatList
          data={filteredSubjects}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
            style={styles.card}
            onPress={() => handleButtonClick(item.id)}
          >
            <View style={styles.iconContainer}>
              <Text>{item.name}</Text>
            </View>
          </TouchableOpacity>
          
          )}
          numColumns={2} // ترتيب العناصر في عمودين
          contentContainerStyle={styles.cardContainer}
        />
      </View>
    </ImageBackground>
  );
}

export default Subjects;

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
  },
  cardContainer: {
    justifyContent: "center",
  },
  card: {
    backgroundColor: "#f5f6fc",
    width: 150,
    height: 150,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    margin: 10,
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
