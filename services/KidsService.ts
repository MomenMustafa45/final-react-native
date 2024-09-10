import { db } from "../config/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

export const fetchParentKids = async (parentId: string) => {
    // explore student collection
    const studentsRef = collection(db, "students");
    // query to fetch students have parent field = the parentID 
    const q = query(studentsRef, where("parent", "==", parentId));
    // each document snapshot represents a single document from the students collection where the parent ID matches the queried parent.
    const querySnapshot = await getDocs(q);

    // The map function iterates over each document snapshot in the docs array. For each document, it creates a new object.
    const kidsList = querySnapshot.docs.map(doc => ({
        // This extracts the document ID from the snapshot and assigns it to the id property of the new object.
        id: doc.id,
        // retrieve data for the id
        ...(doc.data())
      }));

      return kidsList;
}