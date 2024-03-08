import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
import {createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';


const firebaseConfig = {
  apiKey: "AIzaSyAV1SMD9pfn1aWznBDnsn_AU2crTjN75DU",
  authDomain: "gymprot-f67c2.firebaseapp.com",
  projectId: "gymprot-f67c2",
  storageBucket: "gymprot-f67c2.appspot.com",
  messagingSenderId: "502122880869",
  appId: "1:502122880869:web:814514c8267fa257068b8c"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app); 
const db = getFirestore(app);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});
export { storage, db, auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut };


