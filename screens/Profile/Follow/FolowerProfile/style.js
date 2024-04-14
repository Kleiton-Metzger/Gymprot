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
    height: 40,
    width,
    flexDirection: 'row',
    alignItems: 'center',
    // backgroundColor: 'red',
  },
  bckButton: {
    width: '15%',
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    width: '50%',
    textAlign: 'center',
    left: 40,
  },
  profileContainer: {
    width,
    height: 200,
    alignItems: 'center',
    // backgroundColor: 'yellow',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderColor: '#581DB9',
    borderWidth: 3,
    backgroundColor: 'gray',
    top: 10,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#581DB9',
    top: 15,
  },
  userFollow: {
    flexDirection: 'row',
    width: '80%',
    justifyContent: 'space-between',
    top: 20,
  },
  seguidoresContainer: {
    flexDirection: 'column',
    width: '50%',
  },
  segdrTxt: {
    color: 'darkgray',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  segdrNum: {
    color: 'black',
    fontWeight: 'bold',
    left: 20,
  },
  buttonContainer: {
    height: 40,
    width: 10,
    right: 85,
    top: 10,
  },
  bioContainer: {
    padding: 10,
    width: '100%',
    height: 130,
    // backgroundColor: 'lightgray',
  },

  bioText: {
    fontSize: 14,
    color: 'gray',
    top: 5,
    textAlign: 'justify',
    alignItems: 'center',
  },
  bodyContainer: {
    width,
    height,
    backgroundColor: 'lightgray',
  },
  bodyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
    top: 20,
  },
});

export { styles };
