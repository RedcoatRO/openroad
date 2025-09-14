// Importă funcțiile necesare din SDK-urile Firebase
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

// TODO: înlocuiește acest obiect cu configurația proiectului tău Firebase
// Poți găsi aceste date în consola Firebase > Project Settings > General.
const firebaseConfig = {
  apiKey: "AIzaSyBUqJxhsk9hIhT-pzX0boHo_EXTGsziomQ",
  authDomain: "open-road-leasing.firebaseapp.com",
  projectId: "open-road-leasing",
  storageBucket: "open-road-leasing.firebasestorage.app",
  messagingSenderId: "185421234096",
  appId: "1:185421234096:web:f7956a384d02d3c9c9a075"
};

// Inițializează aplicația Firebase
const app = initializeApp(firebaseConfig);

// Exportă instanțele serviciilor pentru a fi folosite în alte părți ale aplicației
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);
