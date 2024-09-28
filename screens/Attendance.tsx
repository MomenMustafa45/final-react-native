
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAppSelector } from '../hooks/reduxHooks';
import React, { useState, useEffect } from 'react';
import { CameraView, CameraType, useCameraPermissions, Camera } from 'expo-camera';
import { StyleSheet, Text, TouchableOpacity, View, Alert } from 'react-native';
// import { Alert } from 'react-native';

export default function QRCodeScanner() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [scannedData, setScannedData] = useState(null);
  const userInfo = useAppSelector((state) => state.user.user);
  const level = useAppSelector((state) => state.levels.levels);
  const [scanned, setScanned] = useState(false);
  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <TouchableOpacity onPress={requestPermission} style={styles.button}>
          <Text style={styles.buttonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }


  const handleBarCodeScanned = async ({ data }) => {
    if (scanned) {
      // Show an alert that the attendance has already been recorded
      Alert.alert(
        "Attendance Recorded",
        "You already recorded the attendance",
        [{ text: "OK" }]
      );
      return;
    } 
    setScanned(true);
    const [type, date] = data.split('-');
    const studentId = userInfo.id;
    const levelId = userInfo.class_id
    try {
      await addDoc(collection(db, "attendance"), {
        studentId,
        levelId,
        date,
        timestamp: new Date().toISOString().split('T')[0],
        status: 'present',
      });
      Alert.alert(
        "Success",
        "Attendance recorded successfully!",
        [{ text: "OK" }]
      );
      setScannedData(data);
    } catch (e) {
      console.error("Error recording attendance: ", e);
    }
    setTimeout(() => setScanned(false), 300000);
  };


  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing={facing}
        onBarcodeScanned={handleBarCodeScanned} // Handle barcode scanning
        barcodeScannerSettings={{
          barcodeTypes: ['aztec', 'ean13', 'ean8', 'qr', 'pdf417', 'upc_e', 'datamatrix', 'code39', 'code93', 'itf14', 'codabar', 'code128', 'upc_a'], // Add more barcode types if needed
        }}
      >
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  buttonText: {
    fontSize: 18,
    color: '#007AFF',
    padding: 10,
  },
});
