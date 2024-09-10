// Import necessary Firebase functions
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBe3-gjHc3oqztP71e-XVCYk9onqL1c3Ms",
  authDomain: "schoolx-7593c.firebaseapp.com",
  projectId: "schoolx-7593c",
  storageBucket: "schoolx-7593c.appspot.com",
  messagingSenderId: "166763289684",
  appId: "1:166763289684:web:3d99cef13ca4bb227461c1",
  measurementId: "G-TVD3W8KMMM",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore and Storage
export const db = getFirestore(app);
export const storage = getStorage(app);

// Initialize Firebase Auth with AsyncStorage for persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

// Export auth for use in the app
export default auth;
