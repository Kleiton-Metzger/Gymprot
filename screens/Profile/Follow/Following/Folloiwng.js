import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Avatar, ActivityIndicator } from 'react-native-paper';
import { useAuth } from '../../../../Hooks/useAuth';
import { Button } from '../../../../components';
import { getUSerSex } from '../../../../utils/gender';
import { styles } from '../../ProfStyle';
import { FontAwesome5 } from '@expo/vector-icons';

export const ProfileFolloiwng = () => {
  return (
    <View style={styles.container}>
      <Text>Profile folioiwng </Text>
    </View>
  );
};
