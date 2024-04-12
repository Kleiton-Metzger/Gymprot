import { Dimensions, StyleSheet, useWindowDimensions } from 'react-native';
const { width, height } = Dimensions.get('window'); //pegar a largura e altura da tela
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
});

export default styles;
