import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { fetchTeachers } from '../services/userServices';
import Loader from './components/Loader';

function Staff() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true); // إضافة حالة التحميل

  useEffect(() => {
    const loadTeachers = async () => {
      try {
        const fetchedTeachers = await fetchTeachers();
        setTeachers(fetchedTeachers);
      } catch (error) {
        console.error('Error fetching teachers: ', error);
      } finally {
        setLoading(false); // تأكد من إيقاف التحميل بعد الانتهاء
      }
    };

    loadTeachers();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Teachers</Text>
      </View>

      {loading ? ( // عرض Loader أثناء التحميل
        <Loader />
      ) : (
        // Teacher Cards
        teachers.map((teacher, index) => (
          <View key={index} style={styles.card}>
            <Image source={{ uri: teacher.photoURL }} style={styles.profileImage} />
            <Text style={styles.name}>{teacher.name}</Text>
            <Text style={styles.subject}>{teacher.subjectName}</Text>
            <Text style={styles.description}>{teacher.description}</Text>

            {/* <TouchableOpacity style={styles.profileButton}>
              <Text style={styles.profileButtonText}>View Profile</Text>
            </TouchableOpacity> */}
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  header: {
    backgroundColor: '#d3d3d3',
    padding: 20,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#002749',
  },
  card: {
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  subject: {
    fontSize: 16,
    color: '#888',
  },
  description: {
    fontSize: 14,
    color: '#888',
    marginBottom: 20,
    textAlign: 'center',
  },
  profileButton: {
    backgroundColor: '#002749',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  profileButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default Staff;
