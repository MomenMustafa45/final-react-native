import { createUserWithEmailAndPassword } from "firebase/auth";
import auth, { db, storage } from "../config/firebase";
import { Schedule, SubjectType, TeacherType } from "../utils/types";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { toast} from 'react-toastify';
export const addTeacher = async (teacherInfo: TeacherType, photo?: File) => {
  try {
    let photoURL = "";
    if (photo) {
      const storageRef = ref(storage, `images/${photo.name}`);
      await uploadBytes(storageRef, photo);
      photoURL = await getDownloadURL(storageRef);
    }

    const teacherLevelsIds = teacherInfo.levels.map((item) => item.id);
    const teacherSubjectIds = teacherInfo.subjects.map((item) => item.id); // Handle multiple subjects

    // Create the teacher in auth
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      teacherInfo.email,
      teacherInfo.password
    );
    const user = userCredential.user;

    // Save the teacher in Firestore
    const teacherRef = doc(db, "teachers", `${user.uid}`);
    const {
      name,
      email,
      gender,
      phoneNumber,
      age,
      description,
      role = "teacher",
    } = teacherInfo;

    await setDoc(teacherRef, {
      id: user.uid,
      name,
      email,
      gender,
      phoneNumber,
      age,
      role,
      description,
      levels_Ids: teacherLevelsIds,
      subjects: teacherSubjectIds, // Store selected subject IDs
      photoURL,
    });

    // Update each subject with the teacher's ID
    for (const subjectId of teacherSubjectIds) {
      const subjectRef = doc(db, "subjects", subjectId);
      await updateDoc(subjectRef, {
        teacher: user.uid, // Update subject with teacher ID
      });
    }

    console.log("Teacher added successfully!");
    toast.success(`${name} added successfully as a teacher`)
  } catch (error) {
    console.log(error);
    toast.error("Failed to add a teacher")
  }
};

export const fetchTeachers = async () => {
  try {
    const teachersCollection = collection(db, "teachers");
    const teachersSnapshot = await getDocs(teachersCollection);

    // Fetch all subjects at once
    const subjectsCollection = collection(db, "subjects");
    const subjectsSnapshot = await getDocs(subjectsCollection);
    const subjectsList = subjectsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Create a map for quick lookup of subject names by ID
    const subjectMap = subjectsList.reduce((map, subject) => {
      map[subject.id] = subject;
      return map;
    }, {} as SubjectType);

    // Process teachers and add subject names
    const teachersList = teachersSnapshot.docs.map((doc) => {
      const teacherData = doc.data() as TeacherType;
      const subject = subjectMap[teacherData.subject]; // Get the subject details
      return {
        id: doc.id,
        ...teacherData,
        subjectName: subject ? subject.name : "Unknown", // Add subject name or fallback
      };
    });

    console.log("Teachers List:", teachersList);
    return teachersList;
  } catch (error) {
    console.error("Error fetching teachers: ", error);
  }
};
/************************** */
// export const fetchTeachersById = async (levelId: string) => {
//   try {
//     const teacherCollection = collection(db, "teachers");

//     // استعلام باستخدام level_id
//     const q = query(teacherCollection, where("level_id", "==", levelId));

//     const teacherSnapshot = await getDocs(q);

//     const teacherList = teacherSnapshot.docs.map((doc) => ({
//       id: doc.id,
//       ...doc.data(),
//     }));

//     console.log(teacherList); // عرض البيانات للتحقق منها

//     return teacherList;
//   } catch (error) {
//     console.error("Error fetching teachers: ", error);
//     return [];
//   }
// };

/****************************/
export const getTeacherNameById = async (teacherId: string) => {
  try {
    // Reference to the specific document in the 'teachers' collection
    const teacherRef = doc(db, "teachers", teacherId);

    // Fetch the document
    const teacherSnap = await getDoc(teacherRef);

    // Check if the document exists and return the data
    if (teacherSnap.exists()) {
      return teacherSnap.data(); // Returns the teacher data
    } else {
      console.log("No such teacher!");
      return null; // If the document does not exist
    }
  } catch (error) {
    console.error("Error getting teacher:", error);
    return null; // If there's an error, return null
  }
};

// ======================

const fetchSubjectName = async (subjectId: string): Promise<string> => {
  try {
    const subjectRef = doc(db, "subjects", subjectId);
    const subjectSnap = await getDoc(subjectRef);
    if (subjectSnap.exists()) {
      return subjectSnap.data().name;
    } else {
      throw new Error("Subject not found");
    }
  } catch (error) {
    console.error("Error fetching subject name: ", error);
    return "Unknown Subject";
  }
};

const fetchLevelName = async (levelId: string): Promise<string> => {
  try {
    const levelRef = doc(db, "levels", levelId);
    const levelSnap = await getDoc(levelRef);
    if (levelSnap.exists()) {
      return levelSnap.data().name;
    } else {
      throw new Error("Level not found");
    }
  } catch (error) {
    console.error("Error fetching level name: ", error);
    return "Unknown Level";
  }
};

export const getTeacherSchedule = async (
  teacherId: string
): Promise<Schedule[]> => {
  try {
    // Fetch all schedules
    const schedulesRef = collection(db, "schedules");
    const scheduleSnapshot = await getDocs(schedulesRef);

    const schedules: Schedule[] = [];

    // Iterate through each schedule document
    for (const scheduleDoc of scheduleSnapshot.docs) {
      const scheduleData = scheduleDoc.data() as Schedule;
      const levelId = scheduleData.level_id;

      // Fetch level name
      const levelName = await fetchLevelName(levelId);

      const daysCollectionRef = collection(scheduleDoc.ref, "days");
      const daysSnapshot = await getDocs(daysCollectionRef);

      const filteredDays: Day[] = [];

      // Iterate through each day document
      for (const dayDoc of daysSnapshot.docs) {
        const dayName = dayDoc.id; // Assuming the document ID is the day name
        const subjectsCollectionRef = collection(
          dayDoc.ref,
          "schedule_subjects"
        );
        const subjectsSnapshot = await getDocs(subjectsCollectionRef);

        const subjects: SubjectType[] = [];

        // Iterate through each subject document
        for (const subjectDoc of subjectsSnapshot.docs) {
          const subjectData = subjectDoc.data() as SubjectType;

          // Check if the teacher_id matches
          if (subjectData.teacher_id === teacherId) {
            // Fetch subject name
            const subjectName = await fetchSubjectName(subjectData.subject_id);

            subjects.push({
              ...subjectData,
              subject_name: subjectName,
              teacher_name: "Teacher Name", // Fetch teacher name if needed
              timeSlot: subjectData.timeSlot || "Unknown", // Adjust based on your data structure
            });
          }
        }

        // Add to filteredDays if subjects found
        if (subjects.length > 0) {
          filteredDays.push({
            dayName,
            subjects,
          });
        }
      }

      // Add to schedules if there are filtered days
      if (filteredDays.length > 0) {
        schedules.push({
          level_id: levelId,
          level_name: levelName,
          days: filteredDays,
        });
      }
    }

    return schedules;
  } catch (error) {
    console.error("Error fetching teacher schedule: ", error);
    return [];
  }
};
