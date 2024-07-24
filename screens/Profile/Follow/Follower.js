import React from 'react';
import { View, StyleSheet, Text, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../../Hooks/useAuth';

export const Follower = () => {
  const navigation = useNavigation();
  const { currentUser } = useAuth();

  const { seguidores = [] } = currentUser || {};

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.listContainer}>
        {seguidores.length === 0 ? (
          <Text style={styles.listText}>Nenhum seguidor ainda.</Text>
        ) : (
          seguidores.map((follower, index) => (
            <View key={index} style={styles.listItem}>
              <TouchableOpacity onPress={() => navigation.navigate('FolowerProfile', { user: follower })}>
                <Text style={styles.followerName}>{follower.name}</Text>
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
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
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
    color: 'black',
  },
  listText: {
    fontSize: 16,
    color: 'black',
    textAlign: 'center',
  },
});
