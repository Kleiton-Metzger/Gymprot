import { StyleSheet } from 'react-native';
import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  editContainer: {
    position: 'absolute',
    top: 70,
    left: 20,
  },
  editIcon: {
    width: 30,
    height: 30,
  },
  userInfoContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    position: 'absolute',
    top: 100,
    flexDirection: 'row',
    right: 30,
  },
  avatarContainer: {
    padding: 10,
    borderRadius: 100,
    marginRight: 20,
  },
  infoContainer: {
    alignItems: 'center',
    marginTop: 20,
    right: 20,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    marginRight: 60,
  },
  email: {
    fontSize: 14,
    color: 'darkgray',
    marginRight: 20,
    color: '#581DB9',
  },
  userData: {
    flexDirection: 'row',
    marginVertical: 5,
  },
  allinfoContainer: {
    width,
    height: 70,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginTop: 20,
  },
  userDataLabel: {
    fontSize: 15,
    fontWeight: 'bold',
    color: 'black',
    marginRight: 10,
  },
  userDataValue: {
    fontSize: 15,
    color: 'black',
    fontWeight: 'bold',
  },
  infoContainerSeg: {
    width,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 270,
  },
  infoSeguidr: {
    fontSize: 15,
    fontWeight: 'bold',
    color: 'gray',
    marginRight: 50,
  },
  infoSeguind: {
    fontSize: 15,
    fontWeight: 'bold',
    color: 'gray',
    marginRight: 10,
    marginLeft: 70,
  },
  txtSeguidr: {
    fontSize: 15,
    color: 'black',
    fontWeight: 'bold',
    marginRight: 20,
    right: 110,
    top: 20,
  },
  txtSeguind: {
    fontSize: 15,
    color: 'black',
    fontWeight: 'bold',
    right: 70,
    top: 20,
  },
  divider: {
    width: 3,
    height: 30,
    backgroundColor: '#581DB9',
  },
  dadoGraf: {
    position: 'absolute',
    top: 70,
    backgroundColor: 'lightgray',
    height,
    width,
  },
  dadsInfo: {
    fontSize: 15,
    fontWeight: 'bold',
    color: 'gray',
    marginLeft: 20,
    alignSelf: 'center',
    top: 10,
  },
});
