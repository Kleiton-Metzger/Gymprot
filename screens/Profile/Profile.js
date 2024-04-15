import React from 'react';
import { View, Text, TouchableOpacity, Button, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Avatar, ActivityIndicator } from 'react-native-paper';
import { useAuth } from '../../Hooks/useAuth';
import { getUSerSex } from '../../utils/gender';
import { styles } from './ProfStyle';
import { MaterialCommunityIcons } from '@expo/vector-icons';

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

  console.log(currentUser);
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.editContainer}>
          <TouchableOpacity activeOpacity={0.7} onPress={() => navigation.navigate('EditProfileScreen')}>
            <MaterialCommunityIcons name="account-edit-outline" size={40} color="black" style={styles.editIcon} />
          </TouchableOpacity>
        </View>

        <View style={styles.buttonContainer}>
          <Button title="Sair" onPress={handleSignOut} color="white" />
        </View>
      </View>
      <View style={styles.userDataContainer}>
        <Image style={styles.avatar} source={{ uri: currentUser.avatar }} />
        <View style={styles.userDatas}>
          <Text style={styles.userName}>{currentUser.name}</Text>
          <Text style={styles.userEmail}>{currentUser.email}</Text>
          <View style={styles.userFollow}>
            <View style={styles.seguidoresContainer}>
              <Text style={styles.segdrTxt}> Seguidores</Text>
              <Text style={styles.segdrNum}> {currentUser.seguidores ? currentUser.seguidores.length : 0 || 0}</Text>
            </View>
            <View>
              <Text style={styles.segdrTxt}> Seguindo</Text>
              <Text style={styles.segdrNum}> {currentUser.seguindo ? currentUser.seguindo.length : 0 || 0}</Text>
            </View>
          </View>
        </View>
      </View>
      <View style={styles.bioContainer}>
        <Text style={styles.bioText}>{currentUser.bio}</Text>
      </View>
      <View style={styles.bodyContainer}>
        <Text style={styles.bodyTitle}>Body</Text>
      </View>
    </View>
  );
};
