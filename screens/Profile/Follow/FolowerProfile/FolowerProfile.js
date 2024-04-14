import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { FontAwesome5, Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from './style';
import { SeguirBTN } from '../../../../components';
import { Video } from 'expo-av';

export const FolowerProfile = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { userName, creatorAvatar, userBio } = route.params;
  const [videos, setVideos] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [notFollowing, setNotFollowing] = useState(true);

  const handleback = () => {
    navigation.goBack();
  };

  const handleSeguir = () => {
    console.log('Seguir');
    setIsFollowing(!isFollowing);
    setNotFollowing(!notFollowing);
  };

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.bckButton} onPress={handleback}>
            <Feather name="arrow-left" size={30} color="black" />
          </TouchableOpacity>
          <Text style={styles.title}>Perfil</Text>
        </View>
        <View style={styles.profileContainer}>
          <Image source={{ uri: creatorAvatar }} style={styles.avatar} />
          <Text style={styles.userName}>{userName}</Text>
          <View style={styles.userFollow}>
            <View style={styles.seguidoresContainer}>
              <Text style={styles.segdrTxt}> Seguidores</Text>
              <Text style={styles.segdrNum}> 10</Text>
            </View>
            <View style={styles.buttonContainer}>
              <SeguirBTN
                label={isFollowing ? 'Seguindo' : 'Seguir'}
                isFollowing={isFollowing}
                notFollowing={notFollowing}
                onPress={handleSeguir}
              />
            </View>
            <View>
              <Text style={styles.segdrTxt}> Seguindo</Text>
              <Text style={styles.segdrNum}> 110</Text>
            </View>
          </View>
        </View>
        <View style={styles.bioContainer}>
          <Text style={styles.bioText}>{userBio}</Text>
        </View>
        <View style={styles.bodyContainer}>
          <Text style={styles.bodyTitle}>Body</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};
