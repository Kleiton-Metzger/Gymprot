import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity,Image } from 'react-native';
import { useNavigation, NavigationContainer } from '@react-navigation/native';
import { auth } from '../storage/Firebase';
import { Ionicons } from '@expo/vector-icons';


export default function Profile () {

  const navigation = useNavigation();


    const handleSignOut = () => {
        auth
          .signOut()
          .then(() => {
            navigation.replace("Login")
            // show the email of the user how logged out 
            console.log('User signed out!')
            
          })
          .catch(error => alert(error.message))
      }

        return (
            <View style={styles.container}>
                <Text style={styles.title}>Profile</Text>
            <TouchableOpacity style={styles.buttonContainer}
                onPress={handleSignOut}>
                 <Text style={styles.buttonText}>Logout</Text>
             </TouchableOpacity>
            </View>
        );
}

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor:'rgba(154, 151, 151, 1)'
    },
    title: {
        color: '#161924', 
        fontSize: 20, 
        fontWeight: 'bold',
        position: 'absolute', 
        left:50,
        padding: 10,
        top: "10%",

    },
    buttonContainer: {
        backgroundColor: 'rgba(88, 29, 185, 1)',
        padding: 15,
        width: '45%',
        alignItems: 'center',
        borderRadius: 25,
        top: 20,
        borderColor: 'black',
        borderWidth: 1,
    },
});
