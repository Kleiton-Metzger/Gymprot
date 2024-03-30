import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { getStorage, ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { auth, db } from '../../storage/Firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import { DismissKeyboard, Input, Button as BTN, BackBtn } from '../../components'
import { Dialog, Portal, Button as PaperButton, RadioButton, Avatar } from 'react-native-paper';

export const EditProfile = () => {
    const navigation = useNavigation();
    const [userData, setUserData] = useState(null);
    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [weight, setWeight] = useState('');
    const [height, setHeight] = useState('');
    const [gender, setGender] = useState('');
    const [password, setPassword] = useState('');
    const [avatar, setAvatar] = useState(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userDocSnap = await getDoc(doc(db, 'users', auth.currentUser.uid));
                if (userDocSnap.exists()) {
                    const userData = userDocSnap.data();
                    setUserData(userData);
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
            } else {
                // Se o usuário cancelou a seleção da imagem, mantenha o avatar como null
                setAvatar(null);
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
    
            if (name.trim() !== '' && name !== userData.name) updates.name = name.trim();
            if (age.trim() !== '' && age !== userData.age) updates.age = age.trim();
            if (weight.trim() !== '' && weight !== userData.weight) updates.weight = weight.trim();
            if (height.trim() !== '' && height !== userData.height) updates.height = height.trim();
            if (gender.trim() !== '' && gender !== userData.gender) updates.gender = gender.trim();
    
            if (password.trim() !== '') {
                try {
                    await currentUser.updatePassword(password.trim());
                    console.log('Password updated successfully');
                } catch (error) {
                    console.error('Error updating password:', error);
                }
            }
    
            if (avatar && userData.photoURL !== avatar) {
                const photoURL = await handleUpdateAvatar(currentUser.uid);
                updates.photoURL = photoURL;
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
    
    const handleUpdateAvatar = async (uid) => {
        try {
            const photoURL = await uploadToFirebase(avatar, uid);
            await deleteOldAvatar(uid);
            return photoURL;
        } catch (error) {
            console.error('Error updating avatar: ', error);
            throw error;
        }
    }
            
    const uploadToFirebase = async (uri, uid) => {
        const storage = getStorage();
        const fileName = `${uid}-${uuidv4()}.png`;
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

    const deleteOldAvatar = async (uid) => {
        try {
            const userDocSnap = await getDoc(doc(db, 'users', uid));
            if (userDocSnap.exists()) {
                const userData = userDocSnap.data();
                const oldPhotoURL = userData.photoURL;
                if (oldPhotoURL) {
                    const storage = getStorage();
                    const oldAvatarRef = ref(storage, oldPhotoURL);
                    await deleteObject(oldAvatarRef);
                }
            }
        } catch (error) {
            if (error.code === 'storage/object-not-found') {
                console.log('Old avatar not found in storage');
            } else {
                console.error('Error deleting old avatar:', error.code, error.message);
            }
        }
    };

    const hideDialog = () => setVisible(false);
    const showDialog = () => setVisible(true);

    return (
        <DismissKeyboard>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
                <BackBtn label="Voltar" onPress={() => navigation.goBack()} />
                <View style={styles.body}>
                    <TouchableOpacity onPress={pickImage}>
                        {avatar ? (
                            <Avatar.Image size={150} source={{ uri: avatar }} />
                        ) : (
                            <Avatar.Image size={150} source={require('../../assets/avatar.png')} />
                        )}
                    </TouchableOpacity>

                    <View style={styles.inputContainer}>
                        <Input
                            mode='outlined'
                            label='Name'
                            color='#581DB9'
                            underline='#581DB9'
                            returnKeyType='next'
                            value={name}
                            onChangeText={setName}
                            autoCapitalize='words'
                            textContentType='name'
                            keyboardType='default'
                        />
                        <View style={styles.rowContainer}>
                            <Input
                                mode='outlined'
                                label='Idade'
                                color='#581DB9'
                                underline='#581DB9'
                                returnKeyType='next'
                                value={age}
                                onChangeText={setAge}
                                autoCapitalize='none'
                                textContentType='none'
                                keyboardType='numeric'
                                width={"45%"}
                            />
                            <Input
                                mode='outlined'
                                label='Peso'
                                color='#581DB9'
                                underline='#581DB9'
                                returnKeyType='next'
                                value={weight}
                                onChangeText={setWeight}
                                autoCapitalize='none'
                                textContentType='none'
                                keyboardType='numeric'
                                width={"45%"}
                            />
                        </View>
                        <Input
                            mode='outlined'
                            label='Altura'
                            color='#581DB9'
                            underline='#581DB9'
                            returnKeyType='next'
                            value={height}
                            onChangeText={setHeight}
                            autoCapitalize='none'
                            textContentType='none'
                            keyboardType='numeric'
                        />
                        <Input
                            mode='outlined'
                            label='Password'
                            color='#581DB9'
                            underline='#581DB9'
                            returnKeyType='done'
                            value={password}
                            onChangeText={setPassword}
                            autoCapitalize='none'
                            textContentType='password'
                            keyboardType='default'
                            containerStyle={styles.input}
                        />
                         <Text style={styles.genderopcText}>Selecione o gênero</Text>
                        <TouchableOpacity onPress={showDialog} style={styles.genderButton}>
                            <Text style={styles.genderButtonText}>{gender ? (gender === '1' ? 'Masculino' : gender === '2' ? 'Feminino' : 'Outro') : 'Selecione o Gênero'}</Text>
                        </TouchableOpacity>
                        <Portal>
                            <Dialog visible={visible} onDismiss={hideDialog}>
                                <Dialog.Title>Gênero</Dialog.Title>
                                <Dialog.Content>
                                    <RadioButton.Group onValueChange={newValue => setGender(newValue)} value={gender}>
                                        <RadioButton.Item label="Masculino" value="1" />
                                        <RadioButton.Item label="Feminino" value="2" />
                                        <RadioButton.Item label="Outro" value="3" />
                                    </RadioButton.Group>
                                </Dialog.Content>
                                <Dialog.Actions>
                                    <PaperButton onPress={hideDialog}>Cancelar</PaperButton>
                                    <PaperButton onPress={hideDialog}>OK</PaperButton>
                                </Dialog.Actions>
                            </Dialog>
                        </Portal>
                        <BTN onPress={handleUpdateProfile} label="Atualizar" style={styles.buttonContainer} />
                    </View>
                </View>
            </KeyboardAvoidingView>
        </DismissKeyboard>

    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    body: {
        justifyContent: 'center',
        alignItems: 'center',
        width: "100%",
        marginTop: "20%",
    },
    inputContainer: {
        width: "100%",
        alignItems: 'center',
        justifyContent: 'center',
    },
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 20,
    },
    buttonContainer: {
        backgroundColor: 'rgba(88, 29, 185, 1)',
        padding: 10,
        width: '40%',
        alignItems: 'center',
        borderRadius: 5,
        marginVertical: 10,
        top: 20,
    },
    genderButton: {
        marginTop: 10,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderWidth: 1,
        borderColor: '#581DB9',
        borderRadius: 5,
        backgroundColor: '#fff',
    },
    genderButtonText: {
        color: '#581DB9',
        fontSize: 16,
    },
    genderopcText: {
        color: 'black',
        fontSize: 16,
        marginTop: 10,
    },
});
