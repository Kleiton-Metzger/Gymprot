import { Dimensions, Modal, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { collection, doc, onSnapshot, query } from 'firebase/firestore';
import { db, auth } from '../storage/Firebase';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  const signOut = async () => {
    try {
      await auth.signOut();
      setUser(null);
    } catch (error) {
      console.error(error);
    }
  };

  // useEffect(() => {
  const fetchUserData = async () => {
    const usersData = {};
    for (const userId of userId) {
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        usersData[userId] = { name: userData.name, avatar: userData.photoURL };
      } else {
        usersData[userId] = { name: '', avatar: null };
      }
    }
  };

  const fetchUserVideos = async () => {
    const q = query(collection(db, 'videos'), where('creatorId', '==', user?.uid));

    const querySnapshot = await getDocs(q);
    let fetchedVideos = [];
    querySnapshot.forEach(doc => {
      const videoData = doc.data();
      fetchedVideos.push({ id: doc.id, ...videoData });
    });
    setVideos(fetchedVideos);
  };

  //}, [videos]);
  useEffect(() => {
    try {
      const unsub = onSnapshot(doc(db, 'users', user?.uid), doc => {
        setCurrentUser(doc.data());
      });
    } catch (error) {
      // console.log('Error getting user data: ', error);
    }
  }, [user]);
  //console.log('currentUser', currentUser);

  const memoedValue = useMemo(
    () => ({
      user,
      setUser,
      currentUser,
      setCurrentUser,
      signOut,
    }),
    [currentUser, user],
  );

  return <AuthContext.Provider value={memoedValue}>{children}</AuthContext.Provider>;
};

export default AuthContext;

export function useAuth() {
  const context = useContext(AuthContext);

  return context;
}

const styles = StyleSheet.create({});
