import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ImageBackground,
  StyleSheet,
  Image,
} from "react-native";
import { useDispatch } from "react-redux";
import { fetchSubjectsByLevel } from "../services/subjectServices";
import { useAppSelector } from "../hooks/reduxHooks";
import { useNavigation } from "@react-navigation/native";
import Loader from "./components/Loader";

function Subjects() {
  const [filteredSubjects, setFilteredSubjects] = useState([]);
  const [loading, setLoading] = useState(true); // حالة التحميل
  const dispatch = useDispatch();
  const userInfo = useAppSelector((state) => state.user.user);
  const navigation = useNavigation();

  useEffect(() => {
    const loadSubjects = async () => {
      if (userInfo.class_id) {
        const data = await fetchSubjectsByLevel(userInfo.class_id);
        setFilteredSubjects(data);
      }
      setLoading(false); // إنهاء حالة التحميل بعد استرجاع البيانات
    };

    loadSubjects();
  }, [userInfo.class_id]);

  const handleButtonClick = (subjectId) => {
    navigation.navigate("QuizScreen", { subjectId });
  };

  const showDetails = (subjectId) => {
    navigation.navigate("SubjectDetails", { subjectId });
  };

  return (
    <ImageBackground
      source={require("../assets/images/schaduel.png")}
      style={styles.background}
    >
      <View style={styles.container}>
        <View style={styles.greetingContainer}>
          <Text style={styles.greetingText}>Hi {userInfo.name}</Text>
        </View>

        {loading ? ( // عرض Loader أثناء التحميل
          <Loader/>
        ) : (
          <FlatList
            data={filteredSubjects}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.card}
                onPress={() => handleButtonClick(item.id)}
              >
                <View style={styles.iconContainer}>
                  <Image
                    style={styles.stretch}
                    source={{ uri: item.photoURL }} // Use dynamic image URL
                  />
                  <Text style={styles.subjectName}>{item.name}</Text>
                  <Text style={styles.description}>{item.description}</Text>

                  <TouchableOpacity
                    style={styles.materialsButton}
                    onPress={() => showDetails(item.id)}
                  >
                    <Text style={styles.materialsButtonText}>See Material</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            )}
            numColumns={2}
            contentContainerStyle={styles.cardContainer}
          />
        )}
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
  stretch: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
  },
  greetingContainer: {
    marginBottom: 20,
    flexDirection: "row",
    gap: 20,
  },
  greetingText: {
    fontWeight: "bold",
    fontSize: 20,
  },
  cardContainer: {
    justifyContent: "center",
  },
  card: {
    backgroundColor: "#f5f6fc",
    width: 340,
    height: 350,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    margin: 10,
    borderColor: "#9ca3af",
    borderWidth: 1,
  },
  iconContainer: {
    alignItems: "center",
    height: 200,
  },
  subjectName: {
    fontWeight: "bold",
    color: "black",
    fontSize: 20,
    textAlign: "left",
    marginBottom: 5,
  },
  description: {
    color: "#6b7280",
    fontSize: 14,
    textAlign: "center",
    paddingHorizontal: 5,
  },
  materialsButton: {
    marginTop: 10,
    paddingHorizontal: 25,
    paddingVertical: 15,
    backgroundColor: "#1e40af",
    borderRadius: 25,
    width: '80%',
    alignItems: 'center',
    marginBottom: 50,
  },
  materialsButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
});
