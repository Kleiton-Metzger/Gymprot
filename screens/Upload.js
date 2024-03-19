import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { getStorage, ref, uploadFile, getDownloadURL } from 'firebase/storage';
import { auth, db } from '../storage/Firebase';
import { doc, setDoc } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';

export const UploadScreen = () => {
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
    },
    container2: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(154, 151, 151, 1)',
        width: 350,
        height: '50%',
        position: 'absolute',
        top: '30%',
        borderRadius: 25,
        borderColor: 'black',
        borderWidth: 1,
    },
    text: {
        fontSize: 40,
        fontWeight: 'bold',
        position: 'absolute',
        padding: '20%',
        top: 30,
    },
    subtext: {
        fontSize: 15,
        position: 'absolute',
        padding: '20%',
        top: 100,
    },
    buttonContainer: {
        backgroundColor: 'rgba(88, 29, 185, 1)',
        padding: 15,
        width: 250,
        alignItems: 'center',
        borderRadius: 25,
        top: 20,
        borderColor: 'black',
        borderWidth: 1,
        marginBottom: 20,
    },
    buttonText: {
        color: 'white',
        fontSize: 20,
    },
});
