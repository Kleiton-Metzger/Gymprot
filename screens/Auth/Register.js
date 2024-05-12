import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
  Image,
  SafeAreaView,
} from 'react-native';
import { StyleSheet } from 'react-native-web';
import { useNavigation } from '@react-navigation/native';
import { auth, createUserWithEmailAndPassword } from '../../storage/Firebase';
import { db } from '../../storage/Firebase';
import { doc, setDoc } from 'firebase/firestore';
import { DismissKeyboard, Logo, Header, Input, Button } from '../../components';
import { Ionicons } from '@expo/vector-icons';

export const Register = ({ navigation, navigation: { goBack } }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false); // State to manage password visibility
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false); // State to manage confirm password visibility
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setUser(user);
      if (loading) setLoading(false);
      if (user) {
        navigation.replace('ProfileScreen');
      }
    });
    return unsubscribe;
  }, [loading, navigation]);

  const handleSignUp = () => {
    setNameError('');
    setEmailError('');
    setPasswordError('');
    setConfirmPasswordError('');

    if (!name.trim() && !email.trim() && !password.trim() && !confirmPassword.trim()) {
      alert('Por favor, preencha todos os campos para criar uma conta');
      return;
    }
    if (!name.trim()) {
      setNameError('Por favor, introduza o seu nome');
      return;
    }
    if (!email.trim()) {
      setEmailError('Introduza o seu email');
      return;
    }
    if (!password.trim()) {
      setPasswordError('Introduza a sua palavra-passe');
      return;
    }
    if (!confirmPassword.trim()) {
      setConfirmPassword('Introduza a sua palavra-passe');
      return;
    }
    if (password !== confirmPassword) {
      alert('Palaavra-passe e confirmar palavra-passe não coincidem');
      return;
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then(userCredential => {
        const user = userCredential.user;
        console.log('Registered with:', user.email);
        setDoc(doc(db, 'users', user.uid), {
          name: name,
          email: email,
          userId: user.uid,
          seguidores: [],
          seguindo: [],
          bio: '',
        });
      })
      .catch(error => alert(error.message));
  };

  if (loading) return null;

  return (
    <SafeAreaView>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <DismissKeyboard>
          <View style={styles.container}>
            <TouchableOpacity onPress={goBack} activeOpacity={0.8} style={{ position: 'absolute', left: 20, top: 10 }}>
              <Ionicons name="arrow-back" size={30} />
            </TouchableOpacity>
            <View style={styles.logoContainer}>
              <Logo />
            </View>
            <View style={styles.titleContainer}>
              <Header>Criar Conta</Header>
            </View>
            <View style={styles.inputContainer}>
              <Input
                mode="outlined"
                label="Nome"
                color="#581DB9"
                underline="#581DB9"
                returnKeyType="next"
                value={name}
                onChangeText={setName}
                errorText={nameError}
              />
              <Input
                mode="outlined"
                label="Email"
                color="#581DB9"
                underline="#581DB9"
                returnKeyType="next"
                value={email}
                onChangeText={setEmail}
                errorText={emailError}
              />
              <Input
                mode="outlined"
                label="Palavra-passe"
                color="#581DB9"
                underline="#581DB9"
                textContentType="password"
                returnKeyType="next"
                value={password}
                onChangeText={setPassword}
                errorText={passwordError}
              />
              <Input
                mode="outlined"
                label="Confirmar Palavra-passe"
                color="#581DB9"
                underline="#581DB9"
                textContentType="password"
                returnKeyType="done"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                errorText={confirmPasswordError}
              />
              <Button onPress={handleSignUp} label="Criar" style={styles.button1} />
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: '5%' }}>
                <Text>Já tem uma conta? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                  <Text style={styles.register}>Entrar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </DismissKeyboard>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingLeft: '10%',
    paddingRight: '10%',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '10%',
  },
  titleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
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
    color: '#fff',
  },
  error: {
    color: 'red',
    marginTop: 10,
  },
  register: {
    color: '#581DB9',
    fontWeight: 'bold',
  },
  button1: {
    width: '50%',
    height: 50,
    borderRadius: 5,
    backgroundColor: '#581DB9',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
});
