import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAV1SMD9pfn1aWznBDnsn_AU2crTjN75DU",
  authDomain: "gymprot-f67c2.firebaseapp.com",
  projectId: "gymprot-f67c2",
  storageBucket: "gymprot-f67c2.appspot.com",
  messagingSenderId: "502122880869",
  appId: "1:502122880869:web:814514c8267fa257068b8c"
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app); 
export const db = getFirestore(app);


