import React from 'react';
import { NavigationContainer} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from "@react-navigation/drawer";

import HomeScreen from './screens/Home';
import Profile from './screens/Profile';
import Camera from './screens/Camera';
import UploadScreen from './screens/Upload';
import Login from "./screens/Login";
import Register from "./screens/Register";


export default function App() {
  const Stack = createStackNavigator();
  const Drawer = createDrawerNavigator();

  const DrawerNavigator = () => {
    return (
      <Drawer.Navigator initialRouteName="Home">
        <Drawer.Screen name="Dashboard" component={HomeScreen} options={{headerShown: false}} />
        <Drawer.Screen name="Profile" component={Profile} />
        <Drawer.Screen name="Camera" component={Camera} />
        <Drawer.Screen name="Upload" component={UploadScreen} />
      </Drawer.Navigator>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={Login} options={{headerShown: false}} />
        <Stack.Screen name="Register" component={Register} options={{headerShown: false}} />
        <Stack.Screen name="Home" component={DrawerNavigator}
         options={{headerShown: false,gestureEnabled: false,}
         
      }/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

