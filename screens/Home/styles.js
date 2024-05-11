import { Dimensions, StyleSheet, useWindowDimensions } from 'react-native';
import { overlay } from 'react-native-paper';
const { width, height } = Dimensions.get('window'); //pegar a largura e altura da tela

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    //backgroundColor: 'red',
  },
  uavatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'darkgray',
    marginLeft: 13,
  },
  filterIcon: {
    right: 20,
    position: 'absolute',
    flexDirection: 'row',
  },
  searchContainer: {
    padding: 10,
    // backgroundColor: 'red',
    width,
  },
  searchBar: {
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    width: '95%',
  },
  videoGridContainer: {
    backgroundColor: 'white',
  },
  videoItem: {
    width: '100%',
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
    borderRadius: 20,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#581DB9',
  },

  location: {
    fontSize: 14,
    color: 'gray',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: 'darkgray',
  },
  infoContainer: {
    flex: 1,
    margin: 5,
    padding: 10,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    width,
    alignSelf: 'center',
  },
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  userInfoTextContainer: {
    flex: 1,
  },
  creatorName: {
    fontSize: 14,
    color: 'gray',
  },
  bio: {
    fontSize: 14,
    color: 'gray',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    fontWeight: 'bold',
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
  tipo: {
    fontSize: 14,
    color: 'gray',
  },
  video: {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    borderRadius: 20,
  },
  videoContainer: {
    width: '100%',
    height: 200,
    borderRadius: 20,
    overflow: 'hidden',
  },
});

export default styles;
