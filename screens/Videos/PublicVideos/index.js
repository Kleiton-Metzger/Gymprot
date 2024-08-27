import React, { useState, useEffect, memo } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  Dimensions,
  LogBox,
  SafeAreaView,
  Modal,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { collection, onSnapshot, query, where, deleteDoc, doc, getDoc, getDocs, updateDoc } from 'firebase/firestore';
import { db, auth, storage } from '../../../storage/Firebase';
import { getStorage, ref, deleteObject } from 'firebase/storage';
import { Video } from 'expo-av';
import { useAuth } from '../../../Hooks/useAuth';
import styles from '../styles';
import { Button } from '../../../components/common/Button';
import { Menu, Divider, RadioButton } from 'react-native-paper';
import VideosScreen from '../VideoRepro/VideoRepre';
import { useNavigation } from '@react-navigation/native';
import { TextInput } from 'react-native-paper';
import CommentsModal from '../../../components/CommentsModal';

const { width, height } = Dimensions.get('window');
LogBox.ignoreLogs(['Sending `onAnimatedValueUpdate` with no listeners registered.']);
LogBox.ignoreLogs([
  'Could not find image file:///private/var/containers/Bundle/Application/CCC465B2-8EA5-4A73-B814-EAAAA115DD03/Expo%20Go.app/No%20avatar%20availble.png',
]);

