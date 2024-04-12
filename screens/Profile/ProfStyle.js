import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
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
  deltContainer: {
    position: 'absolute',
    top: 50,
    left: 20,
  },
  dltText: {
    color: 'red',
    fontSize: 15,
  },
  buttonContainer: {
    backgroundColor: 'rgba(88, 29, 185, 1)',
    padding: 10,
    width: '40%',
    alignItems: 'center',
    borderRadius: 5,
    marginVertical: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 15,
  },
  userDataContainer: {
    alignItems: 'center',
    padding: 20,
    marginVertical: 20,
  },
  userData: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  userDataLabel: {
    fontSize: 16,
    marginRight: 5,
    color: 'black',
    fontWeight: 'bold',
  },
  userDataValue: {
    fontSize: 15,
    color: 'black',
  },
});
