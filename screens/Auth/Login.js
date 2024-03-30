import React, { useState, useEffect } from 'react';
import { View, Text, KeyboardAvoidingView, Platform } from 'react-native';
import { StyleSheet } from 'react-native-web';
import { useNavigation } from '@react-navigation/native';
import { auth, signInWithEmailAndPassword } from '../../storage/Firebase';
import { DismissKeyboard, Logo, Header, Input, Button } from '../../components'

export const Login = () => {
    const navigation = useNavigation();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState(''); 

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            setUser(user);
            if (loading) setLoading(false);
            if (user) {
                navigation.navigate('ProfileScreen'); 
            }
        });
        return unsubscribe;
    }, [loading, navigation]);

    const handleLogin = () => {
        setEmailError('');
        setPasswordError('');
        setError('');

        // Validate email and password
        if (!email.trim() && !password.trim()) {
            setError('Please enter your email and password');
            return;
        }
        if (!email.trim()) {
            setEmailError('Please enter your email');
            return;
        }
        if (!password.trim()) {
            setPasswordError('Please enter your password');
            return;
        }

        signInWithEmailAndPassword(auth, email, password)
            .then(userCredential => {
                const user = userCredential.user;
            })
            .catch(error => setError('Invalid email or password'));
    };

    if (loading) return null;

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
                            keyboardType='email-address'
                            errorText={emailError}
                        />
                        <Input  
                            mode='outlined'
                            label='Password'
                            color="#581DB9"
                            underline="#581DB9"
                            returnKeyType='done'
                            value={password}
                            onChangeText={setPassword}
                            autoCapitalize='none'
                            textContentType='password'
                            errorText={passwordError}
                        />
                        {error ? <Text style={styles.error}>{error}</Text> : null}
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
                        <Text style={styles.textforgot}> 
                            Forgot your password?{' '}
                            <Text
                                style={styles.register}
                                onPress={() => navigation.navigate('ForgotPassword')}
                            >
                                Reset
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
    error: {
        color: 'red',
        fontSize: 14,
        marginTop: 10,
    },
    textforgot: {
        marginTop: "5%",
        color: 'black',
        fontSize: 15,
    },
});
