import React, { useState, useEffect, useRef } from 'react';
import { View, SafeAreaView, TouchableOpacity, Text, ActivityIndicator, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Video } from 'expo-av';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../../storage/Firebase';
import { styles } from './styles';
import ConfigurationModal from '../../../components/ConfigurationModal';
import * as ScreenOrientation from 'expo-screen-orientation';
import Slider from '@react-native-community/slider';

export const VideosScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { videoURL } = route.params;
  const { width, height } = useWindowDimensions();
  const [isVideoLoading, setIsVideoLoading] = useState(true);
  const [videoData, setVideoData] = useState(null);
  const [currentDataPointIndex, setCurrentDataPointIndex] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(true);
  const [treadmillName, setTreadmillName] = useState('');
  const [bicycleName, setBicycleName] = useState('');
  const [inclination, setInclination] = useState('');
  const [maxSpeed, setMaxSpeed] = useState('');
  const [type, setType] = useState('');
  const [isVideoFinished, setIsVideoFinished] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isLandscape, setIsLandscape] = useState(false);
  const [volume, setVolume] = useState(1.0);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [currentTime, setCurrentTime] = useState(0);
  const [seekTime, setSeekTime] = useState(0);
  const videoRef = useRef(null);

  useEffect(() => {
    const lockOrientation = async () => {
      if (isLandscape) {
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
      } else {
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.DEFAULT);
      }
    };

    lockOrientation();

    return () => {
      ScreenOrientation.unlockAsync();
    };
  }, [isLandscape]);

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

  const handlePlayPause = async () => {
    if (isVideoFinished) {
      await videoRef.current.replayAsync();
      setIsVideoFinished(false);
      setIsPlaying(true);
    } else {
      if (isPlaying) {
        await videoRef.current.pauseAsync();
      } else {
        await videoRef.current.playAsync();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const onPlaybackStatusUpdate = status => {
    if (status.didJustFinish) {
      setIsVideoFinished(true);
      setIsPlaying(false);
    } else {
      setCurrentTime(status.positionMillis / 1000);
    }
  };

  const changeOrientation = async () => {
    if (isLandscape) {
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.DEFAULT);
    } else {
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
    }
    setIsLandscape(prev => !prev);
  };

  const handleVolumeChange = value => {
    setVolume(value);
    if (videoRef.current) {
      videoRef.current.setStatusAsync({ volume: value });
    }
  };

  const handlePlaybackRateChange = value => {
    setPlaybackRate(value);
    if (videoRef.current) {
      videoRef.current.setStatusAsync({ rate: value });
    }
  };

  const handleSeek = async value => {
    setSeekTime(value);
    if (videoRef.current) {
      await videoRef.current.setPositionAsync(value * 1000);
    }
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
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton} onPress={() => navigation.goBack()} activeOpacity={0.8}>
          <Ionicons name="arrow-back" size={30} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.headerButton} onPress={changeOrientation} activeOpacity={0.8}>
          <Ionicons name={isLandscape ? 'phone-portrait-outline' : 'phone-landscape-outline'} size={30} color="white" />
        </TouchableOpacity>
      </View>
      <View style={styles.videoContainer}>
        {isVideoLoading && <ActivityIndicator size={30} color="#581DB9" style={styles.activityIndicator} />}
        {videoData && !isModalVisible && (
          <Video
            ref={videoRef}
            source={{ uri: videoURL }}
            isMuted={false}
            volume={volume}
            rate={playbackRate}
            resizeMode="contain"
            shouldPlay={isPlaying}
            isLooping={false}
            useNativeControls={false}
            onLoadStart={() => setIsVideoLoading(false)}
            style={styles.video}
            onLoad={() => setIsVideoLoading(false)}
            onPlaybackStatusUpdate={onPlaybackStatusUpdate}
          />
        )}
        <TouchableOpacity
          style={[styles.playPauseButton, { backgroundColor: isPlaying ? 'rgba(0, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0.5)' }]}
          onPress={handlePlayPause}
          activeOpacity={0.8}
        >
          <Ionicons name={isPlaying ? 'pause' : 'play'} size={40} color="white" />
        </TouchableOpacity>
        <View style={styles.controlsContainer}>
          <TouchableOpacity onPress={() => handleSeek(currentTime - 10)} activeOpacity={0.8} style={styles.seekButton}>
            <Ionicons name="play-back" size={30} color="white" />
          </TouchableOpacity>
          <Slider
            style={styles.videoTimeline}
            minimumValue={0}
            maximumValue={videoData ? videoData.duration : 0}
            value={seekTime}
            onValueChange={handleSeek}
            minimumTrackTintColor="#FFFFFF"
            maximumTrackTintColor="#000000"
          />
          <TouchableOpacity onPress={() => handleSeek(currentTime + 10)} activeOpacity={0.8} style={styles.seekButton}>
            <Ionicons name="play-forward" size={30} color="white" />
          </TouchableOpacity>
        </View>
        <View style={styles.volumeControlContainer}>
          <Ionicons name="volume-high" size={30} color={volume > 0 ? 'white' : 'gray'} />
          <Slider
            style={styles.volumeControl}
            minimumValue={0}
            maximumValue={1}
            value={volume}
            onValueChange={handleVolumeChange}
            minimumTrackTintColor={volume > 0 ? '#FFFFFF' : '#555555'}
            maximumTrackTintColor="#000000"
          />
        </View>
        <View style={styles.speedometerControlContainer}>
          <Ionicons style={styles.speedometer} name="speedometer" size={20} color="white" />
          <Slider
            style={styles.speedometerControl}
            minimumValue={0.5}
            maximumValue={2.0}
            step={0.1}
            value={playbackRate}
            onValueChange={handlePlaybackRateChange}
            minimumTrackTintColor="#FFFFFF"
            maximumTrackTintColor="#000000"
          />
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>Velocidade: km/h</Text>
          <Text style={styles.infoText}>Inclinação: 0°</Text>
          <Text style={styles.infoText}>Tempo do vídeo: 00:00 </Text>
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
