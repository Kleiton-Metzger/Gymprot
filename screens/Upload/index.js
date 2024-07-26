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
import * as FileSystem from 'expo-file-system';

export const UploadScreen = () => {
  const [documents, setDocuments] = useState([]);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [docName, setDocName] = useState('');
  const { currentUser } = useAuth();

  const handleDocumentSelection = async () => {
    try {
      const document = await DocumentPicker.getDocumentAsync();
      if (document.type !== 'cancel') {
        setSelectedDoc(document.assets[0].uri);
        setDocName(document.assets[0].name);
        console.log('Documento selecionado:', document);
        Alert.alert('Enviar Documento', `Deseja enviar o documento ${document.assets[0].name}?`, [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Enviar', onPress: () => uploadDocument() },
        ]);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const uploadDocument = async () => {
    try {
      const storage = getStorage();
      const storageRef = ref(storage, `documents/${currentUser.uid}/${docName}`);

      const response = await fetch(selectedDoc);
      const blob = await response.blob();
      const uploadTask = uploadBytesResumable(storageRef, blob);
      uploadTask.on('state_changed', snapshot => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(`Upload is ${progress}% done`);
        switch (snapshot.state) {
          case 'paused':
            console.log('Upload is paused');
            break;
          case 'running':
            console.log('Upload is running');
            break;
        }
      });
    } catch (error) {
      console.log('Erro ao enviar documento:', error);
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
        style={styles.body}
        data={documents}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.listItem} onPress={() => Linking.openURL(item.uri)}>
            <List.Item
              title={item.name}
              description={new Date(item.createdAt).toLocaleDateString()}
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
