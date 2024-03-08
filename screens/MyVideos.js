import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import PublicScreen from "./PublicScreen";
import PrivateScreen from "./PrivateScreen";

export default function MyVideos() {
    const navigation = useNavigation();
    const route = useRoute();

    // Check the route name to determine which content to render
    const renderContent = () => {
        switch (route.name) {
            case 'PublicScreen':
                return <PublicScreen />;
            case 'PrivateScreen':
                return <PrivateScreen />;
            default:
                return null;
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.opcbar}>
                <TouchableOpacity onPress={() => navigation.navigate('PublicScreen')}>
                    <Text style={styles.buttonText}>Public</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('PrivateScreen')}>
                    <Text style={styles.buttonText}>Private</Text>
                </TouchableOpacity>
            </View>
            {/* Render content based on the current route */}
            {renderContent()}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
    },
    opcbar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: 'rgba(154, 151, 151, 1)',
        borderBottomWidth: 1,
        borderBottomColor: 'black',
        top: "20%",
        borderRadius: 25,
        height: 50,
    },
    buttonText: {
        fontSize: 20,
        color: 'black',
        fontWeight: 'bold',
    },
});
