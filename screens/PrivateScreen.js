import React,{useContext} from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";

export const PrivateScreen = () => {
    const navigation = useNavigation();
    
    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.backContainer} onPress={() => navigation.navigate('MyVideos')}>
                <Image source={require('..//assets/back.png')} style={styles.backBtn} />
                <Text style={styles.backTxt}>My Videos</Text>
            </TouchableOpacity>
            <Text style={styles.title}>Private Screen</Text>
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
    backContainer: {
        position: 'absolute',
        top: 50,
        left: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    backBtn: {
        width: 20,
        height: 20,
        marginRight: 5,
    },
    backTxt: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 20,
    },
});
