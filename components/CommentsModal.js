import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { db } from '../storage/Firebase';
import { collection, addDoc } from 'firebase/firestore';
import { useAuth } from '../Hooks/useAuth';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import CommentsList from './CommentsList';

const CommentsModal = ({ visible, onClose, videoId }) => {
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const { currentUser } = useAuth();

  const handleCommentSubmit = async () => {
    if (!comment.trim() || !currentUser?.userId) {
      Alert.alert('Erro', 'O comentário não pode estar vazio e você deve estar logado para comentar.');
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, 'comments'), {
        videoId,
        userId: currentUser.userId,
        userName: currentUser.name,
        userAvatar: currentUser.avatar || 'https://example.com/path/to/default-avatar.jpg', // Fallback URL
        comment,
        timestamp: new Date(),
      });
      setComment('');
    } catch (error) {
      console.error('Error adding comment: ', error);
      Alert.alert('Erro', 'Ocorreu um erro ao adicionar o comentário. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <MaterialCommunityIcons name="close-circle" size={28} color="#333" />
          </TouchableOpacity>
          <Text style={styles.header}>Adicionar Comentário</Text>
          <TextInput
            style={styles.input}
            placeholder="Escreva seu comentário"
            value={comment}
            onChangeText={setComment}
            multiline
            numberOfLines={4}
            placeholderTextColor="#888"
          />
          <TouchableOpacity
            style={[styles.button, styles.submitButton]}
            onPress={handleCommentSubmit}
            disabled={loading}
          >
            {loading ? <ActivityIndicator size="small" color="#fff" /> : <Feather name="send" size={20} color="#fff" />}
            <Text style={styles.buttonText}>{loading ? 'A enviar...' : 'Enviar'}</Text>
          </TouchableOpacity>
          <CommentsList style={styles.commentsContainer} videoId={videoId} />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  modalContainer: {
    width: '90%',
    maxWidth: 400,
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
    alignItems: 'center',
    position: 'relative',
    maxHeight: '80%',
  },
  header: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    color: '#333',
  },
  input: {
    width: '100%',
    height: 100,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 20,
    textAlignVertical: 'top',
    fontSize: 16,
    color: '#333',
  },
  button: {
    width: '100%',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  submitButton: {
    backgroundColor: '#007BFF',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    marginLeft: 10,
  },
  commentsContainer: {
    width: '100%',
    marginTop: 20,
  },
});

export default CommentsModal;
