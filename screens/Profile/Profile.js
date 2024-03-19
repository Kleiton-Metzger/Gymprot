import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { doc, onSnapshot } from 'firebase/firestore';
import { db, auth } from '../../storage/Firebase';

export default function Profile() {
  const navigation = useNavigation();
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

  const handleSignOut = () => {
    auth
      .signOut()
      .then(() => {
        navigation.replace('Login');
        console.log('User signed out!');
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

      <TouchableOpacity onPress={handleMenuPress}>
        <Image source={userData?.photoURL ? { uri: userData.photoURL } : require('../../assets/avatar.jpg')} style={styles.avatar} />
      </TouchableOpacity>

      {userData && (
        <View style={styles.userDataContainer}>
          <UserData label="Nome" value={userData.name} />
          <UserData label="Email" value={userData.email} />
          <UserData label="Idade" value={userData.age} />
          <UserData label="Peso" value={userData.weight} />
          <UserData label="Altura" value={userData.height} />
          <UserData label="Genero" value={userData.gender} />
        </View>
      )}

      <TouchableOpacity style={styles.buttonContainer} onPress={handleSignOut}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
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
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
    borderColor: 'black',
    borderWidth: 1,
  },
  buttonContainer: {
    backgroundColor: 'rgba(88, 29, 185, 1)',
    padding: 10,
    width: '40%',
    alignItems: 'center',
    borderRadius: 25,
    marginVertical: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 15,
  },
  userDataContainer: {
    alignItems: 'center',
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
