import { StyleSheet } from 'react-native';
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8E8E8',
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginTop: 20,
    color: '#581DB9',
    padding: 20,
  },
  subTitles: {
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderBottomColor: '#581DB9',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingVertical: 10,
  },
  fileName: {
    fontWeight: '500',
    fontSize: 18,
    color: '#333',
  },
  fileData: {
    fontWeight: '500',
    fontSize: 18,
    color: '#333',
  },
  fab: {
    backgroundColor: '#581DB9',
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: '10%',
    zIndex: 1,
    borderRadius: 30,
  },
  body: {
    flex: 1,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 0.5,
    borderBottomColor: '#581DB9',
    paddingVertical: 10,
  },
  ModalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 20,
    width: '90%',
    height: '30%',
    alignSelf: 'center',
    marginTop: '70%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#581DB9',
    textAlign: 'center',
  },
  input: {
    marginBottom: 20,
    backgroundColor: 'white',
  },
  bnts: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  sendbtn: {
    backgroundColor: '#581DB9',
    width: '45%',
  },
  cancelbtn: {
    width: '45%',
  },
});
