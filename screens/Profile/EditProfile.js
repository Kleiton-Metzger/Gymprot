import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { getStorage, ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import uuid from 'uuid-random';

import { DismissKeyboard, Input, Button as BTN, BackBtn } from '../../components';
import { Dialog, Portal, Button as PaperButton, RadioButton, Avatar, ActivityIndicator } from 'react-native-paper';
import { useAuth } from '../../Hooks/useAuth';
import { auth, db } from '../../storage/Firebase';
import { styles } from './EditStyle';
import { Ionicons } from '@expo/vector-icons';

export const EditProfile = () => {
  const { currentUser } = useAuth();
  const navigation = useNavigation();
  const [userData, setUserData] = useState(null);
  const [newName, setName] = useState(currentUser.name);
  const [newAge, setAge] = useState(currentUser.age);
  const [newWeight, setWeight] = useState(currentUser.weight);
  const [newHeight, setHeight] = useState(currentUser.height);
  const [newGender, setGender] = useState(currentUser.gender);
  const [newAvatar, setAvatar] = useState(currentUser.avatar);
  const [newBio, setBio] = useState(currentUser.bio); // Adicionando estado para a bio
  const [visible, setVisible] = useState(false);
  const [password, setPassword] = useState('');
  const [uploading, setUploading] = useState(false);

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
        setAvatar(null);
      }
    } catch (error) {
      console.error('Error picking image: ', error);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      setUploading(true);
      const currentUser = auth.currentUser;
      if (!currentUser) {
        console.error('User not signed in');
        return;
      }

      const updates = {};

      if (newName && newName.trim() !== '' && newName !== currentUser.name) updates.name = newName.trim();
      if (newAge && newAge.trim() !== '' && newAge !== currentUser.age) updates.age = newAge.trim();
      if (newWeight && newWeight.trim() !== '' && newWeight !== currentUser.weight) updates.weight = newWeight.trim();
      if (newHeight && newHeight.trim() !== '' && newHeight !== currentUser.height) updates.height = newHeight.trim();
      if (newGender && newGender.trim() !== currentUser.gender) updates.gender = newGender.trim();
      if (newBio && newBio.trim() !== '' && newBio !== currentUser.bio) updates.bio = newBio.trim(); // Adicionando atualização para a bio

      if (password.trim() !== '') {
        try {
          await currentUser.updatePassword(password.trim());
          console.log('Password updated successfully');
        } catch (error) {
          console.error('Error updating password:', error);
        }
      }

      if (newAvatar && currentUser.avatar !== newAvatar) {
        const photoURL = await handleUpdateAvatar(currentUser.uid);
        updates.avatar = photoURL;
      }

      // Navega para o perfil imediatamente
      navigation.navigate('Profile');

      // Atualiza os dados do usuário no banco de dados posteriormente
      if (Object.keys(updates).length > 0) {
        await setDoc(doc(db, 'users', currentUser.uid), updates, { merge: true });
        console.log('Profile updated successfully');
      }

      setUploading(false);
    } catch (error) {
      console.error('Error updating profile: ', error);
      setUploading(false);
    }
  };

  const handleUpdateAvatar = async uid => {
    try {
      const photoURL = await uploadToFirebase(newAvatar, uid);
      await deleteOldAvatar(uid);
      return photoURL;
    } catch (error) {
      console.error('Error updating avatar: ', error);
      throw error;
    }
  };

  const uploadToFirebase = async (uri, uid) => {
    const storage = getStorage();
    const fileName = `${uid}-${uuid()}.png`;
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

  const handleDeleteAvatar = async () => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        console.error('User not signed in');
        return;
      }

      const userDocRef = doc(db, 'users', currentUser.uid);
      const userDocSnap = await getDoc(userDocRef);
      if (!userDocSnap.exists()) {
        console.error('User document does not exist');
        return;
      }

      const userData = userDocSnap.data();
      const oldPhotoURL = userData.avatar;
      console.log('Old Photo URL:', oldPhotoURL);

      await setDoc(userDocRef, { avatar: null }, { merge: true });

      if (oldPhotoURL) {
        const storage = getStorage();
        const oldAvatarRef = ref(storage, oldPhotoURL);
        await deleteObject(oldAvatarRef);
        console.log('Avatar deleted from storage successfully');
      }

      setAvatar(null);
      console.log('Avatar deleted successfully');
    } catch (error) {
      console.error('Error deleting avatar: ', error);
    }
  };

  const deleteOldAvatar = async uid => {
    try {
      const userDocSnap = await getDoc(doc(db, 'users', uid));
      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        const oldPhotoURL = userData.avatar;
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
    <DismissKeyboard style={{ flex: 1, backgroundColor: '#fff' }}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ position: 'absolute', left: 20, top: 15 }}
          activeOpacity={0.8}
        >
          <Ionicons name="arrow-back" size={30} />
        </TouchableOpacity>

        <View style={styles.body}>
          <TouchableOpacity onPress={pickImage}>
            {newAvatar ? (
              <Avatar.Image size={140} source={{ uri: newAvatar }} />
            ) : (
              <Avatar.Image size={130} source={require('../../assets/avatar.png')} />
            )}
          </TouchableOpacity>
          <TouchableOpacity onPress={handleDeleteAvatar} style={styles.deleteButton}>
            <Text style={styles.deleteButtonText}>Remover Avatar</Text>
          </TouchableOpacity>

          <View style={styles.inputContainer}>
            <Input
              mode="outlined"
              label="Nome"
              color="#581DB9"
              underline="#581DB9"
              returnKeyType="next"
              value={newName}
              onChangeText={setName}
              autoCapitalize="words"
              textContentType="name"
              keyboardType="default"
            />

            <View style={styles.rowContainer}>
              <Input
                mode="outlined"
                label="Idade"
                color="#581DB9"
                underline="#581DB9"
                returnKeyType="next"
                value={newAge}
                onChangeText={setAge}
                autoCapitalize="none"
                textContentType="none"
                keyboardType="numeric"
                width={'45%'}
              />
              <Input
                mode="outlined"
                label="Peso"
                color="#581DB9"
                underline="#581DB9"
                returnKeyType="next"
                value={newWeight}
                onChangeText={setWeight}
                autoCapitalize="none"
                textContentType="none"
                keyboardType="numeric"
                width={'45%'}
              />
            </View>
            <Input
              mode="outlined"
              label="Altura"
              color="#581DB9"
              underline="#581DB9"
              returnKeyType="next"
              value={newHeight}
              onChangeText={setHeight}
              autoCapitalize="none"
              textContentType="none"
              keyboardType="numeric"
            />
            <Input
              mode="outlined"
              label="Bio"
              color="#581DB9"
              underline="#581DB9"
              returnKeyType="next"
              value={newBio}
              onChangeText={setBio}
              autoCapitalize="sentences"
              textContentType="none"
              keyboardType="default"
              numberOfLines={4}
              multiline={true}
              maxLength={100}
              style={styles.bioInput}
            />
            <Input
              mode="outlined"
              label="Password"
              color="#581DB9"
              underline="#581DB9"
              returnKeyType="done"
              value={password}
              onChangeText={setPassword}
              autoCapitalize="none"
              textContentType="password"
              keyboardType="default"
              containerStyle={styles.input}
            />
            <Text style={styles.genderopcText}>Selecione o gênero</Text>
            <TouchableOpacity onPress={showDialog} style={styles.genderButton}>
              <Text style={styles.genderButtonText}>
                {newGender
                  ? newGender === '1'
                    ? 'Masculino'
                    : newGender === '2'
                    ? 'Feminino'
                    : 'Outro'
                  : 'Selecione o Gênero'}
              </Text>
            </TouchableOpacity>
            <Portal>
              <Dialog visible={visible} onDismiss={hideDialog}>
                <Dialog.Title>Gênero</Dialog.Title>
                <Dialog.Content>
                  <RadioButton.Group onValueChange={newValue => setGender(newValue)} value={newGender}>
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
            {uploading && <ActivityIndicator size={30} top={15} color="#581DB9" />}
            <BTN onPress={handleUpdateProfile} label="Atualizar" style={styles.buttonContainer} />
          </View>
        </View>
      </KeyboardAvoidingView>
    </DismissKeyboard>
  );
};
