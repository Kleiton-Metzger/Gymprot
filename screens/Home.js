import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Keyboard, FlatList, Image, Alert } from 'react-native';
import { Feather } from "@expo/vector-icons";

// SearchBar component
const SearchBar = ({ clicked, searchPhrase, setSearchPhrase, setClicked }) => {
  return (
    <View style={clicked ? styles.searchBarClicked : styles.searchBarUnclicked}>
      <Feather name="search" size={20} color="black" style={{ marginLeft: 1 }} />
      <TextInput
        style={styles.input}
        placeholder="Search"
        value={searchPhrase}
        onChangeText={setSearchPhrase}
        onFocus={() => setClicked(true)}
      />
      {clicked && (
        <TouchableOpacity onPress={() => { Keyboard.dismiss(); setClicked(false); setSearchPhrase(''); }}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

// VideoItem component
const VideoItem = ({ title, onPress }) => (
  <TouchableOpacity onPress={onPress}>
    <View style={styles.videoItem}>
      <Text style={styles.title}>{title}</Text>
    </View>
  </TouchableOpacity>
);

// UserInfo component
const UserInfo = ({ avatar, userName, location }) => (
  <View style={styles.userInfo}>
    <Image source={avatar} style={styles.avatar} />
    <Text style={styles.userName}>{userName}</Text>
    <Text style={styles.location}>{location}</Text>
  </View>
);

// VideoGrid component
const VideoGrid = ({ filteredVideos, handleVideoClick }) => {
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
    />
  );
};

// HomeScreen component
export default function HomeScreen() {
  const [clicked, setClicked] = useState(false);
  const [searchPhrase, setSearchPhrase] = useState('');
  const [videos, setVideos] = useState([
    { id: 1, title: 'Video 1', location: 'Location 1', avatar: require('../assets/avatar.jpg'), userName: 'User 1' },
    { id: 2, title: 'Video 2', location: 'Location 2', avatar: require('../assets/avatar.jpg'), userName: 'User 2' },
    { id: 3, title: 'Video 3', location: 'Location 3', avatar: require('../assets/avatar.jpg'), userName: 'User 3' },
    { id: 4, title: 'Video 4', location: 'Location 4', avatar: require('../assets/avatar.jpg'), userName: 'User 4' },
    { id: 5, title: 'Video 5', location: 'Location 5', avatar: require('../assets/avatar.jpg'), userName: 'User 5' },
    { id: 6, title: 'Video 6', location: 'Location 6', avatar: require('../assets/avatar.jpg'), userName: 'User 6' },
    { id: 7, title: 'Video 7', location: 'Location 7', avatar: require('../assets/avatar.jpg'), userName: 'User 7' },
    { id: 8, title: 'Video 8', location: 'Location 8', avatar: require('../assets/avatar.jpg'), userName: 'User 8' },
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
      const filtered = videos.filter(video => video.title.toLowerCase().includes(text.toLowerCase()));
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

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  locationTxt: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 50,
    top: 40,
  },
  searchBarClicked: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f2f2f2",
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#000000",
  },
  searchBarUnclicked: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f2f2f2",
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#000000",
  },
  input: {
    flex: 1,
    marginLeft: 10,
  },
  cancelText: {
    marginLeft: 10,
    color: "#581DB9",
  },
  videoGridContainer: {
    marginTop: 20,
  },
  videoItem: {
    backgroundColor: "#ccc",
    width: 150,
    height: 150,
    justifyContent: "center",
    alignItems: "center",
    margin: 5,
    borderRadius: 20,
    padding: 10,
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  location: {
    fontSize: 14,
    color: 'gray',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 25,
  },
  infoContainer: {
    flex: 1,
    margin: 5,
    padding: 10,
    borderRadius: 20,
    backgroundColor: '#f2f2f2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userInfo: {
    alignItems: 'center',
  },
});
