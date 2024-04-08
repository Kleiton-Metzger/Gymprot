import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { getStorage, ref, uploadFile, getDownloadURL, uploadBytes } from 'firebase/storage';
import { auth, db } from '../../storage/Firebase';
import { doc, setDoc } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import styles from './styles';


export const UploadScreen = () => {

    const handleFileUpload = async (type) => {
        try {
            const document = await DocumentPicker.getDocumentAsync({ type: type });
            if (document.type === 'success') {
                const { uri } = document;
               
                    await uploadToFirebase(uri);
             
            }
        } catch (error) {
            console.error('Error picking file: ', error);
        }
    };

    const uploadToFirebase = async (uri, type) => {
        const storage = getStorage();
        const userId = auth.currentUser.uid;
        const uniqueId = uuidv4();
        const storageRef = ref(storage, `${type}s/${userId}/${uniqueId}`);
        const uploadTask = uploadFile(storageRef, uri);
        uploadTask.on('state_changed',
            (snapshot) => {
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
            },
            (error) => {
                console.error('Error uploading file: ', error);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
                    console.log('File available at', downloadURL);
                    await saveFileToFirestore(downloadURL, type, userId, uniqueId);
                });
            }
        );
    };

    const saveFileToFirestore = async (url, type, userId, uniqueId) => {
        try {
            const docRef = doc(db, 'files', uniqueId);
            await setDoc(docRef, {
                url: url,
                type: type,
                userId: userId,
                createdAt: new Date()
            });
            console.log('File saved to Firestore');
        } catch (error) {
            console.error('Error saving file to Firestore: ', error);
        }
    };

   

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Uploads</Text>
            <Text style={styles.subtext}>Select the file type you want to upload</Text>
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
