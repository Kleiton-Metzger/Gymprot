import React, { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db, auth } from "../storage/Firebase";

export const FirebaseContext = React.createContext();

export const useFirebase = () => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, 'users', auth.currentUser.uid), (docSnap) => {
      if (docSnap.exists()) {
        const userData = docSnap.data();
        console.log('User Data:', userData);
        setUserData(userData);
      } else {
        console.log('No such document!');
      }
    });
    return () => unsubscribe();
  }, []);

  return { userData, setUserData };
};

export const FirebaseProvider = ({ children }) => {
  const firebaseValues = useFirebase();

  return (
    <FirebaseContext.Provider value={firebaseValues}>
      {children}
    </FirebaseContext.Provider>
  );
};

