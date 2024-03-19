import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { StyleSheet } from 'react-native-web';
import { useNavigation } from '@react-navigation/native';
import { auth, signInWithEmailAndPassword } from '../../storage/Firebase';

export default function Login() {
    const navigation = useNavigation();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false); // State to manage password visibility
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            setUser(user);
            if (loading) setLoading(false);
            if (user) {
                navigation.navigate('ProfileScreen'); // Navigate to Profile screen if user is logged in
            }
        });
        return unsubscribe;
    }, [loading, navigation]);

    const handleLogin = () => {
        signInWithEmailAndPassword(auth, email, password)
            .then(userCredential => {
                const user = userCredential.user;
                console.log('Logged in with:', user.email);
            })
            .catch(error => alert(error.message));
    };

    if (loading)return null;
    
    

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : null}
        >
            <Image source={require('../../assets/logo.png')} style={styles.logo} />
            <Text style={styles.title}>Login</Text>
            <Text style={styles.text}>Email</Text>
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
            />
            <Text style={styles.text}>Password</Text>
            <View style={styles.passwordInputContainer}>
                <TextInput
                    style={styles.passwordInput}
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!passwordVisible} // Toggle secureTextEntry based on passwordVisible state
                />
                <TouchableOpacity
                    style={styles.visibilityIcon}
                    onPress={() => setPasswordVisible(!passwordVisible)}>
                    <Image
                        source={passwordVisible ? require('../../assets/eye-open.png') : require('../../assets/eye-closed.png')}
                        style={styles.eyeIcon}
                    />
                </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.buttonContainer} onPress={handleLogin}>
                <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
            <Text style={styles.textRegister}>
                Don't have an account yet?{' '}
                <Text style={styles.register} onPress={() => navigation.navigate('Register')}>
                    Register
                </Text>
            </Text>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        paddingBottom: 50, // Adjust paddingBottom to accommodate space for the keyboard
    },
    logo: {
        width: 150,
        height: 150,
        borderRadius: 100,
        marginBottom: 50,
        borderWidth: 1,
        borderColor: 'black',
    },
    title: {
        fontSize: 30,
        marginBottom: 30,
        color: 'black',
        fontWeight: 'bold',
    },
    text: {
        color: 'black',
        fontWeight: 'bold',
        fontSize: 15,
        textAlign: 'left',
        width: '80%',
        marginBottom: 10,
    },
    input: {
        width: '80%',
        backgroundColor: 'rgba(255, 255, 255, 1)',
        padding: 15,
        marginBottom: 20,
        borderRadius: 25,
        borderColor: 'black',
        borderWidth: 1,
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
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 20,
    },
    textRegister: {
        color: 'black',
        fontSize: 15,
        marginTop: 40,
        textAlign: 'center',
    },
    register: {
        color: 'rgba(88, 29, 185, 1)',
        fontWeight: 'bold',
    },
    passwordInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '80%',
        marginBottom: 20,
        borderRadius: 25,
        borderColor: 'black',
        borderWidth: 1,
    },
    passwordInput: {
        flex: 1,
        height: 40,
        paddingLeft: 10,
    },
    visibilityIcon: {
        padding: 10,
    },
    eyeIcon: {
        width: 20,
        height: 20,
    },
});
