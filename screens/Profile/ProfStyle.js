import { StyleSheet, Dimensions } from 'react-native';

const { height } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 10,
    marginBottom: 10,
    marginTop: 10,
  },
  editIcon: {
    fontSize: 35,
    color: 'black',
  },
  perfilText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    alignSelf: 'center',
    textAlign: 'center',
    flex: 1,
  },
  logoutbtn: {
    fontSize: 25,
    color: 'black',
  },
  separator: {
    height: 1,
    backgroundColor: 'lightgray',
    width: '100%',
  },
  userDataContainer: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#581DB9',
    marginRight: 10,
  },
  userDatas: {
    flex: 1,
    marginLeft: 10,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#581DB9',
  },
  userEmail: {
    fontSize: 14,
    color: 'black',
    marginTop: 5,
  },
  userFollow: {
    flexDirection: 'row',
    marginTop: 10,
  },
  seguidoresContainer: {
    marginRight: 20,
  },
  segdrTxt: {
    color: 'darkgray',
    fontWeight: 'bold',
  },
  segdrNum: {
    color: 'black',
    fontWeight: 'bold',
  },
  bioContainer: {
    padding: 10,
  },
  bioText: {
    fontSize: 14,
    color: '#818589',
    marginTop: 5,
    textAlign: 'justify',
  },
  bodyContainer: {
    flex: 1,
    padding: 10,
  },
  bodyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#581DB9',
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  graphContainer: {
    marginTop: 10,
  },
});
