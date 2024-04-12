import { Dimensions, StyleSheet, useWindowDimensions } from 'react-native';
const { width, height } = Dimensions.get('window'); //pegar a largura e altura da tela

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    justifyContent: 'space-between',
  },
  header: {
    fontSize: 20,
    fontWeight: '500',
    color: '#000000',
    marginLeft: 20,
  },
  userNameH: {
    fontSize: 20,
    fontWeight: '600',
    color: '#581DB9',
  },
  filterIcon: {
    right: 25,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'darkgrey',
    marginHorizontal: 20,
    marginBottom: 5,
  },
  searchBarClicked: {
    borderColor: '#581DB9',
  },
  searchIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  cancelText: {
    marginLeft: 10,
    color: '#581DB9',
    fontSize: 13,
  },
  searchButton: {
    marginLeft: 10,
    color: '#007AFF',
    fontSize: 16,
  },
  videoGridContainer: {},
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
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    fontWeight: 'bold',
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
});

export default styles;
