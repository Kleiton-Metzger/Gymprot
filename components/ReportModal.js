import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { db } from '../storage/Firebase';
import { collection, addDoc, updateDoc, doc, increment } from 'firebase/firestore';
import { useAuth } from '../Hooks/useAuth';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import ModalSelector from 'react-native-modal-selector';

const ReportModal = ({ visible, onClose, videoId }) => {
  const [reportReason, setReportReason] = useState('');
  const [additionalComment, setAdditionalComment] = useState('');
  const [loading, setLoading] = useState(false);
  const { currentUser } = useAuth();

  const handleReportSubmit = async () => {
    if (!reportReason || !currentUser?.userId) {
      Alert.alert('Erro', 'Você deve selecionar um motivo e estar logado para reportar.');
      return;
    }

    setLoading(true);
    try {
      // Add report to the reports collection
      await addDoc(collection(db, 'reports'), {
        videoId,
        userId: currentUser.userId,
        userName: currentUser.name,
        reportReason,
        additionalComment,
        timestamp: new Date(),
      });

      // Increment report count in video document
      const videoDocRef = doc(db, 'videos', videoId);
      await updateDoc(videoDocRef, {
        reportCount: increment(1),
      });

      setReportReason('');
      setAdditionalComment('');
      onClose();
    } catch (error) {
      console.error('Error submitting report: ', error);
      Alert.alert('Erro', 'Ocorreu um erro ao enviar o reporte. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  const data = [
    { key: 1, label: 'Conteúdo inapropriado', value: 'inappropriate_content' },
    { key: 2, label: 'Violação de direitos autorais', value: 'copyright_violation' },
    { key: 3, label: 'Spam ou propaganda', value: 'spam_or_ads' },
    { key: 4, label: 'Outro', value: 'other' },
  ];

  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <MaterialCommunityIcons name="close-circle" size={28} color="#333" />
          </TouchableOpacity>
          <Text style={styles.header}>Reportar Vídeo</Text>
          <Text style={styles.label}>Selecione o motivo do reporte:</Text>

          <ModalSelector
            data={data}
            initValue="Selecione um motivo"
            onChange={option => setReportReason(option.value)}
            style={styles.pickerContainer}
          >
            <TextInput
              style={styles.picker}
              editable={false}
              placeholder="Selecione um motivo"
              value={reportReason ? data.find(item => item.value === reportReason)?.label : ''}
            />
          </ModalSelector>

          <TextInput
            style={styles.input}
            placeholder="Comentário adicional (opcional)"
            value={additionalComment}
            onChangeText={setAdditionalComment}
            multiline
            numberOfLines={4}
            placeholderTextColor="#888"
          />
          <TouchableOpacity
            style={[styles.button, styles.submitButton]}
            onPress={handleReportSubmit}
            disabled={loading}
          >
            {loading ? <ActivityIndicator size="small" color="#fff" /> : <Feather name="send" size={20} color="#fff" />}
            <Text style={styles.buttonText}>{loading ? 'A enviar...' : 'Enviar'}</Text>
          </TouchableOpacity>
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
  label: {
    alignSelf: 'flex-start',
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 10,
    color: '#333',
  },
  pickerContainer: {
    width: '100%',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 20,
    overflow: 'hidden',
  },
  picker: {
    width: '100%',
    height: 50,
    color: '#333',
    paddingLeft: 10,
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
    width: '50%',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: '#581DB9',
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
});

export default ReportModal;
