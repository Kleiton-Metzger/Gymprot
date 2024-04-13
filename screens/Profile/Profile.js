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
      <TouchableOpacity
        style={styles.editContainer}
        onPress={() => navigation.navigate('EditProfileScreen')}
        activeOpacity={0.9}
      >
        <Text>Editar</Text>
        <FontAwesome5 name="edit" size={24} color="black" />
      </TouchableOpacity>
      <View style={styles.userInfoContainer}>
        <View style={styles.avatarContainer}>
          <Avatar.Image
            style={{ backgroundColor: 'gray', marginBottom: 10 }}
            size={120}
            source={currentUser?.avatar ? { uri: currentUser.avatar } : require('../../assets/avatar.png')}
          />
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.name}>{currentUser?.name}</Text>
          <Text style={styles.email}>{currentUser?.email}</Text>
        </View>
      </View>
      <View style={styles.infoContainerSeg}>
        <View style={styles.allinfoContainer}>
          <Text style={styles.infoSeguidr}>Seguidores</Text>
          <Text style={styles.txtSeguidr}>110</Text>
          <Text style={styles.divider}>|</Text>
          <Text style={styles.infoSeguind}>Seguindo</Text>
          <Text style={styles.txtSeguind}>11</Text>
          <View style={styles.dadoGraf}>
            <Text style={styles.dadsInfo}>Publicações</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const UserData = ({ label, value }) => (
  <View style={styles.userData}>
    <Text style={styles.userDataLabel}>{label}:</Text>
    <Text style={styles.userDataValue}>{value}</Text>
  </View>
);
