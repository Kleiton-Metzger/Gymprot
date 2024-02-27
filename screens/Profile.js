import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../storage/Firebase';




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
                <Text style={styles.text}>Profile</Text>
                <Text style={styles.text}>Welcome to your profile</Text>
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
    text: {
        color: '#161924', 
        fontSize: 20, 
        fontWeight: '500'
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
