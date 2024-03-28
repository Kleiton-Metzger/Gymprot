import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { StyleSheet } from 'react-native-web';
import { useNavigation } from '@react-navigation/native';
import { auth, signInWithEmailAndPassword } from '../../storage/Firebase';

import { DismissKeyboard, Logo, Header, Input, Button } from '../../components'

export const Login = () => {
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
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
            <DismissKeyboard>
                <View style={styles.container}>
                <Logo />
                    <Header>Login</Header>
                    <View style={styles.inputContainer}>
                        <Input
                        mode='outlined'
                        label='Email'
                        color="#581DB9"
                        underline="#581DB9"
                        returnKeyType='next'
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize='none'
                        textContentType='emailAddress'
                        keyboardType='default'
                    />
                    <Input  
                        mode='outlined'
                        label='Password'
                        color="#581DB9"
                        underline="#581DB9"
                        returnKeyType='done'

                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={!passwordVisible}
                        autoCapitalize='none'
                        textContentType='password'
                        keyboardType='default'
                    />
                    <Button onPress={handleLogin} label="Login" />
                    <Text style={styles.textRegister}>
                Don't have an account?{' '}
                <Text
                    style={styles.register}
                    onPress={() => navigation.navigate('Register')}
                >
                    Register
                </Text>
            </Text>

                </View>                   
                </View>
            </DismissKeyboard>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: "20%",
    },
    inputContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        width: "100%",
        paddingLeft: "10%",
        paddingRight: "10%",
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 20,
    },
    button: {
        width: '50%',
        height: 50,
        borderRadius: 5,
        backgroundColor: '#581DB9',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    textRegister: {
        marginTop: 20,
        color: 'black',
        fontSize: 15,
    },
    register: {
        color: '#581DB9',
        fontWeight: 'bold',
        fontSize: 15,
    },
});
