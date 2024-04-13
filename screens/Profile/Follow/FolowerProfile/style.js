import { Dimensions, StyleSheet, useWindowDimensions } from 'react-native';
const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
    width,
    height: 30,
  },

  bckButton: {
    left: 15,
    position: 'absolute',
  },
  hometxt: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    width,
    height: 30,
    left: 50,
  },
  body: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'f2f2f2',
    width,
    height,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  avatarContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    top: 40,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    alignItems: 'center',
    justifyContent: 'center',
    top: 5,
  },
  infoContainer: {
    position: 'absolute',
    top: 180,
    flexDirection: 'row',
  },
  infoSeguidr: {
    fontSize: 15,
    fontWeight: 'bold',
    right: 50,
  },
  infoSeguind: {
    fontSize: 15,
    fontWeight: 'bold',
    left: 50,
  },
  btnContainer: {
    position: 'absolute',
    justifyContent: 'spce-between',
    alignItems: 'center',
    height: 40,
    width: '100%',
    top: 215,
  },
  btnSeguir: {
    width: '40%',
    height: 40,
    backgroundColor: '#581DB9',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    position: 'absolute',
    left: '34%',
    top: '10%',
  },
  btnSeguirText: {
    fontSize: 16,
  },
  bioContainer: {
    position: 'absolute',
    top: 250,
    width,
    height: '100%',
    marginTop: 14,
    padding: 10,
  },
  bioHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    alignItems: 'center',
    justifyContent: 'center',
    left: 10,
  },
  bioText: {
    fontSize: 15,
    color: 'black',
    alignItems: 'center',
    justifyContent: 'center',
    left: 10,
  },

  videosContainer: {
    position: 'absolute',
    top: 390,
    width,
    height,
    backgroundColor: 'lightgrey',
  },
  videoItem: {
    width: '100%',
    height: 260,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
    borderRadius: 20,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export { styles };
