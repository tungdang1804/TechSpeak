
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyC0kJwGp_b-syq1utA9OxGEjwf0o8EmhEU",
  authDomain: "english-for-technicians.firebaseapp.com",
  projectId: "english-for-technicians",
  storageBucket: "english-for-technicians.firebasestorage.app",
  messagingSenderId: "500584084498",
  appId: "1:500584084498:web:1883619a64e4ca9602d4cb",
  measurementId: "G-GM295V6M29"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
