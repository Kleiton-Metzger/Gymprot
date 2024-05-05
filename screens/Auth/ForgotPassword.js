import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth, sendPasswordResetEmail } from '../../storage/Firebase';
import { Logo, Header, Input, Button, DismissKeyboard, BackBtn } from '../../components';
import { FontAwesome5 } from '@expo/vector-icons';

export const ForgotPassword = ({ navigation, navigation: { goBack } }) => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  const handleResetPassword = () => {
    setEmailError('');
    if (!email.trim()) {
      setEmailError('Introduza o seu email');
      return;
    }

    sendPasswordResetEmail(auth, email)
      .then(() => {
        alert('Palaavra-passe enviada com sucesso. Verifique o seu email para redefinir a sua palavra-passe');
        navigation.navigate('Login');
      })
      .catch(error => {
        console.error('Error sending password reset email:', error);
        setEmailError('Erro ao enviar email');
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <DismissKeyboard>
        <View>
          <View style={styles.hederContainer}>
            <TouchableOpacity onPress={goBack} style={{ position: 'absolute', left: 20, top: 0 }}>
              <FontAwesome5 name="arrow-left" size={24} color="black" />
            </TouchableOpacity>
          </View>
          <View style={styles.logoContainer}>
            <Logo style={styles.logo} />
            <Header>Recuperar Palavra-Passe</Header>
          </View>
          <View style={styles.inputContainer}>
            <Input
              mode="outlined"
              label="Email"
              color="#581DB9"
              underline="#581DB9"
              returnKeyType="next"
              value={email}
              onChangeText={setEmail}
              errorText={emailError}
              style={styles.input}
            />
          </View>
          <View style={styles.btnContainer}>
            <Button style={styles.button} onPress={handleResetPassword} label="Enviar Email" />
          </View>
        </View>
      </DismissKeyboard>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  hederContainer: {
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  inputContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingLeft: 10,
    paddingRight: 10,
  },
  input: {
    marginTop: 20,
    marginBottom: 20,
    backgroundColor: 'white',
  },
  btnContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
  },
  button: {
    width: '50%',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#581DB9',
    borderRadius: 15,
  },
});
