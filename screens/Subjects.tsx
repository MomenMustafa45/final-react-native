import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useDispatch } from 'react-redux';
import { fetchSubjectsByLevel } from '../services/subjectServices';
import { useAppSelector } from '../hooks/reduxHooks';
import Headero from './components/Header';
import { useNavigation } from '@react-navigation/native';

const Subjects = () => {
  const [filteredSubjects, setFilteredSubjects] = useState([]);
  const dispatch = useDispatch();
  const userInfo = useAppSelector((state) => state.user.user);
  const navigation = useNavigation(); // تغيير هنا

  useEffect(() => {
    const loadSubjects = async () => {
      if (userInfo.class_id) {
        const data = await fetchSubjectsByLevel(userInfo.class_id);
        setFilteredSubjects(data);
      }
    };

    loadSubjects();
  }, [dispatch, userInfo.class_id]);

  const handleButtonClick = (subjectId) => {
    console.log('Navigating with subjectId:', subjectId);
    navigation.navigate('SubjectDetails', { subjectId }); // تصحيح هنا
  };

  return (
    <View style={styles.container}>
      <Headero />
      <ScrollView contentContainerStyle={styles.grid}>
        {filteredSubjects.map((subject) => (
          <View key={subject.id} style={styles.card}>
            <TouchableOpacity style={styles.flipCard} onPress={() => handleButtonClick(subject.id)}>
              <Text style={styles.coverText}>
                Education is the most powerful weapon you can use to change the world
              </Text>
              <View style={styles.cardFront}>
                <Image source={{ uri: subject.photoURL }} style={styles.cardImage} />
              </View>
            </TouchableOpacity>

            <View style={styles.insidePage}>
              <Text style={styles.subjectName}>{subject.name}</Text>
              <Text style={styles.subjectDescription}>{subject.description}</Text>
              <TouchableOpacity
                style={styles.materialButton}
                onPress={() => handleButtonClick(subject.id)}
              >
                <Text style={styles.materialButtonText}>See Materials</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f0f0f0',
  },
  grid: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  card: {
    width: '100%',
    marginBottom: 20,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: 'white',
    elevation: 2,
    padding: 10,
  },
  flipCard: {
    position: 'relative',
    overflow: 'hidden',
  },
  coverText: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
    backgroundColor: '#1A8895',
    padding: 8,
  },
  cardFront: {
    overflow: 'hidden',
    alignItems: 'center',
  },
  cardImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  insidePage: {
    padding: 8,
    alignItems: 'center',
  },
  subjectName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    textAlign: 'center',
  },
  subjectDescription: {
    marginBottom: 8,
    textAlign: 'center',
  },
  materialButton: {
    padding: 10,
    backgroundColor: '#ff4e31',
    borderRadius: 4,
    alignItems: 'center',
    width: 300,
  },
  materialButtonText: {
    color: 'white',
  },
});

export default Subjects;
