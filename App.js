import React from 'react';
import { NavigationContainer} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from "@react-navigation/drawer";
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from './screens/Home';
import Profile from './screens/Profile';
import Camera from './screens/Camera';
import UploadScreen from './screens/Upload';
import Login from "./screens/Login";
import Register from "./screens/Register";
import MyVideos from "./screens/MyVideos";


export default function App() {
  const Stack = createStackNavigator();
  const Drawer = createDrawerNavigator();

  const DrawerNavigator = () => {
    return (
      <Drawer.Navigator initialRouteName="Profile">
        <Drawer.Screen name="Home" component={HomeScreen} 
        options={{
          //headerShown: false,
          drawerLabel: 'Home',
          drawerIcon: ({focused, size}) => (
            <Ionicons name="home" size={size} color={focused ? 'blue' : 'black'} />
          )

        }} />
        <Drawer.Screen name="Profile" component={Profile}
        options={{ 
          //headerShown: false,
          drawerLabel: 'Profile',
          drawerIcon: ({focused, size}) => (
            <Ionicons name="person" size={size} color={focused ? 'blue' : 'black'} />
          )
        }}
        />
        <Drawer.Screen name="Camera" component={Camera} 
        options={{ 
         // headerShown: false,
          drawerLabel: 'Camera',
          drawerIcon: ({focused, size}) => (
            <Ionicons name="camera" size={size} color={focused ? 'blue' : 'black'} />
          )
        }}
        />
        <Drawer.Screen name="Upload" component={UploadScreen}
        options={{ 
          //headerShown: false,
          drawerLabel: 'Upload',
          drawerIcon: ({focused, size}) => (
            <Ionicons name="cloud-upload" size={size} color={focused ? 'blue' : 'black'} />
          )
        }}
        />
        <Drawer.Screen name="MyVideos" component={MyVideos}
        options={{ 
         // headerShown: false,
          drawerLabel: 'My Videos',
          drawerIcon: ({focused, size}) => (
            <Ionicons name="film-outline" size={size} color={focused ? 'blue' : 'black'} />
                        )}} />

      </Drawer.Navigator>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={Login} options={{headerShown: false}} />
        <Stack.Screen name="Register" component={Register} options={{headerShown: false}} />
        <Stack.Screen name="ProfileScreen" component={DrawerNavigator}
         options={{headerShown: false,gestureEnabled: false,}
         
      }/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

