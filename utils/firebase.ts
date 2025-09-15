// Importăm pachetul de compatibilitate Firebase v9, care include toate serviciile
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';


// Configurația pentru aplicația web Firebase, furnizată de utilizator
const firebaseConfig = {
  apiKey: "AIzaSyBUqJxhsk9hIhT-pzX0boHo_EXTGsziomQ",
  authDomain: "open-road-leasing.firebaseapp.com",
  projectId: "open-road-leasing",
  storageBucket: "open-road-leasing.firebasestorage.app", // Valoarea corectată conform screenshot-ului
  messagingSenderId: "185421234096",
  appId: "1:185421234096:web:f7956a384d02d3c9c9a075"
};

// Inițializăm aplicația Firebase, dar numai dacă nu a fost deja inițializată.
// Acest lucru previne erorile în mediile cu Hot Module Replacement (HMR).
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// Exportăm serviciile Firebase inițializate pentru a le putea importa și utiliza în alte părți ale aplicației.
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

// Exportăm și obiectul `firebase` în sine pentru a avea acces la tipuri (ex: firebase.User)
export { auth, db, storage, firebase };