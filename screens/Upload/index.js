import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { FAB, List, Dialog, Button, Divider, ActivityIndicator } from 'react-native-paper';
import * as DocumentPicker from 'expo-document-picker';
import { getStorage, ref, uploadBytes } from 'firebase/storage';
import { db } from '../../storage/Firebase';
import { doc, setDoc, collection, getDocs } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import { styles } from './styles';
import { Input } from '../../components';

export const UploadScreen = () => {
    const [documents, setDocuments] = useState([]);
    const [dialogVisible, setDialogVisible] = useState(false);
    const [documentName, setDocumentName] = useState('');
    const [selectedDocument, setSelectedDocument] = useState(null);
    const [nameError, setNameError] = useState('');

    useEffect(() => {
        fetchDocuments();
    }, []);

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
                setSelectedDocument(document);
                setDialogVisible(true);
            }
        } catch (error) {
            console.error('Error uploading document:', error);
        }
    };

    const handleUpload = async () => {
        try {
            if (!selectedDocument) {
                console.error('No document selected.');
                return;
            }
            const storage = getStorage();
            const documentID = uuidv4();
            const storageRef = ref(storage, `documents/${documentID}`);
            const uri = selectedDocument.uri;

            if (!documentName.trim()) {
                setNameError('Por favor, insira um nome para o documento.');
                return;
            }

            await uploadBytes(storageRef, uri);

            const documentData = {
                id: documentID,
                name: documentName,
                url: `documents/${documentID}`,
                createAt: new Date().toISOString(),
            };
            const docRef = doc(db, 'documentos', documentID);
            await setDoc(docRef, documentData);

            setDocuments([...documents, documentData]);
            setDialogVisible(false);
            setDocumentName('');
            setSelectedDocument(null);
            setNameError('');
        } catch (error) {
            console.error('Error uploading document:', error);
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
    <Text style={styles.title}>Os Meus Documentos</Text>
    <ScrollView style={styles.body}>
        <List.Section style={styles.list}>
            {documents.map((item, index) => (
                <TouchableOpacity key={index} onPress={() => alert('Document ' + item.name)}>
                    <View>
                        <List.Item title={item.name} left={() => <List.Icon icon="file-pdf-box" />} />
                    </View>
                </TouchableOpacity>
            ))}
            <Divider />
        </List.Section>
    </ScrollView>
    <FAB
        icon="plus-circle"
        onPress={uploadDocument}
        style={styles.uploadButtonContainer}
        color="#fff"
    />

    <Dialog visible={dialogVisible} style={styles.dialogContainer} onDismiss={handleDialogDismiss}>
        <Dialog.Title style={styles.dialogTitle}>Upload de Documento</Dialog.Title>
        <Dialog.Content>
            <Input
                label='Name'
                placeholder='Nome do Documento'
                borderColor="#581DB9"
                color="#581DB9"
                returnKeyType='next'
                value={documentName}
                mode='outlined'
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
