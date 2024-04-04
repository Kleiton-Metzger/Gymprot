import React, { useEffect, useState, useRef } from "react";
import { View, Text, TouchableOpacity, Platform, } from "react-native";
import { Camera } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import { StyleSheet } from "react-native-web";
import { getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage';
import { app, db, auth } from "../../storage/Firebase";
import { v4 as uuidv4 } from 'uuid';
import { Accelerometer } from 'expo-sensors';
import * as Location from 'expo-location'; 
import { doc, setDoc, onSnapshot } from "firebase/firestore";
import { Modal, Portal, Provider, Dialog,RadioButton,ProgressBar, MD3Colors } from 'react-native-paper';
import { Input, Button,  } from '../../components'


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
const [uploadProgress, setUploadProgress] = useState(0); // State to track upload progress

  const cameraRef = useRef(null);
  const timerRef = useRef(null); 
  const containerStyle = {
   backgroundColor: 'white',
   padding: "5%",
   margin: "5%",
   borderRadius: 10,
   height: "90%"
    };

  const calculateSpeed = accelerometerData => {
    const { x, y, z } = accelerometerData; 
    const newSpeed = Math.sqrt(x * x + y * y + z * z); 
    return newSpeed;
  };

  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, 'users', auth.currentUser.uid), (docSnap) => {
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

      const locationSubscription = Location.watchPositionAsync(
        { accuracy: Location.Accuracy.High },
        location => {
          setElevation(location.coords.altitude);
        }
      );

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
    return `${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}:${remainingSeconds < 10 ? '0' + remainingSeconds : remainingSeconds}`;
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
      const uploadTask = await uploadBytesResumable(storageRef, blob);       
      const videoURL = await getDownloadURL(storageRef);
      return videoURL;
    } catch (error) {
      console.log('Error uploading video to Firebase:', error);
    }
  }

  const addVideo = async (uri) => {
    const videoURL = await uploadVideoToFirebase(uri);

    const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
    const { latitude, longitude } = location.coords;

    try {
        const geocode = await Location.reverseGeocodeAsync({ latitude, longitude });
        const cityName = geocode[0].city;

        await setDoc(doc(db, "videos", uuidv4()), {
            id: uuidv4(),
            videoURL,
            description,
            createBy: userData.userId,
            createAt: new Date().toISOString(),
            location: {cityName , latitude, longitude},
            speed,
            elevation,
            type: typeVideo, 
            status,
        });
    } catch (error) {
        console.log('Error adding video to Firestore:', error);
    }
  };

  return (
    <Provider>
      <View style={styles.container}>
        <Camera style={styles.camera} type={type} ref={cameraRef}>
          <TouchableOpacity
            style={[styles.recordButton, { backgroundColor: isRecording ? 'red' : 'white' }]}
            onPress={isRecording ? stopRecording : startRecording} />
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
        <Portal>
          <Modal visible={showModal} onDismiss={() => setShowModal(false)} contentContainerStyle={styles.modalContainer}>
            <Text style={styles.modalTitle}>Informações do Vídeo</Text>
            <Text style={styles.modalSubtitle}>Adicione informações adicionais ao vídeo</Text>
            <Input
              mode='outlined'
              label='Descrição'
              color='#581DB9'
              value={description}
              onChangeText={setDescription}
              style={styles.input}
              placeholder='Adicione uma descrição ao seu vídeo'
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
            <Button onPress={() => { addVideo(videoUri); setShowModal(false); }} label="Concluir" style={styles.button} />
          </Modal>
        </Portal>
      </View>
    </Provider>
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
    bottom: 80,
    alignSelf: 'center',
    alignItems: 'center',
    height: 80,
    width: 80,
    borderRadius: 35, 
    bordercolor: 'black',
    borderWidth: 3,
  },
  timerContainer: {
    position: 'absolute',
    top: "5%",
    alignSelf: 'center',
    backgroundColor: 'red',
    padding: 5,
    borderRadius: 10,
  },
  timerText: {
    fontSize: 18,
    color: 'white',
  },
  infoContainer: {
    position: 'absolute', 
    top: "10%",
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
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 10,
    height: '90%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 15,
    textAlign: 'center',
    color: 'gray',
    marginBottom: 10,
  },
  modalLabel: {
    fontSize: 15,
    color: 'black',
    fontWeight: 'bold',
    marginTop: 10,
  },
  input: {
    marginVertical: 10,
  },
  button: {
    marginVertical: 10,
    paddingVertical: 10,
    backgroundColor: '#581DB9',
    borderRadius: 10,
    alignItems: 'center',
  }
   
});
