import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  SafeAreaView,
  ScrollView,
  Alert,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../../../components/common/Button';
import { getIndieNotificationInbox, deleteIndieNotificationInbox } from 'native-notify';
import { getNotificationInbox } from 'native-notify';
import axios from 'axios';
import { Octicons } from '@expo/vector-icons';
import { useAuth } from '../../../Hooks/useAuth';

export const Notifications = () => {
  const navigation = useNavigation();
  const { currentUser } = useAuth();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [notificationIdToDelete, setNotificationIdToDelete] = useState(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await getNotificationInbox(22648, 'ORCAvOl2Mp53Ll26YDq01d');
        console.log('API Response:', response);
        if (Array.isArray(response)) {
          setData(response);
        } else {
          console.error('Unexpected API response:', response);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching notifications:', error);
        Alert.alert('Erro', 'Não foi possível carregar as notificações.');
        setLoading(false);
      }
    };

    fetchNotifications();

    return () => {
      setData([]);
      setLoading(true);
    };
  }, []);
  const handleDeleteNotification = async notificationId => {
    console.log('Deleting notification:', notificationId);
    try {
      const notifications = await deleteIndieNotificationInbox(
        currentUser.userId,
        notificationId,
        22648,
        'ORCAvOl2Mp53Ll26YDq01d',
      );
      console.log('Deleted notifications:', notifications);
      setData(notifications);
      setShowDeleteConfirmation(false);
    } catch (error) {
      console.error('Error deleting notification:', error);
      Alert.alert('Erro', 'Não foi possível apagar a notificação.');
    }
  };

  const confirmDeleteNotification = notificationId => {
    setNotificationIdToDelete(notificationId);
    setShowDeleteConfirmation(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton} activeOpacity={0.8}>
          <Ionicons name="arrow-back" size={30} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>Notificações</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#581DB9" style={{ marginTop: '70%' }} />
      ) : (
        <ScrollView contentContainerStyle={styles.notificationsContainer}>
          {data.length > 0 ? (
            data.map((notification, index) => (
              <View key={index} style={styles.notification}>
                <View style={styles.notificationContent}>
                  <TouchableOpacity>
                    <Text style={styles.notificationTitle}>{notification.title}</Text>
                    <Text style={styles.notificationText}>{notification.message}</Text>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => confirmDeleteNotification(notification.notification_id)}
                >
                  <Octicons name="trash" size={24} color="red" />
                </TouchableOpacity>
              </View>
            ))
          ) : (
            <Text style={{ textAlign: 'center', color: '#A0A0A0' }}>Nenhuma notificação</Text>
          )}
        </ScrollView>
      )}

      <Modal
        visible={showDeleteConfirmation}
        animationType="slide"
        onRequestClose={() => setShowDeleteConfirmation(false)}
        transparent
      >
        <View style={styles.overlay}>
          <View style={styles.confirmationModalContainer}>
            <Text style={styles.confirmationText}>Tem certeza que deseja excluir esta notificação?</Text>
            <View style={styles.confirmationButtonsContainer}>
              <Button
                onPress={() => setShowDeleteConfirmation(false)}
                label="Cancelar"
                style={[styles.modalButton, { marginRight: 10 }]}
              />
              <Button
                onPress={() => handleDeleteNotification(notificationIdToDelete)}
                label="Confirmar"
                style={styles.modalButton}
              />
            </View>
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
  notificationsContainer: {
    padding: 20,
  },
  notification: {
    backgroundColor: '#F7F7F7',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 15,
    color: '#333',
    fontWeight: 'bold',
  },
  notificationText: {
    fontSize: 13,
    color: '#333',
  },
  deleteButton: {
    marginLeft: 10,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmationModalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 20,
    width: '80%',
    alignSelf: 'center',
    alignItems: 'center',
  },
  confirmationText: {
    fontSize: 18,
    color: 'black',
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  confirmationButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  modalButton: {
    marginVertical: 20,
    paddingVertical: 10,
    backgroundColor: '#581DB9',
    borderRadius: 10,
    alignItems: 'center',
    width: '45%',
    alignSelf: 'center',
  },
});
