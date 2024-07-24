import React from 'react';
import { View, StyleSheet, Text, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../../Hooks/useAuth';

export const Following = () => {
  const navigation = useNavigation();
  const { currentUser } = useAuth();

  const { seguindo = [] } = currentUser || {};

  console.log(seguindo);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.listContainer}>
        {seguindo.length === 0 ? (
          <Text style={styles.listText}>Ainda não está seguindo ninguém.</Text>
        ) : (
          seguindo.map((following, index) => (
            <View key={index} style={styles.listItem}>
              <TouchableOpacity onPress={() => navigation.navigate('FolowerProfile', { userId: following.userId })}>
                <Text style={styles.followerName}>{following.name}</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  listContainer: {
    padding: 20,
  },
  listItem: {
    backgroundColor: '#F7F7F7',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  followerName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  listText: {
    fontSize: 16,
    color: 'grey',
    textAlign: 'center',
  },
});
