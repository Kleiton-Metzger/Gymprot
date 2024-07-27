import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  Linking,
  Modal,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { FAB, DataTable, TextInput, ProgressBar, IconButton, MD3Colors } from 'react-native-paper';
import * as DocumentPicker from 'expo-document-picker';
import { db, storage } from '../../storage/Firebase';
import { doc, setDoc, collection, onSnapshot, query, where, deleteDoc, getDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import uuid from 'uuid-random';
import { styles } from './styles';
import { useAuth } from '../../Hooks/useAuth';
import { Button } from '../../components';

export const UploadScreen = () => {
  const [documents, setDocuments] = useState([]);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [docName, setDocName] = useState('');
  const { currentUser } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleDocumentSelection = async () => {
    try {
      const document = await DocumentPicker.getDocumentAsync();
      if (document.type !== 'cancel') {
        setSelectedDoc(document.assets[0].uri);
        setDocName(document.assets[0].name);
        console.log('Documento selecionado:', document);
        setShowModal(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const uploadDocument = async () => {
    try {
      const storage = getStorage();
      const storageRef = ref(storage, `documents/${docName}`);

      const response = await fetch(selectedDoc);
      const blob = await response.blob();
      const uploadTask = uploadBytesResumable(storageRef, blob);

      uploadTask.on('state_changed', snapshot => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress / 100);
      });

      uploadTask.then(async snapshot => {
        console.log('Upload complete');
        const downloadURL = await getDownloadURL(storageRef);
        console.log('File available at', downloadURL);

        const document = {
          id: uuid(),
          name: docName,
          uri: downloadURL,
          size: snapshot.totalBytes,
          createdAt: new Date().toISOString(),
          createdBy: currentUser.userId,
        };

        await setDoc(doc(collection(db, 'documents')), document);
        setShowModal(false);
        setUploadProgress(0);
      });
    } catch (error) {
      console.log('Erro ao enviar documento:', error);
    }
  };

  useEffect(() => {
    if (currentUser) {
      const documentsCollection = collection(db, 'documents');
      const q = query(documentsCollection, where('createdBy', '==', currentUser.userId));

      const unsubscribe = onSnapshot(q, snapshot => {
        const documentsData = snapshot.docs.map(doc => doc.data());
        setDocuments(documentsData);
      });

      return () => unsubscribe();
    }
  }, [currentUser]);

  const handleDeleteDocument = async (documentUri, documentName) => {
    console.log('Deleting document:', documentName);
    console.log('Deleting document:', documentUri);
    try {
      const storageRef = ref(storage, documentUri);
      await deleteObject(storageRef);
      console.log('Document deleted from storage');

      const q = query(collection(db, 'documents'), where('uri', '==', documentUri));
      const querySnapshot = await getDoc(q);
      querySnapshot.forEach(async doc => {
        await deleteDoc(doc.ref);
        console.log('Document deleted from firestore');
      });
    } catch (error) {
      console.log('Erro ao deletar documento:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Meus Documentos</Text>
      <DataTable.Header style={styles.subTitles}>
        <DataTable.Title style={styles.fileName}>Nome</DataTable.Title>
        <DataTable.Title style={styles.fileData}>Data de Criação</DataTable.Title>
      </DataTable.Header>
      <FlatList
        data={documents}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <DataTable.Row style={styles.listItem}>
            <DataTable.Cell style={styles.listname}>{item.name}</DataTable.Cell>
            <DataTable.Cell style={styles.listDta}>{item.createdAt.split('T')[0]}</DataTable.Cell>
            <DataTable.Cell style={styles.deleteButtonContainer}>
              <IconButton
                icon="delete"
                color={MD3Colors.red}
                size={24}
                onPress={() => handleDeleteDocument(item.uri, item.name)}
              />
            </DataTable.Cell>
          </DataTable.Row>
        )}
      />

      <FAB icon="plus" style={styles.fab} color="white" onPress={handleDocumentSelection} />
      <Modal visible={showModal} animationType="slide" transparent>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Adicionar Documento</Text>
              <TextInput
                mode="outlined"
                placeholder="Nome do Documento"
                style={styles.input}
                label="Nome do Documento"
                value={docName}
                onChangeText={setDocName}
              />
              <View style={styles.confirmationButtonsContainer}>
                <Button
                  onPress={() => setShowModal(false)}
                  label="Cancelar"
                  style={[styles.modalButton, { marginRight: 10 }]}
                />
                <Button onPress={uploadDocument} label="Enviar" style={styles.modalButton} />
              </View>
              <View style={styles.progressContainer}>
                <Text style={styles.progressText}>Progresso de Upload</Text>
                <ProgressBar progress={uploadProgress} color="#581DB9" style={styles.progress} />
                <Text style={styles.progressText}>{Math.round(uploadProgress * 100)}%</Text>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};
