// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   Button,
//   StyleSheet,
//   ScrollView,
//   ImageBackground,
// } from "react-native";
// import { useDispatch, useSelector } from "react-redux";
// import { Picker } from "@react-native-picker/picker";
// import { useAppSelector } from "../hooks/reduxHooks";
// import { getKids } from "../Redux/Slices/KidsSlice";
// import Loader from "./components/Loader";
// import { collection, getDocs } from "firebase/firestore";
// import { db } from "../config/firebase";

// const ParentAttendance = () => {
//     const dispatch = useDispatch();
//     const kids = useSelector((state) => state.kids.kidsList);
//     const userInfo = useAppSelector((state) => state.user.user);
//     const [selectedKid, setSelectedKid] = useState("");
//     // const [grades, setGrades] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState(null);
//     const [attendanceRecords, setAttendanceRecords] = useState([]);
//     const [uniqueDates, setUniqueDates] = useState([])
//     useEffect(() => {
//         const parentId = userInfo.id;
//         if (parentId) {
//           dispatch(getKids(parentId));
//         }
//       }, [dispatch, userInfo.id]); 

//       const handleViewAttendance = async (e) => {
//         e.preventDefault();
//         setLoading(true);
//         setError(null);

//         try {
//             // Fetch all attendance records
//             const attendanceSnapshot = await getDocs(collection(db, "attendance"));
//             const records = attendanceSnapshot.docs.map((doc) => ({
//                 id: doc.id,
//                 ...doc.data(),
//             }));

//             // Extract unique dates
//             const allDates = Array.from(
//                 new Set(records.map((record) => record.timestamp)) // unique timestamps
//             );
//             allDates.sort((a, b) => new Date(b) - new Date(a));
//             setUniqueDates(allDates);

//             // Filter attendance records for selected kid
//             const kidAttendanceRecords = records.filter(
//                 (record) => {
//                     console.log(record.studentId); // Log the studentId for debugging
//                     return record.studentId === selectedKid; // Fix: Return the comparison result
//                 }
//             );

//             setAttendanceRecords(kidAttendanceRecords);
//         } catch (err) {
//             setError("Failed to fetch attendance records.");
//         } finally {
//             setLoading(false);
//         }
//     };

//     const getAttendanceStatus = (date) => {
//         const record = attendanceRecords.find(
//             (rec) => rec.timestamp === date && rec.studentId === selectedKid
//         );
//         return record ? record.status : "absent";
//     };
//   return (
//     <ImageBackground
//       source={require("../assets/images/Pastel Purple fun Creative Modern Minimalist Kids Smile Phone Wallpaper (2).png")}
//       style={styles.background}
//     >
//          <View style={styles.container}>
//         <Text style={styles.header}>My Kids</Text>

//         <View style={styles.form}>
//           <Picker
//             selectedValue={selectedKid}
//             onValueChange={(itemValue) => setSelectedKid(itemValue)}
//             style={styles.picker}
//           >
//             <Picker.Item label="Select a kid" value="" />
//             {kids.map((kid) => (
//               <Picker.Item key={kid.id} label={kid.name} value={kid.id} />
//             ))}
//           </Picker>

//           <Button title="VIEW" onPress={handleViewAttendance} color="#002749" />
//         </View>

//         {loading && <Loader />} 

//         {error && <Text style={styles.error}>{error}</Text>}
//         {selectedKid && uniqueDates.length > 0 && (
//                 <table className="table-auto w-full mt-6 px-10">
//                     <thead>
//                         <tr className='bg-deepBlue text-white'>
//                             <th className="px-4 py-2">Date</th>
//                             <th className="px-4 py-2">Attendance Status</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {uniqueDates.map((date) => (
//                             <tr key={date} className='text-center'>
//                                 <td className="border px-4 py-2">{date}</td>
//                                 <td className="border px-4 py-2 justify-center items-center" >
//             {getAttendanceStatus(date) === "present" ? (
//                 <>
//                 <span>present</span>
//                     {/* <FaCheck className='text-green-600 mx-auto' /> Show check icon in green */}
//                 </>
//             ) : (
//                 <>
//                 <>absent</>
//                     {/* <FaX className='text-red-600 mx-auto' /> Show X icon in red */}
//                 </>
//             )}
//         </td>
//                             </tr>
                           
//                         ))}
//                     </tbody>
//                 </table>
//             )}

//         {/* {grades.length === 0 && !loading && !error && (
//           <Text>No grades available for the selected kid.</Text>
//         )} */}
//       </View>
//     </ImageBackground>
//   )
// }

// export default ParentAttendance

// const styles = StyleSheet.create({
//     background: {
//         flex: 1,
//         justifyContent: "center",
//       },
//       container: {
//         flex: 1,
//         padding: 20,
//         justifyContent: "center",
//       },
//       header: {
//         fontSize: 24,
//         fontWeight: "bold",
//         textAlign: "center",
//         marginBottom: 20,
//         color: "#4A4A4A",
//       },
//       form: {
//         marginBottom: 20,
//       },
//       picker: {
//         height: 50,
//         width: "100%",
//         marginBottom: 20,
//       },
//       gradeContainer: {
//         backgroundColor: "#fff",
//         borderRadius: 15,
//         padding: 25,
//         shadowColor: "#000",
//         shadowOffset: { width: 0, height: 4 },
//         shadowOpacity: 0.3,
//         shadowRadius: 5,
//         elevation: 5,
//       },
//       tableHeader: {
//         flexDirection: "row",
//         justifyContent: "space-between",
//         backgroundColor: "#002749",
//         padding: 10,
//       },
//       tableHeaderText: {
//         color: "#fff",
//         fontWeight: "bold",
//         fontSize: 18,
//       },
//       tableRow: {
//         flexDirection: "row",
//         justifyContent: "space-between",
//         paddingVertical: 12,
//         borderBottomWidth: 1,
//         borderBottomColor: "#ccc",
//       },
//       tableCell: {
//         fontSize: 18,
//         flex: 1,
//         textAlign: "center",
//       },
//       error: {
//         color: "red",
//         textAlign: "center",
//       },
// })


