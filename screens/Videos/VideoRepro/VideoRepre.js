import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Video } from 'expo-av';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../../storage/Firebase'; // Importando apenas o db do arquivo Firebase
import { styles } from './styles';

export const VideosScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { videoURL } = route.params;
  const [isVideoLoading, setIsVideoLoading] = useState(true);
  const [videoData, setVideoData] = useState(null);
  const [currentDataPointIndex, setCurrentDataPointIndex] = useState(0);

  useEffect(() => {
    const fetchVideoData = async () => {
      try {
        const q = query(collection(db, 'videos'), where('videoURL', '==', videoURL));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const videoDoc = querySnapshot.docs[0];
          const videoData = videoDoc.data();
          setVideoData(videoData);
        } else {
          console.log('Nenhum vídeo encontrado para a URL:', videoURL);
        }
      } catch (error) {
        console.log('Erro ao buscar vídeo:', error);
      } finally {
        setIsVideoLoading(false);
      }
    };

    fetchVideoData();
  }, [videoURL]);

  useEffect(() => {
    if (videoData) {
      const interval = setInterval(() => {
        setCurrentDataPointIndex(prevIndex =>
          prevIndex < videoData.dataPoints.length - 1 ? prevIndex + 1 : prevIndex,
        );
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [videoData]);

  const calculateAltitudeChange = () => {
    const altitudeGain =
      currentDataPointIndex > 0
        ? videoData.dataPoints[currentDataPointIndex].initialElevation -
          videoData.dataPoints[currentDataPointIndex - 1].elevation
        : 0;

    let altitudeChangeStatus = '';
    if (altitudeGain > 0) {
      altitudeChangeStatus = 'A subir';
    } else if (altitudeGain < 0) {
      altitudeChangeStatus = 'A descer';
    } else {
      altitudeChangeStatus = 'Sem mudança';
    }

    return altitudeGain.toFixed(2) + 'm (' + altitudeChangeStatus + ')';
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.header} onPress={() => navigation.goBack()} activeOpacity={0.8}>
        <Ionicons name="arrow-back" size={30} color="black" style={styles.backBtn} />
      </TouchableOpacity>
      <View style={styles.body}>
        {isVideoLoading && <ActivityIndicator size={30} color="#581DB9" style={styles.activityIndicator} />}
        {videoData && (
          <Video
            source={{ uri: videoURL }}
            isMuted={false}
            volume={2.0}
            resizeMode="cover"
            shouldPlay
            isLooping={false}
            useNativeControls
            style={{ width: '100%', height: 300 }}
            onLoad={() => setIsVideoLoading(false)}
          />
        )}

        {videoData && currentDataPointIndex < videoData.dataPoints.length && (
          <View style={styles.sensorContainer}>
            <View style={styles.sensorItem}>
              <Text style={styles.sensorLabel}>Tempo:</Text>
              <Text style={styles.sensorData}>{videoData.dataPoints[currentDataPointIndex].Tempo} s</Text>
            </View>
            <View style={styles.sensorItem}>
              <Text style={styles.sensorLabel}>Current Speed:</Text>
              <Text style={styles.sensorData}>{videoData.dataPoints[currentDataPointIndex].speed} m/s</Text>
            </View>
            <View style={styles.sensorItem}>
              <Text style={styles.sensorLabel}>Altitude:</Text>
              <Text style={styles.sensorData}>{videoData.dataPoints[currentDataPointIndex].elevation} m</Text>
            </View>
            <View style={styles.sensorItem}>
              <Text style={styles.sensorLabel}>Altitude Gain:</Text>
              <Text style={styles.sensorData}>{currentDataPointIndex > 0 ? calculateAltitudeChange() : 'N/A'}</Text>
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};
