import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  FlatList,
} from "react-native";
import { useRoute } from "@react-navigation/native"; // لاستخدام الـ Route
import { ResizeMode, Video } from "expo-av";

import { collection, getDocs, query, where } from "firebase/firestore";
import { SubjectType } from "../utils/types";
import { db } from "../config/firebase";
import { TextInput } from "react-native";

function SubjectDetails() {
  const route = useRoute<any>();
  const { subjectId } = route.params || {};
  const [subjects, setSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVideo, setSelectedVideo] = useState<{
    url: string | null;
    type: string;
    lessonName: string;
  } | null>(null);

  useEffect(() => {
    if (!subjectId) {
      setError("Subject ID is missing");
      setLoading(false);
      return;
    }

    const fetchVideos = async () => {
      try {
        const subjectsCollection = collection(db, "subjects");
        const subjectQuery = query(
          subjectsCollection,
          where("id", "==", subjectId)
        );
        const subjectsSnapshot = await getDocs(subjectQuery);
        const subjectsData = subjectsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as any),
        }));
        setSubjects(subjectsData);
      } catch (err) {
        console.error("Error fetching subjects:", err);
        setError("Failed to fetch subjects");
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [subjectId]);

  const filteredVideos = subjects.flatMap((subject) =>
    subject.videoUrls && subject.lessonNames
      ? subject.videoUrls
          .map((videoUrl, index) => {
            const lessonName = subject.lessonNames[index];
            const pdfUrl = subject.pdfUrls[index];
            return lessonName &&
              lessonName.toLowerCase().includes(searchTerm.toLowerCase())
              ? { videoUrl, lessonName, pdfUrl }
              : null;
          })
          .filter(Boolean)
      : []
  );

  const handleSelectItem = (
    url: string | null,
    type: string,
    lessonName: string
  ) => {
    setSelectedVideo({ url, type, lessonName });
  };

  const handleClose = () => {
    setSelectedVideo(null); // Close the displayed video or PDF
  };

  if (loading) return <Text className="text-center">Loading...</Text>;
  if (error) return <Text className="text-center text-red-600">{error}</Text>;

  const hasContent = subjects.some(
    (subject) => subject.videoUrls && subject.videoUrls.length > 0
  );

  console.log(filteredVideos);

  return (
    <ImageBackground
      source={{ uri: subjects[0].photoURL }} // Background image for the subject
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>
        {/* Subject information */}
        <View style={styles.subjectInfo}>
          <Text style={styles.title}>{subjects[0].name}</Text>
          <Text style={styles.description}>{subjects[0].description}</Text>
        </View>

        {/* Search bar */}
        <TextInput
          style={styles.searchBar}
          placeholder="Search by lesson name..."
          value={searchTerm}
          onChangeText={(text) => setSearchTerm(text)}
        />

        {/* Video List */}
        <FlatList
          data={filteredVideos}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <View style={styles.videoContainer}>
              <Text style={styles.lessonName}>
                {subjects[0].lessonNames[index]}
              </Text>
              <Video
                source={{ uri: item.videoUrl }} // Display video from URLs
                style={styles.video}
                useNativeControls
                resizeMode={ResizeMode.CONTAIN}
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
