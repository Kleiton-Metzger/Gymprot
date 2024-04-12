import React from 'react';
import { TouchableOpacity } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

export const BackBtn = ({ goBack }) => (
  <TouchableOpacity onPress={goBack} style={{ position: 'absolute', left: 20, top: 0 }}>
    <FontAwesome5 name="arrow-left" size={24} color="black" />
  </TouchableOpacity>
);
