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
    backgroundColor: '#581DB9',
  },
  buttonFollowing: {
    width: 100,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    position: 'absolute',
    backgroundColor: 'lightgrey',
  },
  textNotFollowing: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
  textFollowing: {
    fontSize: 16,
    color: 'black',
    fontWeight: 'bold',
  },
});

export { SeguirBTN };
