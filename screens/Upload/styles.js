import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginTop: 20,
    color: '#581DB9',
  },
  fab: {
    backgroundColor: '#581DB9',
    position: 'absolute',
    bottom: '15%',
    right: 20,
    borderRadius: 30,
    elevation: 8,
    zIndex: 1,
  },
  list: {
    flex: 1,
    marginTop: 20,
  },
  dialogContainer: {
    backgroundColor: '#fff',
  },
  dialogTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#581DB9',
    paddingVertical: 10,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#F5F5F5',
    marginTop: 10,
  },
  subTitles: {
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderBottomColor: '#581DB9',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingVertical: 10,
  },
  fileName: {
    fontWeight: 'bold',
    fontSize: 16,
    color: 'black',
  },
  fileData: {
    fontWeight: 'bold',
    fontSize: 16,
    color: 'black',
  },
});
