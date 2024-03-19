import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { VideoItem } from './video-item';
import { UserInfo } from './user-info';
import styles from '../styles';

export const VideoGrid = ({ filteredVideos, handleVideoClick }) => {
    return (
      <FlatList
        data={filteredVideos}
        numColumns={2}
        renderItem={({ item }) => (
          <View style={styles.infoContainer}>
            <UserInfo avatar={item.avatar} userName={item.userName} location={item.location} />
            <VideoItem title={item.title} onPress={() => handleVideoClick(item.title)} />
          </View>
        )}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.videoGridContainer}
        removeClippedSubviews={true}
        ListEmptyComponent={() => (
          <Text style={styles.emptyText}>No videos found</Text>
        )}
      />
    );
  };