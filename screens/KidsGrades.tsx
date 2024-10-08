import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  ScrollView,
  ImageBackground,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Picker } from "@react-native-picker/picker";
import { useAppSelector } from "../hooks/reduxHooks";
import { getKids } from "../Redux/Slices/KidsSlice";
import { fetchSubjectsGrades } from "../services/gradeServices";
import Loader from "./components/Loader";

const KidsGrades = () => {
  const dispatch = useDispatch();
  const kids = useSelector((state) => state.kids.kidsList);
  const userInfo = useAppSelector((state) => state.user.user);
  const [selectedKid, setSelectedKid] = useState("");
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const parentId = userInfo.id;
    if (parentId) {
      dispatch(getKids(parentId));
    }
  }, [dispatch, userInfo.id]); 

  const handleViewGrades = async () => {
    if (selectedKid) {
      setLoading(true);
      try {
        const fetchedGrades = await fetchSubjectsGrades(selectedKid);
        setGrades(fetchedGrades);
        setError(null);
      } catch (error) {
        setError("Failed to fetch grades. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <ImageBackground
      source={require("../assets/images/Pastel Purple fun Creative Modern Minimalist Kids Smile Phone Wallpaper (2).png")}
      style={styles.background}
    >
      <View style={styles.container}>
        {/* <Text style={styles.header}>My Kids</Text> */}

        <View style={styles.form}>
          <Picker
            selectedValue={selectedKid}
            onValueChange={(itemValue) => setSelectedKid(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Select a kid" value="" />
            {kids.map((kid) => (
              <Picker.Item key={kid.id} label={kid.name} value={kid.id} />
            ))}
          </Picker>

          <Button title="VIEW" onPress={handleViewGrades} color="#002749" />
        </View>

        {loading && <Loader />} 

        {error && <Text style={styles.error}>{error}</Text>}

        {grades.length > 0 && (
          <ScrollView>
            <View style={styles.gradeContainer}>
              <View style={styles.tableHeader}>
                <Text style={styles.tableHeaderText}>Subject</Text>
                <Text style={styles.tableHeaderText}>Grade</Text>
              </View>

              {grades.map((item) => (
                <View key={item.id} style={styles.tableRow}>
                  <Text style={styles.tableCell}>{item.subjectName}</Text>
                  <Text style={styles.tableCell}>{item.quizScore}</Text>
                  <Text style={styles.tableCell}>{item.grade}</Text>
                </View>
              ))}
            </View>
          </ScrollView>
        )}
{selectedKid && grades.length === 0 && !loading && !error && (
  <Text>No grades available for the selected kid.</Text>
)}

      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
  },
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    marginTop:150
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#4A4A4A",
  },
  form: {
    marginBottom: 20,
  },
  picker: {
    height: 50,
    width: "100%",
    marginBottom: 20,
    marginTop:150,
    color:"#002749"
  },
  gradeContainer: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  tableHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#002749",
    padding: 10,
  },
  tableHeaderText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
  tableRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  tableCell: {
    fontSize: 18,
    flex: 1,
    textAlign: "center",
  },
  error: {
    color: "red",
    textAlign: "center",
  },
});

export default KidsGrades;
