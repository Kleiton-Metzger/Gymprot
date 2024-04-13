import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

const SeguirBTN = ({ label, isFollowing, notFollowing, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.button, notFollowing ? { backgroundColor: '#581DB9' } : null]}>
      <Text
        style={[
          styles.buttonText,
          notFollowing ? { color: 'white', fontWeight: 'bold' } : { color: 'black', fontWeight: 'bold' },
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 100,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    position: 'absolute',
    backgroundColor: 'lightgrey',
  },
  buttonText: {
    fontSize: 16,
  },
});

export { SeguirBTN };
