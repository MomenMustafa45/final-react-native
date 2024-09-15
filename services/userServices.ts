import {
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import auth, { db, storage } from "../config/firebase";
import { setUser } from "../Redux/Slices/userSlice";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { ParentType, StudentType, TeacherType } from "../utils/types";
import { Dispatch } from "@reduxjs/toolkit";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const saveLoggedUser = async (
  userId: string,
  dispatch: Dispatch,
  role: string
) => {
  try {
    const userDocRef = doc(db, role, `${userId}`);
    const userDocSnap = await getDoc(userDocRef);
    if (userDocSnap.exists()) {
      await AsyncStorage.setItem(
        "userId",
        JSON.stringify(
          `${userDocSnap.data().id.toString().trim()} ${
            userDocSnap.data().role
          }`
        )
      );
      dispatch(setUser(userDocSnap.data()));
      console.log("Document data:", userDocSnap.data());
      return true;
    } else {
      console.log("No such document!");
    }
  } catch (error) {
    console.log(error);
  }
};

export const getUserById = async (userId: string, dispatch: Dispatch) => {
  try {
    const userDocRef = doc(
      db,
      "users",
      userId.toString().split(" ")[0].slice(1)
    );
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      dispatch(setUser(userDocSnap.data()));
    } else {
      const teacherDocRef = doc(
        db,
        "teachers",
        userId.toString().split(" ")[0].slice(1)
      );
      const teacherDocSnap = await getDoc(teacherDocRef);
      if (teacherDocSnap.exists()) {
        dispatch(setUser(teacherDocSnap.data()));
      } else {
        const parentDocRef = doc(
          db,
          "parents",
          userId.toString().split(" ")[0].slice(1)
        );
        const parentDocSnap = await getDoc(parentDocRef);
        if (parentDocSnap.exists()) {
          dispatch(setUser(parentDocSnap.data()));
        } else {
          const studentDocRef = doc(
            db,
            "students",
            userId.toString().split(" ")[0].slice(1)
          );
          const studentsDocSnap = await getDoc(studentDocRef);
          if (studentsDocSnap.exists()) {
            dispatch(setUser(studentsDocSnap.data()));
          } else {
            console.log("no user with this id");
          }
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
};

// add  parent

export const fetchParents = async (
  setParents: (parentsList: ParentType[]) => void
) => {
  try {
    // Reference to the levels collection
    const parentsCollection = collection(db, "parents");

    const unsubscribe = onSnapshot(parentsCollection, (studentsSnapshot) => {
      const parentsList = studentsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as ParentType),
      }));

      setParents([...parentsList]);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  } catch (error) {
    console.error("Error fetching levels: ", error);
  }
};

export const addParent = async (value: ParentType, photo?: File) => {
  try {
    let photoURL = "";
    if (photo) {
      const storageRef = ref(storage, `images${photo.name}`);
      await uploadBytes(storageRef, photo);
      photoURL = await getDownloadURL(storageRef);
    }
    const childerenIds = value.children?.map((item) => item.id);
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      value.email,
      value.password
    );
    const user = userCredential.user;

    await setDoc(doc(db, "parents", user.uid), {
      id: user.uid,
      name: value.name,
      address: value.address,
      gender: value.gender,
      email: value.email,
      phone: value.phoneNumber,
      Children: childerenIds,
      photoURL,
      role: "parent",
    });

    childerenIds?.forEach(async (id) => {
      try {
        // Reference to the specific document inside the collection
        const docRef = doc(db, "students", `${id}`);

        // Update the specific field with the new value
        await updateDoc(docRef, {
          parent: user.uid,
        });
      } catch (error) {
        console.log(error);
      }
    });
  } catch (error) {
    console.log(error);
  }
};

// add teacher

export const fetchTeachers = async () => {
  try {
    const teachersCollection = collection(db, "teachers");
    const teachersSnapshot = await getDocs(teachersCollection);
    const teachersList = teachersSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as TeacherType),
    }));

    // console.log("Teachers List:", teachersList);
    return teachersList;
  } catch (error) {
    console.error("Error fetching levels: ", error);
  }
};

// add sudent

export const fetchStudents = (
  setStudents: (studentsList: StudentType[]) => void
) => {
  try {
    const studentsCollection = collection(db, "students");
    const q = query(studentsCollection, where("parent", "==", ""));

    // Listen for real-time updates
    const unsubscribe = onSnapshot(q, (studentsSnapshot) => {
      const studentsList = studentsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as StudentType),
      }));

      setStudents([...studentsList]);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  } catch (error) {
    console.error("Error fetching students: ", error);
  }
};

export const addStudent = async (value: StudentType, photo?: File) => {
  try {
    let photoURL = "";
    if (photo) {
      const storageRef = ref(storage, `images/${photo.name}`);
      await uploadBytes(storageRef, photo);
      photoURL = await getDownloadURL(storageRef);
    }

    const userCredential = await createUserWithEmailAndPassword(
      auth,
      value.email,
      value.password
    );
    const user = userCredential.user;

    const studentDoref = doc(db, `students`, `${user.uid}`);

    const {
      name,
      address,
      age,
      class: class_id,
      email,
      gender,
      phoneNumber,
      parent,
      role = "student",
    }: StudentType = value;

    await setDoc(studentDoref, {
      id: user.uid,
      name,
      address,
      age,
      class_id,
      email,
      gender,
      phoneNumber,
      role,
      parent,
      photoURL,
      score: "0",
    });
    if (parent.length > 0) {
      addChildToParent(parent, user.uid);
    }
  } catch (error) {
    console.log(error);
  }
};

const addChildToParent = async (parent: string, userId: string) => {
  const docRef = doc(db, "parents", parent);

  // Fetch the document
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    // Get the current array from the document
    const data = docSnap.data();
    const currentArray = data.Children || [];

    // Check if the string already exists in the array
    if (currentArray.includes(userId)) {
      console.log("The string already exists in the array.");
      return; // Exit if the string is already present
    }

    // Update the document with the new string
    await updateDoc(docRef, {
      Children: arrayUnion(userId), // arrayUnion ensures no duplicates
    });

    console.log("Document updated successfully");

    console.log("Subjects added successfully! and student as well");
  } else {
    console.log("No such document!");
  }
};
