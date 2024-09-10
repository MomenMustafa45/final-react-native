import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  getDoc,
  doc,
  arrayUnion,
  query,
  where,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { Dispatch } from "@reduxjs/toolkit";
import { setSubject } from "../Redux/Slices/subjectSlice";
import { SubjectType } from "../utils/types";
import { toast } from "react-toastify";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";

export const addSubject = async (subjectData: {
  name: string;
  teacher: string; // The selected teacher's ID
  description: string;
  level_id: string;
  total_grade: number;
  photoURL: string;
}) => {
  try {
    console.log(subjectData);
    const { description, level_id, name, photoURL, teacher, total_grade } =
      subjectData;
    // 1. Add a new document to the "subjects" collection
    const subCollectionRef = collection(db, "subjects");
    const docRef = await addDoc(subCollectionRef, {
      description,
      level_id,
      name,
      photoURL,
      teacher,
      total_grade,
    });

    // 2. Get the document ID for the subject
    const docId = docRef.id;

    // 3. Update the document with the ID field
    await updateDoc(docRef, { id: docId });

    // 4. Update the selected teacher's document with the new subject
    const teacherRef = doc(db, "teachers", subjectData.teacher);
    await updateDoc(teacherRef, {
      subjects: arrayUnion(docId), // Add the new subject ID to the teacher's subjects array using arrayUnion
    });

    console.log("Subject added and teacher updated with the new subject");
  } catch (error) {
    toast.error("Error adding subject");
    console.error("Error adding subject: ", error);
  }
};

export const fetchSubjects = async (dispatch: Dispatch) => {
  try {
    // Reference to the subjects collection
    const subjectCollection = collection(db, "subjects");

    // Fetch all documents from the collection
    const subjectSnapshot = await getDocs(subjectCollection);

    // Extract the data from each document
    const subjectList = subjectSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Update state with the fetched subjects
    dispatch(setSubject([...subjectList]));
  } catch (error) {
    console.error("Error fetching subjects: ", error);
  }
};

export const fetchSubjectsByLevel = async (levelId: string) => {
  try {
    const subjectCollection = collection(db, "subjects");

    const q = query(subjectCollection, where("level_id", "==", levelId));

    const subjectSnapshot = await getDocs(q);

    const subjectList = subjectSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    console.log(subjectList);
    return subjectList;
    // dispatch(setSubject([...subjectList]));
  } catch (error) {
    console.error("Error fetching subjects: ", error);
  }
};

export const fetchSubjectsByteacher_id = async (teacherId: string) => {
  try {
    console.log(teacherId);
    const subjectCollection = collection(db, "subjects");

    const q = query(subjectCollection, where("teacher", "==", teacherId));

    const subjectSnapshot = await getDocs(q);
    console.log(subjectSnapshot);
    const subjectList = subjectSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    console.log(`hadeeer ${subjectList}`);
    return subjectList;
    // dispatch(setSubject([...subjectList]));
  } catch (error) {
    console.error("Error fetching subjects: ", error);
  }
};

export const getSubjectNameById = async (
  subjectId: string
): Promise<string> => {
  const subjectRef = doc(db, "subjects", subjectId);
  const subjectSnap = await getDoc(subjectRef);
  if (subjectSnap.exists()) {
    const subjectData = subjectSnap.data() as SubjectType;
    return subjectData.name;
  }
  return "Unknown Subject";
};


// Define the SubjectType interface if not already defined
interface SubjectType {
  name: string;
  videoUrls?: string[]; // Include other fields if needed
}

