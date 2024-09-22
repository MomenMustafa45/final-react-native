import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ImageBackground, FlatList } from "react-native";
import { useRoute } from "@react-navigation/native"; // لاستخدام الـ Route
import { Video } from 'expo-av';

<Video
  source={{ uri: videoUrl }}
  rate={1.0}
  volume={1.0}
  isMuted={false}
  resizeMode="cover"
  shouldPlay
  isLooping
  style={{ width: 300, height: 300 }}
/>

import { getSubjectById } from "../services/subjectServices"; // استيراد خدمة الـ Firebase

function SubjectDetails() {
  const route = useRoute();
  const { subjectId } = route.params || {}; // الحصول على subjectId
  const [videos, setVideos] = useState([]);
  const [subject, setSubject] = useState(null);

  useEffect(() => {
    if (!subjectId) {
      console.error("No subjectId found in route.params");
      return;
    }

    const getSubject = async (id) => {
      try {
        const subjectData = await getSubjectById(id);
        if (subjectData) {
          setSubject(subjectData);
          setVideos(subjectData.videoUrls || []);
        } else {
          console.error("No subject data found!");
        }
      } catch (error) {
        console.error("Error fetching subject details: ", error);
      }
    };

    getSubject(subjectId);
  }, [subjectId]);

  if (!subject) {
    return <Text>Loading...</Text>; // Handle loading state
  }

  return (
    <ImageBackground
      source={{ uri: subject.photoURL }}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <View style={styles.subjectInfo}>
          <Text style={styles.title}>{subject.name}</Text>
          <Text style={styles.description}>{subject.description}</Text>
        </View>

        <FlatList
          data={videos}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.videoContainer}>
              <Video
                source={{ uri: item }}
                style={styles.video}
                controls={true} // أدوات التحكم بالفيديو
                resizeMode="contain"
              />
            </View>
          )}
        />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "rgba(255, 255, 255, 0.8)", // خلفية شفافة فوق الصورة
  },
  subjectInfo: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  description: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
  },
  videoContainer: {
    marginBottom: 20,
  },
  video: {
    width: "100%",
    height: 200,
  },
});

export default SubjectDetails;
