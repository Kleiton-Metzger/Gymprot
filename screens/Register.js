import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { StyleSheet } from 'react-native-web';
import { useNavigation } from '@react-navigation/native'; 
import { auth, createUserWithEmailAndPassword } from '../storage/Firebase';

export default function Register() {
    const navigation = useNavigation(); 

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            setUser(user);
            if (loading) setLoading(false);
            if (user) {
                navigation.navigate('Profile'); // Navigate to Profile screen if user is logged in
            }
        });
        return unsubscribe;
    }, [loading, navigation]);

    const handleSignUp = () => {
        createUserWithEmailAndPassword(auth, email, password)
            .then(userCredential => {
                const user = userCredential.user;
                console.log('Registered with:', user.email);
            })
            .catch(error => alert(error.message));
    }

    if (loading) return null;

    return (
        <View style={styles.container}>
            <View style={styles.titleContainer}>
                <Text style={styles.title}>Register</Text>
                <Text style={styles.detail}>Please enter your details to register</Text>
            </View>
            <Text style={styles.text}>Name</Text>
            <TextInput
                style={styles.input}
                placeholder="Name" 
                value={name}
                onChangeText={setName}
            />
            <Text style={styles.text}>Email</Text>
            <TextInput
                style={styles.input} 
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
            />
            <Text style={styles.text}>Password</Text>
            <TextInput
                style={styles.input}
                placeholder="Password" 
                value={password}
                secureTextEntry={true}
                onChangeText={setPassword}
            />
            <Text style={styles.text}>Confirm Password</Text>
            <TextInput
                style={styles.input}
                placeholder="Confirm Password" 
                value={password}
                secureTextEntry={true}
                onChangeText={setPassword}
            />
            <TouchableOpacity style={styles.buttonContainer} onPress={handleSignUp}>
                <Text style={styles.buttonText}>Register</Text>
            </TouchableOpacity>
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
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(154, 151, 151, 1)',
    },
    titleContainer: {
        marginBottom: 30,
        alignItems: 'center',
    },
    title: {
        fontSize: 30,
        color: 'black',
        fontWeight: 'bold',
    },
    detail: {
        fontSize: 15,
        color: 'black',
        textAlign: 'center',
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
        height: 40,
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: 'black',
        marginBottom: 20,
        paddingLeft: 10,
        borderRadius: 25,
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
    },
    register: {
        color: 'rgba(88, 29, 185, 1)',
        fontWeight: 'bold',
    }
});
