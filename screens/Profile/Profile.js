import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Avatar, ActivityIndicator } from 'react-native-paper';
import { useAuth } from '../../Hooks/useAuth';
import { Button } from '../../components';
import { getUSerSex } from '../../utils/gender';
import { styles } from './ProfStyle';
import { FontAwesome5 } from '@expo/vector-icons';

export const Profile = () => {
  const navigation = useNavigation();
  const { currentUser, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigation.replace('Login');
    } catch (error) {
      console.log('Error signing out:', error.message);
    }
  };

  if (!currentUser) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.editContainer} onPress={() => navigation.navigate('EditProfileScreen')}>
        <FontAwesome5 name="edit" size={24} color="black" />
      </TouchableOpacity>

      {/*{currentUser?.avatar ? (
        <Avatar.Image size={150} source={{ uri: currentUser.avatar }} />
      ) : (
        <Avatar.Image size={150} source={require('../../assets/avatar.png')} />
      )}*/}

      <Avatar.Image
        style={{ backgroundColor: 'gray' }}
        size={150}
        source={currentUser?.avatar ? { uri: currentUser.avatar } : require('../../assets/avatar.png')}
      />
      {currentUser && (
        <View style={styles.userDataContainer}>
          <UserData label="Nome" value={currentUser.name} />
          <UserData label="Email" value={currentUser.email} />
          <UserData label="Idade" value={currentUser.age} />
          <UserData label="Sexo" value={getUSerSex(currentUser.gender)} />
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
