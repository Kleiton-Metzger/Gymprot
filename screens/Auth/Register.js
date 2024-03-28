import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Image } from 'react-native';
import { StyleSheet } from 'react-native-web';
import { useNavigation } from '@react-navigation/native';
import { auth, createUserWithEmailAndPassword } from '../../storage/Firebase';
import { db } from '../../storage/Firebase';
import {doc, setDoc} from "firebase/firestore";
import { DismissKeyboard, Logo, Header, Input, Button } from '../../components'




export const Register = () => {
    const navigation = useNavigation();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false); // State to manage password visibility
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false); // State to manage confirm password visibility
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

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

    const handleSignUp = () => {
        // Validate password and confirm password
        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        createUserWithEmailAndPassword(auth, email, password)
            .then(userCredential => {
                const user = userCredential.user;
                console.log('Registered with:', user.email);
                setDoc(doc(db, "users", user.uid), {
                    name: name,
                    email: email,
                    userId: user.uid,
                });
            })
            .catch(error => alert(error.message));
    }

    if (loading) return null;

    return ( 
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
                <DismissKeyboard>
                    <View style={styles.container}>
                    <Logo />
                        <Header> Register </Header>
                        <View style={styles.inputContainer}>
                            <Input
                            mode='outlined'
                            label='Name'
                            color="#581DB9"
                            underline="#581DB9"
                            returnKeyType='next'
                            value={name}
                            onChangeText={setName}
                            />
                            <Input
                            mode='outlined'
                            label='Email'
                            color="#581DB9"
                            underline="#581DB9"
                            returnKeyType='next'
                            value={email}
                            onChangeText={setEmail}
                            />
                            <Input
                            mode='outlined'
                            label='Password'
                            color="#581DB9"
                            underline="#581DB9"
                            secureTextEntry={!passwordVisible}
                            returnKeyType='next'
                            value={password}
                            onChangeText={setPassword}
                            />
                            <Input
                            mode='outlined'
                            label='Confirm Password'
                            color="#581DB9"
                            underline="#581DB9"
                            secureTextEntry={!confirmPasswordVisible}
                            returnKeyType='done'
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            />
                           <Button onPress={handleSignUp} label="Register" />
                            <Text style={styles.textRegister}>
                                Already have an account?{' '}
                                <Text
                                    style={styles.register}
                                    onPress={() => navigation.navigate('Login')}
                                >
                                    Login
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
        marginTop: "10%",
    },
    inputContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        width: "100%",
        paddingLeft: "10%",
        paddingRight: "10%",
    },
    button: {
        width: '100%',
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#581DB9',
        borderRadius: 5,
        marginVertical: 10,
    },
    buttonText: {
        fontSize: 18,
        color: '#fff'
    },
    textRegister: {
        marginTop: 20,
        fontSize: 16,
    },
    register: {
        color: '#581DB9',
        fontWeight: 'bold',
    }
    
});