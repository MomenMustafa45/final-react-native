import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import MasonryList from 'react-native-masonry-list';

// Import local images
import img1 from '../assets/images/student/istockphoto-1152654779-612x612.jpg';
import img2 from '../assets/images/student/istockphoto-1160232408-612x612.jpg';
import img3 from '../assets/images/student/istockphoto-1162215652-612x612.jpg';
import img4 from '../assets/images/student/istockphoto-1202387751-612x612.jpg';
import img5 from '../assets/images/student/istockphoto-1202387751-612x612.jpg';
import img6 from '../assets/images/student/istockphoto-1202387751-612x612.jpg';
import img7 from '../assets/images/student/istockphoto-1166879652-612x612.jpg';
import img8 from '../assets/images/student/istockphoto-1217088681-612x612.jpg';
import img9 from '../assets/images/student/istockphoto-1223481577-612x612.jpg';
import img10 from '../assets/images/student/istockphoto-1338735375-612x612.jpg';
import img11 from '../assets/images/student/istockphoto-1361844238-612x612.jpg';
import img12 from '../assets/images/student/istockphoto-1482634149-612x612.jpg';
import img13 from '../assets/images/student/istockphoto-1482634409-612x612.jpg';

// مجموعة من الصور المحلية في مصفوفة مع الأبعاد
const images = [
  { source: img1, width: 612, height: 612 },
  { source: img2, width: 612, height: 612 },
  { source: img3, width: 612, height: 612 },
  { source: img4, width: 612, height: 612 },
  { source: img5, width: 612, height: 612 },
  { source: img6, width: 612, height: 612 },
  { source: img7, width: 612, height: 612 },
  { source: img8, width: 612, height: 612 },
  { source: img9, width: 612, height: 612 },
  { source: img10, width: 612, height: 612 },
  { source: img11, width: 612, height: 612 },
  { source: img12, width: 612, height: 612 },
  { source: img13, width: 612, height: 612 },
  // أضف المزيد من الصور هنا
];

const SchoolGallary = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>School Gallery</Text>
      <MasonryList
        images={images}
        imageContainerStyle={styles.imageContainer}
        columns={2} // عدد الأعمدة
        spacing={10} // المسافة بين الصور
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  imageContainer: {
    borderRadius: 10,
    overflow: 'hidden',
  },
});

export default SchoolGallary;
