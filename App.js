import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { PaperProvider } from 'react-native-paper';
import { LogBox, StatusBar } from 'react-native';

import {
  Profile,
  CameraScreen,
  HomeScreen,
  UploadScreen,
  Login,
  Register,
  MyVideos,
  PrivateScreen,
  PublicScreen,
  EditProfile,
  ForgotPassword,
  FolowerProfile,
  VideosScreen,
  Notifications,
  Configurations,
  FollowList,
  Follower,
  Following,
  PdfViewer,
} from './screens';
import { getTabIconName } from './utils';
import { AuthProvider } from './Hooks/useAuth';
import TabNav from './components/TabNav';
import SplashScreen from './screens/Auth/Splash';

LogBox.ignoreLogs(['Sending `onAnimatedValueUpdate` with no listeners registered.']);
LogBox.ignoreLogs([
  'AWarning: TextInput.Icon: Support for defaultProps will be removed from function components in a future major release. Use JavaScript default parameters instead.',
]);

export default function App() {
  const Stack = createStackNavigator();
  const Tab = createBottomTabNavigator();

  const [splashVisible, setSplashVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSplashVisible(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (splashVisible) {
    return <SplashScreen />;
  }

  const TabNavigator = () => {
    return (
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarActiveTintColor: 'rgba(88, 29, 185, 1)',
          tabBarInactiveTintColor: 'gray',
          tabBarStyle: {
            display: 'flex',
            position: 'absolute',

            backgroundColor: 'white',
            borderTopWidth: 0.5,
            elevation: 0,
          },
          tabBarIcon: ({ focused, color, size }) => {
            const iconName = getTabIconName(route, focused);
            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Inicio', headerShown: false }} />
        <Tab.Screen name="Upload" component={UploadScreen} options={{ title: 'Upload', headerShown: false }} />
        <Tab.Screen name="Camera" component={CameraScreen} options={{ title: 'Camera', headerShown: false }} />
        <Tab.Screen name="MyVideos" component={TabNav} options={{ title: 'Meus Videos', headerShown: false }} />
        <Tab.Screen name="Profile" component={Profile} options={{ title: 'Perfil', headerShown: false }} />
      </Tab.Navigator>
    );
  };

  return (
    <PaperProvider>
      <AuthProvider>
        <NavigationContainer>
          <StatusBar backgroundColor="white" barStyle="dark-content" />
          <Stack.Navigator>
            <Stack.Screen name="Login" component={Login} options={{ headerShown: false, gestureEnabled: false }} />
            <Stack.Screen name="Register" component={Register} options={{ headerShown: false }} />
            <Stack.Screen name="ForgotPassword" component={ForgotPassword} options={{ headerShown: false }} />
            <Stack.Screen
              name="ProfileScreen"
              component={TabNavigator}
              options={{ headerShown: false, gestureEnabled: false }}
            />
            <Stack.Screen
              name="PublicScreen"
              component={PublicScreen}
              options={{ headerShown: false, gestureEnabled: false }}
            />
            <Stack.Screen
              name="PrivateScreen"
              component={PrivateScreen}
              options={{ headerShown: false, gestureEnabled: false }}
            />
            <Stack.Screen
              name="EditProfileScreen"
              component={EditProfile}
              options={{ headerShown: false, gestureEnabled: false }}
            />
            <Stack.Screen
              name="FolowerProfile"
              component={FolowerProfile}
              options={{ headerShown: false, gestureEnabled: false }}
            />
            <Stack.Screen
              name="VideosScreen"
              component={VideosScreen}
              options={{
                headerShown: false,
                gestureEnabled: false,
                presentation: 'transparentModal',
                animationTypeForReplace: 'push',
              }}
            />
            <Stack.Screen
              name="NotificationaScreen"
              component={Notifications}
              options={{ headerShown: false, gestureEnabled: false }}
            />
            <Stack.Screen
              name="ConfigurationsScreen"
              component={Configurations}
              options={{ headerShown: false, gestureEnabled: false }}
            />
            <Stack.Screen
              name="FollowListScreen"
              component={FollowList}
              options={{ headerShown: false, gestureEnabled: false }}
            />
            <Stack.Screen
              name="FollowerScreen"
              component={Follower}
              options={{ headerShown: false, gestureEnabled: false }}
            />
            <Stack.Screen
              name="FollowingScreen"
              component={Following}
              options={{ headerShown: false, gestureEnabled: false }}
            />
            <Stack.Screen
              name="PdfViewer"
              component={PdfViewer}
              options={{ headerShown: false, gestureEnabled: false }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </AuthProvider>
    </PaperProvider>
  );
}
