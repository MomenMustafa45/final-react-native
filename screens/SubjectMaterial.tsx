import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  FlatList,
  Modal,
  TouchableOpacity,
  TextInput,
  Linking,
} from "react-native";
import { ResizeMode, Video } from "expo-av";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../config/firebase";

function SubjectDetails({ route }) {
  const { subjectId } = route.params || {};
  const [subjects, setSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLesson, setSelectedLesson] = useState<{
    videoUrl: string | null;
    pdfUrl: string | null;
    lessonName: string;
  } | null>(null);

  useEffect(() => {
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
    videoUrl: string | null,
    pdfUrl: string | null,
    lessonName: string
  ) => {
    setSelectedLesson({ videoUrl, pdfUrl, lessonName });
  };

  const handleClose = () => {
    setSelectedLesson(null); // Close the displayed video or PDF
  };

  if (loading) return <Text style={styles.loadingText}>Loading...</Text>;
  if (error) return <Text style={styles.errorText}>{error}</Text>;

  return (
    <View
      // source={{ uri: subjects[0]?.photoURL }} // Background image for the subject
      style={styles.background}
      // resizeMode="cover"
    >
      <View style={styles.container}>
        <View style={styles.subjectInfo}>
          <Text style={styles.title}>{subjects[0]?.name}</Text>
          <Text style={styles.description}>{subjects[0]?.description}</Text>
        </View>

        <TextInput
          style={styles.searchBar}
          placeholder="Search by lesson name..."
          value={searchTerm}
          onChangeText={(text) => setSearchTerm(text)}
        />

        <FlatList
          data={filteredVideos}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.lessonContainer}
              onPress={() =>
                handleSelectItem(item.videoUrl, item.pdfUrl, item.lessonName)
              }
            >
              <Text style={styles.lessonName}>{item.lessonName}</Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.lessonList}
        />
      </View>

      <Modal visible={!!selectedLesson} animationType="slide">
        <View style={styles.modalContent}>
          {selectedLesson && (
            <>
              <Text style={styles.modalTitle}>{selectedLesson.lessonName}</Text>
              <Video
                source={{ uri: selectedLesson.videoUrl }}
                style={styles.video}
                useNativeControls
                resizeMode={ResizeMode.CONTAIN}
              />
              {selectedLesson.pdfUrl && (
                <TouchableOpacity
                  onPress={() => {
                    Linking.openURL(selectedLesson.pdfUrl);
                  }}
                >
                  <Text style={styles.pdfLink}>View PDF</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                onPress={handleClose}
                style={styles.closeButton}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "rgba(255, 255, 255, 0.9)", // Transparent background
  },
  subjectInfo: {
    marginBottom: 20,
    alignItems: "center",
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
  searchBar: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
  },
  lessonContainer: {
    padding: 15,
    backgroundColor: "#f5f6fc",
    borderRadius: 10,
    marginBottom: 10,
    elevation: 1,
  },
  lessonName: {
    fontSize: 18,
  },
  lessonList: {
    paddingBottom: 100,
  },
  modalContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  video: {
    width: "100%",
    height: 200,
  },
  pdfLink: {
    color: "#1e90ff",
    marginVertical: 10,
    textDecorationLine: "underline",
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#ea580c",
    borderRadius: 5,
  },
  closeButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  loadingText: {
    textAlign: "center",
    fontSize: 18,
  },
  errorText: {
    textAlign: "center",
    fontSize: 18,
    color: "red",
  },
});

export default SubjectDetails;
