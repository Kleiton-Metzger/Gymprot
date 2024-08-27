import React, { useState, useEffect } from 'react';
import { View, Text, KeyboardAvoidingView, Platform, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth, signInWithEmailAndPassword } from '../../storage/Firebase';
import { DismissKeyboard, Logo, Header, Input, Button } from '../../components';
import { useAuth } from '../../Hooks/useAuth';
import { registerIndieID } from 'native-notify';
export const Login = () => {
  const navigation = useNavigation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const { user, setUser } = useAuth();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setUser(user);
      if (loading) setLoading(false);
      if (user) {
        registerIndieID(email, 22648, 'ORCAvOl2Mp53Ll26YDq01d');

        navigation.replace('ProfileScreen');
      }
    });
    return unsubscribe;
  }, []);

  const handleLogin = () => {
    setEmailError('');
    setPasswordError('');
    setError('');

    if (!email.trim() && !password.trim()) {
      setError('Por favor, introduza o seu email e palavra-passe para entrar');
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

    signInWithEmailAndPassword(auth, email, password)
      .then(userCredential => {
        const user = userCredential.user;
      })
      .catch(error => setError('Palavra-passe ou email incorretos'));
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1, height: '100%' }}>
      <DismissKeyboard>
        <View style={styles.container}>
          <Logo />
          <Header>Login</Header>
          <View style={styles.inputContainer}>
            <Input
              mode="outlined"
              label="Email"
              color="#581DB9"
              underline="#581DB9"
              returnKeyType="next"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              textContentType="emailAddress"
              keyboardType="email-address"
              errorText={emailError}
            />
            <Input
              mode="outlined"
              label="Palaavra-passe"
              color="#581DB9"
              underline="#581DB9"
              returnKeyType="done"
              value={password}
              onChangeText={setPassword}
              autoCapitalize="none"
              textContentType="password"
              errorText={passwordError}
            />
            {error ? <Text style={styles.error}>{error}</Text> : null}
            <Button onPress={handleLogin} label="Entrar" style={styles.button} />

            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: '5%' }}>
              <Text style={styles.textRegister}>Não tem uma conta? </Text>
              <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.navigate('Register')}>
                <Text style={styles.register}>Registar</Text>
              </TouchableOpacity>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: '5%' }}>
              <Text style={styles.textforgot}>Esqueceu a palavra-passe? </Text>
              <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.navigate('ForgotPassword')}>
                <Text style={styles.register}>Recuperar palavra-passe</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </DismissKeyboard>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '20%',
  },
  inputContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingLeft: '10%',
    paddingRight: '10%',
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
    color: 'black',
    fontSize: 15,
  },
});
