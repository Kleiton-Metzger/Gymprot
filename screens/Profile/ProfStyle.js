import { StyleSheet } from 'react-native';
import { Dimensions } from 'react-native';
import { Avatar } from 'react-native-paper';

const { width, height } = Dimensions.get('window');
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    top: 60,
    marginHorizontal: 10,
    height: 50,
    marginBottom: 10,
  },
  editContainer: {
    width: '50%',
  },
  editIcon: {
    left: 10,
    width: 40,
  },
  buttonContainer: {
    height: 35,
    width: 80,
    top: 5,
    backgroundColor: '#581DB9',
    borderRadius: 10,
    right: 10,
  },

  userDataContainer: {
    top: 60,
    padding: 10,
    flexDirection: 'row',
    marginTop: 5,
    width: '100%',
    // backgroundColor: 'red',
  },
  avatar: {
    width: 100,
    height: 100,
    borderColor: '#581DB9',
    borderWidth: 3,
    borderRadius: 100,
    marginRight: 10,
  },
  userDatas: {
    width: '65%',
    height: 100,
    justifyContent: 'center',
    alignSelf: 'flex-start',
    padding: 10,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#581DB9',
  },
  userEmail: {
    fontSize: 14,
    color: 'black',
    top: 5,
  },
  userFollow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    top: 15,
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
  bioContainer: {
    top: 60,
    padding: 10,
    width: '100%',
    height: '20%',
  },

  bioText: {
    fontSize: 14,
    color: 'gray',
    top: 5,
    textAlign: 'justify',
  },
  bodyContainer: {
    width,
    height,
    backgroundColor: 'lightgray',
    top: 10,
  },
  bodyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
    top: 20,
  },
});
