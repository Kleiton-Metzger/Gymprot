import React, { useState, useEffect, useRef } from 'react';
import { View, SafeAreaView, TouchableOpacity, Text, ActivityIndicator, useWindowDimensions } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Video } from 'expo-av';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../../storage/Firebase';
import { styles } from './styles';
import ConfigurationModal from '../../../components/ConfigurationModal';
import * as ScreenOrientation from 'expo-screen-orientation';
import Slider from '@react-native-community/slider';
import VideoData from '../../../components/VideoData';
import CustomBottomSheet from './BottomSheet';
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
  const [activeView, setActiveView] = useState('video');
  const playbackRates = [0.5, 1.0, 1.5, 2.0];
  const [showPlaybackRates, setShowPlaybackRates] = useState(false);
  const [showVolumeControl, setShowVolumeControl] = useState(false);
  const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);

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
  const toggleMute = () => {
    const newVolume = volume > 0 ? 0 : 1.0;
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.setStatusAsync({ volume: newVolume });
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
      await videoRef.current.setPositionAsync(value * 100);
    }
  };

  const handleStart = () => {
    setIsModalVisible(false);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    navigation.goBack();
  };

  const togglePlaybackRates = () => {
    setShowPlaybackRates(prev => !prev);
  };

  const selectPlaybackRate = rate => {
    setPlaybackRate(rate);
    setShowPlaybackRates(false);
    if (videoRef.current) {
      videoRef.current.setStatusAsync({ rate: rate });
    }
  };
  const toggleVolumeControl = () => {
    setShowVolumeControl(prev => !prev);
  };

  const toggleView = view => {
    if (view === 'video') {
      setActiveView('video');
      setActiveView(view);
      setIsBottomSheetVisible(false);
    }
    if (view === 'document') {
      setActiveView('document');
      setIsBottomSheetVisible(true);
    }
  };

  const toggleBottomSheet = () => {
    setIsBottomSheetVisible(prev => !prev);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton} onPress={() => navigation.goBack()} activeOpacity={0.8}>
          <Ionicons name="arrow-back" size={30} color="white" />
        </TouchableOpacity>
        <View style={styles.screenContent}>
          <TouchableOpacity
            style={[styles.toggleButton, activeView === 'video' ? styles.activeButton : styles.inactiveButton]}
            onPress={() => toggleView('video')}
            activeOpacity={0.8}
          >
            <Ionicons name="play" size={24} color={activeView === 'video' ? 'black' : 'white'} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleButton, activeView === 'document' ? styles.activeButton : styles.inactiveButton]}
            onPress={() => toggleView('document')}
            activeOpacity={0.8}
          >
            <MaterialIcons name="description" size={24} color={activeView === 'document' ? 'black' : 'white'} />
          </TouchableOpacity>
        </View>

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
        <TouchableOpacity style={styles.playPauseButton} onPress={handlePlayPause} activeOpacity={0.8}>
          <Ionicons name={isPlaying ? 'pause' : 'play'} size={40} color="white" />
        </TouchableOpacity>
        <View style={styles.controlsContainer}>
          <TouchableOpacity onPress={() => handleSeek(currentTime - 10)} activeOpacity={0.8} style={styles.seekButton}>
            <Ionicons name="play-back" size={45} color="white" />
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
            <Ionicons name="play-forward" size={45} color="white" />
          </TouchableOpacity>
        </View>
        <View style={styles.volumeControlContainer}>
          <TouchableOpacity onPress={toggleVolumeControl} activeOpacity={0.8}>
            <Ionicons
              name={volume > 0 ? 'volume-high' : 'volume-mute'}
              size={30}
              color={volume > 0 ? 'white' : 'gray'}
            />
          </TouchableOpacity>

          {showVolumeControl && (
            <Slider
              style={styles.volumeControl}
              minimumValue={0}
              maximumValue={1}
              value={volume}
              onValueChange={handleVolumeChange}
              minimumTrackTintColor={volume > 0 ? '#FFFFFF' : '#555555'}
              maximumTrackTintColor="#000000"
            />
          )}
        </View>

        <View style={styles.speedometerControlContainer}>
          <TouchableOpacity onPress={togglePlaybackRates} activeOpacity={0.8}>
            <MaterialIcons style={styles.speedometerIcon} name="speed" size={30} color="white" />
          </TouchableOpacity>
          {showPlaybackRates && (
            <View style={styles.playbackRatesContainer}>
              {playbackRates.map(rate => (
                <TouchableOpacity
                  key={rate}
                  onPress={() => selectPlaybackRate(rate)}
                  style={[
                    styles.playbackRateButton,
                    playbackRate === rate ? styles.activePlaybackRateButton : styles.inactivePlaybackRateButton,
                  ]}
                  activeOpacity={0.8}
                >
                  <Text style={styles.playbackRateText}>{rate.toFixed(1)}x</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
        <View style={styles.infoContainer}>
          {videoData && (
            <VideoData
              currentDataPointIndex={currentDataPointIndex}
              dataPoints={videoData.dataPoints}
              treadmillName={treadmillName}
              bicycleName={bicycleName}
              inclination={inclination}
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
      <CustomBottomSheet isVisible={isBottomSheetVisible} />
    </SafeAreaView>
  );
};
