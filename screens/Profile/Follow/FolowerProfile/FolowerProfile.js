import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from './style';
import { SeguirBTN } from '../../../../components/common/seguirButton';
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '../../../../storage/Firebase';
import { useAuth } from '../../../../Hooks/useAuth';

export const FolowerProfile = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { currentUser } = useAuth();
  const { userName, creatorAvatar, userBio, createBy } = route.params;
  const [userData, setUserData] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [notFollowing, setNotFollowing] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      // Função para buscar os dados do usuário da coleção 'users'
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

  const handleSeguir = async () => {
    try {
      const userDocRef = doc(db, 'users', createBy);
      const currentUserDocRef = doc(db, 'users', currentUser.userId); // Documento do user atual

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
    <SafeAreaView>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.bckButton} onPress={() => navigation.goBack()}>
            <Feather name="arrow-left" size={30} color="black" />
          </TouchableOpacity>
          <Text style={styles.title}>Perfil</Text>
        </View>
        <View style={styles.profileContainer}>
          <Image source={{ uri: creatorAvatar }} style={styles.avatar} />
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
        <View style={styles.bioContainer}>
          <Text style={styles.bioText}>{userBio}</Text>
        </View>
        <View style={styles.bodyContainer}>
          <Text style={styles.bodyTitle}>Body</Text>
          <View>{/* Aqui você pode exibir os dados do usuário sendo seguido */}</View>
        </View>
      </View>
    </SafeAreaView>
  );
};
