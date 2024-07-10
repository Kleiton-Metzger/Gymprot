import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { FAB, List, Dialog, Button, Divider, DataTable } from 'react-native-paper';
import * as DocumentPicker from 'expo-document-picker';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { db, auth } from '../../storage/Firebase';
import { doc, setDoc, collection, getDocs, query, where, onSnapshot } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import { styles } from './styles';
import { Input } from '../../components';

const formatDate = dateString => {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

export const UploadScreen = () => {
  const [documents, setDocuments] = useState([]);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [documentName, setDocumentName] = useState('');
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [nameError, setNameError] = useState('');
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, 'users', auth.currentUser.uid), docSnap => {
      if (docSnap.exists()) {
        const userData = docSnap.data();
        setUserId(auth.currentUser.uid);
      } else {
        alert('Erro: Usuário não encontrado.');
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (userId) {
      fetchDocuments();
    }
  }, [userId]);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const q = query(collection(db, 'documentos'), where('userId', '==', userId));
      const documentsSnapshot = await getDocs(q);
      const documentsData = documentsSnapshot.docs.map(doc => doc.data());
      documentsData.sort((a, b) => a.name.localeCompare(b.name));
      setDocuments(documentsData);
    } catch (error) {
      alert('Erro ao buscar documentos:', error);
    } finally {
      setLoading(false);
    }
  };

  const selectDocument = async () => {
    try {
      const document = await DocumentPicker.getDocumentAsync({ type: / * / });
      if (document.type === 'success') {
        setSelectedDocument(document);
        setDialogVisible(true);
      } else {
        alert('Nenhum documento selecionado.');
      }
    } catch (error) {
      alert('Erro ao selecionar documento:', error);
    }
  };

  const handleUpload = async () => {
    try {
      if (!selectedDocument) {
        console.error('Nenhum documento selecionado.');
        return;
      }

      if (!documentName.trim()) {
        setNameError('O nome do documento é obrigatório.');
        return;
      }

      setLoading(true);

      const response = await fetch(selectedDocument.uri);
      const blob = await response.blob();

      const storage = getStorage();
      const documentID = uuidv4();
      const documentType = 'pdf';

      const storageRef = ref(storage, `documents/${documentID}.${documentType}`);
      const uploadTask = uploadBytesResumable(storageRef, blob);

      uploadTask.on(
        'state_changed',
        snapshot => {},
        error => {
          console.error('Error uploading document:', error);
          alert('Erro ao enviar documento:', error);
        },
        async () => {
          const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);

          const documentData = {
            id: documentID,
            userId: userId,
            name: documentName.trim(),
            type: documentType,
            createAt: new Date().toISOString(),
            uri: downloadUrl,
          };

          const docRef = doc(db, 'documentos', documentID);
          await setDoc(docRef, documentData);

          setDocuments([...documents, documentData]);
          setDialogVisible(false);
          setDocumentName('');
          setSelectedDocument(null);
          setNameError('');
        },
      );
    } catch (error) {
      console.error('Error uploading document:', error);
      alert('Erro ao enviar documento:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDialogDismiss = () => {
    setDialogVisible(false);
    setDocumentName('');
    setSelectedDocument(null);
    setNameError('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Meus Documentos</Text>
      <DataTable.Header style={styles.subTitles}>
        <Text style={styles.fileName}>Nome</Text>
        <Text style={styles.fileData}>Data de Criação</Text>
      </DataTable.Header>
      {loading ? (
        <ActivityIndicator animating={true} color="#581DB9" size="small" />
      ) : (
        <FlatList
          data={documents}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => alert('Documento ' + item.name)}>
              <DataTable.Row key={item.id}>
                <List.Item
                  title={item.name}
                  description={formatDate(item.createAt)}
                  left={() => <List.Icon icon="file-pdf-box" />}
                />
              </DataTable.Row>
            </TouchableOpacity>
          )}
          style={styles.list}
        />
      )}
      <FAB icon="plus" onPress={selectDocument} style={styles.fab} color="#fff" />
      <Dialog visible={dialogVisible} style={styles.dialogContainer} onDismiss={handleDialogDismiss}>
        <Dialog.Title style={styles.dialogTitle}>Upload de Documento</Dialog.Title>
        <Dialog.Content>
          <Input
            label="Nome"
            placeholder="Nome do Documento"
            borderColor="#581DB9"
            color="#581DB9"
            returnKeyType="next"
            value={documentName}
            mode="outlined"
            onChangeText={setDocumentName}
            style={styles.input}
            errorText={nameError}
          />
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={handleDialogDismiss}>Cancelar</Button>
          <Button onPress={handleUpload}>OK</Button>
        </Dialog.Actions>
      </Dialog>
    </View>
  );
};
