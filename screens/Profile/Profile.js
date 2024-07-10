import React from 'react';
import { View, Text, TouchableOpacity, Button, Image, SafeAreaView, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Avatar, ActivityIndicator } from 'react-native-paper';
import { useAuth } from '../../Hooks/useAuth';
import { getUSerSex } from '../../utils/gender'; // Check if this is needed
import { styles } from './ProfStyle';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AreaChart, BarChart, Grid, LineChart, PieChart, XAxis, YAxis } from 'react-native-svg-charts';
import * as shape from 'd3-shape';
import { Octicons } from '@expo/vector-icons';

export const Profile = () => {
  const navigation = useNavigation();
  const { currentUser, signOut } = useAuth();
  const data = [50, 10, 40, 95, -4, -24, 85, 91, 35, 53, -53, 24, 50, -20, -80];
  const contentInset = { top: 20, bottom: 20 };

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
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity activeOpacity={0.7} onPress={() => navigation.navigate('EditProfileScreen')}>
          <MaterialCommunityIcons name="account-edit-outline" size={35} color="black" style={styles.editIcon} />
        </TouchableOpacity>
        <Text style={styles.perfilText}>Perfil</Text>
        <TouchableOpacity onPress={handleSignOut} activeOpacity={0.7}>
          <MaterialCommunityIcons name="logout" size={25} color="black" style={styles.logoutbtn} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.userDataContainer}>
          <Image
            style={styles.avatar}
            source={currentUser.avatar ? { uri: currentUser.avatar } : require('../../assets/avatar.png')}
          />
          <View style={styles.userDatas}>
            <Text style={styles.userName}>{currentUser.name}</Text>
            <Text style={styles.userEmail}>{currentUser.email}</Text>
            <View style={styles.userFollow}>
              <View style={styles.seguidoresContainer}>
                <Text style={styles.segdrTxt}>Seguidores</Text>
                <Text style={styles.segdrNum}>{currentUser.seguidores ? currentUser.seguidores.length : 0}</Text>
              </View>
              <View>
                <Text style={styles.segdrTxt}>Seguindo</Text>
                <Text style={styles.segdrNum}>{currentUser.seguindo ? currentUser.seguindo.length : 0}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.bioContainer}>
          <Text style={styles.bioText}>{currentUser.bio}</Text>
        </View>
        <View style={styles.separator} />

        <View style={styles.bodyContainer}>
          <Text style={styles.bodyTitle}>Body</Text>
          <View style={styles.graphContainer}></View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
