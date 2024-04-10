import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Modal, TouchableWithoutFeedback } from 'react-native';
import { Camera } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app, db, auth } from '../../storage/Firebase';
import { v4 as uuidv4 } from 'uuid';
import { Accelerometer } from 'expo-sensors';
import * as Location from 'expo-location';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';
import { RadioButton, TextInput, ProgressBar } from 'react-native-paper';
import { Button } from '../../components';
import { Keyboard } from 'react-native';
import { text } from '@fortawesome/fontawesome-svg-core';
import { styles } from './styles';

export const CameraScreen = ({}) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [type] = useState(Camera.Constants.Type.back);
  const [isRecording, setIsRecording] = useState(false);
  const [videoUri, setVideoUri] = useState(null);
  const [recordTime, setRecordTime] = useState(0);
  const [speed, setSpeed] = useState(0);
  const [elevation, setElevation] = useState(null);
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('Public');
  const [showModal, setShowModal] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const [typeVideo, setTypeVideo] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0); 

  const cameraRef = useRef(null);
  const timerRef = useRef(null);

  const calculateSpeed = accelerometerData => {
    const { x, y, z } = accelerometerData;
    const newSpeed = Math.sqrt(x * x + y * y + z * z);
    return newSpeed;
  };

  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, 'users', auth.currentUser.uid), docSnap => {
      if (docSnap.exists()) {
        const userData = docSnap.data();
        setUserData(userData);
      } else {
        console.log('No such document!');
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
      MediaLibrary.requestPermissionsAsync();
    })();
  }, []);

  useEffect(() => {
    const subscription = Accelerometer.addListener(accelerometerData => {
      const newSpeed = calculateSpeed(accelerometerData);
      setSpeed(newSpeed);
      setIsMoving(newSpeed > 0.1);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.error('Location permission denied');
        return;
      }

      const locationSubscription = Location.watchPositionAsync({ accuracy: Location.Accuracy.High }, location => {
        setElevation(location.coords.altitude);
      });

      return () => {
        locationSubscription.remove();
      };
    })();
  }, []);

  const startTimer = () => {
    timerRef.current = setInterval(() => {
      setRecordTime(prevTime => prevTime + 1);
    }, 1000);
  };

  const stopTimer = () => {
    clearInterval(timerRef.current);
    setRecordTime(0);
  };

  function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}:${
      remainingSeconds < 10 ? '0' + remainingSeconds : remainingSeconds
    }`;
  }

  async function startRecording() {
    if (cameraRef.current) {
      try {
        const videoRecordPromise = cameraRef.current.recordAsync();
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
  }

  async function stopRecording() {
    if (cameraRef.current && isRecording) {
      cameraRef.current.stopRecording();
      stopTimer();
      setIsRecording(false);
      setShowModal(true);
    }
  }

  const storage = getStorage(app);

  async function uploadVideoToFirebase(uri) {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const storageRef = ref(storage, `Videos/${uuidv4()}.mp4`);
      const uploadTask = uploadBytesResumable(storageRef, blob);

      uploadTask.on(
        'state_changed',
        snapshot => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress); 
        },
        error => {
          console.log('Error uploading video:', error);
        }
      );

      await uploadTask;
      const videoURL = await getDownloadURL(storageRef);
      return videoURL;
    } catch (error) {
      console.log('Error uploading video to Firebase:', error);
    }
  }

  const addVideo = async uri => {
    if (!userData) {
      console.log('User data is not available yet.');
      return;
    }

    const videoURL = await uploadVideoToFirebase(uri);

    const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
    const { latitude, longitude } = location.coords;

    try {
      const geocode = await Location.reverseGeocodeAsync({ latitude, longitude });
      const cityName = geocode[0].city;

      await setDoc(doc(db, 'videos', uuidv4()), {
        id: uuidv4(),
        videoURL,
        description,
        createBy: userData.userId, 
        createAt: new Date().toISOString(),
        location: { cityName, latitude, longitude },
        speed,
        elevation,
        type: typeVideo,
        status,
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
      <Camera style={styles.camera} type={type} ref={cameraRef}>
      <TouchableOpacity
          style={[styles.recordButton, { backgroundColor: isRecording ? 'red' : 'white' }]}
          onPress={isRecording ? stopRecording : startRecording}
          disabled={uploadProgress > 0 && uploadProgress < 100} // Disable the button when upload is in progress
        />
        {isRecording && (
          <View style={styles.timerContainer}>
            <Text style={styles.timerText}>{formatTime(recordTime)}</Text>
          </View>
        )}
      </Camera>
      <View style={styles.infoContainer}>
        <View style={styles.infoTextContainer}>
          <Text style={styles.infoText}>Current Speed: {isMoving ? speed.toFixed(2) : '0.00'} m/s</Text>
          <Text style={styles.infoText}>Elevation: {elevation ? elevation.toFixed(2) + ' m' : 'N/A'}</Text>
        </View>
        <View style={styles.infoTextContainer}>
          <Text style={styles.infoText}>Distance:</Text>
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

