import React, { useState, useEffect } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity } from 'react-native';
import { Feather } from "@expo/vector-icons";
import { collection, onSnapshot, query, where, getDoc, doc } from 'firebase/firestore';
import { db, auth } from '../../../storage/Firebase';
import { Video } from 'expo-av';
import  styles from './styles';

export const PublicScreen = () => {
    const [filteredVideos, setFilteredVideos] = useState([]);

    useEffect(() => {
        const fetchUserVideos = async () => {
            const q = query(collection(db, 'videos'),
                where('createBy', '==', auth.currentUser.uid),
                where('status', '==', 'Public'));

            const unsubscribeVideos = onSnapshot(q, async (querySnapshot) => {
                const fetchedVideos = [];
                for (const doc of querySnapshot.docs) {
                    const videoData = doc.data();
                    const userData = await getUserData(videoData.createBy);
                    fetchedVideos.push({ id: doc.id, ...videoData, creatorName: userData.name, creatorAvatar: userData.photoURL });
                }
                setFilteredVideos(fetchedVideos);
            });
            return () => unsubscribeVideos();
        };

        fetchUserVideos();
    }, []);

    const getUserData = async (userId) => {
        const userDoc = await getDoc(doc(db, 'users', userId));
        return userDoc.exists() ? userDoc.data() : { name: '', photoURL: null };
    };

    return (
        <View style={styles.container}>

            <FlatList
                data={filteredVideos}
                renderItem={({ item }) => (
                    <View style={styles.infoContainer}>
                        <UserInfo
                            userName={item.creatorName}
                            location={item.location?.cityName || ''}
                            tipo={item.type}
                            creatorAvatar={item.creatorAvatar}
                        />
                        <VideoItem video={item.videoURL} />
                    </View>
                )}
                keyExtractor={item => item.id.toString()}
                contentContainerStyle={styles.videoGridContainer}
                removeClippedSubviews={true}
                ListEmptyComponent={() => (
                    <Text style={styles.emptyText}>Nenhum vídeo encontrado</Text>
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
                <Text style={styles.location}>{location}</Text>
            </View>
            <Text style={styles.tipo}>Tipo: {tipo}</Text>
        </View>
    </View>
);

const VideoItem = ({ video }) => (
    <TouchableOpacity style={styles.videoItem}>
        <Video
            style={styles.video}
            source={{ uri: video }}
            useNativeControls
            resizeMode="contain"
            isLooping
        />
    </TouchableOpacity>
);



