import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, FlatList, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from './style';
import { SeguirBTN } from '../../../../components/common/seguirButton';
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove, where, query, collection, getDocs } from 'firebase/firestore';
import { db } from '../../../../storage/Firebase';
import { useAuth } from '../../../../Hooks/useAuth';
import { Video } from 'expo-av';
import axios from 'axios';

const useFetchUserData = (createBy, userId) => {
  const [userData, setUserData] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDocRef = doc(db, 'users', createBy || userId);
        const docSnap = await getDoc(userDocRef);
        if (docSnap.exists()) {
          const userData = docSnap.data();
          setUserData(userData);
          setIsFollowing(userData.seguidores?.some(seguidor => seguidor.userId === currentUser?.userId));
        }
      } catch (error) {
        console.error('Error fetching user data: ', error);
      }
    };

    fetchUserData();
  }, [createBy, userId, currentUser]);

  return { userData, setUserData, isFollowing, setIsFollowing };
};

const useFetchVideos = (createBy, userId) => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const videosRef = collection(db, 'videos');
        const q = query(videosRef, where('createBy', '==', createBy || userId), where('status', '==', 'Public'));
        const querySnapshot = await getDocs(q);
        const videosData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setVideos(videosData);
      } catch (error) {
        console.error('Error fetching videos: ', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [createBy, userId]);

  return { videos, loading };
};

const UserInfo = ({ userName, location, creatorAvatar }) => (
  <View style={styles.userInfoContainer}>
    <Image
      source={creatorAvatar ? { uri: creatorAvatar } : require('../../../../assets/avatar.png')}
      style={styles.avatarUser}
    />
    <View style={styles.userInfoTextContainer}>
      <Text style={styles.userNameU}>{userName}</Text>
      <View style={styles.locationContainer}>
        <Feather name="map-pin" size={15} color="black" style={styles.locationIcon} />
        <Text style={styles.location}>{location}</Text>
      </View>
    </View>
  </View>
);

const VideoItem = ({ video }) => {
  const navigation = useNavigation();

  return (
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
  );
};

export const FolowerProfile = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { createBy, userId } = route.params;
  const { currentUser } = useAuth();
  const { userData, setUserData, isFollowing, setIsFollowing } = useFetchUserData(createBy, userId);
  const { videos, loading } = useFetchVideos(createBy, userId);

  const sendNotification = async followedUserData => {
    try {
      await axios.post('https://app.nativenotify.com/api/notification', {
        subID: followedUserData.id,
        appId: 22648,
        appToken: 'ORCAvOl2Mp53Ll26YDq01d',
        title: 'You have a new follower',
        body: `${currentUser.name} started following you`,
        dateSent: new Date().toISOString(),
        pushData: JSON.stringify({ type: 'follow', userId: currentUser.userId }),
      });
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  };

  const handleSeguir = async () => {
    try {
      const userDocRef = doc(db, 'users', createBy);
      const currentUserDocRef = doc(db, 'users', currentUser.userId);

      if (isFollowing) {
        setUserData(prevUserData => ({
          ...prevUserData,
          seguidores: prevUserData.seguidores.filter(seguidor => seguidor.userId !== currentUser.userId),
        }));
        await updateDoc(userDocRef, {
          seguidores: arrayRemove({
            userId: currentUser.userId,
            name: currentUser.name,
          }),
        });
        await updateDoc(currentUserDocRef, {
          seguindo: arrayRemove({
            userId: createBy,
            name: userData.name,
          }),
        });
      } else {
        setUserData(prevUserData => ({
          ...prevUserData,
          seguidores: [...prevUserData.seguidores, { userId: currentUser.userId, name: currentUser.name }],
        }));
        await updateDoc(userDocRef, {
          seguidores: arrayUnion({
            userId: currentUser.userId,
            name: currentUser.name,
          }),
        });
        await updateDoc(currentUserDocRef, {
          seguindo: arrayUnion({
            userId: createBy,
            name: userData?.name,
          }),
        });

        await sendNotification(userData);
      }

      setIsFollowing(!isFollowing);
    } catch (error) {
      console.error('Error following user: ', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#581DB9" style={{ marginTop: 20 }} />
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.bckButton} onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={30} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>{userData?.name}</Text>
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
                    source={userData?.avatar ? { uri: userData.avatar } : require('../../../../assets/avatar.png')}
                    style={styles.avatar}
                  />

                  <View style={styles.userFollow}>
                    <View style={styles.seguidoresContainer}>
                      <TouchableOpacity
                        onPress={() => navigation.navigate('FollowListScreen', { userId: userData.id })}
                      >
                        <Text style={styles.segdrTxt}>Seguidor</Text>
                        <Text style={styles.segdrNum}>{userData?.seguidores?.length || 0}</Text>
                      </TouchableOpacity>
                    </View>
                    <View style={styles.buttonContainer}>
                      <SeguirBTN
                        label={isFollowing ? 'A seguir' : 'Seguir'}
                        onPress={handleSeguir}
                        notFollowing={!isFollowing}
                      />
                    </View>
                    <View>
                      <TouchableOpacity
                        onPress={() => navigation.navigate('FollowListScreen', { userId: userData.id })}
                      >
                        <Text style={styles.segdrTxt}>Seguindo</Text>
                        <Text style={styles.segdrNum}>{userData?.seguindo?.length || 0}</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              );
            case 'bio':
              return (
                <View style={styles.bioContainer}>
                  <Text style={styles.bioText}>{userData?.bio}</Text>
                  <View style={{ height: 1, backgroundColor: '#E5E4E2', width: '100%', top: 5 }} />
                </View>
              );
            case 'videos':
              return (
                <View style={styles.bodyContainer}>
                  <FlatList
                    showsVerticalScrollIndicator={false}
                    ItemSeparatorComponent={() => (
                      <View style={{ height: 1, width: '90%', alignSelf: 'center', backgroundColor: 'lightgrey' }} />
                    )}
                    data={videos}
                    renderItem={({ item }) => (
                      <View key={item.id} style={styles.infoContainer}>
                        <UserInfo
                          userName={userData?.name}
                          creatorAvatar={userData?.avatar}
                          location={item.location?.cityName || ''}
                        />
                        <VideoItem video={item?.videoURL} />
                      </View>
                    )}
                    keyExtractor={item => item.id.toString()}
                    contentContainerStyle={styles.videoGridContainer}
                    removeClippedSubviews={true}
                    ListFooterComponent={<View style={{ marginBottom: 80 }} />}
                    ListEmptyComponent={() => <Text style={styles.emptyText}>Nenhum vídeo encontrado</Text>}
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
