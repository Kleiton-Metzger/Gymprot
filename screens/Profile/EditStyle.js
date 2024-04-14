import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  body: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginTop: '20%',
  },
  inputContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  buttonContainer: {
    backgroundColor: '#581DB9',
    padding: 10,
    width: '50%',
    height: 50,
    alignItems: 'center',
    borderRadius: 5,
    marginVertical: 15,
  },
  genderButton: {
    marginTop: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: '#581DB9',
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  genderButtonText: {
    color: '#581DB9',
    fontSize: 16,
  },
  genderopcText: {
    color: 'black',
    fontSize: 16,
    marginTop: 10,
  },
  bioInput: {
    height: 50,
    marginBottom: 20,
    width: '100%',
  },
  bioTxt: {
    color: 'blue',
    fontSize: 16,
  },

  deleteButton: {
    marginTop: 5,
    borderColor: 'red',
    borderRadius: 5,
  },
  deleteButtonText: {
    color: 'red',
    fontSize: 10,
  },
});
