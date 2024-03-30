import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth,sendPasswordResetEmail } from '../../storage/Firebase'; 
import { Logo, Header, Input, Button, DismissKeyboard,BackBtn } from '../../components';

export const ForgotPassword = () => {
    const navigation = useNavigation();
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');

    const handleResetPassword = () => {
        setEmailError('');
        if (!email.trim()) {
            setEmailError('Email is required');
            return;
        }

        sendPasswordResetEmail(auth, email)
            .then(() => {
                alert('Password reset email sent');
                navigation.navigate('Login');
            })
            .catch(error => {
                console.error('Error sending password reset email:', error);
                setEmailError('Error sending password reset email');
            });
    };

    return (
        <DismissKeyboard>
            <SafeAreaView style={styles.container}>
                <Logo />
                <Header>Reset Password</Header>
                <View style={styles.body}>
                    <Input
                        mode='outlined'
                        label='Email'
                        color="#581DB9"
                        underline="#581DB9"
                        returnKeyType='next'
                        value={email}
                        onChangeText={setEmail}
                        errorText={emailError}
                        autoCapitalize='none'
                        textContentType='emailAddress'
                        keyboardType='email-address'
                    />
                </View>
                <View style={styles.btn}>
                <Button onPress={handleResetPassword} label="Reset Password" />
                </View>
            </SafeAreaView>
        </DismissKeyboard>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    body: {
        alignItems: 'center',
        justifyContent: 'center',
        width: "100%",
        paddingLeft: "10%",
        paddingRight: "10%",
    },
    btn: {
        width: "50%",
    },
});
