import React, {useState} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { FirebaseContext } from './contexts/auth';

import  { Profile, CameraScreen, HomeScreen, UploadScreen, Login, Register, MyVideos, PrivateScreen, PublicScreen, EditProfile} from './screens';

import { getTabIconName }from './utils'

export default function App() {
  const Stack = createStackNavigator();
  const Tab = createBottomTabNavigator();
  
  
  const TabNavigator = () => {

    return (
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarActiveTintColor: 'rgba(88, 29, 185, 1)',
          tabBarInactiveTintColor: 'gray',
          tabBarStyle: {
            display: 'flex',
          },
          tabBarIcon: ({ focused, color, size }) => {
            const iconName = getTabIconName(route, focused);
            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
      >
        
        <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Home',headerShown:false }} />
        <Tab.Screen name="Camera" component={CameraScreen} options={{ title: 'Camera',headerShown:false }} />
        <Tab.Screen name="Upload" component={UploadScreen} options={{ title: 'Upload',headerShown:false }} />
        <Tab.Screen name="MyVideos" component={MyVideos} options={{ title: 'My Videos' ,headerShown:false}} />
        <Tab.Screen name="Profile" component={Profile} options={{ title: 'Profile',headerShown:false}} />
      </Tab.Navigator>
    );
  }

  return (
    <NavigationContainer>
      <FirebaseContext.Provider value={{}}>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={Login} options={{ headerShown: false, gestureEnabled:false }} />
        <Stack.Screen name="Register" component={Register} options={{ headerShown: false }} />
        <Stack.Screen name="ProfileScreen" component={TabNavigator} options={{ headerShown: false,gestureEnabled: false  }} />
        <Stack.Screen name="PublicScreen" component={PublicScreen} options={{ headerShown: false,gestureEnabled:false }} />
        <Stack.Screen name="PrivateScreen" component={PrivateScreen} options={{ headerShown: false,gestureEnabled:false }} />
        <Stack.Screen name="EditProfileScreen" component={EditProfile} options={{ headerShown: false,gestureEnabled:false }} />
      </Stack.Navigator>
      </FirebaseContext.Provider>
    </NavigationContainer>
  );
}
