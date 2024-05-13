import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, doc, setDoc } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword as createUser, signInWithEmailAndPassword } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAwEOnY529CIOe1T7heFrKEW82cMIX4v6k",
  authDomain: "movie-9b25a.firebaseapp.com",
  projectId: "movie-9b25a",
  storageBucket: "movie-9b25a.appspot.com",
  messagingSenderId: "583705997353",
  appId: "1:583705997353:web:aa78ca0af2f241ebaeac38",
  measurementId: "G-2H54RKSW00"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const firestore = getFirestore(app);
const auth = getAuth();

export { app, analytics, firestore, auth,collection,doc,setDoc, createUser , signInWithEmailAndPassword };
