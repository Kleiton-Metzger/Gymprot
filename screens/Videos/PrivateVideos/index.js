import React, { useState, useEffect } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, Dimensions, LogBox, SafeAreaView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { collection, onSnapshot, query, where, getDoc, doc } from 'firebase/firestore';
import { db, auth } from '../../../storage/Firebase';
import { Video } from 'expo-av';
import styles from '../styles';
import { useAuth } from '../../../Hooks/useAuth';

const { width, height } = Dimensions.get('window');
LogBox.ignoreLogs(['Sending `onAnimatedValueUpdate` with no listeners registered.']);
LogBox.ignoreLogs([
  'Could not find image file:///private/var/containers/Bundle/Application/CCC465B2-8EA5-4A73-B814-EAAAA115DD03/Expo%20Go.app/No%20avatar%20availble.png',
]);
export const PrivateScreen = ({ navigation }) => {
  const [filteredVideos, setFilteredVideos] = useState([]);
  const { currentUser } = useAuth();
  useEffect(() => {
    const fetchUserVideos = async () => {
      try {
        const q = query(
          collection(db, 'videos'),
          where('status', '==', 'Private'),
          where('createBy', '==', auth.currentUser.uid),
        );

        const unsubscribeVideos = onSnapshot(q, async querySnapshot => {
          let fetchedVideos = [];
          querySnapshot.forEach(doc => {
            const videoData = doc.data();
            fetchedVideos.push({ id: doc.id, ...videoData });
          });
          setFilteredVideos(fetchedVideos);
        });
        return () => unsubscribeVideos();
      } catch (error) {
        console.log('Error fetching videos', error);
      }
    };

    fetchUserVideos();
  }, []);

  return (
    <SafeAreaView>
      <FlatList
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={
          <View style={{ height: 1, width: width * 0.9, alignSelf: 'center', backgroundColor: 'lightgrey' }} />
        }
        data={filteredVideos}
        renderItem={({ item }) => (
          <View style={styles.infoContainer}>
            <UserInfo
              userName={currentUser?.name || ''}
              location={item.location?.cityName || ''}
              tipo={item.type}
              creatorAvatar={currentUser?.avatar}
              navigation={navigation} // Pass navigation as a prop
            />
            <VideoItem video={item.videoURL} />
          </View>
        )}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.videoGridContainer}
        removeClippedSubviews={true}
        ListFooterComponent={<View style={{ marginBottom: 80 }} />}
        ListEmptyComponent={() => <Text style={styles.emptyText}>Nenhum vídeo encontrado</Text>}
      />
    </SafeAreaView>
  );
};

const UserInfo = ({ userName, location, tipo, creatorAvatar, navigation }) => (
  <View style={styles.userInfoContainer}>
    <TouchableOpacity onPress={() => navigation.navigate('Profile')} activeOpacity={0.8}>
      {creatorAvatar && <Image source={{ uri: creatorAvatar }} style={styles.avatar} />}
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
    <Video resizeMode="cover" style={styles.video} source={{ uri: video }} useNativeControls isLooping />
  </TouchableOpacity>
);
