import { Dimensions, StyleSheet } from 'react-native';
import { overlay } from 'react-native-paper';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  uavatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'darkgray',
    marginLeft: 13,
  },
  filterIcon: {
    position: 'absolute',
    right: 20,
    flexDirection: 'row',
  },
  searchContainer: {
    padding: 10,
    width: '100%',
  },
  searchBar: {
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    width: '95%',
  },
  videoGridContainer: {
    backgroundColor: 'white',
  },
  infoContainer: {
    flex: 1,
    margin: 5,
    padding: 10,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    width: '95%',
    alignSelf: 'center',
  },
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
    backgroundColor: 'darkgray',
  },
  userInfoTextContainer: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#581DB9',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  locationIcon: {
    marginRight: 5,
  },
  location: {
    fontSize: 14,
    color: 'gray',
  },
  tipo: {
    fontSize: 14,
    color: 'gray',
  },
  videoItem: {
    width: '100%',
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
    borderRadius: 20,
  },
  videoContainer: {
    width: '105%',
    height: '100%',
    borderRadius: 20,
    overflow: 'hidden',
  },
  video: {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    borderRadius: 20,
  },
  playButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -25 }, { translateY: -25 }], // Centraliza o botão
    zIndex: 1,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#581DB9',
  },
});

export default styles;
