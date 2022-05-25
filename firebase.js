// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"
import { getAuth } from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA3QJeHqsnNGSdajbmkuuDxcf7n6jaNlMo",
  authDomain: "whatsapp2049-74a6f.firebaseapp.com",
  projectId: "whatsapp2049-74a6f",
  storageBucket: "whatsapp2049-74a6f.appspot.com",
  messagingSenderId: "130649400830",
  appId: "1:130649400830:web:eb37a2936f0189ee9a8caf",
  measurementId: "G-MPMHLFM6QR"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig): getApp();
const db = getFirestore();
const storage = getStorage();
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { app, db, storage, auth, provider };
