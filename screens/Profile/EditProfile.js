import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { getStorage, ref, uploadString, getDownloadURL } from 'firebase/storage';
import { auth, db } from '../../storage/Firebase'; // Import 'auth' from Firebase
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';

export default function EditProfile() {
    const navigation = useNavigation();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [avatar, setAvatar] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userDocRef = doc(db, 'users', auth.currentUser.uid);
                const userDocSnap = await getDoc(userDocRef);
                if (userDocSnap.exists()) {
                    const userData = userDocSnap.data();
                    setName(userData.name);
                    setEmail(userData.email);
                    setAvatar(userData.photoURL);
                }
            } catch (error) {
                console.error('Error fetching user data: ', error);
            }
        };
        fetchUserData();
    }, []);

    const pickImage = async () => {
        const options = {
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            quality: 1,
            allowsEditing: true,
            aspect: [4, 3],
        };
        try {
            const result = await ImagePicker.launchImageLibraryAsync(options);
            if (!result.cancelled) {
                setAvatar(result.uri);
            }
        } catch (error) {
            console.error('Error picking image: ', error);
        }
    };

    const handleUpdateProfile = async () => {
        try {
            if (auth.currentUser) {
                const promises = [];
                if (email !== '' && auth.currentUser.email !== email) {
                    promises.push(auth.currentUser.updateEmail(email));
                }
                if (password !== '') {
                    promises.push(auth.currentUser.updatePassword(password));
                }
                if (name !== '') {
                    promises.push(setDoc(doc(db, 'users', auth.currentUser.uid), { name }, { merge: true }));
                }
                if (avatar !== null) {
                    promises.push(uploadToFirebase(avatar));
                }

                await Promise.all(promises);
                
                console.log('Profile updated successfully');
                navigation.navigate('Profile');
            } else {
                console.error('User not signed in');
            }
        } catch (error) {
            console.error('Error updating profile: ', error);
        }
    };

    const uploadToFirebase = async (uri) => {
        const storage = getStorage();
        const fileName = `${auth.currentUser.uid}-${uuidv4()}.jpg`; // Ensure the file extension is correct
        const storageRef = ref(storage, `avatars/${fileName}`);
        
        try {
            const response = await fetch(uri);
            const blob = await response.blob();
            const reader = new FileReader();
            
            reader.onload = async () => {
                const dataURL = reader.result;
                const uploadTask = uploadString(storageRef, dataURL, 'data_url'); // Upload the data URL
                try {
                    await uploadTask;
                    console.log('Upload successful');
                    const photoURL = await getDownloadURL(storageRef);
                    await setDoc(doc(db, 'users', auth.currentUser.uid), { photoURL }, { merge: true });
                } catch (error) {
                    console.error('Error uploading file: ', error);
                }
            };
            
            reader.readAsDataURL(blob); // Convert blob to data URL
        } catch (error) {
            console.error('Error fetching image: ', error);
        }
    };

    return (
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : null}>
            <TouchableOpacity style={styles.backContainer} onPress={() => navigation.navigate('Profile')}>
                <Image source={require('../../assets/back.png')} style={styles.backbtn} />
                <Text style={styles.backtxt}>Profile</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.avatarContainer} onPress={pickImage}>
                <Image source={avatar ? { uri: avatar } : require('../../assets/avatar.jpg')} style={styles.avatar} />
            </TouchableOpacity>

            <Text style={styles.text}>Name</Text>
            <TextInput
                style={styles.input}
                placeholder="Name"
                value={name}
                onChangeText={setName}
            />
            <Text style={styles.text}>Email</Text>
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
            />
            <Text style={styles.text}>Password</Text>
            <View style={styles.passwordInputContainer}>
                <TextInput
                    style={styles.passwordInput}
                    placeholder="Password"
                    value={password}
                    secureTextEntry={!passwordVisible}
                    onChangeText={setPassword}
                />
                <TouchableOpacity
                    style={styles.visibilityIcon}
                    onPress={() => setPasswordVisible(!passwordVisible)}>
                    <Image
                        source={passwordVisible ? require('../../assets/eye-open.png') : require('../../assets/eye-closed.png')}
                        style={styles.eyeIcon}
                    />
                </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.buttonContainer} onPress={handleUpdateProfile}>
                <Text style={styles.buttonText}>Update</Text>
            </TouchableOpacity>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
    },
    backContainer: {
        position: 'absolute',
        top: 50,
        left: 20,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
    },
    backbtn: {
        width: 30,
        height: 30,
        marginRight: 10,
    },
    backtxt: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'black',
    },
    avatarContainer: {
        marginBottom: 20,
    },
    avatar: {
        width: 150,
        height: 150,
        borderRadius: 75,
        borderColor: 'black',
        borderWidth: 1,
    },
    text: {
        color: 'black',
        fontWeight: 'bold',
        fontSize: 15,
        textAlign: 'left',
        width: '80%',
        marginBottom: 10,
    },
    input: {
        width: '80%',
        height: 40,
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: 'black',
        marginBottom: 20,
        paddingLeft: 10,
        borderRadius: 25,
    },
    buttonContainer: {
        backgroundColor: 'rgba(88, 29, 185, 1)',
        padding: 15,
        width: '45%',
        alignItems: 'center',
        borderRadius: 25,
        top: 20,
        borderColor: 'black',
        borderWidth: 1,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 20,
    },
    passwordInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '80%',
        marginBottom: 20,
        borderRadius: 25,
        borderColor: 'black',
        borderWidth: 1,
        backgroundColor: 'white',
    },
    passwordInput: {
        flex: 1,
        height: 40,
        paddingLeft: 10,
    },
    visibilityIcon: {
        padding: 10,
    },
    eyeIcon: {
        width: 20,
        height: 20,
    },
});
