import { collection, getDocs, query, where, doc, getDoc } from "firebase/firestore";
import { db } from "../config/firebase";

export const fetchSubjectsGrades = async (student_id: string) => {
  try {
    // Fetch grades
    const subjectGradeCollection = collection(db, "grades");
    const gradesQuery = query(
      subjectGradeCollection,
      where("student_id", "==", student_id)
    );

    const gradeSnapshot = await getDocs(gradesQuery);

    if (gradeSnapshot.empty) {
      console.log("No matching documents.");
      return [];
    }

    // Fetch subject names along with grades
    const subjectGradeList = await Promise.all(
      gradeSnapshot.docs.map(async (gradeDoc) => {
        const gradeData = gradeDoc.data();
        
        // Fetch subject document from 'subjects' collection
        const subjectRef = doc(db, "subjects", gradeData.subject_id);
        const subjectSnapshot = await getDoc(subjectRef);

        let subjectName = "Unknown Subject"; // Default value

        if (subjectSnapshot.exists()) {
          subjectName = subjectSnapshot.data()?.name || subjectName;
        }

        return {
          id: gradeDoc.id,
          grade: gradeData.grade,
          subjectName, // Add subject name here
        };
      })
    );

    return subjectGradeList;
  } catch (error) {
    console.error("Error fetching subjects grades: ", error);
    throw error; // Ensure that any errors are thrown to be handled in the component
  }
};
