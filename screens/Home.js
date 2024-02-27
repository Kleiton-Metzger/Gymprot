import React from 'react';
import { View, Text, StyleSheet } from 'react-native';




export default function HomeScreen () {
  return (
      <View style={styles.container}>
          <Text style={styles.text}>Home</Text>         
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
      flex: 1, 
      alignItems: 'center', 
      justifyContent: 'center',
      backgroundColor:'rgba(154, 151, 151, 1)'
  },
  text: {
      color: '#161924', 
      fontSize: 20, 
      fontWeight: '500'
  }
});
