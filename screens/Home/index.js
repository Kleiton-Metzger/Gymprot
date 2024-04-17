import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, FlatList, SafeAreaView, Dimensions } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../../storage/Firebase';
import { Video } from 'expo-av';
import { useAuth } from '../../Hooks/useAuth';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Searchbar } from 'react-native-paper';
import styles from './styles';

const { width, height } = Dimensions.get('window');

export const HomeScreen = () => {
  const navigation = useNavigation();
  const [searchPhrase, setSearchPhrase] = useState('');
  const [videos, setVideos] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const { currentUser } = useAuth();
  const [categoria, setCategoria] = useState('');
  const [localizacao, setLocalizacao] = useState(''); // Adicionando estado para localização

  useEffect(() => {
    const fetchUserVideos = async () => {
      let q = collection(db, 'videos');
      q = query(q, where('status', '==', 'Public'));

      // Aplicando filtro da categoria
      if (categoria !== '') {
        q = query(q, where('type', '==', categoria));
      }

      // Aplicando filtro da localização
      if (localizacao !== '') {
        q = query(q, where('location.cityName', '==', localizacao));
      }

      const unsubscribeVideos = onSnapshot(q, async querySnapshot => {
        let fetchedVideos = [];
        querySnapshot.forEach(doc => {
          const videoData = doc.data();
          if (videoData.createBy !== currentUser?.userId) {
            fetchedVideos.push({ id: doc.id, ...videoData });
          }
        });
        setVideos(fetchedVideos);
      });

      return () => unsubscribeVideos();
    };

    fetchUserVideos();
  }, [categoria, localizacao, currentUser]);

  // Atualizando a localização digitada no Searchbar
  const handleSearch = text => {
    setSearchPhrase(text);
    setLocalizacao(text); // Atualizando o estado da localização ao digitar na barra de pesquisa
  };

  let filteredVideos = [...videos];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity onPress={() => navigation.navigate('Profile')} activeOpacity={0.8}>
            <Image
              source={currentUser?.avatar ? { uri: currentUser.avatar } : require('../../assets/avatar.png')}
              style={styles.uavatar}
            />
          </TouchableOpacity>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity
            onPress={() => setCategoria(categoria === 'Walking' ? '' : 'Walking')}
            style={{ marginRight: 5 }}
          >
            <MaterialCommunityIcons
              name="walk"
              style={styles.filterIcon}
              size={27}
              color={categoria === 'Walking' ? '#581DB9' : 'gray'}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setCategoria(categoria === 'Running' ? '' : 'Running')}
            style={{ marginRight: 5 }}
          >
            <MaterialCommunityIcons
              name="run-fast"
              style={styles.filterIcon}
              size={27}
              color={categoria === 'Running' ? '#581DB9' : 'gray'}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setCategoria(categoria === 'Cycling' ? '' : 'Cycling')}
            style={{ marginRight: 5 }}
          >
            <MaterialCommunityIcons
              name="bike"
              style={styles.filterIcon}
              size={27}
              color={categoria === 'Cycling' ? '#581DB9' : 'gray'}
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Localização"
          onChangeText={handleSearch}
          value={searchPhrase}
          style={styles.searchBar}
          icon={() => <Feather name="search" size={15} color="black" />}
          iconColor="#581DB9"
          inputStyle={{ fontSize: 15 }}
        />
      </View>

      <FlatList
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={
          <View style={{ height: 1, width: '90%', alignSelf: 'center', backgroundColor: 'lightgrey' }} />
        }
        data={searchResults.length > 0 ? searchResults : filteredVideos}
        renderItem={({ item }) => (
          <View style={styles.infoContainer}>
            <UserInfo
              userId={item?.createBy || ''}
              userName={item?.creatorInfo?.name || ''}
              location={item.location?.cityName || ''}
              tipo={item.type}
              creatorAvatar={item?.creatorInfo?.avatar}
              bio={item?.creatorInfo?.userBio}
              description={item.description}
              video={item.videoURL}
              navigation={navigation}
              currentUser={currentUser}
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

const UserInfo = ({
  userName,
  location,
  tipo,
  creatorAvatar,
  bio,
  description,
  video,
  navigation,
  userId,
  currentUser,
}) => (
  <View style={styles.userInfoContainer}>
    <TouchableOpacity
      onPress={() => {
        if (currentUser && currentUser.userId === userId) {
          navigation.navigate('Profile');
        } else {
          navigation.navigate('FolowerProfile', {
            userName: userName || '',
            creatorAvatar: creatorAvatar,
            location: location || '',
            tipo: tipo,
            userBio: bio,
            createBy: userId,
          });
        }
      }}
      activeOpacity={0.8}
    >
      {creatorAvatar && (
        <Image
          style={styles.avatar}
          size={150}
          source={creatorAvatar ? { uri: creatorAvatar } : require('../../assets/avatar.png')}
        />
      )}
    </TouchableOpacity>

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
  <TouchableOpacity style={styles.videoItem} activeOpacity={0.8}>
    <Video style={styles.video} source={{ uri: video }} useNativeControls isLooping resizeMode="cover" />
  </TouchableOpacity>
);
