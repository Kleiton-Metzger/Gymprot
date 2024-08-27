import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text, SafeAreaView, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../../Hooks/useAuth';
import { unregisterIndieDevice } from 'native-notify';

export const Configurations = () => {
  const navigation = useNavigation();
  const { currentUser, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      unregisterIndieDevice(currentUser.email, 22648, 'ORCAvOl2Mp53Ll26YDq01d');
      navigation.replace('Login');
    } catch (error) {
      console.log('Error signing out:', error.message);
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
        <TouchableOpacity style={styles.setting} onPress={() => handleSignOut()} opacity={0.8}>
          <Text style={styles.settingText}>Sair</Text>
        </TouchableOpacity>
      </ScrollView>
      <View style={{ flex: 1 }} />
      <Text style={{ textAlign: 'center', marginBottom: 20, color: 'black' }}>Versão 1.0.0</Text>
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
});

export default Configurations;
