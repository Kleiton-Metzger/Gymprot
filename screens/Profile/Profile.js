import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { doc, onSnapshot } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { db, auth } from '../../storage/Firebase';
import {Button } from '../../components'
import { getUSerSex } from '../../utils';
import { Avatar } from 'react-native-paper';

export const Profile = () => {
  const navigation = useNavigation();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const cachedUserData = await AsyncStorage.getItem('userData');
        if (cachedUserData) {
          setUserData(JSON.parse(cachedUserData));
        }
      } catch (error) {
        console.error('Error loading user data from cache:', error);
      }
    };

    loadUserData();

    const unsubscribe = onSnapshot(doc(db, 'users', auth.currentUser.uid), (docSnap) => {
      if (docSnap.exists()) {
        const userData = docSnap.data();
        setUserData(userData);
        // Salvar os dados do usuário em cache
        AsyncStorage.setItem('userData', JSON.stringify(userData));
      } else {
        console.log('No such document!');
      }
    });

    // Clean up the listener when the component unmounts
    return () => unsubscribe();
    
  }, []);



  useEffect(() => {
    if (userData) {
    }
  }, [userData]);



  const handleSignOut = () => {
    auth
      .signOut()
      .then(() => {
        navigation.replace('Login');
      })
      .catch(error => alert(error.message));
  };

  const handleMenuPress = () => {
    navigation.navigate('EditProfileScreen');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.editContainer} onPress={handleMenuPress}>
        <Image source={require('../../assets/edit.png')} style={styles.editIcon} />
      </TouchableOpacity>
     
      
       {userData && userData.photoURL ?
        (<Avatar.Image size={150} source={{ uri: userData.photoURL }} /> ) :
        ( <Avatar.Image size={150} source={require('../../assets/avatar.png')} />)}
       

      {userData && (
        <View style={styles.userDataContainer}>
          <UserData label="Nome" value={userData.name} />
          <UserData label="Email" value={userData.email} />
          <UserData label="Idade" value={userData.age} />
          <UserData label="Sexo" value={getUSerSex(userData.gender)} />
        </View>
        
      )}

      <Button onPress={handleSignOut} label="Logout" style={styles.buttonContainer} />  
    </View>
  );
};

const UserData = ({ label, value }) => (
  <View style={styles.userData}>
    <Text style={styles.userDataLabel}>{label}:</Text>
    <Text style={styles.userDataValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  editContainer: {
    position: 'absolute',
    top: 50,
    right: 20,
  },
  editIcon: {
    width: 30,
    height: 30,
  },
  deltContainer: {
    position: 'absolute',
    top: 50,
    left: 20,
  },
  dltText: {
    color: 'red',
    fontSize: 15,
  },
  buttonContainer: {
    backgroundColor: 'rgba(88, 29, 185, 1)',
    padding: 10,
    width: '40%',
    alignItems: 'center',
    borderRadius: 5,
    marginVertical: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 15,
  },
  userDataContainer: {
    alignItems: 'center',
    padding: 20,
  },
  userData: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  userDataLabel: {
    fontSize: 16,
    marginRight: 5,
    color: 'black',
    fontWeight: 'bold',
  },
  userDataValue: {
    fontSize: 16,
    color: 'black',
  },
});
