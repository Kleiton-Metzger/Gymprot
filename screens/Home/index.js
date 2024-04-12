import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  FlatList,
  Alert,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { collection, onSnapshot, doc, getDoc, where, query } from 'firebase/firestore';
import { db } from '../../storage/Firebase';
import { Video } from 'expo-av';
import styles from './styles';
import { useAuth } from '../../Hooks/useAuth';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window'); //pegar a largura e altura da tela
export const HomeScreen = () => {
  const [searchPhrase, setSearchPhrase] = useState('');
  const [videos, setVideos] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const { currentUser } = useAuth();
  const [categoria, setCategoria] = useState('');

  useEffect(() => {
    const fetchUserVideos = async () => {
      const q = query(collection(db, 'videos'), where('status', '==', 'Public'));

      const unsubscribeVideos = onSnapshot(q, async querySnapshot => {
        let fetchedVideos = [];
        querySnapshot.forEach(doc => {
          const videoData = doc.data();
          fetchedVideos.push({ id: doc.id, ...videoData });
        });
        setVideos(fetchedVideos);
      });
      return () => unsubscribeVideos();
    };

    fetchUserVideos();
  }, []);

  let filteredVideos = videos;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={styles.header}>Olá, </Text>
          <Text style={styles.userNameH}>{currentUser?.name}</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity onPress={() => setCategoria(categoria == 'walk' ? '' : 'walk')} style={{ marginRight: 5 }}>
            <MaterialCommunityIcons
              name="walk"
              style={styles.filterIcon}
              size={27}
              color={categoria === 'walk' ? '#581DB9' : 'gray'}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setCategoria(categoria == 'run' ? '' : 'run')} style={{ marginRight: 5 }}>
            <MaterialCommunityIcons
              name="run-fast"
              style={styles.filterIcon}
              size={27}
              color={categoria === 'run' ? '#581DB9' : 'gray'}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setCategoria(categoria == 'bike' ? '' : 'bike')} style={{ marginRight: 5 }}>
            <MaterialCommunityIcons
              name="bike"
              style={styles.filterIcon}
              size={27}
              color={categoria === 'bike' ? '#581DB9' : 'gray'}
            />
          </TouchableOpacity>
        </View>
      </View>
      <View style={{ marginTop: 5, borderBottomWidth: 1, borderBottomColor: 'lightgrey' }}>
        <View style={styles.searchBar}>
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
      </View>

      <FlatList
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={
          <View style={{ height: 1, width: width * 0.9, alignSelf: 'center', backgroundColor: 'lightgrey' }} />
        }
        data={filteredVideos}
        renderItem={({ item }) => (
          <View style={styles.infoContainer}>
            <UserInfo
              userName={item?.creatorInfo?.name || ''}
              location={item.location?.cityName || ''}
              tipo={item.type}
              creatorAvatar={item?.creatorInfo?.avatar}
            />
            <VideoItem video={item.videoURL} />
          </View>
        )}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.videoGridContainer}
        removeClippedSubviews={true}
        ListEmptyComponent={() => <Text style={styles.emptyText}>Nenhum vídeo encontrado nesta localização</Text>}
      />
    </SafeAreaView>
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
    <Video style={styles.video} source={{ uri: video }} useNativeControls isLooping resizeMode="cover" />
  </TouchableOpacity>
);
