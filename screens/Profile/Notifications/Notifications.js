import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text, SafeAreaView, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

export const Notifications = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton} activeOpacity={0.8}>
          <Ionicons name="arrow-back" size={30} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>Notificações</Text>
      </View>

      <ScrollView contentContainerStyle={styles.notificationsContainer}>
        <View style={styles.notification}>
          <Text style={styles.notificationText}>Nenhuma notificação ainda.</Text>
        </View>
      </ScrollView>
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
  notificationsContainer: {
    padding: 20,
  },
  notification: {
    backgroundColor: '#F7F7F7',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  notificationText: {
    fontSize: 16,
    color: '#333',
  },
});

export default Notifications;
