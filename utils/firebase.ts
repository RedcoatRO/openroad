// Importă funcțiile necesare din SDK-urile Firebase
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

// TODO: înlocuiește acest obiect cu configurația proiectului tău Firebase
// Poți găsi aceste date în consola Firebase > Project Settings > General.
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Inițializează aplicația Firebase
const app = initializeApp(firebaseConfig);

// Exportă instanțele serviciilor pentru a fi folosite în alte părți ale aplicației
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);
