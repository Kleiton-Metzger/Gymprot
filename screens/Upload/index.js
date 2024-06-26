import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import { FAB, List, Dialog, Button, Divider, ActivityIndicator, DataTable } from 'react-native-paper';
import * as DocumentPicker from 'expo-document-picker';
import { getStorage, ref, uploadBytesResumable } from 'firebase/storage';
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

const DocumentItem = React.memo(({ item }) => {
  const handlePress = useCallback(() => {
    alert('Documento ' + item.name);
  }, [item]);

  return (
    <TouchableOpacity onPress={handlePress}>
      <View>
        <List.Item
          title={item.name}
          description={`Criado em: ${formatDate(item.createAt)}`}
          left={() => <List.Icon icon="file-pdf-box" />}
        />
      </View>
      <Divider />
    </TouchableOpacity>
  );
});

export const UploadScreen = () => {
  const [documents, setDocuments] = useState([]);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [documentName, setDocumentName] = useState('');
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [nameError, setNameError] = useState('');
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, 'users', auth.currentUser.uid), docSnap => {
      if (docSnap.exists()) {
        const userData = docSnap.data();
        setUserData(userData);
        setUserId(auth.currentUser.uid);
      } else {
        alert('Erro', 'User não encontrado.');
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

  const uploadDocument = async () => {
    try {
      const document = await DocumentPicker.getDocumentAsync({ type: '*/*' });
      if (!document.canceled) {
        console.log('Documento Selecionado:', document);
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

      setLoading(true);

      const storage = getStorage();
      const documentID = uuidv4();

      let documentType = '';
      let documentUri = '';
      if (selectedDocument.name) {
        const documentNameArray = selectedDocument.name.split('.');
        if (documentNameArray.length > 1) {
          documentType = documentNameArray.pop();
        }
      }
      if (selectedDocument.assets && selectedDocument.assets.length > 0) {
        documentUri = selectedDocument.assets[0].uri;
      }

      const storageRef = ref(storage, `documents/${documentID}.${documentType}`);

      if (!documentName.trim()) {
        setNameError('Por favor, insira um nome para o documento.');
        return;
      }

      await uploadBytesResumable(storageRef, documentUri, () => {
        // Progress callback (optional)
      });

      const documentData = {
        id: documentID,
        userId: userId,
        name: documentName,
        type: documentType,
        createAt: new Date().toISOString(),
        uri: documentUri,
      };

      console.log('Document Data:', documentData);

      const docRef = doc(db, 'documentos', documentID);
      await setDoc(docRef, documentData);

      setDocuments([...documents, documentData]);
      setDialogVisible(false);
      setDocumentName('');
      setSelectedDocument(null);
      setNameError('');
    } catch (error) {
      console.error('Error uploading document:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDialogDismiss = () => {
    setDialogVisible(false);
    alert('Upload Cancelado.');
    setDocumentName('');
    setSelectedDocument(null);
    setNameError('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Os Meus Documentos</Text>
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
                <List.Icon icon="file-pdf-box" />
                <DataTable.Cell>{item.name}</DataTable.Cell>
                <DataTable.Cell>{formatDate(item.createAt)}</DataTable.Cell>
              </DataTable.Row>
            </TouchableOpacity>
          )}
          style={styles.list}
        />
      )}
      <FAB icon="plus-circle" onPress={uploadDocument} style={styles.uploadButtonContainer} color="#fff" />
      <Dialog visible={dialogVisible} style={styles.dialogContainer} onDismiss={handleDialogDismiss}>
        <Dialog.Title style={styles.dialogTitle}>Upload de Documento</Dialog.Title>
        <Dialog.Content>
          <Input
            label="Name"
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
