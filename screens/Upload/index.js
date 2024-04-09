import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TextInput } from 'react-native';
import { FAB, List, Dialog, Button, Divider } from 'react-native-paper';
import * as DocumentPicker from 'expo-document-picker';
import { getStorage, ref, uploadBytes } from 'firebase/storage';
import { db } from '../../storage/Firebase';
import { doc, setDoc, collection, getDocs } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid'; // Importing uuidv4 for generating unique IDs
import { styles } from './styles';

export const UploadScreen = () => {
    const [documents, setDocuments] = useState([]);
    const [dialogVisible, setDialogVisible] = useState(false);
    const [documentName, setDocumentName] = useState('');
    const [selectedDocument, setSelectedDocument] = useState(null); // Adicionando estado para armazenar o documento selecionado

    useEffect(() => {
        fetchDocuments(); // Fetch documents when the component mounts
    }, []); // Empty dependency array ensures this effect runs only once

    const fetchDocuments = async () => {
        try {
            const documentsSnapshot = await getDocs(collection(db, 'documentos'));
            const documentsData = documentsSnapshot.docs.map(doc => doc.data());
            setDocuments(documentsData);
        } catch (error) {
            console.error('Error fetching documents:', error);
        }
    };

    const uploadDocument = async () => {
        try {
            const document = await DocumentPicker.getDocumentAsync({ type: 'application/pdf' });
            if (document.type !== 'cancel') {
                setDialogVisible(true);
                setSelectedDocument(document); // Armazenar o documento selecionado
            }
        } catch (error) {
            console.error('Error uploading document:', error);
        }
    };

    const handleUpload = async () => {
        try {
            const storage = getStorage();
            const documentID = uuidv4(); // Generate a unique ID for the document
            const storageRef = ref(storage, `documents/${documentID}`);
            await uploadBytes(storageRef, selectedDocument.uri); // Usar o documento selecionado

            const documentData = {
                id: documentID, // Assign the unique ID to the document
                name: documentName,
                url: `documents/${documentID}` // Use the document ID in the URL
            };
            const docRef = doc(db, 'documentos', documentID);
            await setDoc(docRef, documentData);

            setDocuments([...documents, documentData]);
            setDialogVisible(false);
            setDocumentName('');
            setSelectedDocument(null); // Limpar o documento selecionado após o upload
        } catch (error) {
            console.error('Error uploading document:', error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Meus Documentos</Text>
            <ScrollView style={styles.body}>
                <List.Section style={styles.list}>
                    {documents.map((item, index) => (
                        <View key={index}>
                            <List.Item title={item.name} left={() => <List.Icon icon="file-pdf-box" />} />
                            <Divider />
                        </View>
                    ))}
                </List.Section>
            </ScrollView>
            <FAB
                icon="plus-circle"
                onPress={uploadDocument}
                style={styles.uploadButtonContainer}
                color="#fff"
                //size={20}
            />
            <Dialog visible={dialogVisible} onDismiss={() => setDialogVisible(false)}>
                <Dialog.Title style={styles.dialogTitle}>Upload de Documento</Dialog.Title>
                <Dialog.Content>
                    <TextInput
                        label="Nome do Documento"
                        value={documentName}
                        onChangeText={text => setDocumentName(text)}
                        style={styles.input}
                    />
                </Dialog.Content>
                <Dialog.Actions>
                    <Button onPress={handleUpload}>Confirmar</Button>
                </Dialog.Actions>
            </Dialog>
        </View>
    );
};
