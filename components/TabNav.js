import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React from 'react';
import { PrivateScreen } from '../screens/Videos/PrivateVideos';
import { PublicScreen } from '../screens/Videos/PublicVideos';
import { LogBox, SafeAreaView } from 'react-native';

LogBox.ignoreLogs(['Sending `onAnimatedValueUpdate` with no listeners registered.']);

const Tab = createMaterialTopTabNavigator();

function TabNav() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <Tab.Navigator
        initialRouteName="Public"
        screenOptions={{
          tabBarActiveTintColor: '#581DB9',
          tabBarInactiveTintColor: 'lightgrey',
          tabBarIndicatorStyle: { backgroundColor: '#581DB9' },
          tabBarStyle: { backgroundColor: 'white' },
          tabBarLabelStyle: { fontSize: 12, fontWeight: 'bold' },
        }}
      >
        <Tab.Screen name="Public" component={PublicScreen} options={{ tabBarLabel: 'Meus Vídeos Públicos' }} />
        <Tab.Screen name="Private" component={PrivateScreen} options={{ tabBarLabel: 'Meus Vídeos Privados' }} />
      </Tab.Navigator>
    </SafeAreaView>
  );
}

export default TabNav;
