import React, { useEffect, useState } from 'react';
import { View, Text, Button, ActivityIndicator, StyleSheet, ScrollView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import { Picker } from '@react-native-picker/picker'; // استيراد Picker من المكتبة الجديدة
import { useAppSelector } from '../hooks/reduxHooks';
import { getKids } from '../Redux/Slices/KidsSlice';
import { fetchSubjectsGrades } from '../services/gradeServices';

const KidsGrades = () => {
  const dispatch = useDispatch();
  const kids = useSelector((state) => state.kids.kidsList);
  const userInfo = useAppSelector((state) => state.user.user);
  const [selectedKid, setSelectedKid] = useState('');
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const parentId = userInfo.id;
    if (parentId) {
      dispatch(getKids(parentId));
    }
  }, []);

  const handleViewGrades = async () => {
    if (selectedKid) {
      setLoading(true);
      try {
        const fetchedGrades = await fetchSubjectsGrades(selectedKid);
        setGrades(fetchedGrades);
        setError(null);
      } catch (error) {
        setError('Failed to fetch grades. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Kids</Text>

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

      {loading && <ActivityIndicator size="large" color="#002749" />}

      {error && <Text style={styles.error}>{error}</Text>}

      {grades.length > 0 && (
        <ScrollView>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={styles.tableHeaderText}>Subject</Text>
              <Text style={styles.tableHeaderText}>Grade</Text>
            </View>

            {grades.map((item) => (
              <View key={item.id} style={styles.tableRow}>
                <Text style={styles.tableCell}>{item.subjectName}</Text>
                <Text style={styles.tableCell}>{item.grade}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      )}

      {grades.length === 0 && !loading && !error && <Text>No grades available for the selected kid.</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  form: {
    marginBottom: 20,
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 20,
  },
  table: {
    marginTop: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#002749',
    padding: 10,
  },
  tableHeaderText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  tableCell: {
    fontSize: 16,
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginTop: 10,
  },
});

export default KidsGrades;
