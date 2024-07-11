import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Modal, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app, db } from '../../storage/Firebase';
import uuid from 'uuid-random';
import * as Location from 'expo-location';
import { doc, setDoc } from 'firebase/firestore';
import { RadioButton, TextInput, ProgressBar } from 'react-native-paper';
import { Button } from '../../components';
import { styles } from './styles';
import { useAuth } from '../../Hooks/useAuth';

export const CameraScreen = () => {
  const { currentUser } = useAuth();
  const cameraRef = useRef(null);
  const timerRef = useRef(null);

  const [permission, requestPermission] = useCameraPermissions();
  const [hasPermission, setHasPermission] = useState(null);
  const [facing, setFacing] = useState('back');
  const [isRecording, setIsRecording] = useState(false);
  const [videoUri, setVideoUri] = useState(null);
  const [recordTime, setRecordTime] = useState(0);
  const [speed, setSpeed] = useState(0);
  const [initialElevation, setInitialElevation] = useState(null);
  const [elevation, setElevation] = useState(null);
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('Public');
  const [showModal, setShowModal] = useState(false);
  const [typeVideo, setTypeVideo] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dataPoints, setDataPoints] = useState([]);
  const [distance, setDistance] = useState(0);

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  useEffect(() => {
    const requestPermissions = async () => {
      const { status } = await requestPermission();
      if (status !== 'granted') {
        console.log('Camera permission not granted');
        return;
      }

      const { status: mediaStatus } = await MediaLibrary.requestPermissionsAsync();
      if (mediaStatus !== 'granted') {
        console.log('Media Library permission not granted');
        return;
      }

      const { status: locationStatus } = await Location.requestForegroundPermissionsAsync();
      if (locationStatus !== 'granted') {
        console.log('Location permission not granted');
        return;
      }

      setHasPermission(true);
    };

    requestPermissions();
  }, []);

  useEffect(() => {
    const fetchElevation = async () => {
      try {
        const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.BestForNavigation });
        const { altitude } = location.coords;

        if (!initialElevation) {
          setInitialElevation(altitude || 0);
        }
        setElevation(altitude || 0);

        if (isRecording) {
          const timestamp = new Date().toISOString();
          const elevationGain = initialElevation ? (initialElevation - altitude).toFixed(2) : 0;

          const newDataPoint = {
            timestamp,
            speed: speed.toFixed(2),
            initialElevation: initialElevation.toFixed(2),
            elevation: altitude.toFixed(2),
            elevationGain,
            Tempo: recordTime + 's',
          };

          setDataPoints(prevDataPoints => [...prevDataPoints, newDataPoint]);
        }
      } catch (error) {
        console.log('Error fetching elevation:', error);
      }
    };

    if (isRecording) {
      const intervalId = setInterval(fetchElevation, 5000);
      return () => clearInterval(intervalId);
    }
  }, [isRecording, speed, initialElevation, elevation]);

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

      return new Promise((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          snapshot => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setUploadProgress(progress);
          },
          error => {
            console.log('Error uploading video:', error);
            reject(error);
          },
          async () => {
            const videoURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(videoURL);
          },
        );
      });
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

  if (!hasPermission) {
    return (
      <View style={styles.container}>
        <Text>No access to camera</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        type={facing === 'back' ? 'back' : 'front'}
        ref={cameraRef}
        ratio="16:9" // Adjust ratio if needed
      >
        <View style={styles.buttonContainer}>
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
        </View>
      </CameraView>
      <View style={styles.infoContainer}>
        <View style={styles.infoTextContainer}>
          <Text style={styles.infoText}>Current Speed: {speed ? speed.toFixed(2) + ' m/s' : 'N/A'}</Text>
          <Text style={styles.infoText}>
            Inicial Elevation: {initialElevation ? initialElevation.toFixed(2) + ' m' : 'N/A'}
          </Text>
          <Text style={styles.infoText}>Elevation: {elevation ? elevation.toFixed(2) + ' m' : 'N/A'}</Text>
          <Text style={styles.infoText}>
            Elevation Gain: {elevation ? (initialElevation - elevation).toFixed(2) + ' m' : 'N/A'}
          </Text>
        </View>
      </View>
      <Modal onRequestClose={handleModalClose} animationType="slide" visible={showModal}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.modalContainer}>
            <TouchableOpacity style={styles.closeButton} onPress={handleModalClose}>
              <Text style={styles.closeButtonText}>Fechar</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Informações do Vídeo</Text>
            <Text style={styles.modalSubtitle}>Adicione informações adicionais ao vídeo</Text>
            <TextInput
              label="Descrição"
              onChangeText={setDescription}
              value={description}
              mode="outlined"
              placeholder="Adicione uma breve descrição ao vídeo"
              style={styles.descriptionInput}
              multiline
            />
            <Text style={styles.modalLabel}>Status do Vídeo:</Text>
            <RadioButton.Group onValueChange={setStatus} value={status}>
              <RadioButton.Item label="Público" value="Public" color="green" />
              <RadioButton.Item label="Privado" value="Private" color="red" />
            </RadioButton.Group>
            <Text style={styles.modalLabel}>Tipo de Exercício:</Text>
            <RadioButton.Group onValueChange={setTypeVideo} value={typeVideo}>
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
