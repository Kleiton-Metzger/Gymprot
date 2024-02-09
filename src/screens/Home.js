import React, { useEffect, useState, useRef } from "react";
import { View, Text, TouchableOpacity, Platform } from "react-native";
import { Camera } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import { StyleSheet } from "react-native-web";
import { getStorage, ref, uploadBytes } from 'firebase/storage';
import { app } from '../../storage/Firebase';
import { v4 as uuidv4 } from 'uuid';
import { accelerometer, barometer, gyroscope } from 'expo-sensors';

export default function HomeScreen({ navigation }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [isRecording, setIsRecording] = useState(false);
  const [videoUri, setVideoUri] = useState(null);
  const cameraRef = useRef(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
      MediaLibrary.requestPermissionsAsync();
    })();
  }, []);

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

  async function startRecording() {
    if (cameraRef.current) {
      try {
        const videoRecordPromise = cameraRef.current.recordAsync();
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
      setIsRecording(false);
    }
  }

  const storage = getStorage(app);

  async function uploadVideoToFirebase(videoUri) {
    try {
      const response = await fetch(videoUri);
      const blob = await response.blob();
  
      const storageRef = ref(storage, `videos/${uuidv4()}.mp4`);
  
      await uploadBytes(storageRef, blob);
  
      console.log('Video uploaded successfully!');
    } catch (error) {
      console.error('Error uploading video to Firebase:', error);
    }
  }
  
 
  async function saveVideo(video) {
    try {
      await MediaLibrary.createAssetAsync(video);
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
      </Camera>
      <View style={styles.infoContainer}>
        <View style={styles.infoTextContainer}>
          <Text style={styles.infoText}>Current Speed:</Text>
          <Text style={styles.infoText}>Elevation:</Text>
        </View>
        <View style={styles.infoTextContainer}>
          <Text style={styles.infoText}>Distance:</Text>
          <Text style={styles.infoText}>Time:</Text>
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
    flex: 1
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
  infoContainer: {
    flex: 0.1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'space-around',
    height: 50,
  },
  infoTextContainer: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  infoText: {
    fontSize: 15,
    fontWeight: 'bold'
  }
});
