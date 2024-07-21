import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, Linking } from 'react-native';
import { FAB, DataTable, List } from 'react-native-paper';
import * as DocumentPicker from 'expo-document-picker';
import { db } from '../../storage/Firebase';
import { doc, setDoc, collection, getDocs } from 'firebase/firestore';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import uuid from 'uuid-random';
import { styles } from './styles';
import { useAuth } from '../../Hooks/useAuth';

export const UploadScreen = () => {
  const [documents, setDocuments] = useState([]);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [docName, setDocName] = useState('');
  const { currentUser } = useAuth();

  const handleDocumentSelection = async () => {
    try {
      const doc = await DocumentPicker.getDocumentAsync();
      if (doc.type === 'cancel') {
        Alert.alert('Error', 'Document selection was cancelled.');
        return;
      }
      console.log('Document Data:', doc);

      const response = await fetch(doc.uri);
      if (!response.ok) {
        throw new Error('Failed to fetch the document');
      }
      const blob = await response.blob();
      setSelectedDoc({ ...doc, blob });
      setDocName(doc.name);
      await handleSendDocToFirebase(doc.name, blob);
    } catch (err) {
      console.error('Error selecting document:', err);
      Alert.alert('Error', 'An error occurred while selecting the document. Please try again.');
    }
  };

  const handleSendDocToFirebase = async (fileName, blobFile) => {
    try {
      const storage = getStorage();
      const uniqueId = uuid();
      const storageRef = ref(storage, `documents/${fileName}-${uniqueId}.pdf`);
      console.log('Storage Ref:', storageRef);

      const uploadTask = uploadBytesResumable(storageRef, blobFile);

      uploadTask.on(
        'state_changed',
        snapshot => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');
        },
        error => {
          console.error('Error uploading document:', error);
          Alert.alert('Error', 'Failed to upload the document. Please check your internet connection and try again.');
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          console.log('File available at', downloadURL);
          await saveDocumentData(downloadURL, fileName, blobFile.size);
        },
      );
    } catch (err) {
      console.error('Error uploading document:', err);
      Alert.alert('Error', 'Failed to upload the document. Please try again.');
    }
  };

  const saveDocumentData = async (downloadURL, name, size) => {
    try {
      const docRef = doc(collection(db, 'documents'));
      const docData = {
        name,
        uri: downloadURL,
        createdAt: new Date(),
        size,
        userId: currentUser.uid,
      };
      await setDoc(docRef, docData);
      console.log('Document successfully written!');
      fetchDocuments();
    } catch (error) {
      console.error('Error writing document: ', error);
      Alert.alert('Error', 'Failed to save document data. Please try again.');
    }
  };

  const fetchDocuments = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'documents'));
      const docs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setDocuments(docs);
    } catch (error) {
      console.error('Error fetching documents: ', error);
      Alert.alert('Error', 'Failed to fetch documents. Please try again.');
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Meus Documentos</Text>
      <DataTable.Header style={styles.subTitles}>
        <DataTable.Title style={styles.fileName}>Nome</DataTable.Title>
        <DataTable.Title style={styles.fileData}>Data de Criação</DataTable.Title>
      </DataTable.Header>
      <FlatList
        style={styles.body}
        data={documents}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.listItem} onPress={() => Linking.openURL(item.uri)}>
            <List.Item
              title={item.name}
              description={new Date(item.createdAt.seconds * 1000).toLocaleDateString()}
              left={props => <List.Icon {...props} icon="file" />}
            />
            <Text style={styles.fileData}>{item.size} bytes</Text>
          </TouchableOpacity>
        )}
      />
      <FAB icon="plus" style={styles.fab} color="white" onPress={handleDocumentSelection} />
    </View>
  );
};
