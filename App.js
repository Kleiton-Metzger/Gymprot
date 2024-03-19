import React, {useState, createContext} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from './screens/Home';
import Profile from './screens/Profile/Profile';
import Camera from './screens/Camera';
import UploadScreen from './screens/Upload';
import Login from "./screens/Auth/Login";
import Register from "./screens/Auth/Register";
import MyVideos from "./screens/MyVideos";
import PrivateScreen from "./screens/PrivateScreen";
import PublicScreen from "./screens/PublicScreen";
import EditProfile from './screens/Profile/EditProfile';
import { AuthContext } from './src/contexts/auth';

export default function App() {
  const Stack = createStackNavigator();
  const Tab = createBottomTabNavigator();
  const [loggedIn, setLoggedIn] = useState(false);
  
  
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
            let iconName;

             if (route.name === 'Profile') {
              iconName = focused ? 'person' : 'person-outline';
            }else if (route.name === 'Home') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'Camera') {
              iconName = focused ? 'camera' : 'camera-outline';
            } else if (route.name === 'Upload') {
              iconName = focused ? 'cloud-upload' : 'cloud-upload-outline';
            } else if (route.name === 'MyVideos') {
              iconName = focused ? 'film' : 'film-outline';
            } 

            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Home',headerShown:false }} />
        <Tab.Screen name="Camera" component={Camera} options={{ title: 'Camera',headerShown:false }} />
        <Tab.Screen name="Upload" component={UploadScreen} options={{ title: 'Upload',headerShown:false }} />
        <Tab.Screen name="MyVideos" component={MyVideos} options={{ title: 'My Videos' ,headerShown:false}} />
        <Tab.Screen name="Profile" component={Profile} options={{ title: 'Profile',headerShown:false}} />
      </Tab.Navigator>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={Login} options={{ headerShown: false, gestureEnabled:false }} />
        <Stack.Screen name="Register" component={Register} options={{ headerShown: false }} />
        <Stack.Screen name="ProfileScreen" component={TabNavigator} options={{ headerShown: false,gestureEnabled: false  }} />
        <Stack.Screen name="PublicScreen" component={PublicScreen} options={{ headerShown: false }} />
        <Stack.Screen name="PrivateScreen" component={PrivateScreen} options={{ headerShown: false }} />
        <Stack.Screen name="EditProfileScreen" component={EditProfile} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
