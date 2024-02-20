import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD4jQs_6VL8eQSXieRCz68-eP-P6udkfm8",
  authDomain: "gymprot-c62a2.firebaseapp.com",
  databaseURL: "https://gymprot-c62a2-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "gymprot-c62a2",
  storageBucket: "gymprot-c62a2.appspot.com",
  messagingSenderId: "443888906305",
  appId: "1:443888906305:web:13d3002095b0bf1cabd6c0"
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app); 
export const db = getFirestore(app);


