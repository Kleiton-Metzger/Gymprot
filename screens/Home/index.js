import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, FlatList, Alert } from 'react-native';
import { Feather } from "@expo/vector-icons";
import { collection, onSnapshot, doc, getDoc } from 'firebase/firestore';
import { db } from '../../storage/Firebase';
import styles  from './styles';
import VideoPlayer from 'react-native-video-player';

export const HomeScreen = () => {
  const [searchPhrase, setSearchPhrase] = useState('');
  const [videos, setVideos] = useState([]);
  const [filteredVideos, setFilteredVideos] = useState([]);
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const unsubscribeVideos = onSnapshot(collection(db, 'videos'), (querySnapshot) => {
      const fetchedVideos = [];
      querySnapshot.forEach((doc) => {
        const videoData = doc.data();
        fetchedVideos.push({ id: doc.id, ...videoData });
      });
      setVideos(fetchedVideos);
    });
    return () => unsubscribeVideos();
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      const userIds = new Set(videos.map(video => video.createBy));
      const usersData = {};
      for (const userId of userIds) {
        const userDoc = await getDoc(doc(db, 'users', userId));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          usersData[userId] = { name: userData.name, avatar: userData.photoURL };
        } else {
          usersData[userId] = { name: '', avatar: null };
        }
      }

      const videosWithUserData = videos.map(video => ({
        ...video,
        creatorName: usersData[video.createBy].name,
        creatorAvatar: usersData[video.createBy].avatar,
      }));
      setFilteredVideos(videosWithUserData);
    };
    fetchUserData();
  }, [videos]);

  useEffect(() => {
    // Aplica filtro de pesquisa quando o texto de pesquisa muda
    const filtered = videos.filter(video => 
      video.location?.cityName?.toLowerCase().includes(searchPhrase.toLowerCase()) 
    );
    setSearchResults(filtered);
  }, [searchPhrase, videos]);

  const handleVideoClick = (id, title) => {
    Alert.alert('Video Clicked', `Video ID: ${id}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.locationTxt}>Localização</Text>
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
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        ) : null}
      </View>
      <FlatList
        data={searchPhrase ? searchResults : filteredVideos.filter(video => video.status === "Public")}
        renderItem={({ item }) => (
          <View style={styles.infoContainer}>
            <UserInfo
              userName={item.creatorName}
              location={item.location?.cityName || ''}
              tipo={item.type}
              creatorAvatar={item.creatorAvatar}
            />
            <VideoItem item={item} onPress={() => handleVideoClick(item.id, item.title)} />
          </View>
        )}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.videoGridContainer}
        removeClippedSubviews={true}
        ListEmptyComponent={() => (
          <Text style={styles.emptyText}>Nenhum video encontrado nesta localização</Text>
        )}
      />
    </View>
  );
};

const UserInfo = ({ userName, location, tipo, creatorAvatar }) => (
  <View style={styles.userInfoContainer}>
    {creatorAvatar && <Image source={{ uri: creatorAvatar }} style={styles.avatar} />}
    <View style={styles.userInfoTextContainer}>
      <Text style={styles.userName}>{userName}</Text>
      <View style={styles.locationContainer}>
        <Feather name="map-pin" size={15} color="black" style={styles.locationIcon} />
        <Text style={styles.location}>Localização: {location}</Text>
      </View>
      <Text style={styles.tipo}>Tipo: {tipo}</Text>
    </View>
  </View>
);


const VideoItem = ({ item, onPress }) => (
  <TouchableOpacity onPress={onPress}>
    <View style={styles.videoItem}>
      <Text style={styles.title}>{item.title}</Text>
      <FlatList
        data={item.relatedVideos}
        renderItem={({ item }) => (
          <Text style={styles.relatedVideo}>{item.title}</Text>
        )}
        keyExtractor={item => item.id.toString()}
        horizontal={true}
        contentContainerStyle={styles.relatedVideosContainer}
      />
    </View>
  </TouchableOpacity>
);

