import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'red',
  },
  header: {
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backBtn: {
    marginLeft: 10,
  },
  body: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activityIndicator: {
    marginTop: 20,
  },
  sensorContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  sensorItem: {
    flexDirection: 'row',
    marginVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 5,
  },
  sensorLabel: {
    color: 'white',
    fontWeight: 'bold',
    marginRight: 10,
  },
  overlayText: {
    color: 'white',
    fontWeight: 'bold',
    marginRight: 10,
  },

  sensorData: {
    fontWeight: 'normal',
    color: 'white',
  },
  modalContent: {
    padding: 10,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  modalCloseButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  modalCloseButton: {
    marginBottom: 15,
    width: '20%',
  },
  modalCloseText: {
    color: '#581DB9',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'right',
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  modalInput: {
    marginBottom: 10,
    backgroundColor: 'white',
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
  video: {
    width,
    height: 300,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  machineDataContainer: {
    width,
    padding: 10,
    flexDirection: 'row',
  },

  machineDataItem: {
    padding: 10,
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    width: '50%',
  },
  machineDataLabel: {
    fontWeight: 'bold',
    color: 'white',
  },
  machineDataValue: {
    fontWeight: 'normal',
    color: 'white',
  },
  machineDataTitle: {
    fontWeight: 'bold',
    color: 'white',
  },
  machineDataname: {
    fontWeight: 'normal',
    borderRadius: 5,
    color: 'white',
  },
  modalButtonG: {
    paddingVertical: 10,
    backgroundColor: '#581DB9',
    borderRadius: 10,
    alignItems: 'center',
    width: '50%',
    alignSelf: 'center',
  },
  machineItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    marginVertical: 5,
  },
  deleteIcon: {
    padding: 10,
  },
  modalIcon: {
    padding: 10,
    marginLeft: '45%',
  },
  confirmationModalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 20,
    width: '80%',
    alignSelf: 'center',
    alignItems: 'center',
    top: '40%',
  },
  confirmationModal: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#581DB9',
    textAlign: 'center',
  },
  confirmationText: {
    fontSize: 15,
    color: 'gray',
    marginBottom: 10,
    textAlign: 'center',
  },
  confirmationButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  modalIcon: {
    padding: 10,
    marginLeft: '45%',
  },

  modalIconText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: 'gray',
    marginLeft: '45%',
  },
  machineDataTitle: {
    fontSize: 18,
    alignSelf: 'center',
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'white',
  },
  modalSwitchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  modalSwitchText: {
    fontSize: 16,
    color: 'gray',
  },
  modalSwitch: {
    transform: [{ scaleX: 1 }, { scaleY: 1 }],
  },
});
