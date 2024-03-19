import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styles from '../styles'; 


export const VideoItem = ({ title, onPress }) => (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.videoItem}>
        <Text style={styles.title}>{title}</Text>
      </View>
    </TouchableOpacity>
  );