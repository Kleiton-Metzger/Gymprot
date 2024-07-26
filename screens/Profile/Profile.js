import React from 'react';
import { View, Text, TouchableOpacity, Image, SafeAreaView, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Avatar, ActivityIndicator } from 'react-native-paper';
import { useAuth } from '../../Hooks/useAuth';
import { Octicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { styles } from './ProfStyle';

export const Profile = () => {
  const navigation = useNavigation();
  const { currentUser, signOut } = useAuth();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity activeOpacity={0.7} onPress={() => navigation.navigate('NotificationaScreen')}>
          <Octicons name="bell" size={24} color="#581DB9" style={styles.notifyIcon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('ConfigurationsScreen')} activeOpacity={0.7}>
          <MaterialCommunityIcons name="cog-outline" size={27} color="#581DB9" style={styles.defyIcon} />
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
            <View style={styles.userFollow}>
              <View style={styles.seguidoresContainer}>
                <TouchableOpacity activeOpacity={0.7} onPress={() => navigation.navigate('FollowListScreen')}>
                  <Text style={styles.segdrTxt}>Seguidores</Text>
                  <Text style={styles.segdrNum}>{currentUser.seguidores ? currentUser.seguidores.length : 0}</Text>
                </TouchableOpacity>
              </View>
              <View>
                <TouchableOpacity activeOpacity={0.7} onPress={() => navigation.navigate('FollowListScreen')}>
                  <Text style={styles.segdrTxt}>Seguindo</Text>
                  <Text style={styles.segdrNum}>{currentUser.seguindo ? currentUser.seguindo.length : 0}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.statsContainer}>
          <Text style={styles.statsTitle}>Meus Status</Text>
          <View style={styles.statsContent}>
            <Text style={styles.stat}>0 Atividades</Text>
            <Text style={styles.stat}>0 segundos</Text>
            <Text style={styles.stat}>0 km</Text>
          </View>
        </View>

        <View style={styles.achievementsContainer}>
          <Text style={styles.achievementsTitle}>Desafios Concluídos</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
