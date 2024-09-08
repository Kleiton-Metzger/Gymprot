import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  SafeAreaView,
  ScrollView,
  Alert,
  Modal,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../../Hooks/useAuth';
import { unregisterIndieDevice } from 'native-notify';
import { auth } from '../../../storage/Firebase';
import { EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';

export const Configurations = () => {
  const navigation = useNavigation();
  const { currentUser, signOut, deleteUser } = useAuth();
  const [modalVisible, setModalVisible] = useState(false);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      unregisterIndieDevice(currentUser.email, 22648, 'ORCAvOl2Mp53Ll26YDq01d');
      navigation.replace('Login');
    } catch (error) {
      console.log('Error signing out:', error.message);
    }
  };

  const handleDeleteAccount = () => {
    setModalVisible(true);
  };

  const handleConfirmDeleteAccount = async () => {
    setLoading(true);
    try {
      const credential = EmailAuthProvider.credential(auth.currentUser.email, password); // Use the input password
      await reauthenticateWithCredential(auth.currentUser, credential);
      await deleteUser();
      unregisterIndieDevice(currentUser.email, 22648, 'ORCAvOl2Mp53Ll26YDq01d');
      navigation.replace('Login');
    } catch (error) {
      console.log('Error deleting account:', error.message);
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
      setModalVisible(false);
    }
  };

  if (!currentUser) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#581DB9" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton} activeOpacity={0.8}>
          <Ionicons name="arrow-back" size={30} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>Configurações</Text>
      </View>
      <ScrollView contentContainerStyle={styles.settingsContainer}>
        <TouchableOpacity style={styles.setting} onPress={() => navigation.navigate('EditProfileScreen')} opacity={0.8}>
          <Text style={styles.settingText}>Editar Perfil</Text>
        </TouchableOpacity>
        <View
          style={{ height: 1, width: '90%', alignSelf: 'center', backgroundColor: 'lightgrey', marginBottom: 10 }}
        />
        <TouchableOpacity
          style={styles.setting}
          onPress={() => navigation.navigate('NotificationScreen')}
          opacity={0.8}
        >
          <Text style={styles.settingText}>Notificações</Text>
        </TouchableOpacity>
        <View
          style={{ height: 1, width: '90%', alignSelf: 'center', backgroundColor: 'lightgrey', marginBottom: 10 }}
        />
        <TouchableOpacity
          style={styles.setting}
          onPress={() => navigation.navigate('PoliticaPrivacidade')}
          opacity={0.8}
        >
          <Text style={styles.settingText}>Política de Privacidade</Text>
        </TouchableOpacity>
        <View
          style={{ height: 1, width: '90%', alignSelf: 'center', backgroundColor: 'lightgrey', marginBottom: 10 }}
        />
        <TouchableOpacity style={styles.setting} onPress={() => handleSignOut()} opacity={0.8}>
          <Text style={styles.settingText}>Sair</Text>
        </TouchableOpacity>
      </ScrollView>
      <View style={{ flex: 1 }} />
      <TouchableOpacity style={styles.deletAccount} onPress={() => handleDeleteAccount()} opacity={0.8}>
        <Text style={styles.deletAccountText}>Apagar Conta</Text>
      </TouchableOpacity>
      <Text style={{ textAlign: 'center', marginBottom: 20, color: 'black' }}>Versão 1.0.0</Text>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Para apagar a sua conta, insira a sua palavra-passe</Text>
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <View style={styles.modalButtonContainer}>
            <TouchableOpacity style={styles.buttonCancel} onPress={() => setModalVisible(false)}>
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonDelete} onPress={handleConfirmDeleteAccount} disabled={loading}>
              <Text style={styles.buttonText}>{loading ? 'A apagar...' : 'Apagar'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
  },
  settingsContainer: {
    padding: 20,
  },
  setting: {
    backgroundColor: '#F7F7F7',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    justifyContent: 'center',
  },
  settingText: {
    fontSize: 16,
    color: '#333',
  },
  deletAccount: {
    backgroundColor: '#DC143C',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    justifyContent: 'center',
    marginHorizontal: 20,
  },
  deletAccountText: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
  },
  modalView: {
    top: '40%',
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    width: '80%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  buttonCancel: {
    backgroundColor: 'lightgray',
    padding: 10,
    borderRadius: 5,
    width: '45%',
    alignItems: 'center',
  },
  buttonDelete: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    width: '45%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default Configurations;
