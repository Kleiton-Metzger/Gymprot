import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { FontAwesome5 } from '@expo/vector-icons';
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
    setIsFollowing(!isFollowing);
    setNotFollowing(!notFollowing);
  };

  const VideoItem = ({ video }) => (
    <View style={styles.videosContainer}>
      <TouchableOpacity style={styles.videoItem} activeOpacity={0.8}>
        <Video style={styles.video} source={{ uri: video }} useNativeControls isLooping resizeMode="cover" />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleback}>
            <Text style={styles.hometxt}>Home</Text>
            <FontAwesome5 style={styles.bckButton} name="arrow-left" size={24} color="black" />
          </TouchableOpacity>
        </View>
        <View style={styles.body}>
          <View style={styles.avatarContainer}>
            <Image
              source={creatorAvatar ? { uri: creatorAvatar } : require('../../../../assets/avatar.png')}
              style={styles.avatar}
            />
            <Text style={styles.name}>{userName}</Text>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.infoSeguidr}>Seguidores: 0</Text>
            <Text style={styles.infoSeguind}>Seguindo: 0</Text>
          </View>

          <View style={styles.btnContainer}>
            <SeguirBTN
              label={isFollowing ? 'Seguir' : 'Seguindo'}
              isFollowing={isFollowing}
              notFollowing={notFollowing}
              onPress={handleSeguir}
            />
          </View>
          <View style={styles.bioContainer}>
            <Text style={styles.bioHeader}>Bio:</Text>
            <Text style={styles.bioText}>{userBio}</Text>
          </View>
          <View style={styles.videosContainer}>
            {videos.map((video, index) => (
              <VideoItem key={index} video={video} />
            ))}

            <Text style={styles.emptyText}>Nenhum vídeo encontrado para este User</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};
