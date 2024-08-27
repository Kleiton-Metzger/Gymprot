import React, { useState, useEffect, memo, useCallback } from 'react';
import { View, Text, TouchableOpacity, Image, FlatList, SafeAreaView, Dimensions } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import {
  updateDoc,
  arrayUnion,
  arrayRemove,
  collection,
  onSnapshot,
  query,
  where,
  doc,
  getDoc,
  getDocs,
} from 'firebase/firestore';
import { db } from '../../storage/Firebase';
import { Video } from 'expo-av';
import { useAuth } from '../../Hooks/useAuth';
import { Searchbar } from 'react-native-paper';
import styles from './styles';
import { DismissKeyboard } from '../../components';
import CommentsModal from '../../components/CommentsModal';
import ReportModal from '../../components/ReportModal';
import { useNavigation } from '@react-navigation/native';

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
  const [reportedVideos, setReportedVideos] = useState(new Set()); // State to track reported videos

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
        const promises = querySnapshot.docs.map(async doc => {
          const videoData = doc.data();
          if (videoData.createBy !== currentUser?.userId) {
            const userData = await getUserData(videoData.createBy);
            const isReported = videoData.reports?.includes(currentUser?.userId) || false;
            fetchedVideos.push({ id: doc.id, ...videoData, creatorInfo: userData, isReported });
          }
        });
        await Promise.all(promises);
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

  const handleCategoriaChange = useCallback(categoria => {
    setCategoria(prevCategoria => (categoria === prevCategoria ? '' : categoria));
  }, []);

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
              setCategoria={handleCategoriaChange}
            />
            <FilterButton
              iconName="run-fast"
              categoria="Running"
              currentCategoria={categoria}
              setCategoria={handleCategoriaChange}
            />
            <FilterButton
              iconName="bike"
              categoria="Cycling"
              currentCategoria={categoria}
              setCategoria={handleCategoriaChange}
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
            <VideoItem
              videoId={item.id}
              video={item.videoURL}
              navigation={navigation}
              currentUser={currentUser}
              setReportedVideos={setReportedVideos}
              reportedVideos={reportedVideos}
              isReported={item.isReported}
            />
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

const FilterButton = memo(({ iconName, categoria, currentCategoria, setCategoria }) => (
  <TouchableOpacity onPress={() => setCategoria(categoria)}>
    <MaterialCommunityIcons
      name={iconName}
      size={27}
      color={categoria === currentCategoria ? '#581DB9' : 'gray'}
      style={{ marginRight: 5 }}
    />
  </TouchableOpacity>
));

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

const VideoItem = memo(({ videoId, video, navigation, currentUser, setReportedVideos, reportedVideos, isReported }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [reportModalVisible, setReportModalVisible] = useState(false);

  useEffect(() => {
    const checkIfLiked = async () => {
      if (!currentUser?.userId) return;

      try {
        const q = query(collection(db, 'videos'), where('id', '==', videoId));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          querySnapshot.forEach(doc => {
            const videoData = doc.data();
            const likes = videoData.likes || [];
            setIsLiked(likes.includes(currentUser.userId));
          });
        } else {
          console.log('No document found with this video ID');
        }
      } catch (error) {
        console.error('Error checking like status: ', error);
      }
    };

    checkIfLiked();
  }, [videoId, currentUser?.userId]);

  const handleLike = useCallback(async () => {
    if (!currentUser?.userId) return;

    try {
      const q = query(collection(db, 'videos'), where('id', '==', videoId));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const videoDoc = querySnapshot.docs[0].ref;

        if (isLiked) {
          await updateDoc(videoDoc, {
            likes: arrayRemove(currentUser.userId),
          });
          setIsLiked(false);
        } else {
          await updateDoc(videoDoc, {
            likes: arrayUnion(currentUser.userId),
          });
          setIsLiked(true);
        }
      } else {
        console.log('No document found with this video ID');
      }
    } catch (error) {
      console.error('Error updating like: ', error);
    }
  }, [videoId, isLiked, currentUser?.userId]);

  const handleReport = useCallback(async () => {
    if (!currentUser?.userId) return;

    try {
      const q = query(collection(db, 'videos'), where('id', '==', videoId));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const videoDoc = querySnapshot.docs[0].ref;
        const videoData = querySnapshot.docs[0].data();
        const reports = videoData.reports || [];

        if (!reports.includes(currentUser.userId)) {
          await updateDoc(videoDoc, {
            reports: arrayUnion(currentUser.userId),
          });
          setReportedVideos(prevSet => new Set(prevSet).add(videoId));
        }
      } else {
        console.log('No document found with this video ID');
      }
    } catch (error) {
      console.error('Error reporting video: ', error);
    }
  }, [videoId, currentUser?.userId]);

  return (
    <View style={styles.videoItemContainer}>
      <TouchableOpacity
        onPress={() => navigation.navigate('VideosScreen', { videoURL: video })}
        style={styles.videoItem}
        activeOpacity={0.8}
      >
        <View style={styles.videoContainer}>
          <Video
            style={styles.video}
            source={{ uri: video }}
            resizeMode="cover"
            isMuted={true}
            shouldPlay={false}
            useNativeControls={false}
            isLooping={false}
          />
          <TouchableOpacity
            onPress={() => navigation.navigate('VideosScreen', { videoURL: video })}
            activeOpacity={0.8}
            style={styles.playButton}
          >
            <Feather name="play-circle" size={50} color="#581DB9" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
      <View style={styles.iconsContainer}>
        <TouchableOpacity style={styles.iconItem} onPress={() => setModalVisible(true)} activeOpacity={0.8}>
          <Feather name="message-circle" size={20} color="black" />
          <Text style={styles.iconText}>Comentários</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconItem} onPress={handleLike} activeOpacity={0.8}>
          <MaterialCommunityIcons name="heart" size={20} color={isLiked ? 'red' : 'black'} />
          <Text style={styles.iconText}>Gosto</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.iconItem}
          onPress={() => {
            setReportModalVisible(true);
            handleReport();
          }}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons name="flag" size={20} color={isReported ? 'red' : 'black'} />
          <Text style={styles.iconText}>Denunciar</Text>
        </TouchableOpacity>
      </View>

      <CommentsModal visible={modalVisible} onClose={() => setModalVisible(false)} videoId={videoId} />
      <ReportModal visible={reportModalVisible} onClose={() => setReportModalVisible(false)} videoId={videoId} />
    </View>
  );
});
