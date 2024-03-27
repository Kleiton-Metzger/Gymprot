import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { auth, db } from '../../storage/Firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';

export const EditProfile = () => {
    const navigation = useNavigation();

    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [weight, setWeight] = useState('');
    const [height, setHeight] = useState('');
    const [gender, setGender] = useState('');
    const [password, setPassword] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [avatar, setAvatar] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userDocSnap = await getDoc(doc(db, 'users', auth.currentUser.uid));
                if (userDocSnap.exists()) {
                    const userData = userDocSnap.data();
                    setName(userData.name);
                    setAge(userData.age || '');
                    setWeight(userData.weight || '');
                    setHeight(userData.height || '');
                    setGender(userData.gender || '');
                    setAvatar(userData.photoURL);
                }
            } catch (error) {
                console.error('Error fetching user data: ', error);
            }
        };
        fetchUserData();
    }, []);

    const pickImage = async () => {
        try {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                console.error('Permission to access camera roll was denied');
                return;
            }
            
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                quality: 1,
                allowsEditing: true,
                aspect: [4, 3],
            });
            
            if (!result.canceled) {
                setAvatar(result.assets[0].uri);
            }
        } catch (error) {
            console.error('Error picking image: ', error);
        }
    };

    const handleUpdateProfile = async () => {
        try {
            const currentUser = auth.currentUser;
            if (!currentUser) {
                console.error('User not signed in');
                return;
            }

            const updates = {};

            if (name.trim() !== '') {
                updates.name = name.trim();
            }

            if (age.trim() !== '') {
                updates.age = age.trim();
            }

            if (weight.trim() !== '') {
                updates.weight = weight.trim();
            }

            if (height.trim() !== '') {
                updates.height = height.trim();
            }

            if (gender.trim() !== '') {
                updates.gender = gender.trim();
            }

            if (password.trim() !== '') {
                try {
                    await currentUser.updatePassword(password.trim());
                    console.log('Password updated successfully');
                } catch (error) {
                    console.error('Error updating password:', error);
                }
            }

            if (avatar !== null) {
                try {
                    const photoURL = await uploadToFirebase(avatar);
                    updates.photoURL = photoURL;
                    //console.log('Avatar uploaded successfully');
                } catch (error) {
                    console.error('Error uploading avatar:', error);
                }
            }

            if (Object.keys(updates).length > 0) {  
                await setDoc(doc(db, 'users', currentUser.uid), updates, { merge: true });
                console.log('Profile updated successfully'); 
            }

            navigation.navigate('Profile');
        } catch (error) {
            console.error('Error updating profile: ', error);
        }
    };

    const uploadToFirebase = async (uri) => {
        const storage = getStorage();
        const fileName = `${auth.currentUser.uid}-${uuidv4()}.jpg`;
        const storageRef = ref(storage, `avatars/${fileName}`);

        try {
            const response = await fetch(uri);
            if (!response.ok) {
                throw new Error('Failed to fetch the image');
            }

            const blob = await response.blob();
            await uploadBytesResumable(storageRef, blob);
            const photoURL = await getDownloadURL(storageRef);
            return photoURL;
        } catch (error) {
            console.error('Error uploading file: ', error);
            throw error;
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

            <Text style={styles.text}>Nome</Text>
            <TextInput
                style={styles.input}
                placeholder="Nome"
                value={name}
                onChangeText={setName}
            />
            <Text style={styles.text}>Idade</Text>
            <TextInput
                style={styles.input}
                placeholder="Idade"
                value={age}
                onChangeText={setAge}
                keyboardType="numeric"
            />
            <Text style={styles.text}>Peso (kg)</Text>
            <TextInput
                style={styles.input}
                placeholder="Peso"
                value={weight}
                onChangeText={setWeight}
                keyboardType="numeric"
            />
            <Text style={styles.text}>Altura (cm)</Text>
            <TextInput
                style={styles.input}
                placeholder="Altura"
                value={height}
                onChangeText={setHeight}
                keyboardType="numeric"
            />
            <Text style={styles.text}>Genero</Text>
            <TextInput
                style={styles.input}
                placeholder="Genero"
                value={gender}
                onChangeText={setGender}
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
