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
    marginBottom: 5,
  },
  editContainer: {
    width: '30%',
    alignSelf: 'center',
  },
  editIcon: {
    width: 40,
    top: 3,
    left: 10,
  },
  perfilTextContainer: {
    width: '40%',
    alignSelf: 'center',
  },
  perfilText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    alignSelf: 'center',
  },
  buttonContainer: {
    width: '30%',
    alignItems: 'flex-end',
    marginTop: 10,
  },
  logoutbtn: {
    width: '30%',
    alignItems: 'center',
    right: 10,
  },
  userDataContainer: {
    padding: 10,
    flexDirection: 'row',
    width: '100%',
    marginTop: 10,
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
    marginLeft: 20,
  },
  bioContainer: {
    padding: 10,
    width: '100%',
    height: 'auto',
  },
  bioText: {
    fontSize: 14,
    color: '#818589',
    marginTop: 5,
    textAlign: 'justify',
  },
  bodyContainer: {
    flex: 1,
    width: '100%',
    height: 'auto',
  },
  bodyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#581DB9',
    alignSelf: 'center',
    marginTop: 10,
  },
  graphContainer: {
    width: '100%',
    height: 'auto',
    marginTop: 10,
  },
  graph: {
    width: '50%',
    height: 'auto',
  },
  graphTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#581DB9',
    alignSelf: 'center',
    marginTop: 10,
  },
  graphText: {
    fontSize: 14,
    color: 'black',
    textAlign: 'justify',
    marginTop: 10,
  },
});
