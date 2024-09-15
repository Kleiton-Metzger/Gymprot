import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Modal, TouchableWithoutFeedback, Platform, Alert } from 'react-native';
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
import axios from 'axios';

class KalmanFilter {
  constructor(R = 0.01, Q = 1) {
    this.R = R; // Variância do ruído do sensor
    this.Q = Q; // Variância do ruído do processo
    this.A = 1;
    this.B = 0;
    this.C = 1;
    this.cov = NaN;
    this.x = NaN; // Valor estimado
  }

  filter(z) {
    if (isNaN(this.x)) {
      this.x = (1 / this.C) * z;
      this.cov = (1 / this.C) * this.Q * (1 / this.C);
    } else {
      const predX = this.A * this.x + this.B * 0;
      const predCov = this.A * this.cov * this.A + this.R;

      const K = predCov * this.C * (1 / (this.C * predCov * this.C + this.Q));
      this.x = predX + K * (z - this.C * predX);
      this.cov = predCov - K * this.C * predCov;
    }
    return this.x;
  }
}

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
  const [elevation, setElevation] = useState(null);
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('Public');
  const [showModal, setShowModal] = useState(false);
  const [typeVideo, setTypeVideo] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dataPoints, setDataPoints] = useState([]);
  const [speed, setSpeed] = useState(0);
  const [distance, setDistance] = useState(0);
  const [currentPosition, setCurrentPosition] = useState(null);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [inclinacao, setInclinacao] = useState({ x: 0.05, y: -0.97, z: -0.25, tolerance: 0.1 });
  const [instantaneousSpeed, setInstantaneousSpeed] = useState(0);
  const [gpsSpeed, setGpsSpeed] = useState(0);
  const MY_API_KEY = 'AIzaSyBtVgHlGmQGx5sVAuEVZHNrFINlKYVxYh0';

  const lastAccelDataRef = useRef(null);
  const lastTimeRef = useRef(null);
  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }
  const kalmanX = useRef(new KalmanFilter()).current;
  const kalmanY = useRef(new KalmanFilter()).current;
  const kalmanZ = useRef(new KalmanFilter()).current;

  useEffect(() => {
    const requestPermissions = async () => {
      const { status } = await requestPermission();
      if (status !== 'granted') {
        Alert.alert('Camera permission not granted');
        return;
      }

      if (Platform.OS === 'android') {
        const { status: camera } = await Camera.requestCameraPermissionsAsync();
        const { status: audioStatus } = await Camera.requestMicrophonePermissionsAsync();
        if (audioStatus !== 'granted' || camera !== 'granted') {
          Alert.alert('Camera or Microphone permission not granted');
          return;
        }
      }

      if (Platform.OS === 'ios') {
        const { status: mediaStatus } = await MediaLibrary.requestPermissionsAsync();
        if (mediaStatus !== 'granted') {
          Alert.alert('Media Library permission not granted');
          return;
        }
      }

      setHasPermission(true);
    };

    requestPermissions();
  }, []);

  const verifyInclination = accelerometerData => {
    try {
      const { x, y, z } = accelerometerData;

      const isUpright =
        x >= inclinacao.x - inclinacao.tolerance &&
        x <= inclinacao.x + inclinacao.tolerance &&
        y >= inclinacao.y - inclinacao.tolerance &&
        y <= inclinacao.y + inclinacao.tolerance &&
        z >= inclinacao.z - inclinacao.tolerance &&
        z <= inclinacao.z + inclinacao.tolerance;

      console.log(isUpright ? 'Em Pé' : 'Deitado');

      if (z > 0.8) {
        console.log('Tela para baixo');
      } else if (z < -0.8) {
        console.log('Tela para cima');
      }
    } catch (error) {
      console.error('Error verifying inclination:', error);
    }
  };
  useEffect(() => {
    let lastUpdateTime = Date.now();

    const subscription = Accelerometer.addListener(accelerometerData => {
      let { x, y, z } = accelerometerData;

      x = kalmanX.filter(x);
      y = kalmanY.filter(y);
      z = kalmanZ.filter(z);

      const currentTime = Date.now();
      const deltaTime = (currentTime - lastUpdateTime) / 1000;
      lastUpdateTime = currentTime;

      const currentAcceleration = Math.sqrt(x * x + y * y + z * z);

      setSpeed(prevSpeed => prevSpeed + currentAcceleration * deltaTime);
    });

    Accelerometer.setUpdateInterval(1000);

    return () => {
      subscription && subscription.remove();
    };
  }, []);

  useEffect(() => {
    const accelerometerSubscription = Accelerometer.addListener(accelerometerData => {
      verifyInclination(accelerometerData);

      const filteredX = kalmanX.filter(accelerometerData.x);
      const filteredY = kalmanY.filter(accelerometerData.y);
      const filteredZ = kalmanZ.filter(accelerometerData.z);

      const currentSpeed = Math.sqrt(filteredX ** 2 + filteredY ** 2 + filteredZ ** 2);

      setSpeed(currentSpeed);
    });

    return () => {
      accelerometerSubscription && accelerometerSubscription.remove();
    };
  }, [inclinacao]);

  useEffect(() => {
    let locationSubscription;

    const initializeLocationSubscription = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission to access location was denied');
          return;
        }

        locationSubscription = await Location.watchPositionAsync(
          { accuracy: Location.Accuracy.BestForNavigation, timeInterval: 1000, distanceInterval: 1 },
          async location => {
            const { latitude, longitude } = location.coords;
            const altitude = await getAltitude(latitude, longitude);

            if (currentPosition) {
              const newDistance = calculateDistance(
                currentPosition.latitude,
                currentPosition.longitude,
                latitude,
                longitude,
              );
              setDistance(prevDistance => prevDistance + newDistance);
            }

            setCurrentPosition({ latitude, longitude });
            setLatitude(latitude);
            setLongitude(longitude);
            setElevation(altitude);

            setDataPoints(prevDataPoints => [
              ...prevDataPoints,
              {
                speed,
                elevation: altitude,
                videoTime: recordTime,
                distance,
              },
            ]);
          },
        );
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
  }, [recordTime, isRecording]);

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
    setDistance(0);
    setSpeed(0);
    setCurrentPosition(null);
    if (cameraRef.current) {
      try {
        const videoRecordPromise = cameraRef.current.recordAsync({
          maxDuration: 1800,
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
          setUploadProgress(progress / 100);
        },
        error => {
          console.log('Error uploading video:', error);
          setUploadProgress(0);
        },
        () => {
          setUploadProgress(0);
        },
      );
      await uploadTask;
      const videoURL = await getDownloadURL(storageRef);
      return videoURL;
    } catch (error) {
      console.log('Error uploading video to Firebase:', error);
      setUploadProgress(0);
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
        type: typeVideo,
        location: { cityName, latitude, longitude },
        status,
        dataPoints,
      });
    } catch (error) {
      console.log('Error adding video to Firestore:', error);
    }
  };

  const getAltitude = async (latitude, longitude) => {
    const API_KEY = MY_API_KEY;
    try {
      const response = await axios.get(`https://maps.googleapis.com/maps/api/elevation/json`, {
        params: {
          locations: `${latitude},${longitude}`,
          key: API_KEY,
        },
      });
      const altitude = response.data.results[0]?.elevation || 0;
      setElevation(altitude);
      return altitude;
    } catch (error) {
      console.error('Error fetching altitude:', error);
      return null || 0;
    }
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c * 1000;
  };

  const handleModalClose = () => {
    setShowModal(false);
    setDescription('');
    setTypeVideo(null);
    setStatus('Public');
    setVideoUri(null);
  };

  if (hasPermission === null) {
    return <View />;
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text>Permission not granted</Text>
        <Button label="Grant Permission" onPress={requestPermission} />
      </View>
    );
  }
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
        <View style={styles.recordButtonContainer}>
          <TouchableOpacity
            style={[styles.recordButton, { backgroundColor: isRecording ? 'red' : 'white' }]}
            onPress={isRecording ? stopRecording : startRecording}
            disabled={uploadProgress > 0 && uploadProgress < 100}
          ></TouchableOpacity>
        </View>
        {isRecording && (
          <View style={styles.timerContainer}>
            <Text style={styles.timerText}>{formatTime(recordTime)}</Text>
          </View>
        )}
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>Speed: {speed.toFixed(2)} m/s</Text>
          <Text style={styles.infoText}>Distance: {distance.toFixed(2)} meters</Text>
          <Text style={styles.infoText}>Latitude: {latitude}</Text>
          <Text style={styles.infoText}>Longitude: {longitude}</Text>
          <Text style={styles.infoText}>Elevation: {elevation.toFixed(3) ? elevation.toFixed(3) : 'A aguardar'}</Text>
          <Text style={styles.infoText}>Time: {formatTime(recordTime)}</Text>
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
                label="Descrição"
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
                  handleModalClose();
                  addVideo(videoUri);
                }}
                label="Concluir"
                style={styles.button}
              />
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </CameraView>
      {uploadProgress > 0 && uploadProgress < 100 && (
        <View style={styles.progressContainer}>
          <ProgressBar progress={uploadProgress} color="#581DB9" style={styles.progress} />
          <Text style={styles.progressText}>{Math.round(uploadProgress * 100)}%</Text>
        </View>
      )}
    </View>
  );
};