import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  ScrollView,
  ImageBackground,
  FlatList,
} from "react-native";
import { MaterialIcons } from '@expo/vector-icons';
import { useDispatch, useSelector } from "react-redux";
import { Picker } from "@react-native-picker/picker";
import { useAppSelector } from "../hooks/reduxHooks";
import { getKids } from "../Redux/Slices/KidsSlice";
import Loader from "./components/Loader";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../config/firebase";

const ParentAttendance = () => {
  const dispatch = useDispatch();
  const kids = useSelector((state) => state.kids.kidsList);
  const userInfo = useAppSelector((state) => state.user.user);
  const [selectedKid, setSelectedKid] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [uniqueDates, setUniqueDates] = useState([]);

  useEffect(() => {
    const parentId = userInfo.id;
    if (parentId) {
      dispatch(getKids(parentId));
    }
  }, [dispatch, userInfo.id]);

  const handleViewAttendance = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Fetch all attendance records
      const attendanceSnapshot = await getDocs(collection(db, "attendance"));
      const records = attendanceSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Extract unique dates
      const allDates = Array.from(
        new Set(records.map((record) => record.timestamp)) // unique timestamps
      );
      allDates.sort((a, b) => new Date(b) - new Date(a));
      setUniqueDates(allDates);

      // Filter attendance records for selected kid
      const kidAttendanceRecords = records.filter(
        (record) => record.studentId === selectedKid
      );

      setAttendanceRecords(kidAttendanceRecords);
    } catch (err) {
      setError("Failed to fetch attendance records.");
    } finally {
      setLoading(false);
    }
  };

  const getAttendanceStatus = (date) => {
    const record = attendanceRecords.find(
      (rec) => rec.timestamp === date && rec.studentId === selectedKid
    );
    return record ? record.status : "absent";
  };

  const renderAttendanceItem = ({ item: date }) => (
    <View style={styles.tableRow}>
      <Text style={styles.tableCell}>{date}</Text>
      <Text style={styles.tableCell}>
        {/* {getAttendanceStatus(date) === "present" ? (
          <Text style={styles.presentText}>Present</Text>
        ) : (
          <Text style={styles.absentText}>Absent</Text>
        )} */}

{/* <td className="border px-4 py-2 justify-center items-center"> */}
  <View style={styles.iconContainer}>
    {getAttendanceStatus(date) === "present" ? (
      <MaterialIcons name="check-circle" size={24} color="green" />
    ) : (
      <MaterialIcons name="cancel" size={24} color="red" />
    )}
  </View>
{/* </td> */}

      </Text>
    </View>
  );

  return (
    <ImageBackground
      source={require("../assets/images/Pastel Purple fun Creative Modern Minimalist Kids Smile Phone Wallpaper (2).png")}
      style={styles.background}
    >
      <View style={styles.container}>
        <Text style={styles.header}>My Kids</Text>

        <View style={styles.form}>
          <Picker
            selectedValue={selectedKid}
            onValueChange={(itemValue) => setSelectedKid(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Select a kid" value="" />
            {kids.map((kid) => (
              <Picker.Item key={kid.id} label={kid.name} value={kid.id} />
            ))}
          </Picker>

          <Button title="VIEW" onPress={handleViewAttendance} color="#002749" />
        </View>

        {loading && <Loader />}
        {error && <Text style={styles.error}>{error}</Text>}

        {selectedKid && uniqueDates.length > 0 && (
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={styles.tableHeaderText}>Date</Text>
              <Text style={styles.tableHeaderText}>Attendance</Text>
            </View>

            <FlatList
              data={uniqueDates}
              keyExtractor={(item) => item}
              renderItem={renderAttendanceItem}
            />
          </View>
        )}
      </View>
    </ImageBackground>
  );
};

export default ParentAttendance;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
  },
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#4A4A4A",
  },
  form: {
    marginBottom: 20,
  },
  picker: {
    height: 50,
    width: "100%",
    marginBottom: 20,
  },
  table: {
    marginTop: 20,
  },
  tableHeader: {
    flexDirection: "row",
    justifyContent: "center",
    gap:120,
    backgroundColor: "#002749",
    padding: 10,
  },
  tableHeaderText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
  tableRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  tableCell: {
    fontSize: 18,
    flex: 1,
    textAlign: "center",
  },
  presentText: {
    color: "green",
  },
  absentText: {
    color: "red",
  },
  error: {
    color: "red",
    textAlign: "center",
  },
  iconContainer: {
    justifyContent: 'center', // Centers vertically
    alignItems: 'center',     // Centers horizontally
    height: '100%',           // Ensures it takes up the full cell height
  },
});
