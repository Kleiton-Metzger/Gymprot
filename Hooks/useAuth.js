import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { collection, doc, onSnapshot, query, where, getDocs, getDoc } from 'firebase/firestore';
import { db, auth } from '../storage/Firebase';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [videos, setVideos] = useState([]);
  const [originalVideos, setOriginalVideos] = useState([]);
  const [categoria, setCategoria] = useState('');
  const [localizacao, setLocalizacao] = useState('');

  const signOut = async () => {
    try {
      await auth.signOut();
      setUser(null);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteUser = async () => {
    try {
      await auth.currentUser.delete();
      setUser(null);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchUserData = async userId => {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      return userDoc.data();
    }
    return { name: '', avatar: null };
  };

  useEffect(() => {
    if (!user) return;
    const unsub = onSnapshot(
      doc(db, 'users', user.uid),
      doc => {
        setCurrentUser(doc.data());
      },
      error => {
        console.log('Error getting user data: ', error);
      },
    );

    return () => unsub();
  }, [user]);

  useEffect(() => {
    const fetchUserVideos = async () => {
      let q = query(collection(db, 'videos'), where('createBy', '==', user.uid));

      const unsubscribeVideos = onSnapshot(q, async querySnapshot => {
        let fetchedVideos = [];
        for (const doc of querySnapshot.docs) {
          const videoData = doc.data();
          const userData = await fetchUserData(videoData.createBy);
          fetchedVideos.push({ id: doc.id, ...videoData, creatorInfo: userData });
        }
        setVideos(fetchedVideos);
        setOriginalVideos(fetchedVideos);
      });

      return () => unsubscribeVideos();
    };

    if (user) {
      fetchUserVideos();
    }
  }, [user]);

  const memoedValue = useMemo(
    () => ({
      user,
      setUser,
      currentUser,
      setCurrentUser,
      signOut,
      videos,
      setCategoria,
      setLocalizacao,
      originalVideos,
      setOriginalVideos,
      deleteUser,
    }),
    [currentUser, user, videos],
  );

  return <AuthContext.Provider value={memoedValue}>{children}</AuthContext.Provider>;
};

export default AuthContext;

export function useAuth() {
  const context = useContext(AuthContext);

  return context;
}