export const PublicScreen = ({ navigation }) => {
  const [filteredVideos, setFilteredVideos] = useState([]);
  const { currentUser } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState();
  const [typeVideo, setTypeVideo] = useState();
  const [selectedVideo, setSelectedVideo] = useState(null);

  const handleModalClose = () => {
    setDescription('');
    setStatus('Public');
    setTypeVideo('Running');
    setSelectedVideo(null);
    setShowModal(false);
  };

  const handleDeleteVideoConfirmation = video => {
    setSelectedVideo(video);
    setShowDeleteConfirmation(true);
  };

  const handleDeleteVideo = async videoURL => {
    try {
      const storageRef = ref(storage, videoURL);
      await deleteObject(storageRef);
      console.log('Video file deleted successfully from storage');

      const q = query(collection(db, 'videos'), where('videoURL', '==', videoURL));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach(async doc => {
        await deleteDoc(doc.ref);
        console.log('Video deleted successfully');
      });
    } catch (error) {
      console.error('Error deleting video document:', error);
    }
  };

  const handleConfirmDeleteVideo = () => {
    handleDeleteVideo(selectedVideo.videoURL);
    setShowDeleteConfirmation(false);
  };

  useEffect(() => {
    const fetchUserVideos = async () => {
      try {
        const q = query(
          collection(db, 'videos'),
          where('status', '==', 'Public'),
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

  const handleEditVideo = async () => {
    try {
      console.log('selectedVideo:', selectedVideo.id);
      const q = query(collection(db, 'videos'), where('id', '==', selectedVideo.id));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach(async doc => {
        await updateDoc(doc.ref, { description, status, type: typeVideo });
        console.log('Video updated successfully');
        setShowModal(false);
        Alert.alert('Sucesso', 'Dados atualizados com sucesso.');
      });
    } catch (error) {
      console.error('Error updating video document:', error);
    }
  };

  return (
    <SafeAreaView>
      <FlatList
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={
          <View style={{ height: 1, width: width * 0.9, alignSelf: 'center', backgroundColor: 'whitesmoke' }} />
        }
        data={filteredVideos}
        renderItem={({ item }) => (
          <View style={styles.infoContainer}>
            <UserInfo
              userName={currentUser?.name || ''}
              location={item.location?.cityName || ''}
              tipo={item.type}
              creatorAvatar={currentUser?.avatar}
              navigation={navigation}
            />
            <View style={styles.vidoeOptionsContainer}>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => {
                  setSelectedVideo(item);
                  setDescription(item.description);
                  setStatus(item.status);
                  setTypeVideo(item.type);
                  setShowModal(true);
                }}
                activeOpacity={0.8}
              >
                <Feather name="edit" size={20} color="#581DB9" />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  handleDeleteVideoConfirmation(item);
                }}
                style={styles.deleteVideo}
                activeOpacity={0.8}
              >
                <Feather name="trash-2" size={20} color="red" />
              </TouchableOpacity>
            </View>
            <View style={styles.videoInfoContainer}>
              <Text style={styles.videoLocation}> {item.location.cityName}</Text>
            </View>
            <VideoItem video={item.videoURL} navigation={navigation} />
          </View>
        )}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.videoGridContainer}
        removeClippedSubviews={true}
        ListFooterComponent={<View style={{ marginBottom: 80 }} />}
        ListEmptyComponent={() => <Text style={styles.emptyText}>Nenhum vídeo público encontrado</Text>}
      />
      <Modal
        onRequestClose={handleModalClose}
        animationType="slide"
        presentationStyle="formSheet"
        visible={showModal}
        onDismiss={handleModalClose}
        contentContainerStyle={styles.modalContainer}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={{ padding: 10 }}>
            <TouchableOpacity style={{ marginBottom: 15 }} onPress={handleModalClose}>
              <Text style={{ color: '#581DB9', fontSize: 16, fontWeight: '600', textAlign: 'right' }}>Fechar</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Editar Vídeo</Text>
            <Text style={styles.modalSubtitle}>Edite as informações do vídeo</Text>
            <TextInput
              label="Descrição"
              mode="outlined"
              placeholder="Adicione uma breve descrição ao vídeo"
              style={styles.descriptionInput}
              value={description}
              onChangeText={setDescription}
              multiline={true}
              bordercolor="#581DB9"
            />

            <Text style={styles.modalLabel}>Status do Vídeo:</Text>
            <RadioButton.Group onValueChange={value => setStatus(value)} value={status}>
              <RadioButton.Item label="Público" value="Public" color="green" />
              <RadioButton.Item label="Privado" value="Private" color="red" />
            </RadioButton.Group>
            <Text style={styles.modalLabel}>Tipo de Exercício:</Text>
            <RadioButton.Group onValueChange={value => setTypeVideo(value)} value={typeVideo}>
              <RadioButton.Item label="Corrida" value="Running" color="#581DB9" />
              <RadioButton.Item label="Bicicleta" value="Cycling" color="#581DB9" />
              <RadioButton.Item label="Caminhada" value="Walking" color="#581DB9" />
            </RadioButton.Group>
            <Button onPress={handleEditVideo} label="Concluir" style={styles.modalButton} />
          </View>
        </TouchableWithoutFeedback>
      </Modal>
      <Modal
        visible={showDeleteConfirmation}
        animationType="slide"
        onRequestClose={() => setShowDeleteConfirmation(false)}
        transparent
      >
        <View style={styles.confirmationModalContainer}>
          <View style={styles.confirmationModal}>
            <Text style={styles.confirmationText}>Tem certeza que deseja excluir este vídeo?</Text>
            <View style={styles.confirmationButtonsContainer}>
              <Button
                onPress={() => setShowDeleteConfirmation(false)}
                label="Cancelar"
                style={[styles.modalButton, { marginRight: 10 }]}
              />
              <Button onPress={handleConfirmDeleteVideo} label="Confirmar" style={styles.modalButton} />
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const UserInfo = ({ userName, location, tipo, creatorAvatar, navigation }) => (
  <View style={styles.userInfoContainer}>
    <TouchableOpacity onPress={() => navigation.navigate('Profile')} activeOpacity={0.8}>
      {creatorAvatar ? (
        <Image style={styles.avatar} source={{ uri: creatorAvatar }} />
      ) : (
        <Image
          style={styles.avatar}
          source={require('../../../assets/avatar.png')}
          defaultSource={require('../../../assets/avatar.png')}
        />
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

const VideoItem = memo(({ video, navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const q = query(collection(db, 'videos'), where('videoURL', '==', video));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach(doc => {
          setSelectedVideo({ id: doc.id, ...doc.data() });
        });
      } catch (error) {
        console.error('Error fetching video:', error);
      }
    };

    fetchVideos();
  }, []);

  const handleOpenComments = () => {
    setSelectedVideo({ id: video });
    setModalVisible(true);
  };

  return (
    <View style={styles.videoItemContainer}>
      <TouchableOpacity
        onPress={() => navigation.navigate('VideosScreen', { videoURL: video })}
        style={styles.videoItem}
        activeOpacity={1}
      >
        <View style={styles.videoContainer}>
          <Video
            style={styles.video}
            source={{ uri: video }}
            resizeMode="cover"
            isMuted
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
        <TouchableOpacity style={styles.iconItem} onPress={handleOpenComments} activeOpacity={0.8}>
          <Feather name="message-circle" size={20} color="black" />
          <Text style={styles.iconText}>Comentários</Text>
        </TouchableOpacity>
      </View>

      <CommentsModal visible={modalVisible} onClose={() => setModalVisible(false)} videoId={selectedVideo?.id} />
    </View>
  );
});
