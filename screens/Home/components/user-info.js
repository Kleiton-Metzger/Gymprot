import React, { useEffect, useState } from 'react';
import { View, Text, Image } from "react-native";
import styles from "../styles";
import { doc, onSnapshot,collection } from 'firebase/firestore';
import { db, auth } from '../../../storage/Firebase';

export const UserInfo = () => {
  const [userData, setUserData] = useState(null);
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const unsubscribeUser = onSnapshot(doc(db, 'users', auth.currentUser.uid), (docSnap) => {
      if (docSnap.exists()) {
        const userData = docSnap.data();
        console.log('User Data:', userData);
        setUserData(userData);
      } else {
        console.log('No such document!');
      }
    });

    // Clean up the listener when the component unmounts
    return () => unsubscribeUser();
  }, []);

  useEffect(() => {
    const unsubscribeVideos = onSnapshot(collection(db, 'videos'), (querySnapshot) => {
      const fetchedVideos = [];
      querySnapshot.forEach((doc) => {
        const videoData = doc.data();
        console.log('Video Data:', videoData);
        if (videoData.createBy === auth.currentUser.uid) { // Verifica se o vídeo foi criado pelo usuário atual
          fetchedVideos.push({ id: doc.id, ...videoData });
        }
      });
      setVideos(fetchedVideos);
    });

    // Clean up the listener when the component unmounts
    return () => unsubscribeVideos();
  }, []);

  return (
    <View style={styles.userInfo}>
      {userData && (
        <>
          <Image source={{ uri: userData.photoURL }} style={styles.avatar} />
          <Text style={styles.userName}>{userData.name}</Text>
          {videos.map(video => (
            <View key={video.id}>
              <Text style={styles.location}>Localização: {video.location.cityName}</Text>
            
            </View>
          ))}
        </>
      )}
    </View>
  );
}
