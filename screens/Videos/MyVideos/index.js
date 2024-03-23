import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import PublicScreen from "../PublicVideos/index.js";
import PrivateScreen from "../PrivateVideos/index.js";
import styles from "./styles.js";

export const MyVideos = () => {
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

