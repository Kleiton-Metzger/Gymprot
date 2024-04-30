import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Video } from 'expo-av';
import { styles } from './styles';

export const VideosScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { videoURL } = route.params;
  const [isVideoLoading, setIsVideoLoading] = useState(true); // State to track video loading

  const handleVideoLoad = () => {
    setIsVideoLoading(false); // Set loading state to false when video is loaded
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.header} onPress={() => navigation.goBack()} activeOpacity={0.8}>
        <FontAwesome5 name="arrow-left" style={styles.backBtn} size={24} color="black" />
      </TouchableOpacity>
      <View style={styles.body}>
        {isVideoLoading && <ActivityIndicator size={30} color="#581DB9" style={styles.activityIndicator} />}
        <Video
          source={{ uri: videoURL }}
          isMuted={false}
          volume={2.0}
          resizeMode="cover"
          shouldPlay
          isLooping={false}
          useNativeControls
          style={{ width: '100%', height: 300 }}
          onLoad={handleVideoLoad}
        />
      </View>
    </SafeAreaView>
  );
};

export default VideosScreen;
