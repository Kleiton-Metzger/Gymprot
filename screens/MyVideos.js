import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";



export default function MyVideos() {
    return (
        <View style={styles.container}>
                <View style={styles.opcbar}>
                <TouchableOpacity >
                <Text style={styles.buttonText}>Public</Text>
                </TouchableOpacity>
                <TouchableOpacity >
                <Text style={styles.buttonText}>Private</Text>
                </TouchableOpacity>
                </View>
        </View>
       

    );
    }

    const styles = StyleSheet.create({
        container: {
            flex: 1, 
            alignItems: 'center', 
            justifyContent: 'center',
            backgroundColor: "white",
        },
        opcbar: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: "95%",
            marginTop: 30,
            position: 'absolute',
            top: "15%",
            borderRadius: 20,
            borderColor: 'black',
            borderWidth: 1,
            backgroundColor: 'rgba(154, 151, 151, 1)',
            padding: 10,
            

        },
        buttonText: {
            fontSize: 20,
            color: 'black',
            fontWeight: 'bold',
        },

        
    });
