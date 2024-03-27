import React, { useEffect, useState, useRef } from "react";
import { View, Text, TouchableOpacity, Platform } from "react-native";
import { Camera } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import { StyleSheet } from "react-native-web";
import { getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage';
import { app, db,auth } from "../../storage/Firebase";
import { v4 as uuidv4 } from 'uuid';
import { Accelerometer } from 'expo-sensors';
import * as Location from 'expo-location'; 
import { doc, setDoc,onSnapshot } from "firebase/firestore";


export const CameraScreen = ({}) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [type] = useState(Camera.Constants.Type.back);
  const [isRecording, setIsRecording] = useState(false);
  const [VideoUri, setVideoUri] = useState(null);
  const [recordTime, setRecordTime] = useState(0);
  const [speed, setSpeed] = useState(0);
  const [elevation, setElevation] = useState(null); 
  const [isMoving, setIsMoving] = useState(false); 
  const cameraRef = useRef(null);
  const timerRef = useRef(null);
   
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
        console.log('User Data:', userData);
        setUserData(userData);
      } else {
        console.log('No such document!');
      }
    });

    // Clean up the listener when the component unmounts
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
    // Subscribe to accelerometer updates
    const subscription = Accelerometer.addListener(accelerometerData => {
      // Calculate speed based on accelerometer data
      const newSpeed = calculateSpeed(accelerometerData); //
      setSpeed(newSpeed); 
      setIsMoving(newSpeed > 0.1); // Set isMoving to true if speed is greater than 0.1 m/s
    });

    return () => {
      subscription.remove(); // Unsubscribe from accelerometer updates
    };
  }, []);

  useEffect(() => {
    (async () => {
      // Request location permissions
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.error('Location permission denied');
        return;
      }

      // Subscribe to location updates
      const locationSubscription = Location.watchPositionAsync(
        { accuracy: Location.Accuracy.High },
        location => {
          setElevation(location.coords.altitude); // Update elevation state
        }
      );

      return () => {
        locationSubscription.remove(); // Unsubscribe from location updates
      };
    })();
  }, []);
  

  const uuidKey=uuidv4();

const addVideo= async (uri) => {
  try {
    // Upload video to Firebase Storage
    const videoURL = await uploadVideoToFirebase(uri);

    // Get current location
    const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
    const { latitude, longitude } = location.coords;

    // Reverse geocode to get city name
    const geocode = await Location.reverseGeocodeAsync({ latitude, longitude });
    const cityName = geocode[0].city;
    await setDoc(doc(db, "videos", uuidv4()), {
      id: uuidv4(),
      videoURL,
      createBy: userData.userId,
      createAt: new Date().toISOString(),
      location: { cityName, latitude, longitude },
      speed,
      elevation,
    });
  } catch (error) {
    console.log('Error adding video to Firestore:', error);
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
        addVideo(data.uri);        
        //  uploadVideoToFirebase(data.uri);
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
      setSpeed(0); 
    }
  }

  
  const storage = getStorage(app);

  async function uploadVideoToFirebase(uri) {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const storageRef = ref(storage, `Videos/${uuidv4()}.mp4`);
      const uploadTask =await uploadBytesResumable(storageRef, blob);       
          const videoURL =  getDownloadURL(storageRef);


      return videoURL;
    } catch (error) {
      console.log('Error uploading video to Firebase:', error);
    }
  }



  return (
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
  iconcam: {
    color: '#161924', 
    position: 'absolute',   
    right: 0,
    padding: 15,
    top: 10,
    fontSize: 40,
  }
});
