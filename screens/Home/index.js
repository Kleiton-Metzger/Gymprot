import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, FlatList, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { collection, onSnapshot, doc, getDoc, where, query } from 'firebase/firestore';
import { db } from '../../storage/Firebase';
import { Video } from 'expo-av';
import styles from './styles';
import { useAuth } from '../../Hooks/useAuth';

export const HomeScreen = () => {
  const [searchPhrase, setSearchPhrase] = useState('');
  const [videos, setVideos] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchUserVideos = async () => {
      const q = query(collection(db, 'videos'), where('status', '==', 'Public'));

      const unsubscribeVideos = onSnapshot(q, async querySnapshot => {
        let fetchedVideos = [];
        querySnapshot.forEach(doc => {
          const videoData = doc.data();
          fetchedVideos.push({ id: doc.id, ...videoData });
        });
        console.log(fetchedVideos?.length);
        setVideos(fetchedVideos);
      });
      return () => unsubscribeVideos();
    };

    fetchUserVideos();
  }, []);

  let filteredVideos = videos;
  return (
    <View style={styles.container}>
      <Text style={styles.locationTxt}>{`Olá, ${currentUser?.name}`} </Text>
      <View style={styles.searchBar}>
        <Feather name="search" size={20} color="black" style={styles.searchIcon} />
        <TextInput
          style={styles.input}
          placeholder="Pesquisar por localização"
          value={searchPhrase}
          onChangeText={setSearchPhrase}
        />
        {searchPhrase ? (
          <TouchableOpacity style={styles.cancelButton} onPress={() => setSearchPhrase('')}>
            <Text style={styles.cancelText}>Cancelar</Text>
          </TouchableOpacity>
        ) : null}
      </View>
      <FlatList
        data={filteredVideos}
        renderItem={({ item }) => {
          console.log(item?.creatorInfo?.avatar);

          return (
            <View style={styles.infoContainer}>
              <UserInfo
                userName={item?.creatorInfo?.name || ''}
                location={item.location?.cityName || ''}
                tipo={item.type}
                creatorAvatar={item?.creatorInfo?.avatar}
              />
              <VideoItem video={item.videoURL} />
            </View>
          );
        }}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.videoGridContainer}
        removeClippedSubviews={true}
        ListEmptyComponent={() => <Text style={styles.emptyText}>Nenhum vídeo encontrado nesta localização</Text>}
      />
    </View>
  );
};

const UserInfo = ({ userName, location, tipo, creatorAvatar }) => (
  <View style={styles.userInfoContainer}>
    {creatorAvatar && (
      <Image
        style={styles.avatar}
        size={150}
        source={creatorAvatar ? { uri: creatorAvatar } : require('../../assets/avatar.png')}
      />
    )}

    <View style={styles.userInfoTextContainer}>
      <Text style={styles.userName}>{userName}</Text>
      <View style={styles.locationContainer}>
        <Feather name="map-pin" size={15} color="black" style={styles.locationIcon} />
        <Text style={styles.location}>{location}</Text>
      </View>
      <Text style={styles.tipo}>Tipo: {tipo}</Text>
    </View>
  </View>
);

const VideoItem = ({ video }) => (
  <TouchableOpacity style={styles.videoItem}>
    <Video style={styles.video} source={{ uri: video }} useNativeControls resizeMode="contain" />
  </TouchableOpacity>
);
