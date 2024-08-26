import React from 'react';
import { View, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Following } from '../Follow/Following';
import { Follower } from '../Follow/Follower';

const Tab = createMaterialTopTabNavigator();

export const FollowList = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton} activeOpacity={0.8}>
          <Ionicons name="arrow-back" size={30} color="black" />
        </TouchableOpacity>
      </View>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: '#581DB9',
          tabBarInactiveTintColor: 'lightgrey',
          tabBarIndicatorStyle: { backgroundColor: '#581DB9' },
          tabBarStyle: { backgroundColor: 'white' },
          tabBarLabelStyle: { fontSize: 14, fontWeight: 'bold' },
        }}
      >
        <Tab.Screen name="Following" component={Following} options={{ tabBarLabel: 'A seguir' }} />
        <Tab.Screen name="Follower" component={Follower} options={{ tabBarLabel: 'Seguidores' }} />
      </Tab.Navigator>
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
    paddingTop: 20,
    paddingBottom: 20,

    position: 'relative',
    backgroundColor: 'white',
  },
  backButton: {
    position: 'absolute',
    left: 15,
  },
});
