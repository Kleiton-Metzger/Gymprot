import React, { useEffect, useState } from 'react';
import { View, Image, StyleSheet, Text } from 'react-native';

export default function SplashScreen() {
  return (
    <View style={styles.container}>
      <Image source={require('../../assets/logo.png')} style={styles.image} />
      <Text
        style={{
          fontSize: 20,
          fontWeight: 'bold',
          color: 'black',
          marginTop: 20,
        }}
      >
        Exercise and Work Integrator
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'withe',
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    borderRadius: 100,
  },
});
