import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { getStorage, ref, uploadFile, getDownloadURL } from 'firebase/storage';
import { auth, db } from '../../storage/Firebase';
import { doc, setDoc } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import styles from './styles';
import { AuthContext } from '../../contexts/auth';

export const UploadScreen = () => {
    const { userData } = React.useContext(AuthContext);

    const handleFileUpload = async (type) => {
        try {
            const document = await DocumentPicker.getDocumentAsync({ type: type });
            if (document.type === 'success') {
                const { uri } = document;
                if (type === 'video') {
                    await uploadToFirebase(uri, 'video');
                } else if (type === 'application/pdf') {
                    await uploadToFirebase(uri, 'pdf');
                }
            }
        } catch (error) {
            console.error('Error picking file: ', error);
        }
    };

    const uploadToFirebase = async (uri, fileType) => {
        try {
            const storage = getStorage();
            const fileName = `${auth.currentUser.uid}-${uuidv4()}.${fileType}`;
            const storageRef = ref(storage, `uploads/${fileName}`);
            const uploadTask = uploadFile(storageRef, uri);

            await uploadTask;
            console.log(`${fileType.toUpperCase()} uploaded successfully`);
            const downloadURL = await getDownloadURL(storageRef);

            // Salvando a URL do documento e a referência do usuário no Firestore
            await saveDocumentToFirestore(downloadURL, fileType);

            console.log(`${fileType.toUpperCase()} URL:`, downloadURL);
        } catch (error) {
            console.error(`Error uploading ${fileType}: `, error);
        }
    };

    const saveDocumentToFirestore = async (downloadURL, fileType) => {
        try {
            const userRef = doc(db, 'users', auth.currentUser.uid);
            const userDoc = await getDoc(userRef);

            if (userDoc.exists()) {
                const userData = userDoc.data();

                // Salvando a URL do documento e a referência do usuário
                await setDoc(doc(db, 'uploads', uuidv4()), {
                    userId: auth.currentUser.uid,
                    userName: userData.name,
                    downloadURL: downloadURL,
                    fileType: fileType,
                });
            } else {
                console.error('User data not found');
            }
        } catch (error) {
            console.error('Error saving document to Firestore: ', error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Uploads</Text>
            <Text style={styles.subtext}>Select the file type you want to upload</Text>
            <Text style={styles.usrname}>User: {userData.name}</Text>
            <View style={styles.container2}>
                <TouchableOpacity
                    style={styles.buttonContainer}
                    onPress={() => handleFileUpload('video')}>
                    <Text style={styles.buttonText}>Upload Video</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.buttonContainer}
                    onPress={() => handleFileUpload('application/pdf')}>
                    <Text style={styles.buttonText}>Upload PDF</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
