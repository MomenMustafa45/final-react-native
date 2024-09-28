import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "../config/firebase";

// Define interfaces for the subject and teacher data
interface Subject {
  id: string;
  subject_id: string;
  teacher_id: string;
  order: string;
  subjectName?: string; // Optional, to be added after fetching
  teacherName: string;
}

interface Teacher {
  id: string;
  name: string;
}

interface DaySchedule {
  dayName: string;
  subjects: Subject[];
}

interface ScheduleData {
  level_id: string;
  days: DaySchedule[];
}

export const fetchSchedule = async (levelId: string): Promise<ScheduleData> => {
  const scheduleData: ScheduleData = {
    level_id: "",
    days: [],
  };

  try {
    // Fetch the main schedule document
    const scheduleDocRef = doc(db, "schedules", levelId);
    const scheduleDocSnap = await getDoc(scheduleDocRef);

    if (scheduleDocSnap.exists()) {
      scheduleData.level_id = scheduleDocSnap.id;
      scheduleData.days = [];

      // Fetch each day subcollection
      const days = ["sunday", "monday", "tuesday", "wednesday", "thursday"];
      for (const day of days) {
        const dayRef = collection(
          db,
          "schedules",
          levelId,
          "days",
          day,
          "schedule_subjects"
        );

        const daySnapshot = await getDocs(dayRef);

        const subjects: Subject[] = [];
        for (const doc of daySnapshot.docs) {
          const subject = { id: doc.id, ...doc.data() } as Subject;
          subjects.push(subject);
        }

        // Fetch subject and teacher details
        for (const subject of subjects) {
          // Fetch subject name
          if (subject.subject_id) {
            const subjectDocRef = doc(db, "subjects", subject.subject_id);
            const subjectDocSnap = await getDoc(subjectDocRef);
            if (subjectDocSnap.exists()) {
              subject.subjectName = subjectDocSnap.data().name;
            }
          }

          // Fetch teacher name
          if (subject.teacher_id) {
            const teacherDocRef = doc(db, "teachers", subject.teacher_id);
            const teacherDocSnap = await getDoc(teacherDocRef);
            if (teacherDocSnap.exists()) {
              // Assuming teacher data contains a 'name' field
              subject.teacherName = teacherDocSnap.data().name;
            }
          }
        }

        scheduleData.days.push({
          dayName: day,
          subjects: subjects,
        });
      }
    }
  } catch (error) {
    console.error("Error fetching schedule: ", error);
  }

  console.log(scheduleData);
  return scheduleData;
};
