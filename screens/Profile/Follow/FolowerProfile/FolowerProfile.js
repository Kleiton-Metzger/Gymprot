import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, FlatList } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from './style';
import { SeguirBTN } from '../../../../components/common/seguirButton';
import {
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  where,
  query,
  collection,
  onSnapshot,
} from 'firebase/firestore';
import { db } from '../../../../storage/Firebase';
import { useAuth } from '../../../../Hooks/useAuth';
import { Video } from 'expo-av';

export const FolowerProfile = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { currentUser } = useAuth();
  const { userName, creatorAvatar, userBio, createBy } = route.params;
  const [userData, setUserData] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [notFollowing, setNotFollowing] = useState(true);
  const [videos, setVideos] = useState([]);
  const [headerVisible, setHeaderVisible] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDocRef = doc(db, 'users', createBy);
        const docSnap = await getDoc(userDocRef);
        if (docSnap.exists()) {
          const userData = docSnap.data();
          setUserData(userData);
          setIsFollowing(
            userData.seguidores && userData.seguidores.some(seguidor => seguidor.userId === currentUser?.userId),
          );
          setNotFollowing(
            !userData.seguidores || !userData.seguidores.some(seguidor => seguidor.userId === currentUser?.userId),
          );
        } else {
          setIsFollowing(false);
          setNotFollowing(true);
        }
      } catch (error) {
        console.error('Error fetching user data: ', error);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchUserVideos = async () => {
      try {
        const q = query(collection(db, 'videos'), where('status', '==', 'Public'), where('createBy', '==', createBy));
        const unsubscribe = onSnapshot(q, async querySnapshot => {
          let fetchedVideos = [];
          querySnapshot.forEach(doc => {
            const videoData = doc.data();
            fetchedVideos.push({ id: doc.id, ...videoData });
          });
          setVideos(fetchedVideos);
        });
        return () => unsubscribe();
      } catch (error) {
        console.error('Error fetching user videos: ', error);
      }
    };

    fetchUserVideos();
  }, []);

  const handleSeguir = async () => {
    try {
      const userDocRef = doc(db, 'users', createBy);
      const currentUserDocRef = doc(db, 'users', currentUser.userId);

      if (isFollowing) {
        await updateDoc(userDocRef, {
          seguidores: arrayRemove({
            userId: currentUser.userId,
            name: currentUser.name,
            avatar: currentUser.avatar,
          }),
        });

        await updateDoc(currentUserDocRef, {
          seguindo: arrayRemove({
            userId: createBy,
            name: userName,
            avatar: creatorAvatar,
          }),
        });

        setIsFollowing(false);
        setNotFollowing(true);
      } else {
        await updateDoc(userDocRef, {
          seguidores: arrayUnion({
            userId: currentUser.userId,
            name: currentUser.name,
            avatar: currentUser.avatar,
          }),
        });

        await updateDoc(currentUserDocRef, {
          seguindo: arrayUnion({
            userId: createBy,
            name: userName,
            avatar: creatorAvatar,
          }),
        });

        setIsFollowing(true);
        setNotFollowing(false);
      }
    } catch (error) {
      console.error('Error following user: ', error);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.bckButton} onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={30} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>Perfil</Text>
      </View>
      <View style={{ height: 1, backgroundColor: 'lightgray', width: '100%' }} />
      <FlatList
        showsVerticalScrollIndicator={false}
        data={['profile', 'bio', 'videos']}
        renderItem={({ item }) => {
          switch (item) {
            case 'profile':
              return (
                <View style={styles.profileContainer}>
                  <Image
                    source={creatorAvatar ? { uri: creatorAvatar } : require('../../../../assets/avatar.png')}
                    style={styles.avatar}
                  />
                  <Text style={styles.userName}>{userName}</Text>
                  <View style={styles.userFollow}>
                    <View style={styles.seguidoresContainer}>
                      <Text style={styles.segdrTxt}>Seguidor</Text>
                      <Text style={styles.segdrNum}>{userData?.seguidores?.length || 0} </Text>
                    </View>
                    <View style={styles.buttonContainer}>
                      <SeguirBTN
                        label={isFollowing ? 'Seguindo' : 'Seguir'}
                        onPress={handleSeguir}
                        notFollowing={notFollowing}
                      />
                    </View>
                    <View>
                      <Text style={styles.segdrTxt}>Seguindo</Text>
                      <Text style={styles.segdrNum}>{userData?.seguindo?.length || 0}</Text>
                    </View>
                  </View>
                </View>
              );
            case 'bio':
              return (
                <View style={styles.bioContainer}>
                  <Text style={styles.bioText}>{userBio}</Text>
                  <View style={{ height: 1, backgroundColor: '#E5E4E2', width: '100%', top: 5 }} />
                </View>
              );
            case 'videos':
              return (
                <View style={styles.bodyContainer}>
                  <FlatList
                    showsVerticalScrollIndicator={false}
                    data={videos}
                    renderItem={({ item }) => (
                      <View style={styles.infoContainer}>
                        <UserInfo
                          userName={item?.creatorInfo?.name || ''}
                          location={item.location?.cityName || ''}
                          tipo={item.type}
                          creatorAvatar={item?.creatorInfo?.avatar}
                          navigation={navigation}
                        />
                        <VideoItem video={item.videoURL} />
                      </View>
                    )}
                    keyExtractor={item => item.id.toString()}
                    contentContainerStyle={styles.videoGridContainer}
                    removeClippedSubviews={true}
                    ListFooterComponent={<View style={{ marginBottom: 80 }} />}
                    ListEmptyComponent={() => <Text style={styles.emptyText}>Nenhum vídeo encontrado</Text>}
                    onScroll={event => {
                      const currentOffset = event.nativeEvent.contentOffset.y;
                      const headerHeight = 40;
                      setHeaderVisible(currentOffset <= headerHeight || currentOffset === 0);
                    }}
                  />
                </View>
              );
            default:
              return null;
          }
        }}
        keyExtractor={(item, index) => index.toString()}
      />
    </SafeAreaView>
  );
};

const UserInfo = ({ userName, location, tipo, creatorAvatar, navigation }) => (
  <View style={styles.userInfoContainer}>
    {creatorAvatar && (
      <Image
        source={creatorAvatar ? { uri: creatorAvatar } : require('../../../../assets/avatar.png')}
        style={styles.avatarUser}
      />
    )}

    <View style={styles.userInfoTextContainer}>
      <Text style={styles.userNameU}>{userName}</Text>
      <View style={styles.locationContainer}>
        <Feather name="map-pin" size={15} color="black" style={styles.locationIcon} />
        <Text style={styles.location}>{location}</Text>
      </View>
    </View>
  </View>
);

const VideoItem = ({ video }) => (
  <TouchableOpacity style={styles.videoItem} activeOpacity={0.8}>
    <Video resizeMode="cover" style={styles.video} source={{ uri: video }} useNativeControls isLooping />
  </TouchableOpacity>
);
