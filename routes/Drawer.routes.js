import React, { Profiler } from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
// import icons 
import { Ionicons } from "@expo/vector-icons";

import Home from "../src/screens/Home";
import Profile from "../src/screens/Profile";
import Multimedia from "../src/screens/Multimedia";


const Drawer = createDrawerNavigator();

export default function DrawerRoutes() {
    return (
        <Drawer.Navigator initialRouteName="Home">

<Drawer.Screen name="Home"
                options={{ 
                    drawerIcon: ({ focused, size, color }) => (
                        <Ionicons name= {focused ? "home" : "home-outline"} size={size} color={color} />
                    ),
                }}
                component={Home} />

<Drawer.Screen name="Profile" 
                options={{ 
                    drawerIcon: ({ focused, size, color }) => (
                        <Ionicons name= {focused ? "person" : "person-outline"} size={size} color={color} />
                    ),
                }}
                component={Profile} />              
<Drawer.Screen name="Videos"
                options={{ 
                    drawerIcon: ({ focused, size, color }) => (
                        <Ionicons name= {focused ? "videocam" : "videocam-outline"} size={size} color={color} />
                    ),
                }}
                component={Multimedia} />
</Drawer.Navigator> 
    );        
}



