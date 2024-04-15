import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

const SeguirBTN = ({ label, isFollowing, notFollowing, onPress }) => {
  const buttonStyles = notFollowing ? styles.buttonNotFollowing : styles.buttonFollowing;
  const textStyles = notFollowing ? styles.textNotFollowing : styles.textFollowing;

  return (
    <TouchableOpacity onPress={onPress} style={buttonStyles}>
      <Text style={textStyles}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonNotFollowing: {
    width: 100,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    position: 'absolute',
    backgroundColor: '#581DB9', // Cor do botão quando não estiver seguindo
  },
  buttonFollowing: {
    width: 100,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    position: 'absolute',
    backgroundColor: 'lightgrey', // Cor do botão quando já estiver seguindo
  },
  textNotFollowing: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
  textFollowing: {
    fontSize: 16,
    color: 'black', // Cor do texto quando já estiver seguindo
    fontWeight: 'bold',
  },
});

export { SeguirBTN }; // Corrigindo a exportação aqui
