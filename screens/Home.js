import React, { useEffect, useState, useRef } from "react";
import { View, Text, TouchableOpacity, Platform } from "react-native";
import { Camera } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import { StyleSheet } from "react-native-web";
import { getStorage, ref, uploadBytesResumable} from 'firebase/storage';
import { app } from "../storage/Firebase";
import { v4 as uuidv4 } from 'uuid';
import { Accelerometer } from 'expo-sensors';

export default function HomeScreen({ navigation }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [isRecording, setIsRecording] = useState(false);
  const [videoUri, setVideoUri] = useState(null);
  const [recordTime, setRecordTime] = useState(0);
  const cameraRef = useRef(null);
  const timerRef = useRef(null);
  const [speed, setSpeed] = useState(0); // State for speed

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
      MediaLibrary.requestPermissionsAsync();
    })();
  }, []);

  useEffect(() => {
    // Subscribe to accelerometer updates
    const subscription = Accelerometer.addListener(accelerometerData => {
      // Calculate speed based on accelerometer data
      const newSpeed = calculateSpeed(accelerometerData);
      setSpeed(newSpeed);
    });

    return () => {
      subscription.remove(); // Unsubscribe from accelerometer updates
    };
  }, []);

  const calculateSpeed = accelerometerData => {
    const { x, y, z } = accelerometerData; 
    const newSpeed = Math.sqrt(x * x + y * y + z * z); 
    return newSpeed;


  };




  const chooseOptimalAspectRatio = (ratios) => {
    return { width: ratios[0].split(':')[0], height: ratios[0].split(':')[1] };
  };

  if (Platform.OS === 'android') {
    Camera.requestCameraPermissionsAsync()
      .then(({ status }) => {
        if (status === 'granted') {
          Camera.getSupportedRatiosAsync().then(ratios => {
            const aspectRatio = chooseOptimalAspectRatio(ratios);
            Camera.setPreviewSize({ width: aspectRatio.width, height: aspectRatio.height });
          });
        } else {
          // Permission denied
          return (
            <View>
              <Text>Acesso negado!</Text>
            </View>
          );
        }
      })
      .catch((error) => {
        console.error('Error requesting camera permissions:', error);
        return (
          <View>
            <Text>Error requesting camera permissions</Text>
          </View>
        );
      });
  } else if (Platform.OS === 'ios') {
    Camera.requestCameraPermissionsAsync();
    if (hasPermission === null) {
      return <View />;
    }
    if (hasPermission === false) {
      return <Text>Acesso negado!</Text>;
    }
  }

  const startTimer = () => {
    timerRef.current = setInterval(() => {
      setRecordTime(prevTime => prevTime + 1);
    }, 1000);
  };

  const stopTimer = () => {
    clearInterval(timerRef.current);
    setRecordTime(0);
  };

  async function startRecording() {
    if (cameraRef.current) {
      try {
        const videoRecordPromise = cameraRef.current.recordAsync();
        startTimer();
        if (videoRecordPromise) {
          setIsRecording(true);
          const data = await videoRecordPromise;
          setVideoUri(data.uri);           
          saveVideo(data.uri);
        }
      } catch (error) {
        console.error('Error recording video:', error);
      }
    }
  }

  async function stopRecording() {
    if (cameraRef.current && isRecording) {
      cameraRef.current.stopRecording();
      stopTimer();
      setIsRecording(false);
    }
  }

  const storage = getStorage(app);

  async function uploadVideoToFirebase(uri) {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const storageRef = ref(storage, `videos/${uuidv4()}.mp4` + new Date().getTime());
      const uploadTask = uploadBytesResumable(storageRef, blob);
      uploadTask.on('state_changed', 
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');
        }, 
        (error) => {
          console.log('Error uploading video:', error);
        }, 
        () => {
          console.log('Upload complete');
        }
      );
    } catch (error) {
      console.error('Error uploading video to Firebase:', error);
    }
  }

  async function saveVideo(video) {
    try {
      await uploadVideoToFirebase(video);
      alert('Vídeo salvo com sucesso!');
    } catch (error) {
      console.log('Error saving video:', error);
    }
  }

  return (
    <View style={styles.container}>
      <Camera style={styles.camera} type={type} ref={cameraRef}>
        <TouchableOpacity
          style={[styles.recordButton, { backgroundColor: isRecording ? 'red' : 'white' }]}
          onPress={isRecording ? stopRecording : startRecording}
        />
        {isRecording && (
          <View style={styles.timerContainer}>
            <Text style={styles.timerText}>{formatTime(recordTime)}</Text>
          </View>
        )}
      </Camera>
      <View style={styles.infoContainer}>
        <View style={styles.infoTextContainer}>
          <Text style={styles.infoText}>Current Speed: {speed.toFixed(2)} m/s</Text>
          <Text style={styles.infoText}>Elevation:</Text>
        </View>
        <View style={styles.infoTextContainer}>
          <Text style={styles.infoText}>Distance:</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent'    
  },
  camera: {
    flex: 1,
    justifyContent: 'space-between',
    position: 'relative',
  },
  recordButton: { 
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    alignItems: 'center',
    height: 50,
    width: 50,
    borderRadius: 25, 
  },
  timerContainer: {
    position: 'absolute',
    top: 20,
    alignSelf: 'center',
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
  },
  timerText: {
    fontSize: 18,
    color: 'white',
  },
  infoContainer: {
    position: 'absolute', 
    top: 0,
    left: 0,
    padding: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.2)', 
    width: 'auto' 
  },
  infoTextContainer: {
    justifyContent: 'center',
  },
  infoText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: 'white',
    margin: 5,
  }
});

function formatTime(seconds) {  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  return `${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}:${remainingSeconds < 10 ? '0' + remainingSeconds : remainingSeconds}`;
}
