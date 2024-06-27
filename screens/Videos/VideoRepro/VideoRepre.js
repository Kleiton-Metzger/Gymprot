import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Video } from 'expo-av';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../../storage/Firebase';
import { styles } from './styles';
import VideoData from '../../../components/VideoData'; // Ajuste o caminho conforme necessário
import ConfigurationModal from '../../../components/ConfigurationModal'; // Ajuste o caminho conforme necessário

export const VideosScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { videoURL } = route.params;
  const [isVideoLoading, setIsVideoLoading] = useState(true);
  const [videoData, setVideoData] = useState(null);
  const [currentDataPointIndex, setCurrentDataPointIndex] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(true);
  const [treadmillName, setTreadmillName] = useState('');
  const [bicycleName, setBicycleName] = useState('');
  const [inclination, setInclination] = useState('');
  const [maxSpeed, setMaxSpeed] = useState('');
  const [type, setType] = useState('');

  useEffect(() => {
    const fetchVideoData = async () => {
      try {
        const q = query(collection(db, 'videos'), where('videoURL', '==', videoURL));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const videoDoc = querySnapshot.docs[0];
          const videoData = videoDoc.data();
          setVideoData(videoData);
          setType(videoData.type);
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

  const handleStart = () => {
    setIsModalVisible(false);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.header} onPress={() => navigation.goBack()} activeOpacity={0.8}>
        <Ionicons name="arrow-back" size={30} color="black" style={styles.backBtn} />
      </TouchableOpacity>
      <View style={styles.body}>
        {isVideoLoading && <ActivityIndicator size={30} color="#581DB9" style={styles.activityIndicator} />}
        {videoData && !isModalVisible && (
          <Video
            source={{ uri: videoURL }}
            isMuted
            volume={2.0}
            resizeMode="cover"
            shouldPlay
            isLooping={false}
            useNativeControls
            style={styles.video}
            onLoad={() => setIsVideoLoading(false)}
          />
        )}
        {videoData && currentDataPointIndex < videoData.dataPoints.length && (
          <VideoData
            dataPoints={videoData.dataPoints}
            currentDataPointIndex={currentDataPointIndex}
            type={type}
            treadmillName={treadmillName}
            bicycleName={bicycleName}
            inclination={inclination}
            maxSpeed={maxSpeed}
          />
        )}
      </View>
      <ConfigurationModal
        isVisible={isModalVisible}
        onClose={handleModalClose}
        treadmillName={treadmillName}
        setTreadmillName={setTreadmillName}
        bicycleName={bicycleName}
        setBicycleName={setBicycleName}
        inclination={inclination}
        setInclination={setInclination}
        maxSpeed={maxSpeed}
        setMaxSpeed={setMaxSpeed}
        onStart={handleStart}
        type={type}
      />
    </SafeAreaView>
  );
};