export const getSubjectById = async (subjectId: string): Promise<SubjectType | null> => {
  try {
    const subjectRef = doc(db, "subjects", subjectId);
    const subjectSnap = await getDoc(subjectRef);
    
    if (subjectSnap.exists()) {
      const subjectData = subjectSnap.data() as SubjectType;
      return subjectData;
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (error) {
    console.error("Error fetching subject: ", error);
    return null;
  }
};


export const addQuestion = async ({
  question,
  answers,
  correctAnswer,
  subjectId,
}) => {
  try {
    console.log("Adding quiz question");

    const questionsRef = collection(db, "subjects", subjectId, "quiz");

    const questionData = {
      questionId: "",
      question: question || "",
      correctAnswer: correctAnswer || "",
      options: answers || [],
    };

    // Add the question to Firestore
    const quizRef = await addDoc(questionsRef, questionData);

    // Update the question with the Firestore-generated ID
    await updateDoc(quizRef, { questionId: quizRef.id });

    console.log("Question added:", quizRef.id);
  } catch (error) {
    console.log("Error adding question:", error);
    throw error;
  }
};

export const uploadImageToStorage = async (file: File) => {
  const storage = getStorage();
  const storageRef = ref(storage, `subjects/${file.name}`);

  try {
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    console.log(downloadURL);

    return downloadURL;
  } catch (error) {
    console.error("Error uploading image: ", error);
    throw error;
  }
};

// const arr = [
//   {
//     questionId: "",
//     question:
//       "A highly irritant drug in the form of an aqueous solution can be administered by:",
//     correctAnswer: "2",
//     options: [
//       "Subcutaneous injection",
//       "Intravenous injection",
//       "Intramuscular injection",
//       "Intra-articular injection",
//     ],
//   },
//   {
//     questionId: "",
//     question:
//       "All of the following are possible consequences of phase I (non-synthetic) biotransformation EXCEPT",
//     correctAnswer: "3",
//     options: [
//       "Production of a pharmacologically inactive metabolite",
//       "Conversion of one pharmacologically active to another active substance",
//       "Conversion of a pharmacologically inactive to an active substance",
//       "Combination of a drug with an endogenous substance",
//     ],
//   },
//   {
//     questionId: "",
//     question: "Which of the following can inhibit hepatic microsomal enzymes:",
//     correctAnswer: "2",
//     options: ["Phenobarbitone", "Phenytoin", "Valproic acid", "Rifampicin"],
//   },
//   {
//     questionId: "",
//     question:
//       "The concept of 'half-life' in pharmacokinetics is best described as:",
//     correctAnswer: "2",
//     options: [
//       "The time it takes for the drug to be absorbed.",
//       "The time it takes for the drug to be eliminated from the body.",
//       "The time it takes for the plasma concentration of a drug to reduce by half.",
//       "The time it takes for the drug to distribute evenly in the body.",
//     ],
//   },
//   {
//     questionId: "",
//     question: "Which of the following is phase-Il reaction of drug metabolism:",
//     correctAnswer: "3",
//     options: ["Oxidation", "Reduction", "Hydrolysis", "Acetylation"],
//   },
//   {
//     questionId: "",
//     question:
//       "The following route of administration is NOT suitable for drugs with extensive hepatic first pass metabolism:",
//     correctAnswer: "2",
//     options: ["Sublingual", "Rectal", "Oral", "Inhalation"],
//   },
//   {
//     questionId: "",
//     question:
//       "An exaggerated normal pharmacological response to usual dose of drug is termed:",
//     correctAnswer: "2",
//     options: ["Tolerance", "Tachyphylaxis", "Supersensitivity", "Idiosyncrasy"],
//   },
//   {
//     questionId: "",
//     question:
//       "A 55-year-old male patient with a history of chronic liver disease is prescribed a new medication. Considering the impaired hepatic function, which pharmacokinetic properties of the drug would be most critical to evaluate in order to avoid toxicity?",
//     correctAnswer: "2",
//     options: [
//       "Absorption rate and renal excretion.",
//       "Volume of distribution and plasma protein binding.",
//       "Metabolism and half-life.",
//       "Therapeutic index and bioavailability.",
//     ],
//   },
//   {
//     questionId: "",
//     question:
//       "The ability of a drug to induce fetal malformation when given to a pregnant mother is termed:",
//     correctAnswer: "3",
//     options: [
//       "Idiosyncrasy",
//       "Hypersensitivity",
//       "Tachyphylaxis",
//       "Teratogenicity",
//     ],
//   },
//   {
//     questionId: "",
//     question:
//       "The bioavailability of drugs after Intravenous administration is:",
//     correctAnswer: "3",
//     options: ["10%", "50 %", "25%", "100%"],
//   },
//   {
//     questionId: "",
//     question: "Old patients aging more than 70 years need:",
//     correctAnswer: "1",
//     options: [
//       "Larger dose than adult dose",
//       "Smaller dose than the adult dose",
//       "Equal dose to that of the adult dose",
//       "A dose that is equal to the infant dose",
//     ],
//   },
//   {
//     questionId: "",
//     question:
//       "Which of the following statements about the bioavailability of a drug is correct?",
//     correctAnswer: "0",
//     options: [
//       "It is always 100% for intravenous administration.",
//       "It is unaffected by first-pass metabolism.",
//       "It is the same as the drug's half-life.",
//       "It refers to the rate at which a drug reaches the systemic circulation.",
//     ],
//   },
//   {
//     questionId: "",
//     question: "Tolerance is:",
//     correctAnswer: "0",
//     options: [
//       "Decreased response to the usual dose of a drug",
//       "Increased response to the usual dose of a drug",
//       "Abnormal reaction to a drug due to genetic or enzyme defect",
//       "Inactivation of a drug be the kidney",
//     ],
//   },
//   {
//     questionId: "",
//     question: "The volume of IV injection may vary from:",
//     correctAnswer: "2",
//     options: ["1-4 ml", "1-2 ml", "1-500 ml", "5-10 ml"],
//   },
//   {
//     questionId: "",
//     question: "Regarding biotransformation of most of the drugs:",
//     correctAnswer: "0",
//     options: [
//       "The general aim is to convert active lipid soluble drugs into inactive water soluble metabolites",
//       "Phase I metabolism includes conjugation with glucuronic acid",
//       "Always leads to inactivation of drugs",
//       "Phase II metabolism includes hydrolysis",
//     ],
//   },
//   {
//     questionId: "",
//     question:
//       "Which of the following is correct as regards to drugs bound to plasma protein:",
//     correctAnswer: "3",
//     options: [
//       "Pharmacologically active",
//       "Diffusible through capillary walls",
//       "Excreted by glomerular filtration",
//       "A reservoir from which free drug can be dissociated",
//     ],
//   },
//   {
//     questionId: "",
//     question: "The following statements INCORRECT",
//     correctAnswer: "2",
//     options: [
//       "Drug metabolism can be affected by genetic variation",
//       "Renal excretion of weak acid and/or base drugs is affected by urinary pH",
//       "Partial agonists have no effect in absence of agonist",
//       "Drugs with zero order kinetics have a non-linear disappearance curve",
//     ],
//   },
//   {
//     questionId: "",
//     question: "Bioavailability is variable if the drug is administered by:",
//     correctAnswer: "2",
//     options: [
//       "Intravenous injection",
//       "Intramuscular injection",
//       "Oral administration",
//       "Subcutaneous injection",
//     ],
//   },
//   {
//     questionId: "",
//     question: "The main site of drug biotransformation is:",
//     correctAnswer: "3",
//     options: ["Kidney", "Lung", "Plasma", "Liver"],
//   },
//   {
//     questionId: "",
//     question: "Which of the following drugs decreases hepatic blood flow?",
//     correctAnswer: "3",
//     options: ["Alpha blockers", "Rifampicin", "Phenytoin", "Beta-Blockers"],
//   },
//   {
//     questionId: "",
//     question: "Alkalization of urine increases excretion of:",
//     correctAnswer: "0",
//     options: ["Aspirin", "Ephedrine", "Amphetamine", "Atropine"],
//   },
//   {
//     questionId: "",
//     question: "Which of the following drugs have negative efficacy?",
//     correctAnswer: "2",
//     options: ["Adrenaline", "Acetylcholine", "Beta-carbolines", "Dopamine"],
//   },
//   {
//     questionId: "",
//     question: "The therapeutic index of a drug is defined as:",
//     correctAnswer: "2",
//     options: [
//       "The ratio of the lethal dose to the effective dose.",
//       "The ratio of the effective dose to the toxic dose.",
//       "The ratio of the toxic dose to the effective dose.",
//       "The ratio of the effective dose to the lethal dose.",
//     ],
//   },
//   {
//     questionId: "",
//     question:
//       "Which of the following factors does NOT affect the distribution of a drug in the body?",
//     correctAnswer: "2",
//     options: [
//       "Plasma protein binding.",
//       "Lipid solubility.",
//       "Renal excretion rate.",
//       "Blood flow to tissues.",
//     ],
//   },
//   {
//     questionId: "",
//     question:
//       "The first-pass effect primarily affects drugs that are administered:",
//     correctAnswer: "2",
//     options: ["Intravenously.", "Intramuscularly.", "Orally.", "Sublingually."],
//   },
//   {
//     questionId: "",
//     question:
//       "A patient is taking Drug A, which is a substrate for CYP3A4. They are prescribed Drug B, which is a potent inhibitor of CYP3A4. Describe the potential interaction between these two drugs and discuss the clinical implications. What strategies could be employed to manage this drug-drug interaction?",
//     correctAnswer: "1",
//     options: [
//       "Increased metabolism of Drug A, leading to reduced efficacy; consider increasing the dose of Drug A.",
//       "Decreased metabolism of Drug A, leading to increased plasma levels and potential toxicity; consider reducing the dose of Drug A.",
//       "No significant interaction, as Drug B does not affect Drug A's metabolism; no dose adjustment needed.",
//       "Increased renal clearance of Drug A, leading to reduced efficacy; consider switching to a different medication.",
//     ],
//   },
//   {
//     questionId: "",
//     question: "Which of the following is an example of a prodrug?",
//     correctAnswer: "1",
//     options: ["Aspirin.", "Clopidogrel.", "Paracetamol.", "Metformin."],
//   },
//   {
//     questionId: "",
//     question:
//       "Which enzyme family is primarily responsible for the metabolism of drugs in the liver?",
//     correctAnswer: "2",
//     options: [
//       "Lipoxygenases.",
//       "Cyclooxygenases.",
//       "Cytochrome P450.",
//       "Adenylyl cyclases.",
//     ],
//   },
//   {
//     questionId: "",
//     question: "A competitive antagonist:",
//     correctAnswer: "3",
//     options: [
//       "Binds irreversibly to the receptor.",
//       "Reduces the efficacy of the agonist.",
//       "Increases the potency of the agonist.",
//       "Shifts the dose-response curve of the agonist to the right.",
//     ],
//   },
//   {
//     questionId: "",
//     question:
//       "Which of the following is a Phase I reaction in drug metabolism?",
//     correctAnswer: "2",
//     options: ["Glucuronidation.", "Sulfation.", "Oxidation.", "Acetylation."],
//   },
//   {
//     questionId: "",
//     question:
//       "Which of the following drugs is known to follow zero-order kinetics at high doses?",
//     correctAnswer: "0",
//     options: ["Phenytoin.", "Amoxicillin.", "Warfarin.", "Losartan."],
//   },
//   {
//     questionId: "",
//     question:
//       "The dosage form that may be administered for releasing drug through several days:",
//     correctAnswer: "3",
//     options: [
//       "Oral sustained release",
//       "Oral enteric-coated",
//       "Intravenous depot",
//       "Intramuscular depot",
//     ],
//   },
//   {
//     questionId: "",
//     question:
//       "Alkalization of the urine would be expected to increase the renal excretion of:",
//     correctAnswer: "0",
//     options: [
//       "Acidic drug",
//       "Basic drug",
//       "Both acidic and basic drugs",
//       "Neither acidic nor basic drugs",
//     ],
//   },
//   {
//     questionId: "",
//     question: "Which of the following statements is CORRECT:",
//     correctAnswer: "1",
//     options: [
//       "Sublingual administration can not avoid first pass metabolism.",
//       "The higher the therapeutic index, the safer the drug.",
//       "Alkalization of urine enhances excretion of weak basic drugs.",
//       "Drug metabolism is slower in those who smoke than in those who do not.",
//     ],
//   },
//   {
//     questionId: "",
//     question: "The term bioavailability refers to the:",
//     correctAnswer: "1",
//     options: [
//       "The relationship between the chemical and physical property of drug and the systemic absorption of the drug",
//       "Measurement of the rate and amount of unchanged drug that reaches systemic circulation",
//       "Movement of the drug into body tissues over time",
//       "Dissolution of the drug in the gastrointestinal tract",
//     ],
//   },
//   {
//     questionId: "",
//     question: "A none-competitive antagonist can produce:",
//     correctAnswer: "1",
//     options: [
//       "Parallel shift of the dose response curve of agonist to right.",
//       "Decrease in the maximal response of the agonist.",
//       "Change in the mechanism of action of the agonist.",
//       "Its effect can be overcome by higher concentration of the agonist.",
//     ],
//   },
//   {
//     questionId: "",
//     question: "The following drug interactions are correct EXCEPT:",
//     correctAnswer: "2",
//     options: [
//       "Metoclopramide hastens the absorption of paracetamol",
//       "Charcoal reduces the absorption of phenobarbitone",
//       "Probenecid enhances the renal excretion of penicillin",
//       "Phenobarbitone reduces the pharmacological action of warfarin",
//     ],
//   },
//   {
//     questionId: "",
//     question:
//       "The following drugs are correctly being paired with their protein targets EXCEPT",
//     correctAnswer: "0",
//     options: [
//       "Acetylcholine ---- calcium ion channel",
//       "Allopurinol ----- enzyme",
//       "Hemicholinium ----- carrier protein",
//       "Local anesthetic ----- sodium ion channel",
//     ],
//   },
//   {
//     questionId: "",
//     question: "The area under the plasma concentration curve (AUC) represents:",
//     correctAnswer: "3",
//     options: [
//       "Biologic half-life of the drug",
//       "Amount of drug that is cleared by the kidney",
//       "Amount of drug in the original dosage form",
//       "Amount of the drug absorbed",
//     ],
//   },
//   {
//     questionId: "",
//     question:
//       "Which drug should be taken for optimum emergency management of an anaphylactic reaction?",
//     correctAnswer: "1",
//     options: ["Albuterol", "Epinephrine", "Atropine", "Propranolol"],
//   },
//   {
//     questionId: "",
//     question:
//       "A hypothetical drug, Drug X, can be administered by all the routes listed below. Which administration route is guaranteed to provide complete (100%) bioavailability of that drug?",
//     correctAnswer: "2",
//     options: ["Intramuscular", "Oral", "Intravenous", "Rectal"],
//   },
//   {
//     questionId: "",
//     question:
//       "Cimetidine, is one of the best examples of a drug that inhibits the P450 system. That means it inhibits the __________ of some drugs:",
//     correctAnswer: "1",
//     options: ["Absorption", "Metabolism", "Distribution", "Excretion"],
//   },
//   {
//     questionId: "",
//     question:
//       'Drug A increases blood pressure by 10 mm Hg. Drug increases pressure by 10 mm Hg also. Giving the two drugs together, each at their own "right" doses, increases blood pressure by 30 mm Hg. This is an example of:',
//     correctAnswer: "3",
//     options: [
//       "Pharmacologic antagonism",
//       "Potentiation",
//       "Summation",
//       "Synergism",
//     ],
//   },
//   {
//     questionId: "",
//     question:
//       'X is a drug that is "extensively bound" to plasma proteins, If you give a therapeutic dose to a person with severe hypoalbuminemia, which one of the following effects would you expect to occur?',
//     correctAnswer: "0",
//     options: [
//       "A greater than normal (possibly toxic) response to the drug",
//       "A longer duration of action",
//       "A slower onset of action",
//       "A drug effect completely different from what X normally would cause.",
//     ],
//   },
//   {
//     questionId: "",
//     question:
//       "A drug has a t1/2 of 3 hours. What is the elimination rate constant (Kell for this drug in a patient?",
//     correctAnswer: "2",
//     options: ["0.15 hours", "0.33 hours", "0.231 hours", "0.6 hours"],
//   },

//   {
//     questionId: "",
//     question:
//       "It is desired to maintain a plasma concentration of 0.15 g/L of carbenicillin in apatient. Plasma clearance equals 8.82 L/hour. Calculate the infusion rate:",
//     correctAnswer: "3",
//     options: ["5 gm/hour", "3 gm/hour", "2.4 gm/hour", "1.3 gm/hour"],
//   },
//   {
//     questionId: "",
//     question:
//       "The plasma concentration of theophylline after a simple IV dose of 300 mg was 9 mg/liter. Calculate the volume of distribution (Vd):",
//     correctAnswer: "1",
//     options: ["3 liters", "33 liters", "15 liters", "45 liters"],
//   },
//   {
//     questionId: "",
//     question:
//       "Which of the following best describes the mechanism of action of a non-competitive antagonist?",
//     correctAnswer: "1",
//     options: [
//       "Binds to the same site as the agonist on the receptor and blocks the agonist's effects.",
//       "Binds to a different site on the receptor and changes the receptor's conformation.",
//       "Competes directly with the agonist for binding to the receptor.",
//       "Increases the number of receptors available for the agonist to bind.",
//     ],
//   },
//   {
//     questionId: "",
//     question:
//       "In the context of drug development, what does the term 'pharmacodynamics' refer to?",
//     correctAnswer: "1",
//     options: [
//       "The study of how a drug is absorbed, distributed, metabolized, and excreted.",
//       "The study of the biochemical and physiological effects of drugs and their mechanisms of action.",
//       "The study of the genetic basis for variation in drug response.",
//       "The study of drug formulation and delivery methods.",
//     ],
//   },
//   {
//     questionId: "",
//     question: "Which of the following statements about drug tolerance is true?",
//     correctAnswer: "0",
//     options: [
//       "It refers to a decrease in the effectiveness of a drug due to repeated administration.",
//       "It refers to an increased sensitivity to a drug after repeated use.",
//       "It is the same as drug dependence.",
//       "It does not occur with chronic use of opioid analgesics.",
//     ],
//   },
// ];
