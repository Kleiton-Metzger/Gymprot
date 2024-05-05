import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, FlatList, SafeAreaView, Dimensions } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { collection, onSnapshot, query, where, doc, getDoc } from 'firebase/firestore';
import { db } from '../../storage/Firebase';
import { Video } from 'expo-av';
import { useAuth } from '../../Hooks/useAuth';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Searchbar } from 'react-native-paper';
import styles from './styles';
import { DismissKeyboard } from '../../components';

const { width } = Dimensions.get('window');

export const HomeScreen = () => {
  const navigation = useNavigation();
  const [searchPhrase, setSearchPhrase] = useState('');
  const [videos, setVideos] = useState([]);
  const [originalVideos, setOriginalVideos] = useState([]);
  const { currentUser } = useAuth();
  const [categoria, setCategoria] = useState('');
  const [localizacao, setLocalizacao] = useState('');
  const [usersData, setUsersData] = useState({});

  useEffect(() => {
    const fetchUserVideos = async () => {
      let q = collection(db, 'videos');
      q = query(q, where('status', '==', 'Public'));

      if (categoria !== '') {
        q = query(q, where('type', '==', categoria));
      }

      if (localizacao !== '') {
        q = query(q, where('location.cityName', '==', localizacao));
      }

      const unsubscribeVideos = onSnapshot(q, async querySnapshot => {
        let fetchedVideos = [];
        querySnapshot.forEach(async doc => {
          const videoData = doc.data();
          if (videoData.createBy !== currentUser?.userId) {
            const userData = await getUserData(videoData.createBy);
            fetchedVideos.push({ id: doc.id, ...videoData, creatorInfo: userData });
          }
        });
        setVideos(fetchedVideos);
        setOriginalVideos(fetchedVideos);
      });

      return () => unsubscribeVideos();
    };

    fetchUserVideos();
  }, [categoria, localizacao, currentUser]);

  const getUserData = async userId => {
    if (usersData[userId]) {
      return usersData[userId];
    } else {
      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);
      const userData = userSnap.exists() ? userSnap.data() : null;
      setUsersData(prevState => ({
        ...prevState,
        [userId]: userData,
      }));
      return userData;
    }
  };

  const handleSearch = text => {
    setSearchPhrase(text);

    if (!text || text.trim() === '') {
      setVideos([...originalVideos]);
      return;
    }

    const searchText = text.toLowerCase();

    const filteredVideos = originalVideos.filter(item => {
      const location = item.location?.cityName.toLowerCase();
      return location.includes(searchText);
    });

    setVideos(filteredVideos);
  };

  return (
    <SafeAreaView style={styles.container}>
      <DismissKeyboard>
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={() => navigation.navigate('Profile')} activeOpacity={0.8}>
            <Image
              source={currentUser?.avatar ? { uri: currentUser.avatar } : require('../../assets/avatar.png')}
              style={styles.uavatar}
            />
          </TouchableOpacity>

          <View style={styles.filterIcon}>
            <FilterButton
              iconName="walk"
              categoria="Walking"
              currentCategoria={categoria}
              setCategoria={setCategoria}
            />
            <FilterButton
              iconName="run-fast"
              categoria="Running"
              currentCategoria={categoria}
              setCategoria={setCategoria}
            />
            <FilterButton
              iconName="bike"
              categoria="Cycling"
              currentCategoria={categoria}
              setCategoria={setCategoria}
            />
          </View>
        </View>
      </DismissKeyboard>

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
        ItemSeparatorComponent={() => (
          <View style={{ height: 1, width: '90%', alignSelf: 'center', backgroundColor: 'lightgrey' }} />
        )}
        data={videos}
        renderItem={({ item }) => (
          <View style={styles.infoContainer}>
            <UserInfo
              userName={item?.creatorInfo?.name || ''}
              location={item.location?.cityName || ''}
              tipo={item.type}
              creatorAvatar={item?.creatorInfo?.avatar}
              navigation={navigation}
              currentUser={currentUser}
              userId={item.createBy}
              bio={item?.creatorInfo?.bio}
            />
            <VideoItem video={item.videoURL} tipo={item.type} />
          </View>
        )}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.videoGridContainer}
        removeClippedSubviews={true}
        ListEmptyComponent={() => <Text style={styles.emptyText}>Nenhum vídeo encontrado</Text>}
      />
    </SafeAreaView>
  );
};

const FilterButton = ({ iconName, categoria, currentCategoria, setCategoria }) => (
  <TouchableOpacity onPress={() => setCategoria(categoria === currentCategoria ? '' : categoria)}>
    <MaterialCommunityIcons
      name={iconName}
      size={27}
      color={categoria === currentCategoria ? '#581DB9' : 'gray'}
      style={{ marginRight: 5 }}
    />
  </TouchableOpacity>
);

const UserInfo = ({ userName, location, tipo, creatorAvatar, navigation, currentUser, userId, bio }) => (
  <View style={styles.userInfoContainer}>
    <TouchableOpacity
      onPress={() => {
        if (currentUser && currentUser.userId === userId) {
          navigation.navigate('Profile');
        } else {
          navigation.navigate('FolowerProfile', {
            createBy: userId,
          });
        }
      }}
      activeOpacity={0.8}
    >
      {creatorAvatar ? (
        <Image source={{ uri: creatorAvatar }} style={styles.avatar} />
      ) : (
        <Image source={require('../../assets/avatar.png')} style={styles.avatar} />
      )}
    </TouchableOpacity>

    <View style={styles.userInfoTextContainer}>
      <Text style={styles.userName}>{userName}</Text>
      <View style={styles.locationContainer}>
        <Feather name="map-pin" size={15} color="black" style={styles.locationIcon} />
        <Text style={styles.location}>{location}</Text>
      </View>
      <Text style={styles.tipo}>
        Tipo de Exercício: {tipo === 'Walking' ? 'Caminhada' : tipo === 'Running' ? 'Corrida' : 'Ciclismo'}
      </Text>
    </View>
  </View>
);

const VideoItem = ({ video, tipo }) => (
  <TouchableOpacity style={styles.videoItem} activeOpacity={0.8}>
    <View style={styles.videoContainer}>
      <Video
        style={styles.video}
        source={{ uri: video }}
        useNativeControls
        isLooping={false}
        resizeMode="cover"
        isMuted
      />
    </View>
  </TouchableOpacity>
);
