import { StyleSheet } from 'react-native';
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
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
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  fileName: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#333',
  },
  fileData: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#333',
    left: 30,
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
    height: 50,
  },
  deleteButtonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    left: 40,
  },

  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 20,
    width: '90%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#581DB9',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    marginBottom: 20,
    backgroundColor: 'white',
  },
  confirmationButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  modalButton: {
    marginVertical: 20,
    paddingVertical: 10,
    backgroundColor: '#581DB9',
    borderRadius: 10,
    alignItems: 'center',
    width: '50%',
    alignSelf: 'center',
  },

  listname: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    alignSelf: 'center',
    right: 10,
  },
  listDta: {
    fontWeight: '500',
    fontSize: 18,
    color: '#333',
    left: 80,
  },
  progressContainer: {
    width: '100%',
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
  },
  progressText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#581DB9',
    marginBottom: 10,
    alignSelf: 'center',
  },
  progress: {
    width: '100%',
    height: 10,
    borderRadius: 10,
    backgroundColor: '#E0E0E0',
  },
});
