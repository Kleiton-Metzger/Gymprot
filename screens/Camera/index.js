import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Modal, TouchableWithoutFeedback, Platform } from 'react-native';
import { Camera, CameraView, useCameraPermissions } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app, db } from '../../storage/Firebase';
import uuid from 'uuid-random';
import { Accelerometer } from 'expo-sensors';
import * as Location from 'expo-location';
import { doc, setDoc } from 'firebase/firestore';
import { RadioButton, TextInput, ProgressBar } from 'react-native-paper';
import { Button } from '../../components';
import { Keyboard } from 'react-native';
import { styles } from './styles';
import { useAuth } from '../../Hooks/useAuth';
import { MaterialIcons } from '@expo/vector-icons';

export const CameraScreen = () => {
  const { currentUser } = useAuth();
  const cameraRef = useRef(null);
  const timerRef = useRef(null);

  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState('back');
  const [hasPermission, setHasPermission] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [videoUri, setVideoUri] = useState(null);
  const [recordTime, setRecordTime] = useState(0);
  const [speed, setSpeed] = useState(0);
  const [elevation, setElevation] = useState(null);
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('Public');
  const [showModal, setShowModal] = useState(false);
  const [typeVideo, setTypeVideo] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dataPoints, setDataPoints] = useState([]);
  const [distance, setDistance] = useState(0);

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  useEffect(() => {
    const requestPermissions = async () => {
      const { status } = await requestPermission();
      if (status !== 'granted') {
        console.log('Camera permission not granted');
        return;
      }

      if (Platform.OS === 'android') {
        const { status: camera } = await Camera.requestCameraPermissionsAsync();
        const { status: audioStatus } = await Camera.requestMicrophonePermissionsAsync();
        if (audioStatus !== 'granted' || camera !== 'granted') {
          console.log('Camera or Microphone permission not granted');
          return;
        }
      }

      if (Platform.OS === 'ios') {
        const { status: mediaStatus } = await MediaLibrary.requestPermissionsAsync();
        if (mediaStatus !== 'granted') {
          console.log('Media Library permission not granted');
          return;
        }
      }

      setHasPermission(true);
    };

    requestPermissions();
  }, []);
  useEffect(() => {
    const initializeAccelerometer = async () => {
      Accelerometer.setUpdateInterval(100);
      Accelerometer.addListener(accelerometerData => {
        const { x = 0, y = 0, z = 0 } = accelerometerData;
        const alpha = 0.1;
        const smoothedX = alpha * x + (1 - alpha) * 0;
        const smoothedY = alpha * y + (1 - alpha) * 0;
        const smoothedZ = alpha * z + (1 - alpha) * 0;
        const newSpeed = Math.sqrt(smoothedX ** 2 + smoothedY ** 2 + smoothedZ ** 2);
        setSpeed(newSpeed);
      });
    };

    initializeAccelerometer();

    return () => {
      Accelerometer.removeAllListeners();
    };
  }, []);

  useEffect(() => {
    let locationSubscription;

    const initializeLocationSubscription = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          console.log('Permission to access location was denied');
          return;
        }
        if ((recordTime === 1 || recordTime % 5 === 0) && isRecording) {
          console.log('im doing it');
          locationSubscription = await Location.watchPositionAsync(
            { accuracy: Location.Accuracy.Highest },
            location => {
              setElevation(location.coords.altitude);

              setDataPoints([
                ...dataPoints,
                {
                  speed,
                  elevation: location.coords.altitude.toFixed(2),
                  videoTime: recordTime,
                },
              ]);
            },
          );
        }
      } catch (error) {
        console.error('Error initializing location subscription:', error);
      }
    };

    initializeLocationSubscription();

    return () => {
      if (locationSubscription) {
        try {
          locationSubscription.remove();
        } catch (error) {
          console.error('Error removing location subscription:', error);
        }
      }
    };
  }, [recordTime]);

  const startTimer = () => {
    timerRef.current = setInterval(() => {
      setRecordTime(prevTime => prevTime + 1);
    }, 1000);
  };

  const stopTimer = () => {
    clearInterval(timerRef.current);
    setRecordTime(0);
  };

  const formatTime = seconds => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}:${
      remainingSeconds < 10 ? '0' + remainingSeconds : remainingSeconds
    }`;
  };

  const startRecording = async () => {
    setDataPoints([]);
    if (cameraRef.current) {
      try {
        const videoRecordPromise = cameraRef.current.recordAsync({
          maxDuration: 60,
          quality: '720p',
          stabilizationMode: 'auto',
          autoFocus: 'on',
        });
        startTimer();
        if (videoRecordPromise) {
          setIsRecording(true);
          const data = await videoRecordPromise;
          setVideoUri(data.uri);
        }
      } catch (error) {
        console.log('Error recording video:', error);
      }
    }
  };

  const stopRecording = async () => {
    if (cameraRef.current && isRecording) {
      cameraRef.current.stopRecording();
      stopTimer();
      setIsRecording(false);
      setShowModal(true);
    }
  };

  const uploadVideoToFirebase = async uri => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const storageRef = ref(getStorage(app), `Videos/${uuid()}.mp4`);
      const uploadTask = uploadBytesResumable(storageRef, blob);
      uploadTask.on(
        'state_changed',
        snapshot => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        },
        error => {
          console.log('Error uploading video:', error);
        },
      );
      await uploadTask;
      const videoURL = await getDownloadURL(storageRef);
      return videoURL;
    } catch (error) {
      console.log('Error uploading video to Firebase:', error);
    }
  };

  const addVideo = async uri => {
    const videoURL = await uploadVideoToFirebase(uri);
    const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Highest });
    const { latitude, longitude } = location.coords;
    try {
      const geocode = await Location.reverseGeocodeAsync({ latitude, longitude });
      const cityName = geocode[0].city;
      await setDoc(doc(db, 'videos', uuid()), {
        id: uuid(),
        videoURL,
        description,
        createBy: currentUser?.userId,
        createAt: new Date().toISOString(),
        location: { cityName, latitude, longitude },
        type: typeVideo,
        status,
        dataPoints,
      });
    } catch (error) {
      console.log('Error adding video to Firestore:', error);
    }
  };

  const handleModalClose = () => {
    setDescription('');
    setStatus('Public');
    setTypeVideo(null);
    setShowModal(false);
  };

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        videoStabilizationMode="auto"
        videoQuality="720p"
        autoFocus="on"
        mode="video"
        facing={facing}
        ref={cameraRef}
      >
        <TouchableOpacity
          style={[styles.recordButton, { backgroundColor: isRecording ? 'red' : 'white' }]}
          onPress={isRecording ? stopRecording : startRecording}
          disabled={uploadProgress > 0 && uploadProgress < 100}
        />
        {isRecording && (
          <View style={styles.timerContainer}>
            <Text style={styles.timerText}>{formatTime(recordTime)}</Text>
          </View>
        )}
      </CameraView>
      <View style={styles.infoContainer}>
        <View style={styles.infoTextContainer}>
          <Text style={styles.infoText}>Current Speed: {speed ? speed.toFixed(2) + ' m/s' : 'N/A'}</Text>
          <Text style={styles.infoText}>Elevation: {elevation ? elevation.toFixed(2) + ' m' : 'N/A'}</Text>
        </View>
        <View style={styles.infoTextContainer}>
          <Text style={styles.infoText}>Distance: {distance.toFixed(2)} m</Text>
        </View>
      </View>
      <Modal
        onRequestClose={handleModalClose}
        animationType="slide"
        presentationStyle="formSheet"
        visible={showModal}
        onDismiss={handleModalClose}
        contentContainerStyle={styles.modalContainer}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={{ padding: 10 }}>
            <TouchableOpacity style={{ marginBottom: 15 }} onPress={handleModalClose}>
              <Text style={{ color: '#581DB9', fontSize: 16, fontWeight: '600', textAlign: 'right' }}>Fechar</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Informações do Vídeo</Text>
            <Text style={styles.modalSubtitle}>Adicione informações adicionais ao vídeo</Text>
            <TextInput
              label="Descriição"
              bordercolor="#581DB9"
              color="#581DB9"
              onChangeText={setDescription}
              value={description}
              mode="outlined"
              placeholder="Adicione uma breve descrição ao vídeo"
              style={styles.descriptionInput}
              multiline={true}
            />
            <Text style={styles.modalLabel}>Status do Vídeo:</Text>
            <RadioButton.Group onValueChange={value => setStatus(value)} value={status}>
              <RadioButton.Item label="Público" value="Public" color="green" />
              <RadioButton.Item label="Privado" value="Private" color="red" />
            </RadioButton.Group>
            <Text style={styles.modalLabel}>Tipo de Exercício:</Text>
            <RadioButton.Group onValueChange={value => setTypeVideo(value)} value={typeVideo}>
              <RadioButton.Item label="Corrida" value="Running" color="#581DB9" />
              <RadioButton.Item label="Bicicleta" value="Cycling" color="#581DB9" />
              <RadioButton.Item label="Caminhada" value="Walking" color="#581DB9" />
            </RadioButton.Group>
            <Button
              onPress={() => {
                addVideo(videoUri);
                handleModalClose();
              }}
              label="Concluir"
              style={styles.button}
            />
          </View>
        </TouchableWithoutFeedback>
      </Modal>
      {uploadProgress > 0 && uploadProgress < 100 && (
        <ProgressBar progress={uploadProgress / 100} color={'#581DB9'} style={styles.progressBar} />
      )}
    </View>
  );
};
