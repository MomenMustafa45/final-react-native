import { collection, doc, getDocs, addDoc, getDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import { Dispatch } from "@reduxjs/toolkit";
import { setLevels } from "../Redux/Slices/levelsSlice";

export const addLevels = async (level: string) => {
  try {
    const collectionRef = collection(db, "levels");
    const docRef = await addDoc(collectionRef, { name: level });
    console.log("Document written with ID: ", docRef.id);
  } catch (error) {
    console.error("Error adding document: ", error);
  }
};

export const fetchLevels = async (dispatch: Dispatch) => {
  try {
    // Reference to the levels collection
    const levelsCollection = collection(db, "levels");

    // Fetch all documents from the collection
    const levelsSnapshot = await getDocs(levelsCollection);

    // Extract the data from each document
    const levelsList = levelsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Update state with the fetched levels
    dispatch(setLevels([...levelsList]));
  } catch (error) {
    console.error("Error fetching levels: ", error);
  }
};

export const getLevelNameById = async (levelId: string): Promise<string> => {
  const levelRef = doc(db, "levels", levelId);
  const levelSnap = await getDoc(levelRef);
  if (levelSnap.exists()) {
    const levelData = levelSnap.data();
    return levelData.name;
  }
  return "Unknown Level";
};
