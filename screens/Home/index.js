import React, { useState } from 'react';
import { View, Text,Alert } from 'react-native';
import styles from './styles';
import { VideoGrid,SearchBar } from './components';

export const HomeScreen = () => {
  const [clicked, setClicked] = useState(false);
  const [searchPhrase, setSearchPhrase] = useState('');
  const [videos, setVideos] = useState([
    { id: 1, title: 'Video 1', location: 'Location 1', avatar: require('../../assets/avatar.jpg'), userName: 'User 1' },
    { id: 2, title: 'Video 2', location: 'Location 2', avatar: require('../../assets/avatar.jpg'), userName: 'User 2' },
    { id: 3, title: 'Video 3', location: 'Location 3', avatar: require('../../assets/avatar.jpg'), userName: 'User 3' },
    { id: 4, title: 'Video 4', location: 'Location 4', avatar: require('../../assets/avatar.jpg'), userName: 'User 4' },
    { id: 5, title: 'Video 5', location: 'Location 5', avatar: require('../../assets/avatar.jpg'), userName: 'User 5' },
    { id: 6, title: 'Video 6', location: 'Location 6', avatar: require('../../assets/avatar.jpg'), userName: 'User 6' },
    { id: 7, title: 'Video 7', location: 'Location 7', avatar: require('../../assets/avatar.jpg'), userName: 'User 7' },
    { id: 8, title: 'Video 8', location: 'Location 8', avatar: require('../../assets/avatar.jpg'), userName: 'User 8' },
  ]);
  const [filteredVideos, setFilteredVideos] = useState(videos);

  const handleVideoClick = (title) => {
    Alert.alert('Video Clicked', `You clicked on ${title}`);
  };

  const handleSearch = (text) => {
    setSearchPhrase(text);
    if (text === '') {
      setFilteredVideos(videos);
    } else {
      const filtered = videos.filter(video => video.location.toLowerCase().includes(text.toLowerCase()));
      setFilteredVideos(filtered);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.locationTxt}>Localização</Text>
      <SearchBar
        clicked={clicked}
        searchPhrase={searchPhrase}
        setSearchPhrase={handleSearch}
        setClicked={setClicked}
      />
      <VideoGrid filteredVideos={filteredVideos} handleVideoClick={handleVideoClick} />
    </View>
  );
}





