import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 10,
    marginBottom: 5,
  },
  editContainer: {
    width: '50%',
  },
  editIcon: {
    left: 10,
    width: 40,
  },
  buttonContainer: {
    height: 40,
    width: 100,
    backgroundColor: '#581DB9',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    right: 10,
  },
  userDataContainer: {
    padding: 10,
    flexDirection: 'row',
    width: '100%',
  },
  avatar: {
    width: 100,
    height: 100,
    borderColor: '#581DB9',
    borderWidth: 3,
    borderRadius: 100,
    marginRight: 10,
    marginBottom: 10,
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
    color: 'lightblue',
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
    padding: 10,
    width,
    marginBottom: 10,
  },
  bioContainer: {
    padding: 10,
    width: '100%',
    height: 110,
  },
  bioText: {
    fontSize: 14,
    color: '#818589',
    marginTop: 5,
    textAlign: 'justify',
    alignSelf: 'center',
  },
  bodyContainer: {
    flex: 1,
    width: '100%',
    height,
  },
  bodyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#581DB9',
    alignSelf: 'center',
    marginTop: 10,
  },
});
