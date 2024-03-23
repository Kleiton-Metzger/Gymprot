import React,{useContext} from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import styles from "./styles";

export const PrivateScreen = () => {
    const navigation = useNavigation();
    
    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.backContainer} onPress={() => navigation.navigate('MyVideos')}>
                <Image source={require('../../../assets/back.png')} style={styles.backBtn} />
                <Text style={styles.backTxt}>My Videos</Text>
            </TouchableOpacity>
            <Text style={styles.title}>Private Screen</Text>
        </View>
    );
}
