import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';



export default function MediaItem () {
  return (
      <View style={styles.container}>
          <Text style={styles.text}>Multimedia</Text>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
      flex: 1, 
      alignItems: 'center', 
      justifyContent: 'center'
  },
  text: {
      color: '#161924', 
      fontSize: 20, 
      fontWeight: '500'
  }
});
