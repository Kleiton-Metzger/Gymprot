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

export const FolowerProfile = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { currentUser } = useAuth();
  const { createBy, userId } = route.params;

  const [userData, setUserData] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [notFollowing, setNotFollowing] = useState(true);
  const [videos, setVideos] = useState([]);
  const [headerVisible, setHeaderVisible] = useState(true);
  const [loading, setLoading] = useState(true);
  const [rendered, setRendered] = useState(false);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const userDocRef = doc(db, 'users', createBy || userId);
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
    } finally {
      setLoading(false);
    }
  };

  const fetchVideos = async () => {
    try {
      setLoading(true);
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

  useEffect(() => {
    fetchUserData();
    fetchVideos();
  }, []);
  useEffect(() => {
    fetchUserData();
    fetchVideos();
  }, []);

  useEffect(() => {
    if (!loading && userData && videos.length > 0) {
      setRendered(true);
    }
  }, [loading, userData, videos]);

  const handleSeguir = async () => {
    try {
      // Atualiza imediatamente a UI
      if (isFollowing) {
        setUserData(prevUserData => ({
          ...prevUserData,
          seguidores: prevUserData.seguidores.filter(seguidor => seguidor.userId !== currentUser.userId),
        }));
        setIsFollowing(false);
        setNotFollowing(true);
      } else {
        setUserData(prevUserData => ({
          ...prevUserData,
          seguidores: [...prevUserData.seguidores, { userId: currentUser.userId, name: currentUser.name }],
        }));
        setIsFollowing(true);
        setNotFollowing(false);
      }

      // Atualiza a base de dados posteriormente
      const userDocRef = doc(db, 'users', createBy);
      const currentUserDocRef = doc(db, 'users', currentUser.userId);

      if (isFollowing) {
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
      }
    } catch (error) {
      console.error('Error following user: ', error);
    }
  };

  if (!rendered) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="normal" color="#0000ff" />
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
                      <Text style={styles.segdrTxt}>Seguidor</Text>
                      <Text style={styles.segdrNum}>{userData?.seguidores?.length || 0} </Text>
                    </View>
                    <View style={styles.buttonContainer}>
                      <SeguirBTN
                        label={isFollowing ? 'Não seguir' : 'Seguir'}
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
    {creatorAvatar ? (
      <Image source={{ uri: creatorAvatar }} style={styles.avatarUser} />
    ) : (
      <Image source={require('../../../../assets/avatar.png')} style={styles.avatarUser} />
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
const VideoItem = ({ video, tipo }) => (
  <View style={styles.videoItem}>
    <Video
      source={{ uri: video }}
      style={styles.video}
      useNativeControls
      isLooping={false}
      resizeMode="cover"
      isMuted
    />
  </View>
);
