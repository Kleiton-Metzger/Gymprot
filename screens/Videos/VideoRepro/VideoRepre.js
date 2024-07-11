import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Video } from 'expo-av';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../../storage/Firebase';
import { styles } from './styles';
import VideoData from '../../../components/VideoData';
import ConfigurationModal from '../../../components/ConfigurationModal';

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
          console.log('No video found for the URL:', videoURL);
        }
      } catch (error) {
        console.log('Error fetching video:', error);
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
    return currentDataPointIndex > 0
      ? videoData.dataPoints[currentDataPointIndex].elevation -
          videoData.dataPoints[currentDataPointIndex - 1].elevation
      : 0;
  };

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
      <View style={styles.videoContainer}>
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
        <View style={styles.dataContainer}>
          {videoData && (
            <VideoData
              type={type}
              dataPoints={videoData.dataPoints}
              currentDataPointIndex={currentDataPointIndex}
              time={videoData.dataPoints[currentDataPointIndex].time}
              speed={videoData.dataPoints[currentDataPointIndex].speed}
              altitude={videoData.dataPoints[currentDataPointIndex].elevation}
              altitudeChange={calculateAltitudeChange()}
              distance={videoData.dataPoints[currentDataPointIndex].distance}
              inclination={videoData.dataPoints[currentDataPointIndex].inclination}
              treadmillName={treadmillName}
              bicycleName={bicycleName}
              maxSpeed={maxSpeed}
            />
          )}
        </View>
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
